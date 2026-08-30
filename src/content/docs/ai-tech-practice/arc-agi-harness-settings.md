---
title: ARC-AGI Harness 设置：模型分数也在测上下文工程
description: 用保留推理与上下文压缩理解为什么评测必须同时固定模型和 Harness
tags: [ai-tech-practice, openai, evaluation, harness, context]
difficulty: intermediate
lastVerified: '2026-08-30'
source:
  title: 'How enabling two settings tripled our scores on the ARC-AGI-3 benchmark'
  publisher: OpenAI
  url: https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/
  published: '2026-07-29'
---

## 先说结论

Agent 分数不是模型能力的裸读数，而是“模型 × Harness × 上下文策略”的联合结果。若每一步都丢掉推理线索，长到阈值又直接截掉旧记录，Agent 就像每走一步都失忆。比较模型前，必须把上下文保留、压缩方式和 token 预算写进实验配置。

## 问题

ARC-AGI-3 要求 Agent 在没有说明书的二维游戏里试错并学习。OpenAI 发现，官方通用 Harness 会在每次动作后丢弃私有推理，并用滚动截断移除旧动作。模型因此反复重新理解游戏，低分未必只来自推理能力不足。官方文章报告，在其公开任务集上，GPT-5.6 Sol 从官方 Harness 的 13.3% 提升到保留推理并启用 compaction 后的 38.3%，输出 token 约降为六分之一；这是厂商实验，本站未独立复现。

## 核心机制

- **保留推理状态：** 通过上一响应标识延续模型已经形成的计划，避免每轮从零推断。
- **压缩而非截断：** 接近上下文上限时提炼旧观察与策略，保住“学到了什么”；直接删最老消息会同时删掉因果链。
- **Harness 对齐：** 用生产中真实采用的 API、工具协议和上下文策略评测，否则测到的是一个并不存在的产品形态。
- **成本与能力同看：** 分数上升若伴随 token、延迟或重试暴涨，仍不能直接判定为更好的产品方案。

## 接入 Zero-to-AI 的实践

为每次长任务保存四层证据：固定输入与代码 SHA；每轮工具调用和环境结果组成的 trajectory；压缩前后的上下文摘要；最终 grader 与成本指标。对比时只改变一个变量，例如 `truncate` 与 `compact`，模型、温度、任务顺序和 sandbox 都保持一致。摘要必须保留已证实事实、未决假设、失败尝试和权限边界，不能只保留“继续努力”。

## 低成本实验

**输入：** 3 个需要连续查文件、修改并验证的小任务，每个任务允许 12 轮。

**步骤：**

1. A 组在第 6 轮删除最早记录；B 组把前 6 轮压成结构化摘要。
2. 使用同一模型、同一初始仓库快照和无网络 sandbox，各跑 3 次。
3. 记录任务通过率、重复读取次数、总 token 和摘要后首次错误。

**成功证据：** B 组能引用早期已验证事实，重复动作更少，且 grader 通过率不低于 A 组；保留完整 trajectory 可复查原因。

**停止线：** 样本间环境不同、摘要由人工偏向某组，或只有一次运行；此时不做能力结论，只修实验设计。

## 误区

- “换成更强模型就够了”：失忆 Harness 会浪费更强的推理能力。
- “上下文越长越好”：冗余历史会增加成本，也可能稀释有效信号。
- “三倍分数可直接外推”：该数字绑定特定模型、任务集与设置，不代表任意 Agent 都有同样收益。

## 原文与证据边界

本文确认了官网标题、日期和文章披露的设置与结果，但没有复跑 ARC-AGI-3，也无法据此拆出“保留推理”和“压缩”各自的独立贡献。可迁移的是控制 Harness 变量与保存 trajectory 的方法。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/)。
