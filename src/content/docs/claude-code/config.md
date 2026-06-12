---
title: 核心配置
description: CLAUDE.md、settings.json 和 Hook 系统 — Claude Code 的灵魂配置
tags: [claude-code]
difficulty: intermediate
learningPaths:
  - ai-coding-zero
prerequisites:
  - claude-code/quickstart
relatedContent:
  - {slug: "methodology/claude-md-philosophy", label: "CLAUDE.md 编写哲学"}
lastVerified: "2026-06-12"
toolVersion: "Claude Code CLI (latest)"
---

## 这是什么

Claude Code 的核心配置文件决定了 AI 的行为方式、权限范围、以及在不同项目中的"人格"。配置得当，Claude Code 从"偶尔用用"变成"日常高效搭档"。

## 类比

CLAUDE.md 像入职第一天交给新同事的"工作手册"——告诉他你的工作习惯、常用工具、不能碰的雷区。settings.json 像公司 IT 部门的"权限清单"——规定哪些操作需要审批、哪些可以自己决定。

## Before you start

- 已经用 Claude Code 完成过至少 1-2 次对话任务
- 对终端命令不陌生

## 实际操作

### 1. CLAUDE.md — 项目级指令

在项目根目录创建 `CLAUDE.md`：

```markdown
# 项目名称 — Claude 工作指南

## 项目身份
- 用途：简短描述项目
- 技术栈：React + TypeScript

## 行为准则
- 编辑前先读相关文件
- 改动超过 3 个文件时先确认
- 提交代码前跑测试
```

Claude Code 启动时自动读取项目根目录的 `CLAUDE.md`，把它作为系统指令。

### 2. 全局 CLAUDE.md

`~/.claude/CLAUDE.md` 对所有项目生效。放跨项目通用的内容：
- 你的个人信息和工作偏好
- 输出风格要求
- 工具使用规范

### 3. settings.json — 权限与行为

`~/.claude/settings.json`（全局）或 `<项目>/.claude/settings.json`（项目级）：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test:*)",
      "Bash(git diff:*)",
      "Bash(git status:*)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(git push --force:*)"
    ]
  }
}
```

### 4. Hook 系统（即将推出详细教程）

Hook 是"事件触发器"——在特定时刻自动执行你设定的动作。就像一个门禁系统：有人刷卡（事件发生）→ 自动开门（执行动作）。

常见用法：
- **每次 Claude Code 写完文件后，自动检查代码格式**
- **每次提交前，自动跑一遍测试**

Hook 的配置写在 `settings.json` 中，属于进阶功能。当你把基础配置用熟后，再来学 [Hook 系统详解](/zero-to-ai/methodology/workflow-design/)（即将推出）。

## 常见坑

- **CLAUDE.md 写了不生效**：确认文件在项目根目录（不是 src/ 下）。重开 Claude Code 会话加载新配置。
- **settings.json 权限太窄**：导致 Claude Code 什么都做不了。从宽松开始，逐渐收紧。
- **Hook 脚本路径**：用绝对路径或确保脚本在 PATH 中。Hook 的工作目录是项目根目录。

## 下一步

- 配置好了基础？学 [Skill 体系](/zero-to-ai/claude-code/skills/) — 把常见的任务封装成可复用技能
- 想看配置背后的设计思想：[CLAUDE.md 编写哲学](/zero-to-ai/methodology/claude-md-philosophy/)（即将推出）
