---
title: Agent 工具设计：围绕任务闭环，不围绕 API 数量
description: 用任务级工具、命名空间、语义压缩输出与留出评测改进 Agent 工具
tags: [ai-tech-practice, anthropic, agent-tools, tool-design, evaluation]
difficulty: intermediate
lastVerified: '2026-08-30'
source:
  title: 'Writing effective tools for agents — with agents'
  publisher: Anthropic
  url: https://www.anthropic.com/engineering/writing-tools-for-agents
  published: '2025-09-11'
---

## 先说结论

对 Agent 友好的工具，不是把后端每个 API 原样暴露出来，而是让一次调用完成一个清晰任务，并返回足够决策、又不会淹没上下文的信息。工具质量最终要看任务成功率、调用轨迹和错误恢复；“文档写得很全”或“接口数量很多”都不是 outcome。

## 原文解决什么

传统 API 为人类开发者设计，常把一个业务动作拆成多次细粒度请求，并返回庞大对象。Agent 面对几十个相似工具时容易选错名称、漏掉调用顺序，或把 token 浪费在无关字段上。Anthropic 讨论如何让 Agent 参与工具原型与评测，用真实任务暴露工具描述、参数、输出和命名上的摩擦。

## 核心机制

- **Task-level tools：** 围绕“搜索并取回关键内容”“创建带参与人的会议”等完整意图设计，而不是机械映射每个底层 endpoint；仍要保留权限检查和可审计失败。
- **Namespace：** 用稳定前缀把相关能力分组，名称直接表达对象与动作，减少模型在同义工具间猜测。
- **Semantic compact output：** 默认返回 ID、关键状态、摘要和下一步需要的字段；完整原始对象通过显式详情调用获取。压缩的是冗余，不是证据。
- **Held-out eval：** 用未参与设计的真实任务检验工具选择、参数正确性、调用次数和最终结果，避免只优化开发集案例。

Agent 可以帮助生成候选工具和失败样本，但接口所有者仍需决定权限、幂等性、破坏性动作确认与兼容契约。

## 和 Zero-to-AI 现有实践如何接上

本站 [Skill 体系](/claude-code/skills/) 已把重复流程封装为任务剧本，[MCP 集成](/claude-code/mcp/) 负责连接外部能力。工具设计可以放在两者之间：MCP 提供窄而清楚的原子能力，Skill 只编排确实需要的多步流程。若每个 Skill 都在解析巨大原始 JSON，问题多半应回到工具输出，而不是继续增加提示词。

## 一个低成本实验

选一个公开 API 的“搜索条目并查看详情”任务。A 版直接暴露 6 个底层 endpoint；B 版提供带 namespace 的 `catalog.search` 与 `catalog.get_details`，搜索默认只回传标题、ID、状态和短摘要。准备 10 个开发任务与 5 个 held-out 任务，固定模型和最大调用次数。

**成功证据：** B 版在 held-out 集上保持或提高任务通过率，同时减少无效调用和输出 token；失败记录能指出是选错工具、参数错误、信息不足还是后端错误。

**停止线：** 任务级封装隐藏了权限确认、丢掉最终判断必需字段，或只能靠为每个 eval 写特例通过；恢复更窄接口并重做任务边界。

## 常见误区

- 工具越少越好：合并无关动作会产生巨型参数和含糊权限。
- 输出越短越好：删掉来源 ID、状态或错误细节会让 Agent 无法验证与恢复。
- 用开发集反复调到全过：没有 held-out case，得到的只是对已知提示的过拟合。

## 原文与证据边界

本文依据 Anthropic 官方页面公开经验整理，没有取得 TraceFetch 验签包，因此不标记 `verification.valid=true`。本站未独立复现 Anthropic 的内部工具集、模型表现或评测收益；这里给出的两版接口实验是可执行迁移方案，不是原文数据的复刻。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://www.anthropic.com/engineering/writing-tools-for-agents)。
