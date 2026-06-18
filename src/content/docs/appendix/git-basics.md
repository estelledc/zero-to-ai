---
title: Git 10 分钟速成
description: 从零开始理解版本控制 — 用游戏存档的类比学会 git init/add/commit/diff/log/status/clone
tags: [appendix]
difficulty: beginner
prerequisites: []
relatedContent:
  - { slug: 'claude-code/quickstart', label: '10 分钟上手 Claude Code' }
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
lastVerified: '2026-06-12'
---

## 类比：Git 像游戏存档

玩 RPG 游戏时，打 boss 前你会存档。打赢了继续，打输了读档重来。**Git 就是给代码做同样的事**——每次修改后"存档"，任何时候可以回到之前的版本。

对应关系：

| 游戏术语       | Git 术语       |
| -------------- | -------------- |
| 存档           | commit（提交） |
| 存档列表       | log（日志）    |
| 回到存档       | checkout       |
| 对比两个存档   | diff           |
| 下载别人的存档 | clone          |

不需要联网，不需要注册账号，Git 是你电脑上的一个程序，管好你自己文件夹里的代码。

## 7 个核心操作

### 1. `git init` — 开始一个新游戏

在文件夹里初始化 Git。只需要运行一次，Git 会在这个文件夹里建一个隐藏的 `.git` 目录，用来存放所有"存档"数据。

```bash
cd 你的项目文件夹
git init
```

运行后会看到 `Initialized empty Git repository in ...`，表示"游戏"开始了。

### 2. `git status` — 看现在什么状态

最常用的命令。告诉你：哪些文件改了、哪些还没存档、哪些是新文件。

```bash
git status
```

输出示例解读：

- `Untracked files`（红色）— 新文件，Git 还不认识
- `Changes not staged for commit`（红色）— 改过了但没标记"要存档"
- `Changes to be committed`（绿色）— 已经标记好，等存档

**每次不知道该做什么时，先 `git status`。**

### 3. `git add` — 选择要存档的文件

不像游戏那样自动存全部——Git 让你**选择**哪些文件要存档。这给了你控制权：改了三处，可以先只存改好的那一处。

```bash
git add 文件名          # 只存一个文件
git add 文件1 文件2     # 存多个文件
git add .               # 存当前目录所有修改（小心！）
```

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

## 和 Claude Code 配合的 3 个关键场景

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

确认只改了该改的地方，没有多改、少改、改错。

### 场景三：改错了回退

- **回退单个文件**：`git checkout -- 文件名` — 放弃这个文件的所有未存档修改
- **回退全部未存档修改**：`git stash` — 把所有没存的东西暂存起来，工作区恢复干净
- **读回 stash 里的东西**：`git stash pop` — 把暂存的修改拿回来

学会 `git stash` 你就敢让 AI 随便改了——大不了 `git stash` 回到干净状态。

## 常见坑

**1. `git add .` 存进了不该存的文件**

比如 API key 文件、密码文件。解决：在项目根目录建一个 `.gitignore` 文件，把不想存的文件名写进去，一行一个。

```
# .gitignore 示例
.env
secret.txt
node_modules/
```

**2. commit message 写"修改"、"更新"**

没用。一个月后自己都看不懂。花 5 秒写清楚改了啥。

**3. 忘记 `git add` 直接 `git commit`**

什么都没存进去。习惯性在 `git commit` 前跑一次 `git status` 确认。

**4. 不知道怎么回退就不敢让 AI 改代码**

学会 `git stash` 就够了。改之前 `git stash` 存一下当前进度，改乱了 `git stash pop` 恢复。注意：`git stash` 保存的是未提交的改动——如果你想回退 AI 已经做了的修改，用 `git checkout -- <文件名>` 更直接。

## Checkpoint：动手试试

打开终端，复制粘贴下面每一行，一行一行跑：

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

跑完后你应该看到两个存档记录。这就学会了 Git 最核心的操作。

继续阅读：[通用环境基础设施](/methodology/basics/) — 终端、PATH、包管理器、环境变量
