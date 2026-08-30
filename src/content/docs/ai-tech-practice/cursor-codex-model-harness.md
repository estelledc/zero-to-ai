---
title: 为 Codex 调 Harness：工具齐全不等于模型会正确使用
description: 用模型特定提示、工具形状、lint 触发与推理连续性做最小适配实验
tags: [ai-tech-practice, cursor, codex, agent-harness]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'Improving Cursor’s agent for OpenAI Codex models'
  publisher: Cursor
  url: https://cursor.com/blog/codex-model-harness
  published: '2025-12-04'
---

## 先说结论

Agent Harness 不是模型外面的一层通用包装。模型训练时熟悉的提示顺序、工具名称和调用节奏不同；换模型却原样复用旧 Harness，可能出现工具明明存在却不用、改完不读 lint、跨工具调用丢失子目标等问题。正确做法是以轨迹失败为信号，逐项适配，而不是堆一份更长的万能提示。

## 原文解决什么

Cursor 介绍了为 GPT-5.1-Codex-Max 调整 Harness 的过程。Codex 更熟悉 shell 导向的工作流，因此 Cursor 让专用工具的名称与 `rg` 等 shell 概念更接近，并用直白指令规定何时读取 lint。它还调整工作中更新的长度、行动倾向和消息顺序，避免 Harness 指令压过用户意图。

关键不是模仿某段提示，而是保持状态连续。Cursor 称，推理项在工具调用之间丢失时，模型会重新猜测计划，导致子目标遗漏、调用乱序或重复推导；其 Cursor Bench 中出现 30% 性能下降。这个数字是 Cursor 内部评测自报，本站未复现，也不能外推到其他 Codex 版本或 API。

## 接入 Zero-to-AI 的实践

先把失败分成四类：没找到合适工具、找到但没调用、调用后没读取结果、跨调用忘记约束。只有某类失败稳定出现，才加对应指针。比如编辑后漏看 lint，就写清触发时机和修复范围；不要顺手加入十条无关行为规则。传递会话状态时保存平台正式支持的 reasoning item 或摘要，不自行伪造隐藏思维，也不把用户可见进度消息当作内部推理。

## 一个低成本实验

**输入：** 同一仓库快照、同一 Codex 模型、三项固定任务：跨文件改名、修 lint、完成需要三次工具调用的小修复。

**步骤：**

1. 用当前 Harness 各跑一次，记录工具选择、lint 是否读取、约束是否跨调用保留。
2. 只改一个变量，例如增加“实质编辑后读取最近文件 lint”的明确触发条件。
3. 在新 worktree 重跑三题；通过后再单独测试工具名称或状态传递，不能一次全改。

**成功证据：** 目标失败减少，三题最终验收不下降，且没有新增越权命令、重复调用或人工返工。

**停止线：** 模型版本、任务快照或工具权限同时变化；无法归因时停止推广，只保留实验记录。

## 常见误区

- 工具定义写清就会自动调用：模型还需要与训练分布相符的名称和触发条件。
- 更多系统指令总会更稳：冲突或节省 token 的强指令可能压低行动意愿。
- 保存连续性等于记录隐藏 CoT：实践只能使用平台明确提供、允许传递的状态。

## 原文与证据边界

本文依据 2026-08-30 可读取的 Cursor 官方页面。页面中的 30% 降幅、模型表现和内部 Bench 均为厂商自报；本轮未取得 TraceFetch 签名正文包，因此不能声明 `verification.valid=true`。上述实验只比较本站小任务中的 Harness 变量，不证明生产用户质量提升。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://cursor.com/blog/codex-model-harness)。
