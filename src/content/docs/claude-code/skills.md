---
title: Skill 体系
description: 创建和使用可复用技能 — 把常见的提示词封装成 Skill，下次直接调用
tags: [claude-code]
difficulty: intermediate
learningPaths:
  - ai-coding-zero
prerequisites:
  - claude-code/config
relatedContent:
  - {slug: "methodology/workflow-design", label: "工作流编排思路"}
lastVerified: "2026-06-12"
toolVersion: "Claude Code CLI (latest)"
---

## 这是什么

Skill 是可复用的任务指令。比如你每次提交代码都要说"分析变更、分组、生成规范的中文 commit message"，把它写成一个 Skill，下次直接 `/commit` 就行。

## 类比

Skill 像厨房里的预制菜包——把"切菜、调味、控制火候"这些每次都重复的步骤打包好，你只需要"这个我用/commit，那个我用/render"。

## Before you start

- CLAUDE.md 和 settings.json 已经配置好（参考[核心配置](/zero-to-ai/claude-code/config/)）
- 你发现自己在重复输入相同类型的 prompt

## 实际操作

### 1. Skill 的结构

Skill 文件放在 `.claude/skills/` 或 `~/.claude/skills/` 目录下，是普通的 markdown 文件：

```markdown
---
name: my-skill
description: 简短描述这个 Skill 做什么
---

# Skill 标题

当用户说 X 时触发。
步骤：
1. 做 A
2. 做 B
3. 做 C
```

### 2. 创建第一个 Skill

在 `.claude/skills/my-commit.md`：

```markdown
---
name: my-commit
description: 分析变更、分组、生成规范的 commit message
---

# 提交代码

当用户说"提交"或"commit"时触发。

步骤：
1. git status 看有哪些变更
2. git diff --stat 看每个文件改动量
3. 按主题分组变更（一个 commit 只做一件事）
4. 为每组生成中文 commit message：动词 + 对象：说明
5. 逐一执行 git add <文件> && git commit -m "<message>"
```

### 3. 使用 Skill

在 Claude Code 对话中输入 `/my-commit`。

### 4. Skill 的触发方式

- **显式调用**：用户输入 `/skill-name`
- **关键词触发**：Skill 描述中的关键词匹配用户输入
- **自动加载**：`~/.claude/skills/` 下的 Skill 所有会话自动可用

## 常见坑

- **Skill 不触发**：检查文件在 `.claude/skills/` 下（不是子目录的深层位置）。确认 frontmatter 的 `name` 字段没有和已有 Skill 冲突。
- **Skill 太泛化**：描述太模糊会误触发。描述写清楚触发条件。
- **Skill 间冲突**：多个 Skill 匹配同一输入时，Claude Code 会问你选哪个。

## 下一步

- 需要一个完整的 Skill 示例？看 [Claude Code 配置](/zero-to-ai/claude-code/config/) 中的 settings.json 和 Hook 配置
- 想学工作流编排方法论：[工作流编排思路](/zero-to-ai/methodology/workflow-design/)（即将推出）
