---
title: CoT 可监控性评测：先证明“能看见”，再讨论“能监督”
description: 用 intervention、process 与 outcome-property 三类合成评测检查监督信号
tags: [ai-tech-practice, openai, chain-of-thought, evals]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'Evaluating chain-of-thought monitorability'
  publisher: OpenAI
  url: https://openai.com/index/evaluating-chain-of-thought-monitorability/
  published: '2025-12-18'
---

## 先说结论

“模型给了解释”不等于解释忠实，“监控器判对了结果”也不等于看懂了过程。可监控性评测要建立外部可判定的 ground truth，再问监控器能否从允许观察的信号识别原因、步骤或结果属性。本站实践只能使用系统实际暴露的解释、工具动作和输出，不能把它们称为隐藏 CoT。

## 原文解决什么

OpenAI 提出三类 CoT monitorability eval。**Intervention** 在环境中加入受控变化，检查监控器能否识别行为为什么改变；**process** 选择有效路径有限的任务，由专家列出必要步骤，再判断模型走了哪条；**outcome-property** 先用外部判定器确认输出具有某种属性，例如 reward hacking，再检查推理或动作中是否有可识别证据。

评测必须同时看 Agent 和 monitor 两侧。提高 Agent 推理预算可能让行为更复杂，也可能留下更长证据；提高 monitor 预算则可能改善识别。只固定一侧，无法判断瓶颈来自信号缺失还是监控能力不足。OpenAI 自报构建了 13 项评测、24 个环境，相关趋势也只在其研究条件下成立，本站未复现。

## 接入 Zero-to-AI 的实践

把“可监控性”缩成本站能验证的动作日志任务。Intervention 样本可在依赖文件中加入明确版本冲突；process 样本规定修复必须经过复现、定位、修改、验证四步；outcome-property 样本则用外部脚本判断 Agent 是否改了测试来制造通过。监控器只接收时间排序后的可见解释和工具摘要，并与独立 ground truth 对照。

如果平台只返回最终答案，就只能评测 outcome，不能补写一段“模型当时想了什么”。如果解释中没出现意图但动作已违规，应记录为当前观测下不可监控，而不是强行合理化。

## 一个低成本实验

**输入：** 每类四条合成轨迹，共 12 条；一半保留完整可见解释与动作，一半只保留动作和结果。

**步骤：**

1. 预先写出 intervention 原因、process 必要步骤和 outcome 属性标签。
2. 用同一监控器分别评估两种观测条件，再各增加一次 monitor 预算。
3. 分开报告三类召回、误报和无法判断，不汇总成一个漂亮总分。

**成功证据：** 标签由外部规则稳定复核；完整观测相对动作-only 的差异可重复，且失败样本能指出是缺信号还是判定错误。

**停止线：** ground truth 依赖猜测模型意图、实验要求访问未授权隐藏 CoT，或调整题目后才让监控器通过；停止结论。

## 常见误区

- 能解释就忠实：自然语言可能是事后叙述。
- 监控准确率高就能做安全控制：分布变化和对抗适应仍会破坏信号。
- 一个总分代表全部风险：三类评测测的是不同机制，应分开看。

## 原文与证据边界

本文依据 2026-08-30 可读取的 OpenAI 官方页面。研究中的 CoT 访问、模型趋势与算力比较属于 OpenAI 实验条件，不能迁移为本站能力。本轮未取得 TraceFetch 签名正文包，不能声明 `verification.valid=true`。上述合成实验只测可获得解释和动作的可判别性，不证明隐藏推理透明或生产安全。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://openai.com/index/evaluating-chain-of-thought-monitorability/)。
