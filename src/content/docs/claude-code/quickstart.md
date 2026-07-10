---
title: 10 分钟上手 Claude Code
description: 安装 Claude Code、输入第一句 prompt、理解对话模式和基本操作
tags: [claude-code]
difficulty: beginner
prerequisites:
  - methodology/basics
relatedContent:
  - { slug: 'claude-code/config', label: '核心配置' }
  - { slug: 'glossary', label: '术语对照表' }
  - { slug: 'claude-code/preflight', label: '开始之前' }
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
  - { slug: 'claude-code/agnes-free-vibe-coding', label: '第三方兼容实验边界' }
  - { slug: 'claude-code/first-page', label: '你的第一个 AI 页面' }
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
---

## 这是什么

Claude Code 是终端里的 AI 编程助手。安装它之后，你在终端输入 `claude` 就能开始和 AI 对话、让 AI 帮你写代码、调试、学习编程。这篇文章带你从零到能用它完成第一个任务。

## 开始之前

:::note[不想先花钱？]
先说明边界：Claude.ai 免费方案不包含 Claude Code。你可以使用 Claude Pro / Max / Team / Enterprise 登录，或使用 Claude Console 的按量 API。本站另有 [Agnes 兼容路线](/claude-code/agnes-free-vibe-coding/)，但它是第三方网关，不属于 Anthropic 官方支持范围，能力与免费政策都可能变化。
:::

- 你会打开终端并输入命令（如果不会，先看[通用环境基础设施](/methodology/basics/)）
- 你的系统满足最低要求：macOS 13+、Windows 10 1809+ / Server 2019+，或受支持的 Linux 发行版
- 你有 Claude Pro / Max / Team / Enterprise 订阅，或有 [Claude Console](https://console.anthropic.com) API 额度；第三方兼容网关请单独看对应教程

### 0. 了解成本

Claude Code 有两种常见计费入口：订阅方案共享用量额度，Claude Console API 按 token 计费。两者不能用一个固定“月均价”互相换算。开始前先确认你使用哪种认证方式，并在 [Anthropic 官方定价](https://www.anthropic.com/pricing) 查看当前价格；详细估算方法见[成本与计费](/claude-code/cost/)。

## 类比

Claude Code 像你手机上的智能助手（Siri / 小爱同学），但它的工作阵地不是“设个闹钟”而是“写代码”。你在对话里告诉它要做什么，它读你的代码库、写新代码、帮你改 bug。区别是它能看到你的整个项目文件夹、理解上下文、持续帮忙。

## 实际操作

### 1. 安装

官方推荐原生安装；它不再要求先安装 Node.js。

**macOS / Linux / WSL：**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows PowerShell：**

```powershell
irm https://claude.ai/install.ps1 | iex
```

**Windows CMD：**

```bat
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

安装后验证：

```bash
claude --version
claude doctor
```

原生 Windows 推荐安装 Git for Windows；没有 Git Bash 时 Claude Code 会回退到 PowerShell。WSL 用户应在 WSL 终端内执行 Linux 安装命令。

### 2. 登录或选择 API 认证

直接运行 `claude`，按浏览器提示登录。这是 Claude Pro / Max / Team / Enterprise 用户的默认方式；凭证由 Claude Code 管理，不需要复制进 shell 配置文件。

如果你使用 Claude Console API，在当前终端设置 `ANTHROPIC_API_KEY`：

```bash
export ANTHROPIC_API_KEY="你的 Claude Console API Key"
```

PowerShell 等价写法：

```powershell
$env:ANTHROPIC_API_KEY="你的 Claude Console API Key"
```

API key 会优先于订阅登录。若你本来想用订阅却遇到认证问题，先取消这个环境变量，再用 `/status` 确认当前认证来源：macOS/Linux 运行 `unset ANTHROPIC_API_KEY`，PowerShell 运行 `Remove-Item Env:ANTHROPIC_API_KEY`。不要把真实 key 提交到 Git，也不要在截图、Issue 或教程示例中公开它。

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

> 同一个任务的不同步骤（比如“加一个按钮”然后“改按钮颜色”）不需要 /clear。只有切换到完全不同的任务时才需要。

### 4. 第一次对话

```bash
claude
```

输入你的第一句 prompt：

```text
帮我在当前目录创建一个 hello.html，打开后显示 "Hello World"。
```

Claude Code 会读你的当前目录、创建文件、写内容。你可以在对话中让它改样式、加功能。

如果你已经有项目文件夹（而不是空文件夹），第一个任务建议不让 Claude 创建新文件。先用它理解你的代码：

```text
claude
读一下当前目录的代码，告诉我这个项目是做什么的
```

Claude 会扫描你的文件、理解结构、用自然语言解释。这比“建一个 hello.html”更接近真实使用场景——大多数时候你是在改已有项目，不是从零开始。

### 5. 基本操作

| 操作                 | 怎么做                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| 开始对话             | `claude`                                                                                                     |
| 中止当前回复         | `Ctrl + C`                                                                                                   |
| 暂停/恢复对话        | `Ctrl + Z` → 恢复：`fg`（操作系统级进程暂停，不是 Claude Code 功能。初学者建议避免使用，直接开新会话更安全） |
| 看到 Claude 在做什么 | 它会在终端打印正在执行的命令                                                                                 |

## 常见坑

- **`claude: command not found`**：安装后重开终端，并运行 `claude doctor`。macOS/Linux 原生安装通常位于 `~/.local/bin/claude`；不要同时保留原生、Homebrew 和旧 npm 全局安装。
- **登录后仍提示认证失败**：在 Claude Code 中运行 `/status`。若环境里残留失效的 `ANTHROPIC_API_KEY`，它会优先于订阅登录；取消该变量后重试。
- **Claude Code 改错了代码**：如果还没学 git，最简单的保护方式：在让 AI 改动之前，先手动复制一份文件夹作为备份（右键文件夹 → 复制 → 粘贴）。如果你已经会用 git：`git diff` 查看改动，`git checkout -- <文件名>` 回退单文件，`git stash` 回退全部。养成先 commit 再让 AI 动手的习惯。Git 基础操作详见[附录：Git 入门](/appendix/git-basics/)。
- **Claude 第一次写的代码不完美**：这完全正常，不是你的问题也不是工具的问题。Claude Code 第一次接触你的项目时，它对代码库的理解是空白的——就像一个刚入职的同事还没读过任何文档。第一次尝试通常不太对，告诉它“不对，我要的是 X 而不是 Y”，第二次就会好很多。这是正常的工作方式，不是故障。
- **回复太慢/卡住了**：`Ctrl + C` 中止当前回复，重新发 prompt。

## Checkpoint

确认你完成了以下操作：

1. `claude --version` 能输出版本号
2. `claude` 能完成浏览器登录，或 `/status` 显示你主动选择的 API 认证
3. 你成功让 Claude 创建了至少一个文件（比如 hello.html）
4. 你知道 `/clear` 是干什么用的

全部通过？恭喜——你已经会用 Claude Code 了。

## 下一步

- 现在你已经能基本使用，下一步学[核心配置](/claude-code/config/)——CLAUDE.md 和 settings.json 是 Claude Code 的灵魂
- 或者：用刚学会的 Claude Code 让它帮你创建第一个完整小页面（打开终端，cd 到你的项目目录，输入：`用 html/css 帮我做一个个人名片页面`）
