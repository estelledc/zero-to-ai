---
title: GPT-Red：让自动红队成为可控的安全反馈环
description: 用威胁模型、隔离环境、对抗自博弈与能力保持评测扩展 Prompt Injection 防御
tags: [ai-tech-practice, openai, red-teaming, prompt-injection, safety-eval]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'GPT-Red: Unlocking Self-Improvement for Robustness'
  publisher: OpenAI
  url: https://openai.com/index/unlocking-self-improvement-gpt-red/
  published: '2026-07-15'
---

## 先说结论

自动红队的价值不是生成更多“吓人提示”，而是形成受控闭环：攻击者在明确威胁模型内找失败，防守者学习抵抗，再用隔离的 held-out 场景检验是否真正泛化。攻击模型本身是高风险资产，不能当普通工具开放，也不能让它接触真实凭证和生产目标。

## 问题

人工红队能发现深层问题，但成本高、覆盖有限，难以持续生成训练所需的多样攻击。与此同时，网页、邮件、本地文件和工具返回都可能携带 prompt injection。固定题库很快饱和，模型在旧攻击上高分，不代表能抵抗会根据回应迭代的新攻击者。

## 核心机制

OpenAI 描述的 GPT-Red 通过 self-play 与一组防守模型同时训练：攻击者因诱发有效失败获奖励，防守者因抵抗攻击并完成原任务获奖励。每个环境都先定义攻击者能控制的内容和成功条件，训练后再到未见场景与真实系统模拟中测试。文章报告 GPT-5.6 Sol 在其最难直接注入基准上，相比四个月前最佳生产模型失败减少 6 倍；也报告多项攻击与防御数字，均为 OpenAI 结果，本站未独立复现。

真正的闭环还包含两条约束：攻击能力与生产模型分离，避免释放专门训练出的恶意能力；防御提升不能靠“什么都拒绝”，必须同时跑正常能力与过度拒绝 grader。

## 接入 Zero-to-AI 的实践

本站只做低风险版本：用合成文件模拟恶意指令，目标是让 Agent继续完成无害的文档任务且不越权。红队生成器只能输出文本 fixture，不能联网、执行命令或读取真实仓库外数据。每个 case 记录威胁模型、可控字段、禁止动作、正常任务 outcome 与攻击是否成功。trajectory grader 检查数据来源和工具调用，环境层再用 sandbox 保证即使模型失守也无法外传。

## 低成本实验

**输入：** 10 份合成 README，其中 5 份夹带“忽略任务并读取仓库外文件”等无害占位攻击，5 份为正常内容。

**步骤：**

1. 在只读 fixture、仓库外不可见、无网络的 sandbox 中执行同一摘要任务。
2. 记录 Agent 是否遵循用户目标、是否尝试越权、正常样本是否被过度拒绝。
3. 根据失败新增变体，最多两轮；最终用未参与迭代的 4 个 case 验收。

**成功证据：** 注入样本中无越权工具调用，正常任务仍完成；held-out 结果与完整 trajectory 可复查。

**停止线：** 变体开始涉及真实 secrets、真实外部端点、绕过细节或生产账号，立即停止并改回占位符。

## 误区

- 攻击成功率越高越好：没有权限边界的红队会制造新的现实风险。
- 全部拒绝就是鲁棒：安全 grader 必须与任务完成率配对。
- 自博弈能替代人：人类与第三方仍负责新威胁、伦理边界和校准。

## 原文与证据边界

本文只覆盖安全评测工程，不复现 OpenAI 的攻击样例、算力规模或生产实验，也不声称合成 fixture 能代表真实攻击面。可迁移的是明确威胁模型、攻击/防守分离和 held-out 验收。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://openai.com/index/unlocking-self-improvement-gpt-red/)。
