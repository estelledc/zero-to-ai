---
title: Managed Agents Runtime：把大脑、手和会话拆开
description: 用稳定接口、持久事件日志与隔离执行环境承载长时 Agent
tags: [ai-tech-practice, managed-agents, runtime, sandbox]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'Scaling Managed Agents: Decoupling the brain from the hands'
  publisher: Anthropic
  url: https://www.anthropic.com/engineering/managed-agents
  published: '2026-04-08'
---

## 先说结论

长时 Agent 不该把推理循环、执行环境和历史记录绑在一个“不能死”的容器里。更稳的架构是：会话保存事实，大脑决定下一步，手负责执行；三者通过窄接口连接，任一部分失败都能替换，而不是抢救整台机器。

## 原文解决什么

Anthropic 早期把 session、Harness 和 sandbox 放在同一容器。好处是直接，问题是容器一旦卡死，任务历史、用户数据和执行能力一起受影响，也很难判断故障究竟来自推理循环、事件流还是机器。更麻烦的是，凭证与模型生成的代码处在同一环境，扩大了提示注入后的可达范围。

## 核心机制

- **Session** 是只追加的持久事件日志，不等于当前模型的上下文窗口。压缩可以变化，原始事件仍可按位置切片恢复。
- **Harness** 是无状态的推理循环。崩溃后，新实例读取 session，从最后事件继续。
- **Sandbox** 是可替换的“手”，只通过类似 `execute(name, input) → string` 的窄工具接口暴露能力。
- 凭证留在 sandbox 外的 vault 或代理中。Agent 可以完成授权动作，但不能读取秘密本身。
- 执行环境按需创建；不需要代码执行的会话不必等待容器启动。

原文报告其架构降低了首 token 延迟，具体比例来自 Anthropic 服务测量，本站没有独立复现。

## 和 Zero-to-AI 现有实践如何接上

本地仓库不必实现分布式 runtime，也能采用同一边界：Git 历史和任务记录保存事实，Agent 会话负责判断，worktree 负责隔离文件操作，sandbox/approval 决定真实权限。`AGENTS.md` 是行为指令，不是凭证保险箱；`npm run verify` 的输出是一次执行事件，不应只留在模型口头总结里。

这个拆分还有一个直接好处：恢复失败时能分别追问“历史是否完整、判断是否合理、执行是否成功”，而不是把三类问题混成“Agent 卡住”。

## 一个低成本实验

**输入：** 一个可在 worktree 完成的小任务，以及一份四字段接班记录：目标、当前 SHA、已完成、下一步。

**步骤：**

1. 会话 A 在 worktree 完成一半，记录实际命令与退出码后主动结束。
2. 会话 B 只读取仓库、接班记录和 `git diff`，不读取 A 的完整聊天。
3. B 继续完成任务并运行最窄检查。
4. 人核对 B 是否依据持久状态恢复，而非猜测 A 做过什么。

**成功证据：** B 能指出准确基线、未完成项和验证结果；删除会话 A 不会丢失必要事实。

**停止线：** 接班记录需要复制整段对话才能继续，或凭证出现在仓库、日志、工具输出中；立即停止实验，先修状态与安全边界。

## 常见误区

- 把 session 当摘要：摘要是可替换视图，session 应保留可恢复事实。
- 认为容器隔离自动保护秘密：秘密若注入同一环境，生成代码仍可能读取。
- 为普通本地任务先造平台：先验证“状态可恢复、执行可替换、凭证不可达”三条语义，再决定是否需要服务化。

## 原文与证据边界

Managed Agents 的接口、延迟和故障恢复是 Anthropic 产品架构报告。本站没有运行该托管服务做对照；本文仅把稳定接口和隔离原则映射到 Git、worktree 与本地权限模型。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://www.anthropic.com/engineering/managed-agents)。
