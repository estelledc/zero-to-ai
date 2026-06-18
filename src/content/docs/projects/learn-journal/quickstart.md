---
title: Learn Journal 快速上手
description: 从下载到第一次使用的完整指南
tags: [projects, learn-journal]
difficulty: beginner
prerequisites:
  - projects/learn-journal/index
lastVerified: '2026-06-18'
relatedContent:
  - { slug: 'methodology/skill-pack', label: '学习日志 Skill Pack' }
  - { slug: 'projects/learn-journal/how-it-works', label: '运作原理' }
---

## 前提条件（诚实版）

你需要：

- 一个你已经会用的 AI 编程助手（Claude Code / Codex / CatDesk / Cursor，任选一个）
- 能打开终端，能 `cd` 到文件夹，能复制粘贴命令
- 一个空文件夹（或者你想放学习记录的任何地方）
- 10 分钟时间（第一次设置，不是 30 秒）

你不需要：git（可选但推荐）、Python（lint 脚本需要，但第一周不用）、markdown 深度知识（会看就行）。

如果你连 AI 编程助手都还没装，先去装一个再回来。这不是本指南的范围。

## 第一步：下载并解压

从 [这里下载 skill-pack.zip](/downloads/skill-pack.zip)（约 31KB），解压到你准备好的文件夹里。

解压后你会看到一个 `skill-pack/` 目录：

```
my-learning/              # 你的文件夹
└── skill-pack/
    ├── protocols/        # AI 遵循的规则
    ├── templates/        # 笔记模板
    ├── skills/           # 功能描述
    ├── adapters/         # 平台适配文件
    ├── scripts/          # 可选工具（lint 等）
    └── config.yaml.example
```

## 第二步：放置适配文件

根据你用的 AI 工具，把对应的文件复制到你的文件夹根目录：

| 你用的工具  | 复制这个文件                                | 放到根目录后叫 |
| ----------- | ------------------------------------------- | -------------- |
| Claude Code | `skill-pack/adapters/claude-code/CLAUDE.md` | `CLAUDE.md`    |
| Codex       | `skill-pack/adapters/codex/AGENTS.md`       | `AGENTS.md`    |
| CatDesk     | `skill-pack/adapters/catdesk/CATDESK.md`    | `CATDESK.md`   |
| Cursor      | `skill-pack/adapters/cursor/.cursorrules`   | `.cursorrules` |

然后把 `skill-pack/config.yaml.example` 复制为 `config.yaml`：

```bash
cp skill-pack/config.yaml.example config.yaml
```

## 第三步：初始化

打开你的 AI 助手，在这个文件夹里说：

> "帮我初始化学习空间"

AI 会问你几个问题（名字、学习方向、经验水平），然后帮你创建目录结构。

初始化完成后，你的文件夹变成：

```
my-learning/
├── config.yaml           # 你的配置
├── CLAUDE.md             # （或对应的适配文件）
├── skill-pack/           # 协议和模板
├── daily/                # 每天的日志
├── learnings/            # 学习笔记
├── problems/             # 问题记录
└── sources/              # 学习材料
```

## 第一天：两种方式写日报

下班前（或者学完一段东西后），你有两个选择：

**选择 A：对话模式**（适合不知道怎么组织的时候）

对 AI 说"今天做了 X，学了 Y"，AI 会追问细节、帮你结构化：

```
你: 今天配了一下午 Nginx 反向代理，终于跑通了。

AI: 不错！关于 Nginx 反向代理——这个听起来像是一个新概念，
    要不要单独记一篇学习笔记？

你: 好

AI: 我来问你几个问题，帮你用自己的话写下来：
    1. 反向代理解决了什么问题？
    2. 配置的时候最关键的一步是什么？
    3. 有没有踩什么坑？
```

优点：降低"不知道写什么"的启动摩擦。缺点：一条记录可能要 5-8 轮对话，累了的时候嫌慢。

**选择 B：快速模式**（适合知道要写什么的时候）

直接复制模板，手动填写：

```bash
cp skill-pack/templates/daily.md daily/2026-06-18.md
# 打开文件，填 3 个字段：做了什么、学了什么、明天计划
```

或者更快——直接对 AI 说"帮我用快速模式记日报：今天配了 Nginx 反向代理，学了 upstream 负载均衡，明天要做 HTTPS 配置"。AI 直接生成文件，不追问。

30 秒搞定。

## 第一周后你的文件夹长这样

```
my-learning/
├── config.yaml
├── daily/
│   ├── 2026-06-16.md
│   ├── 2026-06-17.md
│   ├── 2026-06-18.md
│   ├── 2026-06-19.md
│   └── 2026-06-20.md
├── learnings/
│   ├── nginx-reverse-proxy.md
│   ├── docker-compose-basics.md
│   └── git-rebase-vs-merge.md
├── problems/
│   └── nginx-502-bad-gateway.md
└── sources/
    └── docker-official-docs.md
```

所有文件都是普通 markdown，用任何编辑器都能打开看。

## 常见坑

**"AI 没有按照协议行为"** — 检查适配文件（CLAUDE.md / .cursorrules 等）是否在文件夹根目录。如果放错了位置，AI 读不到它。另一个可能：你的 AI 工具的 context window 太小，协议文件被截断了。

**"对话模式太慢，每次都要聊好几轮"** — 用快速模式。或者对 AI 说"今天用简洁模式，不要追问，直接帮我记"。协议支持这种切换。

**"不知道该说什么"** — 就说"今天做了什么"或者"帮我回顾一下今天"。如果实在想不起来，说"我今天主要在做 X 项目"，AI 会从这里开始引导。

**"笔记格式不对"** — 第一周不用在意格式。先养成"每天都写点什么"的习惯。格式问题第二周再说。如果你想提前检查，可以运行 `python skill-pack/scripts/lint-notes.py`。

**"我用的 AI 工具不在列表里"** — 如果你用的是 Windsurf、GitHub Copilot 或其他支持 system prompt 的工具，可以试试 Cursor 的 `.cursorrules` 适配文件。不保证完美兼容，但基本功能应该能用。

## 如果你第三天就不想用了

这很正常。学习 journaling 类工具的典型曲线是"前 3 天热情、第 2 周断崖"。

几个建议：

- 把目标降到最低——"每天写一句话"也算。不需要每天都写完整日报。
- 用快速模式而不是对话模式——减少摩擦。
- 如果连一句话都不想写，那可能这套方法不适合你，这没什么问题。不是所有人都需要结构化学习记录。

## 下一步

- [它是怎么工作的](/projects/learn-journal/how-it-works/)——理解背后的五环循环和间隔复习
- [日常节奏](/claude-code/daily-rhythm/)——完整的日循环工作流（如果你用 Claude Code）
- [学习管理系统](/methodology/learning-management/)——工件选择和知识捕获的完整理论
