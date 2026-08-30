---
title: PlugMem：把 Agent 记忆从聊天摘录变成可复用知识
description: 用 facts、skills 与 memory graph 理解交互提炼、意图检索和上下文蒸馏
tags: [ai-tech-practice, agents, memory, microsoft]
difficulty: intermediate
lastVerified: '2026-08-30'
source:
  title: 'PlugMem: Transforming raw agent interactions into reusable knowledge'
  publisher: Microsoft Research
  url: https://www.microsoft.com/en-us/research/blog/from-raw-interaction-to-reusable-knowledge-rethinking-memory-for-ai-agents/
  published: '2026-03-10'
---

## 先说结论

Agent 记忆不该等于“把更多旧对话塞回提示词”。PlugMem 的思路是把原始交互提炼成两类可复用资产：描述世界与用户的 facts，以及能再次执行的 skills；再用 memory graph 表达它们之间的关系，按当前意图检索并蒸馏成短上下文。价值在于减少重复探索，而不是让模型无条件相信过去。

## 它在解决什么问题

聊天摘要会把事实、偏好、失败尝试和临时指令揉在一起。向量相似度能找到措辞相近的片段，却未必理解用户此刻要执行什么；全量回放还会增加 token、泄漏过期信息。真正需要的是知道某条记忆从哪次交互来、适用于什么意图、是否已被新证据覆盖，以及调用后有没有帮助。

## 核心机制

PlugMem 从轨迹中抽取 facts 和 skills。fact 可表达实体、属性或约束，skill 则保存目标、前提和可复用操作。memory graph 把记忆与实体、任务和依赖连接起来，使检索不止依赖文本距离。收到新请求后，系统先理解意图，选择相关子图，再把多条记忆蒸馏为当前模型可消费的紧凑上下文。原始轨迹仍是证据层，蒸馏文本是可重建投影，二者不能混为同一真相。

## 接到 Zero-to-AI 实践

个人 Agent 可以从三张表开始：`fact` 记录内容、来源、有效期与冲突状态；`skill` 记录触发条件、步骤和成功判定；`edge` 记录支持、依赖或替代关系。检索前先写当前意图，再选记忆，避免用“像不像”代替“是否有用”。任何会改变外部状态的旧步骤，都要重新确认权限和环境，记忆不能继承历史授权。

## 低成本实验

选取 20 条脱敏交互，人工整理成 facts、skills 和关系边。准备 8 个后续任务，分别用“最近五条对话”“关键词检索”“意图加图关系检索”生成最多 300 字的上下文。让执行者在不知道检索方式的情况下完成任务，记录命中必要约束数、引用过期事实数、上下文长度和任务结果。

**成功证据：** 每条压缩记忆可追溯到原交互；至少一个冲突事实被显式标记，意图检索在同等长度预算下减少无关或过期内容。

**停止线：** 无法确认数据权限、事实没有来源和更新时间，或评测者通过看原对话泄漏答案时，停止实验并先补记忆契约。

## 误区

- memory graph 是组织结构，不会自动让错误事实变真。
- 技能可复用不等于授权可复用，发送、删除、发布仍要遵守当前边界。
- 压缩率高不代表记忆好，删掉否定条件和失败原因会制造危险捷径。

## 原文与证据边界

Microsoft Research 页面足以说明 PlugMem 的设计与研究结果，但相关表现是研究团队在给定任务和实现下的报告，本站未独立复现。验证 bundle 的 `verification.valid=true` 只说明抓取完整，不能证明方法优于所有记忆系统。上面的实验验证本地记忆是否可追溯、可更新。

本文是原创中文实践解读，不是逐句翻译。英文原文见 [Microsoft Research](https://www.microsoft.com/en-us/research/blog/from-raw-interaction-to-reusable-knowledge-rethinking-memory-for-ai-agents/)。
