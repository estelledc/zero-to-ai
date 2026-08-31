---
title: Diff-first 代码审查：先形成问题，再补最窄证据
description: 让代码审查 Agent 从变更出发，用 grep、glob 与 view 验证具体风险
tags: [ai-tech-practice, github, code-review, agent-tools]
difficulty: intermediate
lastVerified: '2026-08-31'
source:
  title: 'Better tools made Copilot code review worse. Here’s how we actually improved it.'
  publisher: GitHub
  url: https://github.blog/ai-and-ml/github-copilot/better-tools-made-copilot-code-review-worse-heres-how-we-actually-improved-it/
  published: '2026-07-10'
---

## 先说结论

代码审查不是“尽可能理解整个仓库”。先读 diff，写出一个会影响合入决定的具体问题，再为它取最窄的上下文，通常比漫游式搜索更稳。`grep`、`glob` 和 `view` 本身没有审查策略；真正决定成本与质量的是它们被要求按什么顺序工作。

## 问题在哪里

GitHub 将 Copilot code review 的专用探索工具替换成共享的 Unix 风格工具后，离线基准里平均成本上升，有用评论反而减少。轨迹显示，Agent 把审查做成了仓库导览：宽搜、猜路径、读大段文件，再从新增上下文继续扩散。每次工具输出都会进入后续上下文，因此“多读一点以防万一”不只是慢，还可能稀释真正与 diff 有关的证据。

## 核心机制

一个审查问题应当沿着这条短链收敛：

1. 从 diff 中指出被改变的行为，例如权限判断、配置含义或错误分支。
2. 先写问题，例如“是否有调用者依赖旧行为”，而不是直接要求“理解这个模块”。
3. 路径不确定时用 `glob`，符号或调用点明确时用 `grep`；可以批量做便宜的发现。
4. 只有知道文件和目标范围后才用 `view`，并批量读取少量相关区间。
5. 证据足以确认或排除问题就停止，不把邻近但无关的代码继续带入上下文。

搜索失败也要窄化恢复：表达式有误时改成一次更简单的搜索；路径猜错时回到 `glob`。连续猜相邻路径，通常只是把一次工具错误放大成浏览循环。

## 和 Zero-to-AI 的日常开发怎么接上

本站已有 `npm run verify` 作为实现后的统一验证入口，但测试通过不等于审查完成。审查者仍要从本次 diff 识别“测试可能没覆盖的行为变化”，再沿直接调用者、相邻契约和现有测试取证。可以在审查记录里固定四列：diff 事实、待证问题、读取位置、结论。没有落到具体代码证据的问题，不提交评论。

这套方法只适合有明确 diff 锚点的 review。需求探索、架构学习或跨模块重构，本来就可能需要更宽的阅读，不能机械套用同一组指令。

## 一个低成本实验

**输入：** 选 6 个已有明确人工结论的小型 PR，固定仓库提交、模型、工具权限与单次预算。

**步骤：**

1. A 组使用通用的“检查相关仓库上下文”指令；B 组要求先列审查问题，再按 `grep/glob → view → decide` 工作。
2. 保存两组工具轨迹，标记每次读取是否服务于已写明的问题。
3. 由不知道分组的人工审阅者判断评论是否正确、可执行、值得阻塞。
4. 比较有效问题数、无关读取量、工具输出量和搜索失败后的恢复路径。

**成功证据：** B 组没有漏掉基线中的真实问题，误报不增加；同时无关文件读取或工具输出明显下降，并且每条评论都能回指 diff 和最小证明范围。

**停止线：** 两组使用了不同模型或上下文预算、历史 PR 没有可信人工结论，或只比较 token 不复核评论质量；此时不能把差异归因于 diff-first 指令。

## 常见误区

- “工具更强，结果自然更好”：工具接口改变了 Agent 的行为路径，旧指令未必仍匹配新工具。
- “读得越全，漏报越少”：宽读可能增加噪声，审查应先有问题再取证。
- “同一套提示适合所有编码任务”：review 有 diff 锚点，交互式开发未必有。

## 原文与证据边界

GitHub 报告，调优后的生产方案相对对照组平均审查成本约降低 20%，且没有出现阻碍发布的质量信号。这是 GitHub 内部基准与生产观测，本站没有取得其 case、轨迹、成本口径或质量阈值，未独立复现该数字。本文提出的小实验只能验证本站样本中的审查路径，不能证明 Copilot 产品效果。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://github.blog/ai-and-ml/github-copilot/better-tools-made-copilot-code-review-worse-heres-how-we-actually-improved-it/)。
