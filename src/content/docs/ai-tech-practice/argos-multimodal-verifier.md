---
title: Argos：多模态 Agent 的奖励先要看懂落点
description: 拆解检测、分割、指点、字符串与 LLM 评分如何组成 agentic verifier
tags: [ai-tech-practice, multimodal, reinforcement-learning, microsoft]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'Argos: Multimodal reinforcement learning with agentic verifier for AI agents'
  publisher: Microsoft Research
  url: https://www.microsoft.com/en-us/research/blog/multimodal-reinforcement-learning-with-agentic-verifier-for-ai-agents/
  published: '2026-01-20'
---

## 先说结论

训练会操作界面的多模态 Agent，不能只问“最后答案像不像”。Argos 把验证也做成组合系统：GroundingDINO 找目标，SAM2 分割区域，pointing 检查点击落点，字符串规则核对可确定文本，LLM 评分处理较开放的语义。它试图把模糊的成功判断拆成可定位信号，但 verifier 本身仍会错。

## 它在解决什么问题

GUI 或视觉任务常有多条可行路径。只比较最终截图会把偶然相似当成功；只核对动作坐标又无法判断界面是否已变化。人工标注准确却昂贵，单一视觉模型则可能在小图标、遮挡或滚动后失效。强化学习若收到错误奖励，会稳定学会“骗过评分器”而非完成任务。

## 核心机制

Argos 根据任务选择不同验证工具并汇总结果。GroundingDINO 用文本定位候选对象，SAM2 给出更细的区域掩码，pointing verifier 判断预测点是否进入目标；精确名称、数字或状态可走字符串匹配，无法用规则覆盖的视觉语义再交给 LLM 评分。组合 verifier 的意义是让不同工具处理自己更擅长的证据，并为强化学习提供更密集的奖励，而不是用一个总分隐藏失败位置。

## 接到 Zero-to-AI 实践

先为一个操作任务写状态断言，例如“设置页中开关由关变开”，再把证据分成动作、视觉结果和可读文本。确定性检查优先，开放评分最后使用；每个 verifier 都保存输入截图、目标、阈值和单项输出。对高风险动作仍要人工确认，不能因为组合分数过线就自动付款、删除或发布。

## 低成本实验

截取 24 张本地应用截图，人工标注一个按钮区域和操作后状态。构造正确点击、边缘点击、错按钮、文字相同但状态未变四类样本。用矩形区域模拟 pointing，以 OCR 或人工转录模拟字符串检查，再让一个视觉模型只判断开放状态。分别计算单项规则和“落点加状态”组合的误报、漏报，并检查分歧样本。

**成功证据：** 标注与判定规则可复查；组合验证至少拒绝一个单看文字或单看坐标会误收的样本，并公开所有分歧案例。

**停止线：** 截图包含未脱敏信息、标注者无法确定正确状态，或为了提高总分反复针对测试集调阈值时，停止并重建数据集。

## 误区

- verifier 多不等于证据独立，多个视觉工具可能受同一截图偏差影响。
- 奖励更密集不保证目标正确，错误中间信号会加速 reward hacking。
- LLM 评分适合补充模糊语义，不应覆盖可确定的状态断言。

## 原文与证据边界

Microsoft Research 页面介绍 Argos 的系统和实验，性能提升属于研究团队在特定模型、环境与评测上的自报结果，本站未复现。验证 bundle 的 `verification.valid=true` 只证明官方正文抓取完整，不为 verifier 准确率背书。本地实验只检查组合判定是否减少已知误报。

本文是原创中文实践解读，不是逐句翻译。英文原文见 [Microsoft Research](https://www.microsoft.com/en-us/research/blog/multimodal-reinforcement-learning-with-agentic-verifier-for-ai-agents/)。
