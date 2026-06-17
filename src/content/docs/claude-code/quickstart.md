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
  - { slug: claude-code/config, label: 核心配置 }
  - { slug: glossary, label: 术语对照表 }
lastVerified: '2026-06-12'
toolVersion: 'Claude Code CLI (latest)'
---

## 这是什么

Claude Code 是终端里的 AI 编程助手。安装它之后，你在终端输入 `claude` 就能开始和 AI 对话、让 AI 帮你写代码、调试、学习编程。这篇文章带你从零到能用它完成第一个任务。

## Before you start

- 你会打开终端并输入命令（如果不会，先看[通用环境基础设施](/methodology/basics/)）
- 你有一个 Anthropic 账号和 API Key（[console.anthropic.com](https://console.anthropic.com) 获取）

### 0. 了解成本

Claude Code 是按用量收费的。用量单位叫 token，简单理解就是"处理的文字量"。

大致参考（以 2026 年 6 月 Anthropic API 定价）：

- **偶尔问问问题**：$5-15 / 月
- **每天用它写代码**：$50-100 / 月
- **全天候深度使用**：$300+ / 月

你可以控制开销：

- 对话中输入 `/usage` 随时查看当前会话的 token 消耗和费用
- 用 `--model` 参数切换更便宜的模型：`claude --model claude-haiku-4-5`
- 别担心——先学会用，再学会省。前几次对话的费用通常不到 $1

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

### 3.5 一个关键习惯：每次新任务前 /clear

在你的下一次对话开始前，先记住这个最重要的命令：`/clear`。

类比：做完数学作业后不收拾桌子就开始写语文作业——数学草稿纸还摊着，思路被干扰。Claude Code 也一样：上一个任务的对话内容还在上下文里，会干扰 Claude 对新任务的理解。

在对话中输入 `/clear` 就是清空桌面。每次切换到完全不相关的任务时就用一次。

> 同一个任务的不同步骤（比如"加一个按钮"然后"改按钮颜色"）不需要 /clear。只有切换到完全不同的任务时才需要。

### 4. 第一次对话

```bash
claude
```

输入你的第一句 prompt：

```
帮我在当前目录创建一个 hello.html，打开后显示 "Hello World"。
```

Claude Code 会读你的当前目录、创建文件、写内容。你可以在对话中让它改样式、加功能。

如果你已经有项目文件夹（而不是空文件夹），第一个任务建议不让 Claude 创建新文件。先用它理解你的代码：

```
claude
读一下当前目录的代码，告诉我这个项目是做什么的
```

Claude 会扫描你的文件、理解结构、用自然语言解释。这比"建一个 hello.html"更接近真实使用场景——大多数时候你是在改已有项目，不是从零开始。

### 5. 基本操作

| 操作                 | 怎么做                       |
| -------------------- | ---------------------------- |
| 开始对话             | `claude`                     |
| 中止当前回复         | `Ctrl + C`                   |
| 暂停/恢复对话        | `Ctrl + Z` -> 恢复：`fg`     |
| 看到 Claude 在做什么 | 它会在终端打印正在执行的命令 |

## 常见坑

- **`claude: command not found`**：安装后需关掉终端重开，或者执行 `source ~/.zshrc` 让 PATH 生效。确认 `npm list -g @anthropic-ai/claude-code` 能看到它。
- **`ANTHROPIC_API_KEY not set`**：确认 `echo $ANTHROPIC_API_KEY` 有输出。若无，重新执行 export 命令。
- **Claude Code 改错了代码**：如果还没学 git，最简单的保护方式：在让 AI 改动之前，先手动复制一份文件夹作为备份（右键文件夹 → 复制 → 粘贴）。如果你已经会用 git：`git diff` 查看改动，`git checkout -- <文件名>` 回退单文件，`git stash` 回退全部。养成先 commit 再让 AI 动手的习惯。
- **Claude 第一次写的代码不完美**：这完全正常，不是你的问题也不是工具的问题。Claude Code 第一次接触你的项目时，它对代码库的理解是空白的——就像一个刚入职的同事还没读过任何文档。第一次尝试通常不太对，告诉它"不对，我要的是 X 而不是 Y"，第二次就会好很多。这是正常的工作方式，不是故障。
- **回复太慢/卡住了**：`Ctrl + C` 中止当前回复，重新发 prompt。

## 下一步

- 现在你已经能基本使用，下一步学[核心配置](/claude-code/config/) -- CLAUDE.md 和 settings.json 是 Claude Code 的灵魂
- 或者：用刚学会的 Claude Code 让它帮你创建第一个完整小页面（打开终端，cd 到你的项目目录，输入：`用 html/css 帮我做一个个人名片页面`）
