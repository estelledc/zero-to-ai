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
export ANTHROPIC_API_KEY="sk-ant-api03-你的真实key写在这里"
```

把 `sk-ant-api03-...` 整段替成你在 [Anthropic 控制台](https://console.anthropic.com) 生成的真实 key。不要手打，复制粘贴。key 很长。

重要：上面的 export 命令只在当前终端窗口有效，关掉终端就没了。永久保存需要写入 shell 配置文件：

```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-api03-你的key"' >> ~/.zshrc
```

`~/.zshrc` 是每次打开终端时自动执行的配置文件。`>>` 表示"追加到这行的末尾"。把 `sk-ant-api03-你的key` 替成你的真实 key。

完成后关掉终端重开，输入 `echo $ANTHROPIC_API_KEY` 确认有输出，就表示配置成功了。

### 3. 选择工作目录

先用 `pwd` 确认你在哪里。新手建议在桌面建一个测试文件夹：

```bash
cd ~/Desktop
mkdir my-first-ai-project
cd my-first-ai-project
```

`mkdir` = make directory（创建文件夹）。现在你在这个空文件夹里，Claude Code 会把这里当作你的项目根目录。

### 4. 第一次对话

```bash
claude
```

输入你的第一句 prompt：

```
帮我在当前目录创建一个 hello.html，打开后显示 "Hello World"。
```

Claude Code 会读你的当前目录、创建文件、写内容。你可以在对话中让它改样式、加功能。

### 5. 基本操作

| 操作 | 怎么做 |
|---|---|
| 开始对话 | `claude` |
| 中止当前回复 | `Ctrl + C` |
| 暂停/恢复对话 | `Ctrl + Z` -> 恢复：`fg` |
| 看到 Claude 在做什么 | 它会在终端打印正在执行的命令 |

## 常见坑

- **`claude: command not found`**：安装后需关掉终端重开，或者执行 `source ~/.zshrc` 让 PATH 生效。确认 `npm list -g @anthropic-ai/claude-code` 能看到它。
- **`ANTHROPIC_API_KEY not set`**：确认 `echo $ANTHROPIC_API_KEY` 有输出。若无，重新执行 export 命令。
- **Claude Code 改错了代码**：如果还没学 git，最简单的保护方式：在让 AI 改动之前，先手动复制一份文件夹作为备份（右键文件夹 → 复制 → 粘贴）。如果你已经会用 git：`git diff` 查看改动，`git checkout -- <文件名>` 回退单文件，`git stash` 回退全部。养成先 commit 再让 AI 动手的习惯。
- **回复太慢/卡住了**：`Ctrl + C` 中止当前回复，重新发 prompt。

## 下一步

- 现在你已经能基本使用，下一步学[核心配置](/zero-to-ai/claude-code/config/) -- CLAUDE.md 和 settings.json 是 Claude Code 的灵魂
- 或者：用刚学会的 Claude Code 让它帮你创建第一个完整小页面（打开终端，cd 到你的项目目录，输入：`用 html/css 帮我做一个个人名片页面`）
