---
title: Hook 系统
description: 让 Claude Code 自动触发检查 — Hook 的 4 种类型、分层防御思维、以及你的第一个 Hook 脚本
tags: [claude-code]
difficulty: advanced
learningPaths:
  - advanced-custom
prerequisites:
  - claude-code/config
  - claude-code/skills
relatedContent:
  - { slug: 'methodology/workflow-design', label: '工作流编排思路' }
lastVerified: '2026-06-12'
toolVersion: 'Claude Code CLI (latest)'
---

## 这是什么

Hook 让你在 Claude Code 的特定时刻自动执行脚本 -- 不需要你每次手动说"检查一下这个"。

**类比**：Hook 像安防系统。你不需要每天亲自站在门口检查每个人 -- 系统在有人经过时自动验证身份、记录日志、发现异常时告警。

四种 Hook 对应安防系统的四个环节：

- **PreToolUse** = 门禁系统：刷卡前验证身份。阻止危险操作，比如 `git push --force` 或 `rm -rf`。
- **PostToolUse** = 监控录像：事后可回放。检查刚写完的文件有没有漏字段、格式对不对。
- **SessionStart** = 开机自检：每次启动检查系统状态。注入当前项目状态、提醒待办。
- **SessionStop** = 下班打卡：结束时记录今天做了什么。持久化日志、统计 token 消耗。

技术定义：Hook 是 Claude Code 的事件驱动脚本系统。你写一个 bash 脚本，在 `settings.json` 里注册它监听的事件类型，Claude Code 在事件发生时自动调用脚本、读取返回值、决定下一步行为。

**Hook 解决的是确定性自动化 -- "每次 X 发生时自动做 Y"。** Skill 解决的是灵活工作流 -- "当用户说要 X 时执行 Y 步骤"。两者互补，不是替代。

## 4 种 Hook 类型

### PreToolUse -- 门禁系统

在工具调用**之前**触发。可以阻止操作（block）、放行（allow）、或放行但提醒（warn）。

最小示例：拦截 `git add .`。`git add .` 危险在于它会把当前目录下所有修改一次性暂存，容易把调试日志、临时文件、敏感信息也误加进去。

在 `settings.json` 中注册：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/guard-git-add.sh"
          }
        ]
      }
    ]
  }
}
```

Hook 脚本 `~/.claude/hooks/guard-git-add.sh`：

```bash
#!/bin/bash
# Claude Code 把事件信息通过 stdin 传入
event=$(cat)
tool_name=$(echo "$event" | jq -r '.tool_name')
tool_input=$(echo "$event" | jq -r '.tool_input')

# 只拦截 Bash 工具里的 git add .
if [ "$tool_name" = "Bash" ] && echo "$tool_input" | jq -r '.command' | grep -qE "git add (\.|-A|--all)"; then
  echo '{"decision": "block", "reason": "不要用 git add . 或 git add -A -- 会把所有文件一股脑暂存。请指定具体文件路径。"}'
  exit 0
fi

echo '{"decision": "allow"}'
```

三个关键点：

1. `exit 0` + `"decision": "block"` = 阻止操作
2. `exit 0` + `"decision": "allow"` = 放行
3. `exit 0` + `"decision": "warn"` = 放行但显示警告。`exit 1` 或任何非 0 退出码也视为 block

### PostToolUse -- 监控录像

在工具调用**之后**触发。**只能 warn，不能 block** -- 操作已经发生了，Hook 只能事后检查并提醒。

典型用途：写完文件后自动检查格式。例如检查 learnings 笔记是否漏了 `来源:` 字段：

```bash
#!/bin/bash
event=$(cat)
tool_name=$(echo "$event" | jq -r '.tool_name')

# 只关心文件写入操作
if [ "$tool_name" != "Write" ] && [ "$tool_name" != "Edit" ]; then
  echo '{"decision": "allow"}'
  exit 0
fi

file_path=$(echo "$event" | jq -r '.tool_input.file_path')
# 只检查 learnings 目录下的笔记
if echo "$file_path" | grep -q "learnings/"; then
  if [ -f "$file_path" ] && ! grep -q "来源:" "$file_path"; then
    echo '{"decision": "warn", "reason": "learnings 笔记缺少『来源:』字段 -- pre-commit hook 会拒绝提交。请补上。"}'
    exit 0
  fi
fi

echo '{"decision": "allow"}'
```

这里返回 `"decision": "warn"` 而不是 `"block"` -- 写完文件后用户可能还要继续编辑，阻止写操作只会让 Claude 无法工作。

### SessionStart -- 开机自检

会话启动时触发。**不能 block 任何操作**，作用是注入上下文。

这是 Jason 系统里最常用的 Hook 类型。每次新会话开始时自动加载当前 git 状态、所在分支、最近提交，让你不用每次都说"先看看现在项目什么状态"：

```bash
#!/bin/bash
echo '{"continue": true, "hookSpecificOutput": {"hookEventName": "SessionStart", "systemMessage": "当前项目状态：\n- 分支：'"$(git branch --show-current 2>/dev/null || echo 'N/A')"'\n- 最近提交：'"$(git log --oneline -3 2>/dev/null || echo 'N/A')"'\n- 未暂存文件：'"$(git status --short 2>/dev/null | head -5 || echo 'N/A')"'"}}'
```

要点：

- 返回格式是 `"continue": true` + `"hookSpecificOutput"`，和前两种不同
- `systemMessage` 字段的内容会直接注入 Claude 的上下文，就像你手动发了一段消息
- **控制输出长度**：SessionStart 的输出会吃掉上下文。保持在 10 行以内

### SessionStop -- 下班打卡

会话结束时触发。用于记录日志、统计 token 消耗、归档会话信息：

```bash
#!/bin/bash
event=$(cat)
transcript_path=$(echo "$event" | jq -r '.transcript_path')
session_id=$(echo "$event" | jq -r '.session_id')
end_time=$(date -Iseconds)

echo "[$end_time] session=$session_id transcript=$transcript_path" >> ~/.claude/session-log.txt
echo '{"continue": true}'
```

这个 Hook 在 Jason 的 `claude-feedback` skill 里被用于实时诊断 -- SessionStop 触发时自动分析对话质量、判断是否值得回退重试。

## 分层防御

单个 Hook 只能拦截一类问题。真正的防护来自把四种 Hook 组合成分层体系：

| 层级    | Hook 类型    | 职责                 | 比喻                                       |
| ------- | ------------ | -------------------- | ------------------------------------------ |
| Layer 1 | PreToolUse   | **阻止**明显危险操作 | 安检门 -- 查出危险品直接不让进             |
| Layer 2 | PostToolUse  | **警告**可疑行为     | 监控室 -- 不能阻止事发，但能立刻发现并告警 |
| Layer 3 | SessionStart | **注入**上下文       | 交接班 -- 告诉接班的同事当前系统什么状态   |
| Layer 4 | SessionStop  | **记录**和归档       | 值班日志 -- 这班发生了什么，留给下一班     |

每层抓不同类别的问题：

- Layer 1 抓的是"操作本身就很危险"：`git push --force`、`rm -rf`、无条件覆盖远程分支
- Layer 2 抓的是"操作本身没问题，但结果可能不符合规范"：文件缺字段、格式化不对、产生重复内容
- Layer 3 解决的是"Claude 不知道当前什么状态就干活"：不知道在哪个分支、不知道未提交的改动
- Layer 4 解决的是"做完了但没留下痕迹"：不记得上次会话做了什么、不知道 token 花在哪

## Hook vs Skill：什么时候用哪个

| 场景                                                  | Hook | Skill |
| ----------------------------------------------------- | ---- | ----- |
| 每次 git 提交前自动检查危险命令                       | ✓    |       |
| 用户说"提交代码"时分析变更、分组、生成 commit message |      | ✓     |
| 会话启动时自动注入 git 状态                           | ✓    |       |
| 用户说"整理 wiki"时触发多步工作流                     |      | ✓     |
| 写完文件自动检查漏字段                                | ✓    |       |
| 用户说"教我读这段源码"时进入精确教学模式              |      | ✓     |
| 会话结束时自动记录日志                                | ✓    |       |
| 用户说"备份配置"时执行同步、脱敏、归档流程            |      | ✓     |

**判断原则**："每次 X 自动发生"用 Hook。"用户说要 X 时执行多步流程"用 Skill。如果一个操作需要用户主动发起、需要多步交互、需要根据中间结果做判断 -- 它是 Skill。如果一个操作应该静默执行、用户不需要知道它跑了、只在出问题时才出声 -- 它是 Hook。

## Hook 脚本的输入输出

理解 Hook 脚本的通信方式可以减少很多调试时间：

**输入**：Claude Code 通过 **stdin** 传入一个 JSON 对象。不同 Hook 类型传入的字段不同，但都包含 `tool_name`、`tool_input`、`session_id` 等基础信息。

**输出**：Hook 脚本通过 **stdout** 返回一个 JSON 对象。不同 Hook 类型的返回格式略有不同：

- PreToolUse / PostToolUse：`{"decision": "block|allow|warn", "reason": "..."}`
- SessionStart：`{"continue": true, "hookSpecificOutput": {"hookEventName": "SessionStart", "systemMessage": "..."}}`
- SessionStop：`{"continue": true}`

**退出码**：`exit 0` 表示脚本正常执行（decision 由 JSON 里的 `decision` 字段决定）。`exit 1` 或任何非 0 退出码等同于 block。

## 调试 Hook

Hook 调试比其他配置更难 -- 失败通常是静默的。Hook 脚本报错了你未必看到，Claude Code 可能只是不触发它。

排查步骤（按顺序）：

1. **先手动跑脚本**。在终端里模拟 Claude Code 的输入，看脚本能不能独立运行：

   ```bash
   echo '{"tool_name":"Bash","tool_input":{"command":"git add ."}}' | bash ~/.claude/hooks/guard-git-add.sh
   ```

   如果这一步就报错，问题在脚本本身。

2. **检查 matcher 是否匹配**。settings.json 里的 `"matcher"` 字段决定了 Hook 监听哪个工具。如果你的脚本只监听了 `"Bash"`，那 `Write` 或 `Edit` 操作不会触发它。

3. **看 SessionStart 的输出**。SessionStart Hook 的输出会出现在 Claude Code 启动时的日志里。如果你的 SessionStart Hook 没有生效，先看启动输出。

4. **加日志**。在 Hook 脚本里加 `echo "DEBUG: 到这里了" >> /tmp/hook-debug.log`，跑几轮后查看日志文件。

5. **确认脚本有执行权限**。`chmod +x ~/.claude/hooks/your-script.sh`。没有执行权限的脚本静默失败。

## 常见坑

1. **把 Skill 的逻辑写进 Hook**。Hook 应该是简单检查 -- 判断一个条件然后返回 allow/block/warn。如果 Hook 脚本超过 30 行，问自己：这真的是自动化检查，还是在往里塞工作流？

2. **PreToolUse 太激进**。一上来就把所有敏感命令 block 掉，Claude 什么工具都调不了。正确节奏：从允许开始，发现具体哪些操作不该由 Claude 做，再加 block。

3. **Hook 脚本语法错误但看不到报错**。见上面调试章节的第 1 步 -- 先手动跑。

4. **SessionStart 输出太长**。把 git log、git status、文件树全打印出来，一次吃掉几百行上下文。控制在 10 行以内 -- 只给 Claude 一个"快照"，不是"完整档案"。

5. **忘记 chmod +x**。新建的脚本默认没有执行权限。这是最常见的"Hook 不生效"原因。

6. **PostToolUse 试图 block**。PostToolUse 的 decision 里写 `"block"` 会被忽略 -- 操作已经发生了。PostToolUse 只能 warn。

## 下一步

- 回到 [Skill 体系](/claude-code/skills/) 理解 Hook 的互补工具 -- Skill 解决灵活工作流，Hook 解决确定性自动检查
- 看看 [工作流编排思路](/methodology/workflow-design/) 理解 Hook 在整个工作流中的定位
- 在 [核心配置](/claude-code/config/) 的 Hook 入门段动手写你的第一个 Hook
- 对记忆系统还没概念？读 [记忆系统](/claude-code/memory/) -- Hook + Skill + Memory 三者协作才能发挥最大效力
