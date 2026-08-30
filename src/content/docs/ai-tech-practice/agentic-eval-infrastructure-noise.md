---
title: Agentic Eval 的基础设施噪声：一台更大的 VM 也会涨分
description: 控制 CPU、内存、超时与并发，让编码评测区分模型能力和运行环境
tags: [ai-tech-practice, anthropic, evaluation, infrastructure, reproducibility]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'Quantifying infrastructure noise in agentic coding evals'
  publisher: Anthropic
  url: https://www.anthropic.com/engineering/infrastructure-noise
  published: '2026-02-05'
---

## 先说结论

Agentic coding eval 是端到端系统实验，CPU、内存、硬限制、超时、并发和 API 延迟都会进入分数。资源太紧会把瞬时 OOM 当成模型失败；资源太松又可能让重依赖、暴力搜索等策略获得额外优势。可信报告必须同时公布资源“保证值”和“杀死阈值”，并把基础设施失败单列。

## 问题

传统静态题只评分最终输出，Agent 却要在容器里安装依赖、编译、跑测试和多轮试错。Anthropic 报告其 Terminal-Bench 2.0 实验中，严格资源配置与不封顶配置的分数相差 6 个百分点；严格配置的基础设施错误率为 5.8%，不封顶时为 0.5%。这些数字来自特定集群、模型和任务，本站没有独立复现，但足以说明“小幅领先”可能只是运行环境不同。

## 核心机制

容器的资源请求值和硬上限不是一回事。两者相等时，短暂内存峰值就会触发 OOM；增加适度余量主要降低无关崩溃。继续放宽后，额外资源开始改变可行策略，评测不再只是更稳定，而是变得更容易。其他混杂项还包括任务超时、节点型号、缓存、依赖镜像、网络带宽、并发度和运行时段。它们必须进入实验元数据，而不是藏在“Harness 默认值”里。

## 接入 Zero-to-AI 的实践

每个 trial 保存镜像摘要、CPU/内存 request 与 limit、磁盘、超时、并发、网络策略、开始时间和节点信息。结果拆成三层：grader 通过、Agent 自身失败、infra error。比较两个模型时采用同一任务顺序和资源档位；若不能做到同硬件，至少交叉运行并报告置信区间。sandbox 每次从干净快照启动，禁止前一 trial 的缓存和文件污染后一轮。

不要事后静默删掉 infra error。预先写明重跑规则，并同时报告原始运行数、重跑数和最终纳入数，才能看出平台是否在为某个方案兜底。

## 低成本实验

**输入：** 选 8 个会安装依赖或跑构建的任务，固定模型与 Harness。

**步骤：**

1. 设定“紧”“适中”两档内存，request 相同，只改变 hard limit。
2. 每个 case 每档跑 3 次，随机交错顺序。
3. 记录峰值内存、超时、退出码、infra error 与测试结果。
4. 人工复核资源放宽后新增的成功，是避免误杀还是换用了重资源策略。

**成功证据：** 能给出每档的基础设施失败率和任务通过率，并从 trajectory 解释差异来源；环境元数据足够另一台机器复跑。

**停止线：** 模型版本、任务镜像或依赖源在实验中变化，或者两档实际落在不同硬件且无法交叉；此时不比较分数。

## 误区

- 资源越多越公平：不封顶会改变被测能力的定义。
- OOM 一律算失败：先判断它是任务要求还是平台瞬时噪声。
- 只报平均分：必须同时报告 infra error、方差和实验配置。

## 原文与证据边界

官网标题为“Quantifying infrastructure noise in agentic coding evals”，比任务文件名更具体。文中 6 个百分点、资源倍数和显著性结论均属 Anthropic 实验，不能直接外推到本仓或任意云平台。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://www.anthropic.com/engineering/infrastructure-noise)。
