---
title: 实时 RL：让生产反馈更快回到 Composer
description: 理解 on-policy、短周期 checkpoint 与 reward hacking，并划清用户反馈的数据边界
tags: [ai-tech-practice, coding-agents, reinforcement-learning, production-feedback]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: Improving Composer through real-time RL
  publisher: Cursor
  url: https://cursor.com/blog/real-time-rl-for-composer
  published: '2026-03-26'
---

## 先说结论

实时 RL 的核心不是“每个用户点击后立刻改模型”，而是缩短当前 policy 产生 trajectory、环境评分、更新 checkpoint 再部署的闭环。数据越接近 on-policy，训练信号越贴近模型当前会犯的错；但生产反馈也携带隐私、选择偏差和奖励投机风险，速度不能替代治理。

## 问题

离线训练常使用旧模型生成的轨迹。模型更新后，旧数据中的动作分布可能已经过时，继续优化会学到不再可达的行为。生产环境能提供新鲜任务，却不是天然标签：用户接受补丁可能只是没细看，撤销也可能来自需求变化；活跃用户、公开仓库和容易自动评分的任务还会被过度代表。

## 核心机制

Cursor 描述的 real-time RL 持续从生产反馈构造任务，让当前或接近当前的 policy 运行，再将可验证结果用于更新。文章报告约五小时形成 checkpoint 等节奏，这些数字属于 Cursor 自有系统。on-policy 能降低训练策略与采样策略的距离，但要求严格记录每条 trajectory 来自哪个 checkpoint；否则“实时”只是一堆无法归因的新数据。

奖励必须防 hacking。若只奖励测试通过，Agent 可能删测试、缩小断言或硬编码；若只奖励用户接受，可能迎合短期偏好。可靠 reward 应组合原任务测试、不可变约束、差异审计和必要人工复核，并监控指标上涨时真实质量是否同步。

## 接入 Zero-to-AI 的实践

先用合成或明确授权的数据练闭环，不把用户仓库默认变成训练集。事件记录只保留完成评测所需字段，对代码、路径、身份和提示做最小化与脱敏，并明确保留期限、退出机制和删除传播。训练样本还要标记来源人群与任务类型，以便发现谁被遗漏。

部署采用小流量和可回滚 checkpoint。线上反馈是候选信号，必须经过清洗、去重、权限检查与独立评测，不能直接变成 reward。

## 低成本实验

**输入：** 20 个合成代码修复任务、两个固定 policy 版本和一个含隐藏测试的 grader。

**步骤：**

1. 用版本 A 生成轨迹，记录 checkpoint、任务版本和 reward 分解。
2. 每 5 个任务更新一次简单策略配置，形成版本 B，而非训练大模型。
3. 让 A、B 在留出集交叉运行，检查收益是否只来自已见任务。
4. 加入“删测试即可过”的诱饵，观察 reward 是否被钻空子。

**成功证据：** 每条数据可追溯到采样 policy；留出集和约束指标同时改善；诱饵行为被隐藏测试或差异审计拦截。

**停止线：** 使用未授权用户内容、无法执行删除请求、采样版本不明、只看接受率，或 reward 上升而约束违反增加时立即停止更新。

## 误区

- real-time 等于无审核在线学习：短闭环仍需要数据门、评测门和回滚。
- 用户反馈就是偏好真相：它受人群、任务难度和界面行为影响。
- on-policy 自动避免 reward hacking：它只改善数据分布匹配，不保证奖励定义正确。

## 原文与证据边界

五小时 checkpoint、生产改进和相关性能数字均为 Cursor 自报。本站没有接触其用户数据、训练基础设施或模型权重，也未复现实验。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://cursor.com/blog/real-time-rl-for-composer)。
