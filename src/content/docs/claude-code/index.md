---
title: Claude Code
description: Claude Code 完整教程 — 从自评估到高级定制，16 篇实战指南覆盖成本、配置、上下文、验证、Skill、Hook、记忆、MCP、子 Agent、日常节奏、配置即代码和项目实战
tags: [claude-code]
difficulty: beginner
prerequisites: []
relatedContent:
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
  - { slug: 'glossary', label: '术语对照表' }
lastVerified: '2026-06-24'
toolVersion: 'Claude Code CLI v2.1'
---

## Claude Code 是什么

Claude Code 是 Anthropic 出品的命令行 AI 编程助手。你在终端里用自然语言描述任务，它读代码、写代码、运行命令、帮你调试。就像有一个随时待命的资深开发者坐在你旁边。

本教程不是官方文档的翻译——是基于真实项目使用经验总结的策略集合。每一篇都来自踩过的坑和验证过的方案。

## 教程地图

### 入门（建议按顺序）

- [开始之前](preflight) — 3 分钟自评估，确认这个教程适不适合你
- [10 分钟上手](quickstart) — 安装 Claude Code，输入你的第一句 prompt
- [成本与计费](cost) — token 怎么算、三种模型怎么选、怎么控制开销
- [第三方兼容网关实验](agnes-free-vibe-coding) — 保留旧 URL，讲清非官方兼容、价格和恢复边界
- [第一个页面](first-page) — 用 AI 从零构建个人介绍页，第一个可展示成果
- [核心配置](config) — CLAUDE.md / settings.json / Hook 系统基础配置
- [上下文管理](context) — 管理 AI 的“记忆空间”，学会 /clear 和 /compact
- [验证方法论](verify) — 确认 Claude 写的代码是对的——最重要的单一步骤

### 核心工作流

- [Skill 体系](skills) — 创建和使用可复用技能，把重复工作变成一句话
- [记忆系统](memory) — 长期记忆让 AI 记住你的偏好和项目约定
- [为项目写 CLAUDE.md](project-guide) — 第二个实战练习，让 AI 真正理解你的项目
- [Hook 系统](hooks) — 自动触发检查与动作，“每次 X 发生时自动做 Y”
- [日常节奏](daily-rhythm) — 每天怎么跟 Claude 协作——完整的 7 步日循环

### 高级定制

- [MCP 集成](mcp) — 连接外部工具（含上下文成本警告，大多数人不需要）
- [子 Agent 协作](subagents) — 多任务并行委派，装修队总包 + 各工种师傅模式
- [配置即代码](dotfiles) — 版本管理你的 Claude Code 配置，换电脑 30 秒恢复

## 你可能还需要的预备知识

这些不是 Claude Code 教程页，但经常需要配合使用：

- [通用环境基础设施](/methodology/basics/) — 终端、PATH、包管理器、环境变量，10 分钟速成
- [Git 10 分钟速成](/appendix/git-basics/) — 如果还不熟悉 Git，花 10 分钟看这篇
- [术语对照表](/glossary/) — 教程中出现的所有术语速查

## 从哪里开始

→ 第一次来？从 [开始之前](/claude-code/preflight/) 花 3 分钟自评估。

已经装好了？直接跳到你要的章节，每篇都是独立的。
