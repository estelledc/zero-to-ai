---
title: AI Control Roadmap：监控高能力 Agent 的真实动作
description: 用 supervisor、覆盖率、召回率和响应时间建立可测量的 Agent 控制层
tags: [ai-tech-practice, ai-control, agents, security]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: Securing the future of AI agents
  publisher: Google DeepMind
  url: https://deepmind.google/blog/securing-the-future-of-ai-agents/
  published: '2026-06-18'
---

## 先说结论

给 Agent 写一条“不要做坏事”的系统提示，不等于建立控制。AI control 关注的是：即使被控模型可能隐藏意图，外部 supervisor 能否在足够多的真实动作上及时发现并阻断危险。它必须同时测 coverage、recall 和 time-to-response；只展示几个成功拦截案例，无法说明系统可靠。

## 问题

Agent 能读写文件、调用 API、发消息和长时间执行，单次输出审核抓不到跨步骤风险。权限全关会让产品不可用，权限全开再靠事后日志又来不及。更难的是监督器本身也可能漏报、误报，或与被监控模型共享同一盲点。安全问题于是从“模型说了什么”变成“哪些动作可达、哪些被看见、多久能止损”。

## 核心机制

Google DeepMind 的 AI Control Roadmap 把 supervisor 放在模型与环境之间：高风险动作先经过检查，低风险动作保留审计，异常触发降权、暂停或人工升级。coverage 表示控制层实际观察到多少应观察的表面；recall 表示已发生的危险尝试中抓住多少；time-to-response 则决定发现时损害是否已经发生。三者需要与误报率、业务可用性一起看。

原文还讨论用大规模任务建立证据，其中“一百万任务”等规模是厂商路线与自报，不代表规模本身能替代威胁模型。重复一百万次无风险任务，仍不能证明罕见高影响路径安全。

## 接入 Zero-to-AI 的实践

先列 capability，而不是列抽象风险：读哪些目录、写哪些路径、能否联网、能否代表用户发送、能否更改权限。每次工具调用生成结构化事件，记录主体、目标、参数摘要、策略决定和结果。supervisor 只在真实边界做决定，例如外发、删除、付款和权限提升；普通读取无需堆叠无意义确认。

控制策略要有明确退路。检测不确定时可以转只读、缩小作用域或请求人工批准，而不是默默放行或无限重试。

## 低成本实验

**输入：** 30 条合成工具轨迹，其中混入越权读取、可疑外发和正常相似动作，并预先冻结标签。

**步骤：**

1. 让 supervisor 逐条输出 allow、block 或 escalate 及时间戳。
2. 统计可观察动作覆盖率、危险动作召回率、误报率和响应时间。
3. 加入一次跨三步才显现的外发轨迹，检查状态是否跨调用保留。
4. 改一个阈值并复跑，比较安全与可用性取舍。

**成功证据：** 每项指标可从原始事件复算；漏报和误报都有具体 case；被阻断动作在环境侧确实未执行，而非仅生成警告文本。

**停止线：** 标签在看到输出后修改、关键动作绕过记录、supervisor 与被控 Agent 共用不可审计上下文，或只报 recall 不报 coverage 和误报时停止声称控制有效。

## 误区

- supervisor 更强就够了：监控面没覆盖到的动作，再强也看不见。
- 高 recall 就安全：全拦截也能得到高 recall，却让系统失去用途。
- 任务规模等于证据质量：规模必须落在真实威胁路径上才有意义。

## 原文与证据边界

路线图描述 Google DeepMind 的研究方向、系统设想与实验规模。本站没有复现其 supervisor 或百万任务评测，也不把厂商数字当作本地安全保证。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://deepmind.google/blog/securing-the-future-of-ai-agents/)。
