---
title: 10 分钟上手 Claude Code
description: 安装 Claude Code、输入第一句 prompt、理解对话模式和基本操作
tags: [claude-code]
difficulty: beginner
learningPaths:
  - ai-coding-zero
prerequisites:
  - methodology/basics
relatedContent:
  - {slug: claude-code/config, label: 核心配置}
  - {slug: glossary, label: 术语对照表}
lastVerified: "2026-06-12"
toolVersion: "Claude Code CLI (latest)"
---

## 这是什么

Claude Code 是终端里的 AI 编程助手。安装它之后，你在终端输入 `claude` 就能开始和 AI 对话、让 AI 帮你写代码、调试、学习编程。这篇文章带你从零到能用它完成第一个任务。

## Before you start

- 你会打开终端并输入命令（如果不会，先看[通用环境基础设施](/zero-to-ai/methodology/basics/)）
- 你有一个 Anthropic 账号和 API Key（[console.anthropic.com](https://console.anthropic.com) 获取）

## 类比

Claude Code 像你手机上的智能助手（Siri / 小爱同学），但它的工作阵地不是"设个闹钟"而是"写代码"。你在对话里告诉它要做什么，它读你的代码库、写新代码、帮你改 bug。区别是它能看到你的整个项目文件夹、理解上下文、持续帮忙。

## 实际操作

### 1. 安装

```bash
# macOS / Linux
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

如果提示 `npm: command not found`，先装 Node.js：

```bash
# macOS
brew install node

# 验证
node --version
npm --version
```

### 2. 设置 API Key

```bash
export ANTHROPIC_API_KEY='$ANTHROPIC_API_KEY'
```

> `$ANTHROPIC_API_KEY` 是占位符，替成你从 [console.anthropic.com](https://console.anthropic.com) 拿到的真实 key。不要把这个 key 分享给任何人或上传到公开仓库。

建议把 `export ANTHROPIC_API_KEY=...` 加到 `~/.zshrc`（或 `~/.bashrc`），每次打开终端自动生效。

### 3. 第一次对话

```bash
claude
```

输入你的第一句 prompt：

```
帮我在当前目录创建一个 hello.html，打开后显示 "Hello World"。
```

Claude Code 会读你的当前目录、创建文件、写内容。你可以在对话中让它改样式、加功能。

### 4. 基本操作

| 操作 | 怎么做 |
|---|---|
| 开始对话 | `claude` |
| 中止当前回复 | `Ctrl + C` |
| 暂停/恢复对话 | `Ctrl + Z` -> 恢复：`fg` |
| 看到 Claude 在做什么 | 它会在终端打印正在执行的命令 |

### 5. 从哪启动

**重要提示**：Claude Code 从你执行 `claude` 命令的目录读取项目上下文。建议只从项目根目录启动 -- cd 到你要工作的项目目录后再执行 `claude`。

## 常见坑

- **`claude: command not found`**：安装后需关掉终端重开，或者执行 `source ~/.zshrc` 让 PATH 生效。确认 `npm list -g @anthropic-ai/claude-code` 能看到它。
- **`ANTHROPIC_API_KEY not set`**：确认 `echo $ANTHROPIC_API_KEY` 有输出。若无，重新执行 export 命令。
- **Claude Code 改错了代码**：用 `git diff` 查看改动，`git checkout -- <文件名>` 回退单文件，`git stash` 回退全部。养成先 git commit 保存当前状态再让 AI 改代码的习惯。
- **回复太慢/卡住了**：`Ctrl + C` 中止当前回复，重新发 prompt。

## 下一步

- 现在你已经能基本使用，下一步学[核心配置](/zero-to-ai/claude-code/config/) -- CLAUDE.md 和 settings.json 是 Claude Code 的灵魂
- 或者：用刚学会的 Claude Code 让它帮你创建第一个完整小页面（打开终端，cd 到你的项目目录，输入：`用 html/css 帮我做一个个人名片页面`）
