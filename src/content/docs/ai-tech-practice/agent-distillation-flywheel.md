---
title: Agent 蒸馏飞轮：先从真实轨迹筛出可学经验
description: 用 trace 分区、教师评估和 LoRA 蒸馏理解小模型 Agent 的持续优化闭环
tags: [ai-tech-practice, agents, distillation, nvidia]
difficulty: intermediate
lastVerified: '2026-08-30'
source:
  title: Build Efficient AI Agents Through Model Distillation With the NVIDIA Data Flywheel Blueprint
  publisher: NVIDIA Technical Blog
  url: https://developer.nvidia.com/blog/build-efficient-ai-agents-through-model-distillation-with-nvidias-data-flywheel-blueprint/
  published: '2025-06-11'
---

## 先说结论

蒸馏 Agent 的难点不是让大模型批量生成答案，而是从真实交互里找出小模型值得接管、又有可靠反馈的任务。Data Flywheel Blueprint 把生产 trace、教师模型、评估器和 LoRA 训练接成循环：先观察，再筛选和去重，最后才训练。它适合稳定、重复、可评分的子任务，不适合拿一个小模型包办所有长尾请求。

## 它在解决什么问题

直接把所有日志送去训练会混入隐私、重复样本、失败工具调用和不断变化的需求。只用教师模型造题，又可能偏离真实流量。更现实的问题是：哪些请求已形成高频簇，教师答案是否真的更好，小模型升级后是否仍守住质量与成本门槛？没有这几层判断，“飞轮”只会更快放大脏数据。

## 核心机制

蓝图先采集 OpenTelemetry trace，再按任务和时间分区、去重，保留可追踪的数据版本。教师模型为样本生成或改进答案，独立 evaluator 按任务标准筛选；通过的样本用于 LoRA 微调较小模型。部署后继续收集新轨迹，比较当前模型、候选小模型与教师，再决定是否开启下一轮。教师负责提供候选能力，评估器负责判定是否达标，两者不能混成一次自我打分。

NVIDIA 文中报告某客服 Agent 场景的小模型准确率达到教师模型的 98%，同时讨论成本和延迟收益。这是厂商在给定数据、模型与评分方法下的自报结果，本站没有独立复现，不能外推成任意 Agent 都能保留 98% 能力。

## 接到 Zero-to-AI 实践

先挑一个边界窄的动作，例如把失败日志归到五个已定义类别。为每条 trace 保存输入版本、工具结果、人工标签和敏感字段处理状态；按会话切分训练集与测试集，避免同一对话的近重复内容泄漏。只有当规则或人工复核能稳定判断对错，才值得蒸馏。发布也应是候选模型旁路评分，而不是训练完成就替换线上模型。

## 低成本实验

收集 40 条脱敏的本地任务记录，按会话去重后分成 25 条训练、15 条保留测试。让较强模型给训练样本补充理由，再由固定 rubric 和人工抽检筛掉不合格答案。用提示词模拟“小模型策略”，比较原策略、教师策略与筛选后策略在测试集上的准确率、拒答率和平均输出长度。

**成功证据：** 数据分区可复查、重复项有记录，保留集从未进入生成或调参；候选策略在预设质量下限之上，并给出至少三条失败样本。

**停止线：** 无法脱敏、任务没有稳定评分标准、保留集被反复查看调参，或提升只来自答案变长时，停止训练并回到数据契约。

## 误区

- 教师答案不是事实标签；教师和评估器可能共享同一盲点。
- LoRA 降低训练成本，不会自动解决数据漂移、工具权限或安全边界。
- trace 数量多不等于覆盖广，近重复会同时夸大训练量和测试成绩。

## 原文与证据边界

官方页面足以说明蓝图组件与案例流程，但验证 bundle 的 `verification.valid=true` 只代表抓取内容完整，不证明其中性能主张。上面的实验验证数据闭环是否可审计，不是对 NVIDIA 蓝图、GPU 性能或 98% 数字的复现。

本文是原创中文实践解读，不是逐句翻译。英文原文见 [NVIDIA Technical Blog](https://developer.nvidia.com/blog/build-efficient-ai-agents-through-model-distillation-with-nvidias-data-flywheel-blueprint/)。
