---
title: 迭代修复闭环：让验证失败成为下一轮输入
description: 用 Review、Repair、Validate 三段式循环收敛可测量的代码与内容维护任务
tags: [ai-tech-practice, openai, codex, repair-loop, validation]
difficulty: advanced
lastVerified: '2026-08-31'
source:
  title: 'Build iterative repair loops with Codex'
  publisher: OpenAI
  url: https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex
  published: '2026-05-11'
---

## 先说结论

迭代修复不是让 Agent 无限重试，而是让 Review、Repair、Validate 各守一个职责：先找候选问题，再做最小修改，最后用可执行检查决定是否通过。验证留下的 `remaining delta` 才能进入下一轮；模型说“已修复”不能结束循环。

## 原文解决什么

OpenAI Cookbook 用过时技术文档的维护展示闭环：Codex 审查当前工件，修改隔离副本，执行笔记本并按规则验证，再把未解决项带给下一轮。示例对象是文档，但模式适用于 API 迁移、代码现代化、规则修订等存在可靠反馈的任务。

## 核心机制

- Review 只读工件，按问题类型、严重度和修复方向输出结构化发现；不在这一阶段编辑或假装完成验证。
- Repair 同时读取当前工件、审查发现、业务规则和上一轮验证差额，只处理最重要的剩余问题，并保留原目标。
- Validate 先执行真实检查，再逐项判断行为、可运行性和工件完整性。失败信息必须结构化返回，而不是停在一段终端文本。
- 每轮保存发现、变更摘要、更新后的工件、执行结果和剩余差额，形成可审计回执。
- 循环遇到验证通过、达到次数上限、差额不再变化，或需要人类判断时停止。

## 和 Zero-to-AI 及日常开发如何接上

本站修文章时，可以让 Review 检查事实、frontmatter 与契约，让 Repair 只改副本或明确目标文件，再由 Prettier、引用检查和人工阅读承担 Validate。验证失败应回到具体差额，例如“缺来源链接”，而不是重新给 Agent 一句宽泛的“继续优化”。

代码任务也应维持同样分层：静态 review 给候选风险，测试或真实运行给行为证据，owner 决定是否接受。AI judge 可以补充语义检查，但不能替代可执行测试、外部授权或人工验收。

## 一个低成本实验

**输入：** 复制一篇包含三个已知问题的练习 Markdown：一个失效链接、一个 frontmatter 错误和一个无法机械判断的事实表述。

**步骤：**

1. Review 只输出三类发现及严重度，不编辑文件。
2. Repair 每轮最多处理一个最高优先级问题，并记录改了什么、没改什么。
3. Validate 运行格式与链接检查，再由人审阅事实表述，把失败写成下一轮差额。
4. 最多运行三轮；每轮保留结果，但不把练习副本合并回正式内容。

**成功证据：** 机械检查最终通过，人工事实项有明确接受或拒绝记录，剩余差额逐轮减少，且每次修改都能对应到上一轮发现。

**停止线：** 连续两轮差额不变、达到三轮上限，或下一步需要来源作者与 owner 判断；停止自动循环并交给人，不通过放宽规则制造绿灯。

## 常见误区

- Review 后直接宣布修复：发现只是候选问题，不是运行证明。
- Repair 同时重写无关内容：大 diff 会破坏问题与证据的一一对应。
- Validate 只让另一个模型打分：没有真实执行时，两个模型可能共享同一盲点。
- 只设“直到通过”：缺少次数、停滞和人工门会把闭环变成失控重试。

## 原文与证据边界

Cookbook 中三份示例笔记本的一至三轮收敛结果属于 OpenAI 提供的教学 fixture 与运行环境，本站未独立复现，也不能外推到任意代码库。上述小实验只验证工作流能否保留差额和停止条件，不证明 Codex 修复质量优于单轮人工维护。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://developers.openai.com/cookbook/examples/codex/build_iterative_repair_loops_with_codex)。
