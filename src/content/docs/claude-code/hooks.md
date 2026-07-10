---
title: Hook 系统
description: 用事件、matcher、stdin JSON 和退出码安全地自动检查 Claude Code 操作
tags: [claude-code]
difficulty: advanced
prerequisites:
  - claude-code/config
  - claude-code/skills
relatedContent:
  - { slug: 'methodology/workflow-design', label: '工作流编排思路' }
  - { slug: 'claude-code/config', label: '核心配置' }
  - { slug: 'claude-code/skills', label: 'Skill 体系' }
  - { slug: 'claude-code/dotfiles', label: '配置即代码' }
  - { slug: 'claude-code/memory', label: '记忆系统' }
  - { slug: 'claude-code/daily-rhythm', label: '日常节奏' }
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
---

## 这是什么

Hook 是事件触发器：Claude Code 到达某个生命周期节点时，把一份 JSON 输入交给你的脚本，再根据脚本的退出码或 JSON 输出决定后续动作。

**类比**：`PreToolUse` 像门禁，事情发生前可以拒绝；`PostToolUse` 像质检，事情已经发生，只能反馈和要求补救；`SessionEnd` 像下班日志，只负责记录或清理。

Hook 事件远不止四种。初学时先掌握这四个：

| 事件           | 触发时机                        | 能否阻止尚未发生的工具调用      |
| -------------- | ------------------------------- | ------------------------------- |
| `PreToolUse`   | 工具调用前                      | 可以                            |
| `PostToolUse`  | 工具成功后                      | 不可以撤销；可把反馈交给 Claude |
| `SessionStart` | 新会话、恢复、`/clear` 或压缩后 | 不适用，常用于补充上下文        |
| `SessionEnd`   | 会话结束                        | 不适用，常用于日志和清理        |

## 数据怎么流动

```text
事件发生 → matcher 命中 → Claude Code 把 JSON 写到脚本 stdin
        → 脚本检查 → 退出码或 stdout JSON → Claude Code 继续、拒绝或反馈
```

脚本不要猜参数位置，应从 stdin JSON 读取 `hook_event_name`、`tool_name`、`tool_input` 等字段。不同事件的字段不同，以官方 Hook reference 为准。

## 第一个可复现 Hook：阻止 force push

先创建脚本：

```bash
mkdir -p .claude/hooks
```

保存为 `.claude/hooks/block-force-push.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail

input="$(jq -c '.' </dev/stdin)"
command="$(printf '%s' "$input" | jq -r '.tool_input.command // ""')"

if [[ "$command" == *"git push --force"* || "$command" == *"git push -f"* ]]; then
  echo "force push 被项目 Hook 拒绝；请使用普通 push 或先人工确认。" >&2
  exit 2
fi

exit 0
```

赋予执行权限：

```bash
chmod +x .claude/hooks/block-force-push.sh
```

在项目级 `.claude/settings.json` 注册：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-force-push.sh"
          }
        ]
      }
    ]
  }
}
```

这里使用 `exit 2`，因为官方协议把它解释为该事件的阻断信号。拒绝原因写到 stderr；不要同时再输出控制 JSON。

## 结构化 JSON 和退出码不要混用

Hook 有两种控制方式，每次执行选一种：

1. **退出码方式**：`exit 0` 表示正常；`exit 2` 触发事件特定的阻断行为；其他非零退出码表示脚本错误，不等同于统一 block。
2. **结构化 JSON 方式**：脚本 `exit 0`，stdout 只输出一个合法 JSON 对象。

如果 `exit 2`，stdout 中的 JSON 会被忽略。shell profile、调试 `echo` 或其他杂音也会破坏 JSON 解析，所以日志应写 stderr。

### PreToolUse 的结构化拒绝

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "该命令会覆盖远端历史"
  }
}
```

### PostToolUse 的反馈

```json
{
  "decision": "block",
  "reason": "格式检查失败，请修复刚才写入的文件后再继续"
}
```

这里的 `block` 是“阻止 Claude 按原计划继续”，不是时光倒流；刚才的工具调用已经发生。真正要在执行前拒绝，必须用 `PreToolUse`。

### SessionStart 注入上下文

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "本项目提交前必须运行 npm run verify。"
  }
}
```

静态规则更适合写进 `CLAUDE.md`；只有需要动态计算的内容才值得用 SessionStart 脚本。

### SessionEnd 记录日志

`SessionEnd` 是正确事件名，不是 `SessionStop`。它没有决策控制，适合清理临时文件或记录脱敏统计：

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "matcher": "prompt_input_exit|clear|logout",
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/session-end.sh" }
        ]
      }
    ]
  }
}
```

不要把 transcript、token、绝对路径或凭证直接上传到外部系统；先脱敏，再明确用户是否授权传输。

## 怎么验证

1. 单独给脚本输入一份最小 JSON，确认安全命令退出 0、危险命令退出 2。
2. 运行 `jq empty .claude/settings.json`，确认配置 JSON 合法。
3. 在测试仓库触发一次普通 Bash 和一次 `git push --force --dry-run` 形态的命令，确认 matcher 与拒绝原因符合预期。
4. 用 `claude --debug` 排查 Hook 未触发或 JSON 解析失败；不要直接在重要仓库做第一次测试。

## 常见误区

- **错误认知：`SessionStop` 是会话结束事件** → 正确事件名是 `SessionEnd`；`Stop` 是模型准备停止回复时的另一类事件。
- **错误认知：任何非零退出码都会 block** → 只有退出码 2 具有事件特定阻断语义，其他非零值表示 Hook 错误。
- **错误认知：PostToolUse 能撤销工具调用** → 它只能反馈或要求补救，工具已经执行。
- **错误认知：stdout 可以一边打日志一边输出 JSON** → 结构化模式要求 stdout 只有 JSON，调试信息写 stderr。
- **错误认知：matcher 在所有事件都匹配工具名** → matcher 的含义随事件变化；`SessionEnd` 匹配结束原因。

## Checkpoint

1. 为什么危险命令防护应放在 `PreToolUse`，而不是 `PostToolUse`？
2. `exit 1` 与 `exit 2` 有什么区别？
3. 把示例改成拒绝 `git add .`，并用两份 stdin JSON 做允许/拒绝测试。
4. 解释 `Stop` 和 `SessionEnd` 为什么不是同一个事件。

## 下一步

- 用[配置即代码](/claude-code/dotfiles/)管理 Hook 脚本，但不要把密钥纳入 Git。
- 用[工作流编排思路](/methodology/workflow-design/)决定哪些检查该自动化、哪些应保留人工判断。

官方依据（复核于 2026-07-10）：[Hooks reference](https://code.claude.com/docs/en/hooks)、[Hooks guide](https://code.claude.com/docs/en/hooks-guide)。
