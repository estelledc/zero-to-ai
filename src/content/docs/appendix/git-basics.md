---
title: Git 10 分钟速成
description: 从零开始理解版本控制 — 用游戏存档的类比学会 git init/add/commit/diff/log/status/clone
tags: [appendix]
difficulty: beginner
prerequisites: []
relatedContent:
  - { slug: 'claude-code/quickstart', label: '10 分钟上手 Claude Code' }
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
  - { slug: 'appendix/troubleshooting', label: '常见问题排查' }
  - { slug: 'projects/publish-first-site', label: '把第一张个人页面发布成小站' }
lastVerified: '2026-07-10'
---

## 这是什么

这一页用约 10 分钟，让你在本机学会 Git 最核心的本地操作：`init` / `status` / `add` / `commit` / `diff` / `log`，外加 `clone` 的直觉。读完你应能在一个练习目录里留下至少两次 commit，并知道改乱文件时怎么回退。

本篇**不**覆盖分支协作、`push`/`pull` 冲突解决、rebase。那些在发布小站或团队协作时再学。

## 类比

玩 RPG 游戏时，打 boss 前你会存档。打赢了继续，打输了读档重来。**Git 就是给代码做同样的事**——每次修改后「存档」，任何时候可以回到之前的版本。

| 游戏术语       | Git 术语           |
| -------------- | ------------------ |
| 存档           | commit（提交）     |
| 存档列表       | log（日志）        |
| 回到存档       | restore / checkout |
| 对比两个存档   | diff               |
| 下载别人的存档 | clone              |

本地操作不需要联网，不需要注册账号——Git 是你电脑上的程序。等你需要和别人协作（clone、push）时才需要网络。

## 开始之前

- 会打开终端（不会？先读 [通用环境基础设施](/methodology/basics/)）
- 本机已安装 Git。检查：

**macOS / Linux / WSL：**

```bash
git --version
```

**Windows PowerShell：**

```powershell
git --version
```

若提示找不到命令：macOS 可装 Xcode Command Line Tools 或 `brew install git`；Windows 用 [Git for Windows](https://git-scm.com/download/win) 或 `winget install Git.Git`；Linux（Debian/Ubuntu）用 `sudo apt install git`。装完**重开终端**再检查。

- **macOS / Linux / WSL2**：下列 bash 可直接用
- **原生 Windows**：Git Bash 与下列 bash 一致；PowerShell 里 `git` 命令相同，路径用 `~\Desktop\...`

## 实际操作

### 1. `git init` — 开始一个新游戏

在文件夹里初始化 Git。只需要运行一次，Git 会在这个文件夹里建一个隐藏的 `.git` 目录，用来存放所有「存档」数据。

```bash
cd 你的项目文件夹
git init
```

运行后会看到 `Initialized empty Git repository in ...`，表示「游戏」开始了。

### 2. `git status` — 看现在什么状态

最常用的命令。告诉你：哪些文件改了、哪些还没存档、哪些是新文件。

```bash
git status
```

输出示例解读：

- `Untracked files`（红色）— 新文件，Git 还不认识
- `Changes not staged for commit`（红色）— 改过了但没标记「要存档」
- `Changes to be committed`（绿色）— 已经标记好，等存档

**每次不知道该做什么时，先 `git status`。**

### 3. `git add` — 选择要存档的文件

不像游戏那样自动存全部——Git 让你**选择**哪些文件要存档。这给了你控制权：改了三处，可以先只存改好的那一处。

```bash
git add 文件名          # 只存一个文件
git add 文件1 文件2     # 存多个文件
git add .               # 存当前目录所有修改（小心！）
```

`git add` 把文件放入**暂存区**（staging area）——相当于存档前的「待确认清单」。只有暂存区里的文件会被下一次 `git commit` 存进去。

`git add .` 的坑：会把当前目录所有修改都标记，包括你可能不想存的临时文件、配置文件。存之前看一眼 `git status` 确认。

### 4. `git commit` — 存档！

把 `git add` 选中的文件正式记录下来。**必须写存档说明**（commit message），不然 Git 会拒绝。

```bash
git commit -m "存档说明"
```

存档说明怎么写？

- 不好：`修改`、`更新`、`fix`
- 好：`修复登录页密码框显示明文`、`添加用户头像上传功能`

写清楚你做了什么，未来的你会感谢现在的你。

**常见错误**：忘记 `git add` 直接 `git commit`——什么都没存进去。正确流程永远是：改文件 → `git add` → `git commit`。

**第一次 commit 可能被拒（身份未配置）：**

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

再用原来的 `git commit -m "..."` 重试。邮箱可用 GitHub 提供的 noreply 地址，不必公开私人邮箱。

### 5. `git diff` — 对比两次存档有什么不同

看这次改了哪些行。绿色加号是新增的，红色减号是删掉的。

```bash
git diff              # 看还没 git add 的修改
git diff --staged     # 看已经 git add 还没 commit 的修改
git diff HEAD         # 看所有还没提交的修改（最常用）
```

在让 AI 改代码后这个命令特别有用——确认 AI 只改了该改的地方，没乱动别的。

### 6. `git log` — 翻存档列表

看历史上所有存档记录。

```bash
git log               # 完整信息（按 q 退出）
git log --oneline     # 一行一条，简洁（推荐）
```

每条记录包含：谁提交的、什么时候、存档说明、一个唯一编号（commit hash）。

### 7. `git clone` — 下载别人的存档

把远程仓库（比如 GitHub 上的项目）下载到本地。

```bash
git clone <URL>
```

下载后自动把整个存档历史也带下来，你可以看这个项目从第一天到现在的所有改动。

除了以上 7 个基础命令，下面的场景还会用到几个保护性命令（`git stash`、`git restore`），遇到时现学即可。

## 和 AI 编程助手配合的 3 个关键场景

### 场景一：AI 改代码前先存档

让 AI 改一大段代码之前，先存个档。改错了可以秒回。

```bash
git add -A
git commit -m "AI 修改前的存档"
```

### 场景二：AI 改完后检查

AI 改完代码后，用 `git diff` 逐行看改了什么。

```bash
git diff
```

确认只改了该改的地方，没有多改、少改、改错。满意后再 `git add` + `git commit`。

### 场景三：改错了回退（失败恢复）

两种情况：

- **只想撤回某个文件的未提交修改**：`git restore 文件名`（现代 Git 2.23+）；旧写法 `git checkout -- 文件名`
- **想把当前改到一半的进度暂时存起来**：`git stash`（像游戏的「快速存档」）。回来继续时 `git stash pop`

```bash
# 看清要回退什么
git status
git diff

# 丢弃单个文件的未提交修改（不可恢复，确认后再做）
git restore 文件名

# 或：暂存当前脏工作区，切去干别的
git stash
# ... 干完别的 ...
git stash pop
```

学会这两个命令你就敢让 AI 改了——改乱了一个文件用 `git restore`，改乱了一堆未提交改动用 `git stash` 或按文件 restore。

:::caution[不要一上来就用危险命令]
本页不教 `git reset --hard` 或强推。未提交的修改用 `restore` / `stash` 即可。已提交的坏改动，发布场景里优先用 `git revert`（见 [发布小站](/projects/publish-first-site/)），而不是改写历史。
:::

## 常见坑

**1. `git add .` 存进了不该存的文件**

比如 API key 文件、密码文件。解决：在项目根目录建一个 `.gitignore` 文件，把不想存的文件名写进去，一行一个。

```text
# .gitignore 示例
.env
secret.txt
node_modules/
```

若已经误提交密钥：立刻轮换密钥，不要假设「再 commit 删掉」就安全——历史里还在。求助时也不要把 key 贴进 Issue。

**2. commit message 写「修改」、「更新」**

没用。一个月后自己都看不懂。花 5 秒写清楚改了啥。

**3. 忘记 `git add` 直接 `git commit`**

什么都没存进去。习惯性在 `git commit` 前跑一次 `git status` 确认。若提示 `nothing to commit, working tree clean` 但你明明改过文件——多半改错了目录，先 `pwd`。

**4. `Author identity unknown`**

按上文配置 `user.name` / `user.email` 后重试 commit。

**5. 不知道怎么回退就不敢让 AI 改代码**

回顾场景三：未提交用 `git restore` / `git stash`；已提交坏改动用可追溯的 `git revert`（发布课再练）。

**6. 在错误的文件夹里 `git init`**

`git status` 若显示大量无关文件，先确认 `pwd`。不要在家目录整盘 init。练习用独立小文件夹。

## Checkpoint：动手试试

打开终端，复制粘贴下面每一行，一行一行跑：

**macOS / Linux / WSL：**

```bash
cd ~/Desktop
mkdir test-git
cd test-git
git init
echo "第一行字" > test.txt
git add test.txt
git commit -m "第一个存档"
echo "第二行字" >> test.txt
git diff
git add test.txt
git commit -m "加了第二行"
git log --oneline
```

**Windows PowerShell：**

```powershell
cd ~\Desktop
mkdir test-git
cd test-git
git init
Set-Content -Path test.txt -Value "第一行字"
git add test.txt
git commit -m "第一个存档"
Add-Content -Path test.txt -Value "第二行字"
git diff
git add test.txt
git commit -m "加了第二行"
git log --oneline
```

跑完后你应该看到两个存档记录。这就学会了 Git 最核心的操作。

自检：

- □ `git --version` 有输出
- □ 练习目录里 `git log --oneline` 至少两条 commit
- □ 你能解释 `status` / `add` / `commit` / `diff` 各干什么
- □ 你知道未提交改乱文件时用 `git restore`，而不是删仓库重来

本篇只涵盖本地操作。分支（branch）、推送（push）、合并（merge）等协作概念不在范围内——遇到时再学。术语速查见 [术语对照表](/glossary/)。

## 下一步

- 还不会终端？去 [通用环境基础设施](/methodology/basics/)
- Claude 路径：去 [开始之前](/claude-code/preflight/)，或继续 [10 分钟上手](/claude-code/quickstart/)
- 已有本地页面要上线：去 [把第一张个人页面发布成小站](/projects/publish-first-site/)
- 报错了：去 [常见问题排查](/appendix/troubleshooting/)
