---
title: DFlash：把推测解码的草稿阶段也并行起来
description: 从草稿、验证和接受率理解 block-diffusion speculative decoding，并做可审计的纸面实验
tags: [ai-tech-practice, speculative-decoding, inference, nvidia]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: Boost Inference Performance up to 15x on NVIDIA Blackwell Using DFlash Speculative Decoding
  publisher: NVIDIA Technical Blog
  url: https://developer.nvidia.com/blog/boost-inference-performance-up-to-15x-on-nvidia-blackwell-using-dflash-speculative-decoding/
  published: '2026-06-23'
---

## 先说结论

推测解码的关键不是“小模型先写、大模型照抄”，而是草稿便宜、候选接受率足够高、目标模型能并行验证。传统草稿模型仍逐 token 生成，会形成新瓶颈；DFlash 用 block diffusion 一次提出一块候选，把草稿阶段也变成并行工作。

## 问题

自回归模型每次只确定下一个 token，延迟天然串行。普通 speculative decoding 虽让目标模型一次验证多个候选，但 draft 长度增加时，小模型也要一步步写，草稿成本跟着上涨。如果候选经常被拒，额外草稿和验证反而浪费；所以只谈理论并行度没有意义。

## 核心机制

DFlash 的 block-diffusion drafter 在一次 forward pass 中预测一组被 mask 的未来 token，再由目标模型并行验证并接受最长有效前缀。它还用目标模型 hidden state 作为条件，并通过 KV injection 把目标上下文特征注入草稿模型各层的 key-value 投影，目的是在保持草稿轻量的同时提高接受率。最终 token 仍由目标模型验证，因此文章称输出分布保持目标模型质量。

NVIDIA 原文报告：在八卡 DGX B300、gpt-oss-120b、TensorRT-LLM 和指定交互区间下，相比自回归解码吞吐最高超过 15 倍；其他单卡模型与框架得到不同幅度。本文没有 Blackwell 环境，也未独立复现这些数字。

## 如何接到 Zero-to-AI 学习实践

评估时同时画 latency-throughput Pareto 曲线，不拿单个最高吞吐点下结论。固定模型、数据集、输出长度和并发，记录 draft 耗时、目标验证耗时、平均接受 token 数、每用户生成速度与总吞吐。先问工作负载是 decode-bound 还是 prefill-bound；后者未必从 DFlash 得到同样收益。

还要保留纯自回归基线，并把 warm-up、batch、精度和硬件写进实验记录。若一种配置吞吐更高却让单用户等待越过产品目标，它不在可接受的 Pareto 区间。质量验收应比较目标模型最终输出分布或任务指标，不能只看候选接受率。

同一结论至少要覆盖短输出和长输出两类负载。

## 低成本实验

无需 GPU 也能做纸面模拟。准备 30 轮“目标 token 序列”和三组长度为 4 的候选块，分别设高、中、低命中率。逐轮接受最长匹配前缀，统计每次目标验证产出的有效 token 数，再扣除固定 draft 成本。改变块长度，观察并行收益何时被拒绝率吃掉。这个实验只验证机制和指标关系，不测真实 kernel、显存或厂商吞吐。

为避免事后挑结果，先写下每组候选和成本公式，再统一计算。至少构造一个块更长却总成本更高的反例；如果没有，说明样例还不足以展示接受率与草稿成本的权衡。

**成功证据：** 原始候选表、成本公式和逐轮接受结果均可复算；至少出现一个“块更长但总成本更高”的反例，并能指出拒绝率如何抵消并行收益。

**停止线：** 没有固定自回归基线、看完结果后又修改候选块，或开始把纸面计算外推成真实 GPU 加速时，停止比较并重做实验设计。

## 误区

- draft 越长不一定越快；接受率下降会增加废弃候选。
- speculative decoding 不是跳过大模型，大模型仍负责验证。
- “最高 15×”不是任意模型、GPU 或并发的默认加速，尤其不能直接套到笔记本。

## 原文与证据边界

页面披露了 Blackwell 测试条件、SPEED-Bench、框架集成和多个表格，但它仍是 NVIDIA 技术博客。20 个 checkpoint 与 vLLM、SGLang、TensorRT-LLM 支持说明可评估性，不等于所有组合都已达到同一收益。

本文是原创中文实践解读，不是逐句译文。英文原文见 [NVIDIA 官方技术文章](https://developer.nvidia.com/blog/boost-inference-performance-up-to-15x-on-nvidia-blackwell-using-dflash-speculative-decoding/)。
