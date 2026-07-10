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

**Hook（钩子）** 是事件触发器：Claude Code 到达某个生命周期节点时，把一份 JSON（一种结构化数据格式）输入交给你的脚本，再根据脚本的退出码或 JSON 输出决定后续动作。

**类比**：`PreToolUse` 像门禁，事情发生前可以拒绝；`PostToolUse` 像质检，事情已经发生，只能反馈和要求补救；`SessionEnd` 像下班日志，只负责记录或清理。

**安全警告（先读）：** Hook 脚本以你的用户权限运行，能读 stdin 里的工具参数，也能执行任意命令。只运行你信任的脚本；不要从不明来源复制 Hook；不要在 Hook 里把 transcript、token、绝对路径或凭证上传到外部系统。

**术语速查：**

| 词 | 含义 |
| --- | --- |
| matcher | 过滤器：决定哪些工具名/结束原因会触发这条 Hook |
| stdin / stdout / stderr | 标准输入/输出/错误流；事件 JSON 从 stdin 进来，控制 JSON 只应走 stdout，日志走 stderr |
| 退出码 | 脚本结束时返回的数字；`0` 正常，`2` 在 Hook 协议里表示阻断，其他非零多表示脚本错误 |
| `$CLAUDE_PROJECT_DIR` | Claude Code 提供的环境变量，指向当前项目根目录 |

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

## 常见误区与失败恢复

- **错误认知：`SessionStop` 是会话结束事件** → 正确事件名是 `SessionEnd`；`Stop` 是模型准备停止回复时的另一类事件。失败恢复：打开 settings.json，把 `SessionStop` 改成 `SessionEnd`。
- **错误认知：任何非零退出码都会 block** → 只有退出码 2 具有事件特定阻断语义，其他非零值表示 Hook 错误。失败恢复：把“故意拒绝”统一改成 `exit 2`，脚本崩溃用日志修，不要用 `exit 1` 冒充拒绝。
- **错误认知：PostToolUse 能撤销工具调用** → 它只能反馈或要求补救，工具已经执行。失败恢复：危险操作防护一律改到 `PreToolUse`。
- **错误认知：stdout 可以一边打日志一边输出 JSON** → 结构化模式要求 stdout 只有 JSON，调试信息写 stderr。失败恢复：删掉所有 `echo` 到 stdout 的调试行，改 `echo ... >&2`。
- **错误认知：matcher 在所有事件都匹配工具名** → matcher 的含义随事件变化；`SessionEnd` 匹配结束原因。失败恢复：对照官方 Hook reference 核对当前事件的 matcher 语义。
- **Hook 注册了但不触发** → 常见原因：脚本无执行权限、路径错误、JSON 非法、matcher 未命中。失败恢复：`chmod +x` → 终端手动喂 JSON 测脚本 → `jq empty` 验 settings → `claude --debug` 看是否调用到脚本。
- **从网上复制未知 Hook** → 安全风险：脚本可能外传代码或凭证。失败恢复：删除该 Hook 注册与脚本；轮换可能暴露的密钥；只保留你读懂并信任的脚本。

## 最小可验证动作

一次坐下来约 15 分钟（请在**测试仓库**做，不要第一次就在生产仓库试）：

1. 按上文创建 `.claude/hooks/block-force-push.sh` 并 `chmod +x`
2. 在项目 `.claude/settings.json` 注册 PreToolUse Hook
3. 在终端单独验证脚本：

```bash
# 应退出 0
printf '%s' '{"tool_input":{"command":"git status"}}' | .claude/hooks/block-force-push.sh; echo exit:$?

# 应退出 2，并在 stderr 看到拒绝原因
printf '%s' '{"tool_input":{"command":"git push --force origin main"}}' | .claude/hooks/block-force-push.sh; echo exit:$?
```

**成功标准：** 安全命令 `exit:0`，危险命令 `exit:2`。然后再在 Claude Code 里触发一次同类 Bash，确认拒绝原因可见。

## Checkpoint

- [ ] 我能解释：为什么危险命令防护应放在 `PreToolUse`，而不是 `PostToolUse`
- [ ] 我能区分 `exit 1`（脚本错误）与 `exit 2`（协议阻断）
- [ ] 我完成了上面的「最小可验证动作」，两份 stdin JSON 测试通过
- [ ] 我知道 `Stop` 和 `SessionEnd` 不是同一个事件
- [ ] 我理解：Hook 以本机用户权限运行，不明来源脚本不可信；日志与凭证不外传

## 下一步

- 用[配置即代码](/claude-code/dotfiles/)管理 Hook 脚本，但不要把密钥纳入 Git。
- 用[工作流编排思路](/methodology/workflow-design/)决定哪些检查该自动化、哪些应保留人工判断。
- 回到[核心配置](/claude-code/config/)核对 settings.json 与 CLAUDE.md 的分工。

官方依据（复核于 2026-07-10）：[Hooks reference](https://code.claude.com/docs/en/hooks)、[Hooks guide](https://code.claude.com/docs/en/hooks-guide)。
