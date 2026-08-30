---
title: AgentRx：沿 Trajectory 找到第一个不可恢复错误
description: 用工具 Schema、领域策略、可执行约束和证据日志系统调试 Agent
tags: [ai-tech-practice, microsoft, debugging, trajectory, agent-eval]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'Systematic debugging for AI agents: Introducing the AgentRx framework'
  publisher: Microsoft Research
  url: https://www.microsoft.com/en-us/research/blog/systematic-debugging-for-ai-agents-introducing-the-agentrx-framework/
  published: '2026-03-12'
---

## 先说结论

调试 Agent 不该从最后一句错误答案往回猜，而要找 trajectory 中第一个让任务无法恢复的步骤。先用工具 Schema 与领域策略生成可执行约束，逐步产出证据日志，再让 LLM 判断根因；这样能把“模型好像理解错了”变成可复查的违规点。

## 问题

长任务里常有多个错误：一个工具参数缺失，随后 Agent 误读报错，再编造结果，最后才测试失败。最后失败最显眼，却未必是根因。多 Agent 场景还会把错误传给下游，使人工复盘在几十步日志中追错方向。单一成功率只回答“有没有完成”，不能回答“从哪一步开始已经救不回来”。

## 核心机制

Microsoft Research 的 AgentRx 先把不同系统的 trajectory 归一成统一表示；再依据工具 Schema 和领域策略合成带 guard 的约束，只在前置条件成立时执行；约束检查器逐步记录违反项与证据；最后由 LLM judge 结合九类 grounded taxonomy 判断 critical failure step 和根因。类别覆盖计划偏离、信息编造、非法调用、误读工具结果、意图与计划错位、用户意图不足、能力不支持、guardrail 阻断和系统失败。

官方报告基于 115 条人工标注失败轨迹，在其基准上相对提示基线，定位准确率绝对提升 23.6%，根因归因提升 22.9%。这些是论文团队结果，本站未复现。

## 接入 Zero-to-AI 的实践

先统一最小 trajectory 结构：时间、actor、输入摘要、工具名与参数、返回值、环境状态、权限结果。为高价值规则手写确定性约束，例如“修改后必须运行目标验证”“外部写操作必须有授权”“非零退出码不得宣称通过”。LLM 只处理无法机械判定的意图错位，并必须引用步骤号。系统故障、权限阻断和 Agent 逻辑错误分开统计，避免把 sandbox 正常拒绝算成模型变笨。

## 低成本实验

**输入：** 5 条脱敏失败 trajectory，各人工标出第一个不可恢复步骤和根因类别。

**步骤：**

1. 写 6 条带适用条件的约束，先在两条轨迹上调试。
2. 对剩余三条盲测，输出违反步骤、证据片段与类别。
3. 与人工标签比较；争议时回看是否是约束错误，而非强迫标签一致。

**成功证据：** 每个结论都引用具体步骤和工具结果；能区分上游根因与下游连锁错误，且盲测优于“只读最终答案”的基线。

**停止线：** trajectory 缺关键工具返回、时间顺序不可信，或策略本身未定义；返回“证据不足”，不要补写故事。

## 误区

- 第一个错误就是 critical failure：早期小错可能被恢复，关键是何时不可恢复。
- LLM judge 能替代约束：没有结构化证据，judge 仍是在猜。
- taxonomy 越细越好：分类应服务修复责任，不要把同一根因拆成无穷标签。

## 原文与证据边界

本文依据 Microsoft Research 博文，不等同于对开源实现和论文代码的独立审计。官方基准规模与提升数字仅作归因陈述；实际项目需先用自己的人工标注基线校准。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://www.microsoft.com/en-us/research/blog/systematic-debugging-for-ai-agents-introducing-the-agentrx-framework/)。
