---
title: 学习日志 Skill Pack
description: 一键部署的结构化学习系统 -- 让任何 AI 编程助手变成你的学习伙伴
tags: [methodology, tool]
difficulty: beginner
learningPaths:
  - daily-efficiency
  - advanced-custom
prerequisites:
  - methodology/learning-management
relatedContent:
  - { slug: 'methodology/learning-management', label: '学习管理系统' }
  - { slug: 'claude-code/daily-rhythm', label: '日常节奏' }
lastVerified: '2026-06-17'
---

## 这是什么

前面几篇方法论讲了"学习管理系统"的设计思想：工件选择、知识捕获管线、文件系统哲学。但从"理解原理"到"自己搭一套"之间还有不少工程量 -- 要写协议文件、要配模板、要写 lint 脚本、要适配不同的 AI 工具。

**Skill Pack 把这些全部打包好了。** 你只需要下载一个 ZIP，解压，复制一个适配文件，就能立刻开始用。

它从 [intern-journal](https://github.com/estelledc/intern-journal) 项目中提炼而来，经过 50+ 天的实际使用验证。不是理论设计，是跑通了的实践。

## 下载

<a href="/downloads/skill-pack.zip" download>skill-pack.zip</a>（约 31KB）

## 30 秒上手

1. 解压 ZIP，把 `skill-pack/` 文件夹放到你的项目根目录（或任意空文件夹）
2. 根据你用的 AI 工具，把对应的适配文件复制到根目录：
   - Claude Code → `adapters/claude-code/CLAUDE.md`
   - Codex → `adapters/codex/AGENTS.md`
   - CatDesk → `adapters/catdesk/CATDESK.md`
   - Cursor → `adapters/cursor/.cursorrules`
3. 复制 `config.yaml.example` 为 `config.yaml`，填入你的名字和学习方向
4. 打开 AI 助手，说："帮我初始化学习空间"
5. 回答几个问题，开始使用

## 它能做什么

装好之后，你的 AI 助手会自动获得以下能力：

**日终回顾** -- 每天下班前引导你回顾今天做了什么、学了什么，生成结构化日报。

**知识捕获** -- 聊天中提到新概念时，AI 帮你结构化记录成学习笔记，自动选择正确的工件类型。

**六步讲解** -- 解释新概念时遵循"定位 → 类比 → 机制 → 代码 → 误区 → 验证"的教学结构，确保你真正理解而不是死记硬背。

**交叉引用** -- 新笔记自动关联已有知识，形成知识网络。写之前先搜索已有内容，避免重复。

**间隔复习**（第二周自动开启）-- 追踪每条知识的掌握度，用优先级公式 `(1 - mastery) × (days_since + 1)` 提醒你复习快忘的内容。

**质量门禁** -- lint 脚本检查笔记格式（来源字段、死链等），确保知识库不会随时间腐烂。

## 文件结构

```
skill-pack/
├── protocols/          ← 核心方法论（AI 遵循的规则）
│   ├── core.md         ← 工件选择、知识捕获、教学风格
│   ├── review.md       ← 间隔复习算法
│   └── explain.md      ← 六步讲解协议
├── templates/          ← 工件模板（日报、笔记等的格式）
├── skills/             ← 功能描述（AI 在什么时候做什么）
├── adapters/           ← 平台适配（不同 AI 工具的入口文件）
├── scripts/            ← lint 和初始化脚本
└── config.yaml.example ← 配置模板
```

## 初始化后你的学习空间

```
my-learning/
├── config.yaml         ← 你的配置（名字、方向、复习偏好）
├── CLAUDE.md           ← （或 AGENTS.md / .cursorrules）
├── daily/              ← 每天的工作日志
├── learnings/          ← 学到的新知识
├── problems/           ← 解决过的问题
└── sources/            ← 学习材料收藏
```

所有内容都是普通 markdown 文件，用 Git 追踪，任何编辑器都能打开。

## 兼容性

| AI 工具        | 支持状态           |
| -------------- | ------------------ |
| Claude Code    | 完整支持           |
| OpenAI Codex   | 完整支持           |
| CatDesk        | 完整支持           |
| Cursor         | 完整支持           |
| Windsurf       | 未测试（理论兼容） |
| GitHub Copilot | 未测试             |

## 设计哲学

这个 skill pack 的核心设计决策：

**协议驱动** -- AI 的行为不是硬编码的，而是通过 markdown 协议文件定义的。你可以随时修改协议来调整 AI 的行为，不需要写代码。

**无状态** -- 文件系统就是状态。没有数据库、没有后端、没有账号。Git 提供版本控制，markdown 提供可读性。

**平台无关** -- 同一套协议通过不同的适配器文件支持多个 AI 工具。换工具不需要重新学习。

**渐进式** -- 第一天只需要写 daily，第二周才开启间隔复习。不会一上来就用复杂度压垮你。

## 和本站其他内容的关系

- [学习管理系统](/methodology/learning-management/) 讲的是"为什么这样设计" -- 原理和思想
- 本页的 Skill Pack 是"拿来就用" -- 打包好的实现
- [日常节奏](/claude-code/daily-rhythm/) 讲的是"每天怎么用" -- 具体的工作流

三者互补：先理解原理，再下载工具，最后按节奏使用。

## 下一步

下载后如果遇到问题，可以查看 ZIP 内的 `SETUP.md` 获取详细安装说明和常见问题解答。
