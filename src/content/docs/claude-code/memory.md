---
title: 记忆系统
description: Claude Code 的长期记忆 — 让 AI 记住你的偏好、项目约定和重要事实
tags: [claude-code]
difficulty: intermediate
learningPaths:
  - ai-coding-zero
  - daily-efficiency
  - advanced-custom
prerequisites:
  - claude-code/config
relatedContent:
  - { slug: 'methodology/memory-system-design', label: '记忆系统设计原则' }
lastVerified: '2026-06-12'
toolVersion: 'Claude Code CLI (latest)'
---

## 这是什么

Claude Code 的记忆系统让你存储长期的事实和偏好——你的背景、项目约定、反馈历史——AI 在每次新会话中自动加载这些信息。不用每次都重新自我介绍。

## 类比

记忆系统像你的手机通讯录。你不用每次打电话都重新告诉对方你是谁、你喜欢什么——拨号时通讯录自动告诉对方"这是 Jason，他喜欢简洁的回复、不用 emoji"。

## 开始之前

- 已经配置了 CLAUDE.md（参考[核心配置](/claude-code/config/)）
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

| 类型        | 用途           | 示例                           |
| ----------- | -------------- | ------------------------------ |
| `user`      | 用户个人事实   | 姓名、角色、偏好               |
| `feedback`  | 用户反馈和修正 | "上次告诉 Claude 不要用 emoji" |
| `project`   | 项目约定和约束 | 项目架构、技术栈决策           |
| `reference` | 外部引用       | 文档 URL、dashboard 链接       |

### 4. 记忆如何被加载

Claude Code 启动时加载 `MEMORY.md` 索引文件中列出的记忆。只有标记为"始终适用"的记忆才会每次加载——其余按需触发（命中关键词时才读）。

### 5. 三层记忆索引

```
MEMORY.md（Claude 的记忆索引文件，位于项目根目录）— 始终适用，强制加载
MEMORY-COMPANY.md  — 公司基础设施，命中关键词时加载
MEMORY-PROJECTS.md — 项目专属，命中项目名时加载
```

## 动手试一试：写你的第一条记忆

跟着下面的步骤操作，5 分钟内你就能让 Claude 在每次新对话开始时"认识"你。

### Step 1: 打开 Claude Code 对话

在终端启动 Claude Code。输入下面这段话（替换成你的真实信息）：

```
我叫张三，前端实习生，用 React + TypeScript。
请帮我把这些信息保存到记忆里。
```

Claude 会自动创建一个记忆文件。你可以通过 `/memory` 命令查看它写了什么。

### Step 2: 验证记忆生效

关掉当前会话（`/clear` 或重新开一个终端），再启动 Claude Code，问一句：

```
我叫什么名字？我用什么技术栈？
```

如果 Claude 能准确回答，说明记忆已经生效了。

### Step 3: 手动编辑记忆

记忆文件是普通的 markdown 文件，你完全可以手动编辑。找到 `~/.claude/CLAUDE.md`，添加一行试试：

```markdown
# 记忆

- 代码风格：函数式组件，不用 class 组件
- 命名规范：变量 camelCase，文件名 kebab-case
- 偏好：回复简洁，不用 emoji，先说结论再解释
```

保存后重新开会话，Claude 就会遵循这些偏好。

### Checkpoint

试着回答这两个问题来检验你是否理解了：

1. 你有一条记忆"我喜欢暗色主题"，但新会话中 Claude 似乎不记得。你会去哪里检查？
2. 你想让 Claude 只在讨论数据库相关话题时才知道"我们用 PostgreSQL 14"。应该把这条记忆放在 MEMORY.md（始终加载）、MEMORY-COMPANY.md（关键词触发）还是 MEMORY-PROJECTS.md（项目触发）？

## 常见坑

- **记忆写了但 AI 没记住**：检查该记忆是否被 `MEMORY.md` 索引文件引用。孤立的记忆文件不会被加载。
- **记忆冲突**：同一事实在多个记忆文件出现不同版本。写入新记忆前先 grep 检查已有条目。
- **记忆膨胀**：太多"始终适用"的记忆每次会话都加载，消耗 token。把非高频记忆按触发条件分到 MEMORY-COMPANY.md 或 MEMORY-PROJECTS.md。

## 下一步

- 理解记忆系统的设计原则：[记忆系统设计原则](/methodology/memory-system-design/)
- 想看完整工作流：[工作流编排思路](/methodology/workflow-design/)
