---
title: Composer 2 训练拆解：先补代码分布，再练真实 Agent 行为
description: 从 continued pretraining、异步强化学习与执行环境理解编码 Agent 的训练闭环
tags: [ai-tech-practice, coding-agents, training, reinforcement-learning]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: A technical report on Composer 2
  publisher: Cursor
  url: https://cursor.com/blog/composer-2-technical-report
  published: '2026-03-27'
---

## 先说结论

编码 Agent 的训练不能只喂更多代码。continued pretraining 负责补充代码、仓库结构与开发文本的分布知识；强化学习再让模型在真实工具循环里学会搜索、编辑、运行和修正。两阶段解决的问题不同，最终分数还同时依赖执行环境与评分器，不能把 CursorBench 的提升全部归因于某一个训练技巧。

## 问题

会补全代码的模型不一定会完成仓库任务。它可能读错入口、修改过多文件、忽略测试，或在环境失败后反复尝试。只用静态 next-token 目标，无法直接奖励“最小正确改动并通过验证”；只做 RL，又可能因为基础代码能力不足、任务过难或 reward 稀疏而学不到稳定策略。

## 核心机制

Cursor 的 Composer 2 报告把训练分为 continued pretraining 与 RL。前者继续适配编码相关数据，后者在可执行任务中根据结果更新策略。MoE 让每个 token 只激活部分参数，以扩大容量与计算之间的选择；异步 RL 则让 rollout、评分与训练不必严格串行，减少等待，但也引入 policy staleness、版本追踪和样本归属问题。

Anyrun 提供可隔离的执行环境，CursorBench 提供端到端任务与评分。它们既是训练基础设施，也是结果的一部分：镜像、网络、超时、测试和重跑策略一变，分数含义就可能变化。因此报告模型时必须同时钉住 harness。

## 接入 Zero-to-AI 的实践

把能力缺口按阶段归档。不会理解代码或接口，优先归入数据与预训练问题；知道该做什么却不会选择工具、验证或恢复，才更像 Agent policy 问题。每条训练样本保留任务版本、环境摘要、policy checkpoint、trajectory、reward 分解和 grader 版本，避免异步流水线把旧策略样本混成新策略结果。

本站不训练 Composer 2，也不拿不同公开模型的差异反推其训练因果。可以学习的是“数据—环境—奖励—评测”四份版本必须同时可追踪。

## 低成本实验

**输入：** 10 条匿名编码 Agent 失败 trace，以及固定的任务验收标准。

**步骤：**

1. 将失败标为知识缺口、定位错误、工具错误、验证缺失或奖励错配。
2. 为每类写一个可观察判据，禁止根据模型自述分类。
3. 选两条 trace，分别设计静态学习样本和可执行 RL 任务。
4. 用同一 grader 检查两种样本是否真的触达原失败。

**成功证据：** 每个分类都能引用动作或测试结果；训练样本与目标失败一一对应；grader 不奖励删测试、硬编码答案等捷径。

**停止线：** 没有原始 trace、环境或 grader 版本不明，或者仅凭最终分数声称某训练阶段产生因果收益时停止分析。

## 误区

- continued pretraining 等于记住更多仓库：目标是分布适配，不能用泄漏受测题目换分。
- RL 分数上涨就会真实开发：奖励覆盖不到的质量、安全和维护性仍可能退化。
- MoE 自动更便宜：实际成本还取决于路由、通信、批处理与部署栈。

## 原文与证据边界

CursorBench 分数、训练规模和效率均来自 Cursor 技术报告，本站没有访问训练数据、checkpoint 或 Anyrun 集群，也未独立复现这些数字。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://cursor.com/blog/composer-2-technical-report)。
