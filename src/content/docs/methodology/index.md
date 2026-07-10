---
title: 方法论
description: 工具无关的共用思想和方法 — 指令、记忆、工作流与学习系统
tags: [methodology]
difficulty: beginner
prerequisites: []
relatedContent:
  - { slug: 'glossary', label: '术语对照表' }
  - { slug: 'claude-code/index', label: 'Claude Code 教程' }
  - { slug: 'codex/index', label: 'Codex 零基础路线' }
lastVerified: '2026-07-10'
---

这些内容不绑定任何一个具体工具，而是讲通用思想：怎么写出好的 AI 指令、怎么设计记忆系统、怎么编排多步骤工作流。

建议先学完至少一个工具的快速入门（比如 [Claude Code 10 分钟上手](/claude-code/quickstart/) 或 [Codex 安装与成本](/codex/quickstart/)），再来读进阶方法论。

## 零基础先读谁

| 你的情况                         | 读这篇                                    | 约时    |
| -------------------------------- | ----------------------------------------- | ------- |
| 还不会打开终端 / 不懂 PATH       | **必读** [通用环境基础设施](basics)       | 10 分钟 |
| 正在走 Claude / Codex 零基础路径 | 先完成工具 quickstart，方法论其余篇可后置 | —       |
| 已经会日常对话，想系统化         | 按下方「推荐阅读顺序」从哲学篇往下读      | 按篇    |

:::tip[跟零基础路径？]
你只需要读「通用环境基础设施」。其余篇目是进阶内容，等你走完零基础路径（做出可打开的页面或公开小站）后再回来，吸收率会高很多。
:::

## 分区地图

| 教程                                       | 一句话价值                             | 难度         | 约时    | 建议时机                     |
| ------------------------------------------ | -------------------------------------- | ------------ | ------- | ---------------------------- |
| [通用环境基础设施](basics)                 | 终端、PATH、包管理器、环境变量一次讲清 | beginner     | 10 分钟 | 装任何 CLI 之前              |
| [CLAUDE.md 编写哲学](claude-md-philosophy) | 为什么项目指令文件是核心、怎么写才管用 | intermediate | 25 分钟 | 写过第一份 CLAUDE.md 之后    |
| [记忆系统设计原则](memory-system-design)   | 跨会话知识如何可持续，而不是越记越乱   | intermediate | 25 分钟 | 用过 Memory / 笔记一段时间后 |
| [工作流编排思路](workflow-design)          | 把多步骤、多 Skill 收成可重复循环      | intermediate | 30 分钟 | 日常已有固定协作节奏时       |
| [学习管理系统](learning-management)        | 对话如何沉淀成永久知识与工件           | intermediate | 25 分钟 | 开始系统记笔记时             |
| [学习日志 Skill Pack](skill-pack)          | 可下载的结构化学习系统入口             | intermediate | 15 分钟 | 想试用 Learn Journal 时      |
| [系统提示解剖学](prompt-anatomy)           | 从真实系统提示学工业级指令模式         | advanced     | 30 分钟 | 已能稳定写出项目规则后       |
| [Skill 工程化设计](skill-engineering)      | 把提示词升级为可安装、可版本化资产     | advanced     | 30 分钟 | 已会写基础 Skill 后          |

## 推荐阅读顺序

1. **basics**（环境）→ 回工具路径继续安装
2. **claude-md-philosophy** ↔ 工具侧的项目规则篇（Claude：`config` / `project-guide`；Codex：`agents-md`）
3. **memory-system-design** → **learning-management** →（可选）**skill-pack** / Learn Journal
4. **workflow-design** → **prompt-anatomy** → **skill-engineering**

## 卡住了去哪

- 命令找不到、权限、发布失败：[常见问题排查](/appendix/troubleshooting/)
- 术语看不懂：[术语对照表](/glossary/)（先看「第一周必懂」）
- 想回到工具实操：[Claude Code](/claude-code/) 或 [Codex](/codex/)

## Checkpoint

- □ 你知道本分区大部分内容应在「至少一个工具 quickstart 完成」后再读
- □ 零基础路径上你只把 [basics](basics) 标为必读
- □ 你能根据上表选出下一篇该读的方法论

## 下一步

→ 还没装环境？去 [通用环境基础设施](basics)。

→ 已经会用工具？从 [CLAUDE.md 编写哲学](claude-md-philosophy) 或你当前卡点对应的那一行开始。
