---
title: 记忆系统
description: Claude Code 的长期记忆 — 让 AI 记住你的偏好、项目约定和重要事实
tags: [claude-code]
difficulty: intermediate
prerequisites:
  - claude-code/config
relatedContent:
  - { slug: 'methodology/memory-system-design', label: '记忆系统设计原则' }
  - { slug: 'claude-code/config', label: '核心配置' }
  - { slug: 'claude-code/context', label: '上下文窗口管理' }
  - { slug: 'claude-code/dotfiles', label: '配置即代码' }
  - { slug: 'methodology/workflow-design', label: '工作流编排思路' }
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
---

## 这是什么

Claude Code 的**记忆系统**让你存储长期的事实和偏好——你的背景、项目约定、反馈历史——AI 在每次新会话中自动加载这些信息。不用每次都重新自我介绍。

本页先讲**内置记忆**（写进 `CLAUDE.md` / 用 `/memory`），再讲可选的**自建记忆索引**（用 `MEMORY.md` 等文件做分层加载）。两者不要混为一谈：内置就能上手；自建是条目变多之后的组织方式。

**术语速查：**

| 词              | 含义                                                      |
| --------------- | --------------------------------------------------------- |
| 会话（session） | 一次打开 Claude Code 到关闭/清空之间的对话                |
| `/memory`       | Claude Code 内置命令，用于查看或写入记忆相关内容          |
| `MEMORY.md`     | 自建方案里的索引文件：列出“始终加载”的记忆条目            |
| frontmatter     | Markdown 文件开头 `---` 之间的元数据块                    |
| token           | 模型计费/上下文占用的基本单位；记忆越多，每次会话占用越多 |

## 类比

记忆系统像你的手机通讯录。你不用每次打电话都重新告诉对方你是谁、你喜欢什么——拨号时通讯录自动告诉对方“这是 Jason，他喜欢简洁的回复、不用 emoji”。

## 开始之前

- 已经配置了 CLAUDE.md（参考[核心配置](/claude-code/config/)）
- 理解文件系统的基本操作

## 实际操作

Claude Code 内置的记忆功能很简单：在对话中用 `/memory` 命令保存信息到 `CLAUDE.md` 文件。下面 §1-§5 介绍的是在内置功能基础上搭建的**自定义记忆索引系统**——它不是 Claude Code 自带的，但能让记忆管理更系统化。如果你刚入门，可以先跳到“动手试一试”用内置功能上手。

### 1. 自建记忆的存储位置

记忆文件存放在 `~/.claude/projects/<项目路径哈希>/memory/` 目录。

### 2. 自建记忆文件的结构

每个记忆是一个 markdown 文件，包含 **frontmatter**（文件头元数据）和正文：

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

### 3. 自建记忆的分类

| 类型        | 用途           | 示例                           |
| ----------- | -------------- | ------------------------------ |
| `user`      | 用户个人事实   | 姓名、角色、偏好               |
| `feedback`  | 用户反馈和修正 | “上次告诉 Claude 不要用 emoji” |
| `project`   | 项目约定和约束 | 项目架构、技术栈决策           |
| `reference` | 外部引用       | 文档 URL、dashboard 链接       |

### 4. 自建记忆如何被加载

Claude Code 启动时加载 `MEMORY.md` 索引文件中列出的记忆。只有标记为“始终适用”的记忆才会每次加载——其余按需触发（命中关键词时才读）。

### 5. 三层记忆索引（自建方案）

```text
MEMORY.md（Claude 的记忆索引文件，位于项目根目录）— 始终适用，强制加载
MEMORY-COMPANY.md  — 公司基础设施，命中关键词时加载
MEMORY-PROJECTS.md — 项目专属，命中项目名时加载
```

**内置 vs 自建**：上面描述的三层记忆索引（MEMORY.md / MEMORY-COMPANY.md / MEMORY-PROJECTS.md）是 Jason 的自建方案，不是 Claude Code 自带的功能。Claude Code 内置的记忆能力是通过 `~/.claude/CLAUDE.md` 和项目级 `CLAUDE.md` 实现的——你写在这些文件里的内容每次会话都会被加载。三层索引是在此基础上的进阶组织方式，适合记忆条目多了之后分类管理。刚开始用的话，直接在 CLAUDE.md 里写就够了。

## 动手试一试：写你的第一条记忆

跟着下面的步骤操作，5 分钟内你就能让 Claude 在每次新对话开始时“认识”你。

### Step 1: 打开 Claude Code 对话

在终端启动 Claude Code。输入下面这段话（替换成你的真实信息）：

```text
我叫张三，前端实习生，用 React + TypeScript。
请帮我把这些信息保存到记忆里。
```

Claude 会自动创建一个记忆文件。你可以通过 `/memory` 命令查看它写了什么。

### Step 2: 验证记忆生效

关掉当前会话（`/clear` 或重新开一个终端），再启动 Claude Code，问一句：

```text
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

## 常见坑

- **记忆写了但 AI 没记住（内置路径）**：先确认写进了会被加载的位置——通常是 `~/.claude/CLAUDE.md` 或项目根 `CLAUDE.md`，且已**新开会话**。失败恢复：打开对应文件确认内容在；`/clear` 或重开终端后再问“我叫什么 / 我的偏好是什么”。
- **记忆写了但 AI 没记住（自建索引）**：检查该记忆是否被 `MEMORY.md` 索引文件引用。孤立的记忆文件不会被加载。失败恢复：在 `MEMORY.md` 里加上指向该文件的条目，再重开会话。
- **记忆冲突**：同一事实在多个记忆文件出现不同版本。写入新记忆前先 `grep` 检查已有条目。失败恢复：保留一处权威表述，删掉或改写冲突副本。
- **记忆膨胀**：太多“始终适用”的记忆每次会话都加载，消耗 token（上下文配额）。失败恢复：把非高频记忆按触发条件分到 `MEMORY-COMPANY.md` 或 `MEMORY-PROJECTS.md`；内置路径则把低频细节挪出 CLAUDE.md，改成按需链接的文件。
- **把自建方案当成官方必装**：三层索引不是 Claude Code 自带功能。失败恢复：新手只维护 CLAUDE.md；条目变多再考虑索引。

## 最小可验证动作

一次坐下来约 5 分钟：

1. 在 Claude Code 中说（换成你的真实信息）：

```text
我叫张三，前端实习生，用 React + TypeScript。
请帮我把这些信息保存到记忆里。
```

2. 用 `/memory` 或打开 `~/.claude/CLAUDE.md` 确认内容已写入
3. `/clear` 或重开会话，再问：

```text
我叫什么名字？我用什么技术栈？
```

**成功标准：** Claude 能准确回答姓名与技术栈。若不能，按上面“记忆写了但 AI 没记住”排查。

## Checkpoint

- □ 我能区分：内置记忆（CLAUDE.md / `/memory`）vs 自建三层索引（MEMORY.md 等）
- □ 我完成了上面的「最小可验证动作」，新会话能答出我的姓名/技术栈
- □ 记忆不生效时，我知道先查文件位置、是否被索引、是否已重开会话
- □ 我理解：不是所有事实都该“始终加载”；低频信息应按需触发，避免 token 膨胀
- □ （进阶）我能说明：只在讨论数据库时才需要的事实，更适合关键词触发层，而不是 MEMORY.md 始终加载

## 下一步

- 理解记忆系统的设计原则：[记忆系统设计原则](/methodology/memory-system-design/)
- 会话内的短期记忆上限 → [上下文窗口管理](/claude-code/context/)
- 想看完整工作流：[工作流编排思路](/methodology/workflow-design/)
- 把记忆文件纳入版本管理 → [配置即代码](/claude-code/dotfiles/)
