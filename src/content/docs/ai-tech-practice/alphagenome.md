---
title: AlphaGenome：一次读取百万碱基，但预测不是临床结论
description: 理解卷积、Transformer 与多输出头如何比较参考和替代序列的功能差异
tags: [ai-tech-practice, biology, genomics, deepmind]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'AlphaGenome: AI for better understanding the genome'
  publisher: Google DeepMind
  url: https://deepmind.google/blog/alphagenome-ai-for-better-understanding-the-genome/
  published: '2025-06-25'
---

## 先说结论

AlphaGenome 试图回答的不是“这个人会不会得病”，而是某段 DNA 序列及其变体可能怎样影响基因调控。模型一次处理最长约 100 万个碱基，用卷积提取局部模式、Transformer 连接远距离区域，再通过多个输出头预测不同分子信号。比较 reference 与 alternate 序列的输出差异，可形成变体效应假设，但不能直接用于个人基因解释或临床决策。

## 它在解决什么问题

基因组的大量变体位于非编码区，影响可能通过很远的调控元件传到基因。短窗口会漏掉长距离关系，只预测一种实验信号又难以解释变体可能影响转录、剪接还是染色质状态。现实瓶颈是用统一模型连接长上下文和多种测量，同时保留实验验证的入口。

## 核心机制

AlphaGenome 接收长 DNA 序列。卷积层擅长识别 motif 等局部结构，Transformer 聚合远距离上下文；多模态输出头预测基因表达、剪接、染色质可及性和蛋白结合等不同功能信号。评估变体时，分别输入 reference 与包含替代碱基的 alternate 序列，再比较各输出轨迹的变化。这个差值表示模型预测的功能影响，不是疾病因果证明，也不包含完整的人群、环境和临床背景。

官方初始博客发布于 2025-06-25；页面后来补充的 2026 年 Nature 论文属于后续更新。论文出现时间不能反写成产品博客的首次发布日期，引用时应分别标注。

## 接到 Zero-to-AI 实践

初学者先用合成序列理解“单变量对照”：固定窗口，只改变一个碱基，观察不同输出头是否产生局部或远端差异。不要上传个人基因数据，也不要把模型分数翻译成患病概率。若进入真实研究，需要版本化参考基因组、组织类型、坐标系和实验标签，并由基因组学专家决定后续验证。

## 低成本实验

构造三条 200 字符的虚拟 DNA 序列，每条只在一个位置替换碱基。自定义两个透明规则头：一个统计局部 motif，另一个统计窗口两端的配对模式。分别计算 reference 与 alternate 的输出差，记录哪些变体只影响局部头、哪些同时影响远端头。该实验是结构类比，不运行 AlphaGenome。

**成功证据：** 每组只改变一个碱基，差值可由规则手算复核；至少包含局部影响、远端影响和无影响三类结果。

**停止线：** 输入来自真实个人基因、开始推断疾病风险，或把自定义规则结果称作生物学发现时，立即停止并转交合规研究流程。

## 误区

- 百万碱基上下文不等于理解整个人类基因组或所有细胞环境。
- 多输出头提供多种预测，不等于这些测量都被同一次真实实验验证。
- reference/alternate 差异是候选机制信号，不是临床诊断或治疗建议。

## 原文与证据边界

DeepMind 页面说明模型能力、限制与后续论文，相关基准均是作者在指定数据集上的报告，本站未复现。验证 bundle 的 `verification.valid=true` 仅说明页面抓取完整，不能证明生物学主张。本文不处理个人数据，也不提供医疗建议。

本文是原创中文实践解读，不是逐句翻译。英文原文见 [Google DeepMind](https://deepmind.google/blog/alphagenome-ai-for-better-understanding-the-genome/)。
