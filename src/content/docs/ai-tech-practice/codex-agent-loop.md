---
title: 展开 Codex Agent Loop：真正增长的是执行历史
description: 从 Responses、工具调用循环与上下文压缩理解 Coding Agent 的运行时
tags: [ai-tech-practice, codex, agent-loop, responses-api, context]
difficulty: intermediate
lastVerified: '2026-08-30'
source:
  title: 'Unrolling the Codex agent loop'
  publisher: OpenAI
  url: https://openai.com/index/unrolling-the-codex-agent-loop/
  published: '2026-01-23'
---

## 先说结论

Coding Agent 不是“一次提示词生成一个补丁”，而是模型在 Responses 与工具结果之间反复交接控制权。每次读文件、跑命令、看到错误都会成为下一轮输入，所以真正消耗上下文的是完整执行历史。设计 Agent 时要先看循环何时继续、何时压缩、何时用外部状态代替对话记忆。

## 原文解决什么

普通聊天接口容易让人忽略中间状态：模型提出工具调用，宿主执行，再把结果送回模型，直到得到最终响应。对 Codex 而言，工具输出可能很长，任务也可能持续多轮。若宿主没有可靠保存 response 项、工具调用 ID 与结果，循环会断；若不控制上下文增长，早期约束会被日志和 diff 淹没。

## 核心机制

一个最小循环只有四步：向 Responses 提交用户目标与可用工具；模型返回文本或工具调用；宿主执行工具并回传结构化结果；模型根据新状态决定继续调用还是结束。重要的是把“模型思考”和“环境事实”分开：文件内容、退出码与 diff 来自工具，模型只能据此规划。

随着循环展开，上下文会累积指令、调用参数、命令输出和阶段结论。压缩不是简单删除旧消息，而是保留任务目标、关键约束、已确认事实、未完成项与必要引用，把可重新读取的大段内容移出活跃窗口。可恢复状态最好落在 Git、测试报告或任务清单中，而不是只存在于摘要。

## 和 Zero-to-AI 现有实践如何接上

本站 [工作流编排](/methodology/workflow-design/) 的 Explore → Plan → Implement → Verify → Learn，可以映射为 Agent loop 的阶段控制；[Codex 修改、验证与 Git](/codex/modify-verify-git/) 则提供外部检查点。每轮工具调用都应服务于当前阶段，并用实际文件和退出码收口。这样即使压缩上下文，也能从仓库状态恢复，而不是相信模型记忆。

## 一个低成本实验

用一个只改单文件的小任务实现两版玩具 loop：A 版把每次完整文件和日志都回传；B 版只回传相关片段、退出码和阶段摘要，并允许模型按需再次读取。固定模型、任务、工具和最大轮数，记录每轮输入长度、工具次数、最终 diff 与测试结果。

**成功证据：** B 版在不降低任务通过率的前提下减少上下文增长；压缩后仍能复述文件范围、验收条件和未完成项，并由 Git 与测试验证最终状态。

**停止线：** 压缩后丢失禁止项、重复执行已完成写操作，或无法把最终声明对应到工具证据；先修状态表示，不继续拉长轮数。

## 常见误区

- 把 loop 写成无限重试：必须有最大轮数、失败分类和退出条件。
- 只保存最终回答：没有 trajectory 就无法定位工具失败或假完成。
- 压缩等于删旧日志：若没有结构化保留约束和决策，短上下文只是失忆。

## 原文与证据边界

本文依据 OpenAI 官方页面解释 Responses 与工具循环，并给出本站可做的对照实验；未取得 TraceFetch 验签包，不能标记 `verification.valid=true`。本站没有复现 Codex 内部运行时或服务端压缩实现，因此只讨论公开接口层可观察的机制。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://openai.com/index/unrolling-the-codex-agent-loop/)。
