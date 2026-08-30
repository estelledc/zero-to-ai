---
title: Agent Evals：先定义结果，再选择 Grader
description: 从任务、trajectory、outcome 与多类 grader 搭建最小可信 Agent 评测
tags: [ai-tech-practice, anthropic, evaluation, grader, trajectory]
difficulty: intermediate
lastVerified: '2026-08-30'
source:
  title: 'Demystifying evals for AI agents'
  publisher: Anthropic
  url: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
  published: '2026-01-09'
---

## 先说结论

Agent eval 不是“问一道题，看最后一句像不像答案”。它要同时保存任务、环境、完整 trajectory 与最终 outcome，并用确定性检查、模型评审和人工校准分别承担合适的判断。先把成功写成可观察状态，再谈分数。

## 问题

Agent 会跨多轮调用工具、修改文件并根据中间结果改计划。它可能口头声称“修好了”，但仓库状态并未改变；也可能绕开预想路径，却交付了完全正确的结果。只评最终文本会放过假完成，只限定工具顺序又会误杀有效方案。随机性还意味着单次通过不能证明稳定。

## 核心机制

- **Task / trial：** 一个任务要跑多次 trial，区分“偶尔成功”和“可靠成功”。
- **Trajectory / outcome：** trajectory 解释 Agent 怎么走，outcome 证明环境最后变成什么样。二者不能互相替代。
- **Grader 分工：** 测试、类型检查和状态断言便宜且可复现；LLM grader 适合开放式质量，但要有细 rubric 和人工校准；人工负责高风险、主观或争议样本。
- **能力与回归分离：** 能力集应保留未攻克任务，回归集应接近稳定全过。前者看上限，后者防退化。
- **可靠性指标：** `pass@k` 关注多次里至少一次成功，`pass^k` 关注连续多次都成功。面向真实用户时，后者往往更接近体验。

## 接入 Zero-to-AI 的实践

从 20 个以内的真实失败起步即可。每条 case 固定仓库快照、输入、权限、网络策略和超时；运行后保存命令退出码、diff、测试结果与 trajectory。正确性优先用代码 grader，文档可读性再用有证据引用的 rubric。LLM grader 必须允许返回“证据不足”，且不能读取被测 Agent 不可见的答案。每次模型或 Harness 升级，同时跑能力集和回归集。

任务还要同时收录正例与负例：既检查“该做时会做”，也检查“不该做时能停”。否则 Agent 只要对所有输入都采取同一激进行为，也可能获得漂亮分数。

## 低成本实验

**输入：** 5 个已有小任务，其中 3 个来自过去失败，2 个是“明确不应修改”的负例。

**步骤：**

1. 为每条任务写一个 outcome 断言和一个禁止项。
2. 在干净 worktree、无额外凭证的 sandbox 中各跑 3 次。
3. 用测试或 diff 自动评分，再人工抽查全部失败与 20% 成功 trajectory。
4. 把不公平 grader 与真实 Agent 失败分开记录。

**成功证据：** 每个分数都能回到具体断言、环境状态和 trajectory；同一 case 的波动有 trial 记录，而不是被平均数藏掉。

**停止线：** 参考解本身过不了 grader、两位读者无法对通过标准达成一致，或环境无法重置；先修 case，不优化 Agent。

## 误区

- grader 越多越可信：重复且相关的 grader 只会制造虚假的精确度。
- 强制固定工具顺序：应优先评结果，只有安全、权限或审计要求才约束路径。
- 自动 eval 等于用户价值：生产监控、用户反馈与人工复核仍是独立证据层。

## 原文与证据边界

原文给出跨多类 Agent 的方法与客户案例，不能视为对 Zero-to-AI 的实测。本文把它收敛为小型教程仓库可执行的评测骨架；具体样本数、模型和阈值仍需本地基线决定。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)。
