---
title: 并行 Claude 写 C 编译器：并发不是核心，验证器才是
description: 用 workers、GCC oracle 与 delta debugging 理解长周期并行编码实验
tags: [ai-tech-practice, anthropic, multi-agent, compiler, verification]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'Building a C compiler with a team of parallel Claudes'
  publisher: Anthropic
  url: https://www.anthropic.com/engineering/building-c-compiler
  published: '2026-02-05'
---

## 先说结论

多个 Agent 能同时写代码，不代表项目会更快收敛。编译器实验真正可迁移的部分，是把任务拆成低重叠所有权，并让统一 verifier 决定什么可以进入主线。并行只增加候选产出；oracle、回归集和失败缩减才把候选变成可信进展。

## 原文解决什么

C 编译器覆盖词法、语法、类型、优化、代码生成和平台兼容，单个长会话容易在上下文、回归和任务切换上失控。Anthropic 的实验让多个 Claude worker 并行推进不同问题，再通过共享验证体系吸收结果。难点不只是分派，而是避免多人改同一热点、错误互相叠加，以及让失败样例足够小到能快速定位。

## 核心机制

- **Parallel workers：** 每个 worker 获得边界清楚的模块、测试或失败簇，减少写入冲突。
- **Verifier：** 候选修改必须经过同一构建与回归入口；主线接受的是验证结果，不是 worker 的完成声明。
- **GCC oracle：** 对相同 C 程序比较参考编译器与目标编译器的编译、运行或输出行为，用成熟实现提供外部基准。
- **Delta debugging：** 当随机或大型用例失败时，自动删减输入，保留最小仍能触发差异的程序，再交给 worker 修复。

这些机制形成“发现差异 → 缩小反例 → 分派修复 → 全量回归”的循环。worker 数量只有在验证吞吐和任务独立性跟得上时才有价值。
最小反例还能减少无关日志，让下一轮修复围绕同一个可重复事实展开。

## 和 Zero-to-AI 现有实践如何接上

本站 [子 Agent 协作](/claude-code/subagents/) 已要求任务写清目标、输入、输出和约束，并提醒不要并行修改同一模块。这个案例进一步说明：主 Agent 应保留合并权，所有 worker 共享同一 verify 契约；[Agent Evals](/ai-tech-practice/agent-evals/) 中的 outcome grader 可直接承接编译与行为比较。

## 一个低成本实验

不用真的写编译器。准备一个有 12 个失败测试的小型解析器，把失败按词法、表达式、错误处理分成三组。设置三名 worker 各自只改一个模块，另设 verifier 只运行测试并报告首个失败；若输入很长，手动或脚本化删减到最小反例。再与单 Agent 顺序修复做同一时间预算对比。

**成功证据：** 并行组在没有交叉覆盖文件的前提下修复更多独立失败；每个合入改动都有全量回归退出码，缩减后的反例仍稳定复现原差异。

**停止线：** 两个 worker 需要同时改同一核心文件、verifier 排队时间超过实现时间，或 oracle 对预期行为本身不一致；先重拆任务或修基准。

## 常见误区

- worker 越多越快：协调、冲突和验证队列会先成为瓶颈。
- GCC 输出不同就一定是 bug：实现定义、未定义行为与目标平台差异必须排除。
- 只跑 worker 的局部测试：局部通过不能证明没有破坏其他语言特性。

## 原文与证据边界

Anthropic 页面中的持续时长、代码量、通过率、成本和并行规模均为厂商自报，本站未独立复现，不把这些数字当成通用生产率结论。本文只使用官方页面正文，未取得 TraceFetch 验签包，也未运行同规模编译器实验。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://www.anthropic.com/engineering/building-c-compiler)。
