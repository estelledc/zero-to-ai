---
title: Speculative Cascades：把是否升级大模型推迟到 token 级
description: 理解级联推理与 speculative decoding 如何合并质量路由和并行验证
tags: [ai-tech-practice, inference, llm, google]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: Speculative cascades — A hybrid approach for smarter, faster LLM inference
  publisher: Google Research
  url: https://research.google/blog/speculative-cascades-a-hybrid-approach-for-smarter-faster-llm-inference/
  published: '2025-09-11'
---

## 先说结论

传统 cascade 在整条请求开始或结束后决定是否调用大模型，传统 speculative decoding 则让小模型起草、大模型逐 token 验收。Speculative cascades 把两者合并：小模型先生成候选，大模型并行验证，并在 token 级根据置信信号决定接受、修正或继续交给大模型。它优化的是质量与计算量的折中，不保证输出与单独运行大模型完全相同。

## 它在解决什么问题

只按请求难度路由太粗：同一道题的开头可能简单，关键推理步骤却需要大模型。先让小模型完整回答再评分，又已付出整段延迟；所有请求都跑大模型则浪费算力。系统需要在生成途中识别“这里值得升级”，同时避免两套模型串行运行抵消节省。

## 核心机制

小模型作为 draft model 提议一段 token，大模型对候选进行验证。级联的 deferral 规则不再只给整条回答打分，而是读取 token 级分数与验证信号，决定继续接受草稿还是切换更强模型。这样，简单片段可保留小模型速度，困难片段借用大模型能力；并行验证则复用 speculative decoding 的批量检查思路。

关键代价是输出分布改变。标准 speculative decoding 通过特定接受规则可保持目标模型分布，而加入质量导向的级联决策后，系统追求的是风险—成本目标，不能声称结果必然等同于大模型独立生成。阈值也会随任务、模型校准和服务负载变化。

## 接到 Zero-to-AI 实践

先区分两种需求：若必须严格复现目标模型分布，就采用有分布保证的解码方案；若产品允许用可测质量换取成本，再设计 deferral。每次路由至少记录草稿长度、接受 token 数、触发升级的位置、最终质量和两模型计算量。不要只报平均延迟，因为少量困难请求可能出现尾延迟倒挂。

## 低成本实验

准备 30 个短任务，人工标出答案中的关键片段。无需真实双模型：用一份已保存的“小模型草稿”和“大模型答案”，设计三种规则——整题置信度路由、每五个 token 检查、遇到关键片段检查。统计接受比例、模拟计算成本、关键错误漏过数和升级次数，再改变阈值画出质量—成本表。

**成功证据：** 至少出现一个整题路由漏掉、token 级规则能捕获的局部错误；每个阈值都有质量与成本两项记录，且保存失败样本。

**停止线：** 没有独立质量标签、把字符重合当语义正确，或用模拟成本宣称真实硬件加速时，停止并补充测量条件。

## 误区

- “speculative”不表示随意猜测，候选 token 仍需验证和接受规则。
- 小模型接受率高不一定更好，错误校准可能只是让系统更少求助。
- 平均 token 节省不能替代端到端延迟、尾延迟和服务成本测试。

## 原文与证据边界

Google Research 页面介绍方法和实验结论；其中效果属于作者在指定模型、任务和预算下的报告，本站未复现。验证 bundle 的 `verification.valid=true` 仅证明页面抓取完整，不验证算法主张。低成本实验只建立 deferral 的测量直觉。

本文是原创中文实践解读，不是逐句翻译。英文原文见 [Google Research](https://research.google/blog/speculative-cascades-a-hybrid-approach-for-smarter-faster-llm-inference/)。
