---
title: 通用环境基础设施
description: 终端、PATH、包管理器、环境变量 — 一次性讲清楚，不再每个工具教程里重复
tags: [methodology]
difficulty: beginner
lastVerified: '2026-07-10'
prerequisites: []
relatedContent:
  - { slug: 'claude-code/quickstart', label: '10 分钟上手 Claude Code' }
  - { slug: 'claude-code/preflight', label: '开始之前' }
  - { slug: 'glossary', label: '术语对照表' }
  - { slug: 'appendix/git-basics', label: 'Git 最小知识' }
  - { slug: 'claude-code/index', label: 'Claude Code 教程总览' }
---

## 这是什么

AI 编程工具都需要你使用**终端**输入命令。如果你以前只点鼠标操作电脑，这篇文章帮你补齐基础知识。读完你会知道终端是什么、怎么打开、以及安装软件时经常出现的“PATH”“环境变量”是什么意思。

:::note[和 Claude Code 安装的关系]
[10 分钟上手](/claude-code/quickstart/)里的**原生安装不要求先装 Node.js**。本页教的是通用终端基础；Node/npm 只在你做某些网页工作流或发布站点时才需要，**不是** Claude Code CLI 本身的强制前置。
:::

## 开始之前

不需要任何预备知识。这正是零基础起点。

## 类比

你的电脑像一个厨房。GUI（鼠标点来点去）就是在厨房台面上手动切菜、炒菜。终端（Terminal）就是你对厨师长用对讲机下命令——更快、更精确，但你得知道正确的口令。PATH 就是厨师长的菜单——他只听上面列的那些厨师的指令。

## 实际操作

### 1. 打开终端

- **macOS**：按 `Cmd + Space`，输入 `Terminal`，回车。或 Launchpad → 其他 → 终端
- **Windows**：按 `Win + R`，输入 `cmd` 或 `powershell`，回车。若后续按 Claude Code 的 WSL 路径安装，请在 **WSL 终端**里操作，不要混用未配置的 CMD
- **Linux**：取决于桌面环境，通常是 `Ctrl + Alt + T`

### 2. 输入你的第一条命令

**macOS / Linux / WSL：**

```bash
echo "Hello"
```

**Windows PowerShell：**

```powershell
Write-Output "Hello"
```

**成功标准：** 输出一行 `Hello`。`echo` / `Write-Output` 就是“复读机”——你说什么它就重复什么。

### 3. 你在哪？

```bash
pwd
```

PowerShell 可用 `Get-Location`。

输出：你的当前目录绝对路径。本文用 `$HOME` 表示个人主目录，不展示真实用户名。`pwd` = “print working directory”（打印当前目录）。

### 4. 这里有什么？

```bash
ls
```

PowerShell 可用 `Get-ChildItem`（或别名 `ls`）。

输出：当前目录下的文件列表。`ls` = “list”（列出）。

### 5. 包管理器是什么？

包管理器就是一个“应用商店”，只是工作在终端里：

- **macOS**：`brew install <包名>`（需要先装 Homebrew）

如果你的 Mac 还没装 Homebrew（输入 `brew --version` 看是否提示 command not found），先用这条命令安装：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装过程中它会告诉你它在做什么、是否需要输入密码。按提示操作即可。装完后验证：`brew --version`。

- **Windows**：`winget install <包名>`（Windows 11 自带）
- **Linux**：`sudo apt install <包名>`（Debian/Ubuntu）或 `sudo dnf install <包名>`（Fedora）

### 6. PATH 是什么？

**macOS / Linux / WSL：**

```bash
echo $PATH
```

**Windows PowerShell：**

```powershell
$env:PATH
```

输出：一串用 `:`（Unix）或 `;`（Windows）分隔的目录路径。

当你输入某个命令时，系统按照 PATH 里列出的目录顺序去找对应的可执行文件。如果找不到，就报 `command not found`（或 PowerShell 的“无法识别”）。

### 7. 环境变量是什么？

```bash
echo $HOME
```

PowerShell：`echo $HOME` 或 `$env:USERPROFILE`。

输出：你的用户主目录路径；后续示例统一写成 `$HOME`。

环境变量是系统和程序之间共享的“便签”。`HOME` 告诉所有程序你的主目录在哪。AI 工具的 API Key 通常也通过环境变量传入（如 `ANTHROPIC_API_KEY`）。

### 8. Node.js：可选，不是 Claude Code 的硬门槛

:::tip[什么时候才需要 Node？]

- **不需要**：只按 [quickstart 原生安装](/claude-code/quickstart/)使用 Claude Code CLI（`curl` / `irm` 安装脚本）。
- **需要**：你的项目本身用 npm/Node（例如本地起开发服务器），或你要走某些[发布小站](/projects/publish-first-site/)等网页工作流。
  :::

若你确定后面会用到 Node，再安装并验证：

**macOS：**

```bash
brew install node
node --version
npm --version
```

**Windows（winget）：**

```powershell
winget install OpenJS.NodeJS.LTS
node --version
npm --version
```

**Linux（Debian/Ubuntu 示例）：**

```bash
sudo apt update && sudo apt install -y nodejs npm
node --version
npm --version
```

**成功标准（仅当你选择安装时）：** `node --version` 与 `npm --version` 都打印出版本号。

## 常见坑

- **`command not found`**：这个命令没有安装，或者它的路径不在 PATH 里。先确认已安装：`which <命令名>`（PowerShell：`Get-Command <命令名>`）。若安装了仍提示找不到，大概率 PATH 未包含该安装路径。
- **`Permission denied`**：没有权限。加 `sudo` 尝试（macOS/Linux），或检查文件权限：`chmod +x <文件名>`。
- **安装完软件后终端不识别**：关掉终端重新打开。新装的软件注册到 PATH 需要重启 shell 才能生效。
- **误以为必须先装 Node 才能装 Claude Code**：旧教程常把 npm 全局安装写成前置。当前官方推荐原生安装，**不要求**先装 Node。失败恢复：跳过 Node，直接去 [10 分钟上手](/claude-code/quickstart/) 的原生安装命令；只有项目真的需要 npm 时再回来装 Node。

## Checkpoint

确认你的**终端基础**已就绪（Node 不是必选项）：

- □ 打开终端，输入 `echo "Hello"`（或 PowerShell 的 `Write-Output "Hello"`）能看到输出
- □ 你知道 `pwd`（或 `Get-Location`）是干什么的（打印当前目录）
- □ 你理解 PATH：命令找不到时，先怀疑“没装”或“装了但不在 PATH”
- □ （可选）若你接下来要做 npm 网页项目或发布流程：`node --version` 与 `npm --version` 能看到版本号；**仅学 Claude Code CLI 可跳过本项**

全部通过终端基础项？环境就绪，可以继续了。

## 下一步

- 从 [开始之前](/claude-code/preflight/) 跳过来的？环境就绪了，[回去继续自评估](/claude-code/preflight/)
- 继续 [Claude Code 快速开始](/claude-code/quickstart/)（原生安装，无需先装 Node）
- 环境就绪后，了解 [CLAUDE.md 编写哲学](/methodology/claude-md-philosophy/) 来定制 Claude 的行为
- 回 [学习方法论](/methodology/)
- 查看 [术语对照表](/glossary/)
