---
title: 记忆系统
description: Claude Code 的长期记忆 — 让 AI 记住你的偏好、项目约定和重要事实
tags: [claude-code]
difficulty: intermediate
learningPaths:
  - daily-efficiency
  - advanced-custom
prerequisites:
  - claude-code/config
relatedContent:
  - {slug: "methodology/memory-system-design", label: "记忆系统设计原则"}
lastVerified: "2026-06-12"
toolVersion: "Claude Code CLI (latest)"
---

## 这是什么

Claude Code 的记忆系统让你存储长期的事实和偏好——你的背景、项目约定、反馈历史——AI 在每次新会话中自动加载这些信息。不用每次都重新自我介绍。

## 类比

记忆系统像你的手机通讯录。你不用每次打电话都重新告诉对方你是谁、你喜欢什么——拨号时通讯录自动告诉对方"这是 Jason，他喜欢简洁的回复、不用 emoji"。

## Before you start

- 已经配置了 CLAUDE.md（参考[核心配置](/zero-to-ai/claude-code/config/)）
- 理解文件系统的基本操作

## 实际操作

### 1. 记忆的存储位置

记忆文件存放在 `~/.claude/projects/<项目路径哈希>/memory/` 目录。

### 2. 记忆文件的结构

每个记忆是一个 markdown 文件，包含 frontmatter 和正文：

```markdown
---
name: my-coding-style
description: 我的代码风格偏好
metadata:
  type: user
---

我偏好函数式组件而非 class 组件。
命名用 camelCase，文件名用 kebab-case。
```

### 3. 记忆的类型

| 类型 | 用途 | 示例 |
|---|---|---|
| `user` | 用户个人事实 | 姓名、角色、偏好 |
| `feedback` | 用户反馈和修正 | "上次告诉 Claude 不要用 emoji" |
| `project` | 项目约定和约束 | 项目架构、技术栈决策 |
| `reference` | 外部引用 | 文档 URL、dashboard 链接 |

### 4. 记忆如何被加载

Claude Code 启动时加载 `MEMORY.md` 索引文件中列出的记忆。只有标记为"始终适用"的记忆才会每次加载——其余按需触发（命中关键词时才读）。

### 5. 三层记忆索引

```
MEMORY.md         — A 段：始终适用，强制加载
MEMORY-COMPANY.md — B 段：公司基础设施，命中关键词时加载
MEMORY-PROJECTS.md — C 段：项目专属，命中项目名时加载
```

## 常见坑

- **记忆写了但 AI 没记住**：检查该记忆是否被 `MEMORY.md` 索引文件引用。孤立的记忆文件不会被加载。
- **记忆冲突**：同一事实在多个记忆文件出现不同版本。写入新记忆前先 grep 检查已有条目。
- **记忆膨胀**：太多"始终适用"的记忆每次会话都加载，消耗 token。把非高频记忆按触发条件分到 B/C 段。

## 下一步

- 理解记忆系统的设计原则：[记忆系统设计原则](/zero-to-ai/methodology/memory-system-design/)
- 想看完整工作流：[工作流编排思路](/zero-to-ai/methodology/workflow-design/)
