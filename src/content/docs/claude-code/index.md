---
title: Claude Code
description: Claude Code 完整教程 — 从自评估到高级定制，16 篇实战指南覆盖成本、配置、上下文、验证、Skill、Hook、记忆、MCP、子 Agent、日常节奏、配置即代码和项目实战
tags: [claude-code]
difficulty: beginner
prerequisites: []
relatedContent:
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
  - { slug: 'glossary', label: '术语对照表' }
  - { slug: 'appendix/troubleshooting', label: '常见问题排查' }
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
---

## Claude Code 是什么

Claude Code 是 Anthropic 出品的命令行 AI 编程助手。你在终端里用自然语言描述任务，它读代码、写代码、运行命令、帮你调试。就像有一个随时待命的资深开发者坐在你旁边。

本教程不是官方文档的翻译——是基于真实项目使用经验总结的策略集合。每一篇都来自踩过的坑和验证过的方案。

## 零基础先读谁

按这条最短闭环走，手里会有一个可打开、可发布的页面：

1. [开始之前](preflight)（约 5 分钟）— 确认适不适合你
2. [通用环境基础设施](/methodology/basics/)（约 10 分钟）— 终端 / PATH / 包管理器
3. [Git 10 分钟速成](/appendix/git-basics/) — 会存档再改文件
4. [10 分钟上手](quickstart) — 安装并完成第一次对话
5. [第一个页面](first-page) → [发布成小站](/projects/publish-first-site/) — 可展示成果

完整路径进度与里程碑见 [AI 编程零基础入门](/paths/#ai-coding-zero)。

:::tip[卡住了]
安装失败、命令找不到、权限报错：先查 [常见问题排查](/appendix/troubleshooting/)，再回到当前步骤。不要跳过验证直接大改文件。
:::

## 教程地图

每篇可独立阅读；零基础建议按「入门 → 核心工作流 → 高级」顺序。时长为阅读+跟做的粗估。

### 入门（建议按顺序）

| 教程 | 你得到什么 | 难度 | 约时 |
| ---- | ---------- | ---- | ---- |
| [开始之前](preflight) | 自评估结论与成本心理预期 | beginner | 5 分钟 |
| [10 分钟上手](quickstart) | 已安装、已登录、第一次有效对话 | beginner | 10–15 分钟 |
| [成本与计费](cost) | 会看用量、会选模型、知道怎么控开销 | beginner | 15 分钟 |
| [第三方兼容网关实验](agnes-free-vibe-coding) | 分清官方路径与兼容实验边界 | beginner | 10 分钟 |
| [第一个页面](first-page) | 浏览器可打开的个人介绍页 | beginner | 20–30 分钟 |
| [核心配置](config) | 能写/改 CLAUDE.md 与基础 settings | intermediate | 25 分钟 |
| [上下文管理](context) | 会用 /clear、/compact，少「失忆」 | intermediate | 20 分钟 |
| [验证方法论](verify) | 每次改动都有可勾选验收 | intermediate | 25 分钟 |

### 核心工作流

| 教程 | 你得到什么 | 难度 | 约时 |
| ---- | ---------- | ---- | ---- |
| [Skill 体系](skills) | 把重复工作收成可复用 Skill | intermediate | 30 分钟 |
| [记忆系统](memory) | 偏好与约定可跨会话保留 | intermediate | 20 分钟 |
| [为项目写 CLAUDE.md](project-guide) | 第二份实战：项目级指令文件 | intermediate | 30 分钟 |
| [Hook 系统](hooks) | 「事件发生时自动做 Y」 | advanced | 30 分钟 |
| [日常节奏](daily-rhythm) | 可坚持的日循环与三天挑战 | intermediate | 20 分钟 |

### 高级定制

| 教程 | 你得到什么 | 难度 | 约时 |
| ---- | ---------- | ---- | ---- |
| [MCP 集成](mcp) | 外接工具前先算清上下文成本 | advanced | 25 分钟 |
| [子 Agent 协作](subagents) | 并行委派与边界划分 | advanced | 30 分钟 |
| [配置即代码](dotfiles) | 配置可版本管理、换机可恢复 | advanced | 25 分钟 |

## 你可能还需要的预备知识

这些不是 Claude Code 教程页，但经常需要配合使用：

- [通用环境基础设施](/methodology/basics/) — 终端、PATH、包管理器、环境变量
- [Git 10 分钟速成](/appendix/git-basics/) — init / add / commit / diff / log
- [术语对照表](/glossary/) — 第一周必懂词 + 全表速查
- [方法论](/methodology/) — 工具无关的指令、记忆与工作流思想（建议先完成 quickstart）

## Checkpoint

开始专区正文前，确认：

- [ ] 你知道 Claude Code 与 Codex 是两条独立路线，命令不要混用
- [ ] 你已选定第一站：零基础 → [preflight](/claude-code/preflight/)；已会装工具 → 直接跳到需要的章节
- [ ] 你知道卡住时先打开 [troubleshooting](/appendix/troubleshooting/)

## 从哪里开始

→ 第一次来？从 [开始之前](/claude-code/preflight/) 花几分钟自评估。

已经装好了？直接跳到你要的章节；每篇末尾都有 Checkpoint 与下一步导航。
