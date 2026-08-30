---
title: 多 Agent 研究系统：用广度优先换覆盖，不用人数换幻觉
description: 从 lead、workers、广度优先搜索与同预算评测理解研究型 Agent
tags: [ai-tech-practice, anthropic, multi-agent, research, evaluation]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'How we built our multi-agent research system'
  publisher: Anthropic
  url: https://www.anthropic.com/engineering/multi-agent-research-system
  published: '2025-06-13'
---

## 先说结论

研究型多 Agent 系统最适合“可拆成多个独立方向、最后需要综合”的开放问题。lead 的职责不是亲自搜索全部资料，而是控制问题分解、预算和证据合并；workers 的价值是并行扩大覆盖面。若没有统一引用、去重和同预算评测，多 Agent 只会更快地产生重复内容并消耗更多 token。

## 原文解决什么

复杂研究请求往往同时涉及多个实体、年份、来源类型或相互竞争的解释。单 Agent 顺序搜索时，早期路径会占满上下文，容易过早收敛。Anthropic 的系统以 lead 规划方向并派出 workers，让各 worker 在独立上下文里搜集证据，再由 lead 组合成答案。由此产生的新问题是预算分配、结果重复、引用遗漏和并发失败恢复。

## 核心机制

- **Lead / workers：** lead 保存问题结构与验收口径，worker 只负责一个自包含子问题，并返回结论、来源和不确定项。
- **Breadth-first：** 先用较浅搜索覆盖多个候选方向，再把剩余预算投给高价值分支，降低第一条线索绑架全局的风险。
- **并行隔离：** worker 使用独立上下文，避免互相污染；合并时按主张去重，而不是简单拼接摘要。
- **结果评测：** 评估覆盖、正确性、引用可追溯和资源成本。比较单 Agent 与多 Agent 时必须固定总预算或同时报告质量—成本曲线。

原文报告多 Agent 在其研究评测上相对提升 90.2%，并消耗约 15 倍 token；两项都是 Anthropic 自报，本站未独立复现。

## 和 Zero-to-AI 现有实践如何接上

本站 [子 Agent 协作](/claude-code/subagents/) 已给出五要素任务契约，[工作流编排](/methodology/workflow-design/) 提供 Explore 与 Verify 阶段。接入研究场景时，可以让 lead 先写“主张—所需证据—预算”表，再把互不依赖的证据槽分给 workers；最终仍由主线程核对来源是否真的支持主张，不能把子 Agent 数量当作交叉验证。

## 一个低成本实验

选一个需要比较四个公开项目的问题，准备相同的 24 次搜索或读取调用预算。A 组由单 Agent 顺序完成；B 组由 lead 分给四个 workers，每个最多 5 次调用，保留 4 次给 lead 查缺与合并。事先写 8 个事实槽和引用合格条件，盲评最终覆盖与错误。

**成功证据：** B 组在相同总调用预算下覆盖更多事实槽，且每个主张都能回到直接来源；重复来源、无效调用和未证实结论均被单独计数。

**停止线：** 子问题彼此强依赖、lead 无法判断引用质量，或并发开销吃掉大部分预算；退回单 Agent 或先做问题拆解。

## 常见误区

- 多数 Agent 同意就是真的：它们可能共享同一错误来源或模型偏差。
- 先派很多人再定义问题：没有证据槽会造成大规模重复搜索。
- 只比较答案质量：若不固定或报告 token、调用次数和耗时，提升无法公平解释。

## 原文与证据边界

本文基于 Anthropic 官方工程页面，未取得 TraceFetch 验签包，不能声称 `verification.valid=true`。90.2% 和 15 倍 token 均是厂商在特定系统与评测上的自报数字；实验设计、模型、搜索环境变化后不保证复现，本站只提炼可检验的编排原则。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://www.anthropic.com/engineering/multi-agent-research-system)。
