---
title: 第一次只读任务
description: 在项目目录启动 Codex，先理解项目、限定范围并把完成标准写清楚
tags: [codex, prompt, beginner]
difficulty: beginner
prerequisites:
  - codex/quickstart
relatedContent:
  - { slug: 'methodology/prompt-anatomy', label: 'Prompt 的结构' }
  - { slug: 'codex/agents-md', label: '用 AGENTS.md 写项目规则' }
  - { slug: 'codex/troubleshooting', label: 'Codex 故障排查' }
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 这是什么

你已经能安装并登录 Codex。这一页故意**不改任何文件**：只让 Codex 读项目、说明现状、给出下一步最小计划。目标是验证工作目录、登录、上下文理解和沟通方式，同时练会一个可核对的 prompt。

## 类比

新同事入职第一天，最安全的任务不是「重构整个系统」，而是「读一下项目，告诉我入口、运行方式和风险」。只读任务像让新同事先参观工位、指认灭火器位置——证明「理解正确」，再进入小步修改。

## 开始之前

- 已完成 [安装、登录与成本](/codex/quickstart/)，`codex --version` 与 `codex login status` 正常
- 你会 `cd` 到一个文件夹；可选但推荐会一点 [Git](/appendix/git-basics/)
- **macOS / Linux / WSL2**：下面的 bash 命令可直接用
- **原生 Windows**：可用 PowerShell 创建目录与文件；Git 步骤相同。若你选的是 WSL 路线，请在 WSL 终端内操作，不要混用 PowerShell 路径

## 实际操作

### 1. 准备一个练习仓库

如果你还没有项目，创建一个最小目录：

**macOS / Linux / WSL：**

```bash
mkdir my-codex-project
cd my-codex-project
git init
printf '# My Codex Project\n' > README.md
git add README.md
git commit -m "创建练习仓库"
```

**Windows PowerShell（原生 Windows 路线）：**

```powershell
mkdir my-codex-project
cd my-codex-project
git init
Set-Content -Path README.md -Value "# My Codex Project"
git add README.md
git commit -m "创建练习仓库"
```

如果 `git commit` 提示未配置 user.name / user.email，先设置（可改成你的信息）：

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

然后再执行一次 `git commit`。

### 2. 启动并确认目录

```bash
codex
```

先输入 `/status`，确认显示的是当前练习目录。然后发送下面这段可复制 prompt：

```text
只读当前项目，不要修改文件、不要安装依赖。
告诉我：
1. 这个项目现在有什么文件；
2. Git 是否干净；
3. 如果下一步要做一个静态个人主页，最小计划是什么；
4. 我应该怎样验证结果。
不确定的地方明确标出来。
```

这个 prompt 包含范围、禁止项、交付物和验证方式。它比「帮我看看」更容易得到可核对的结果。

**成功标准：** Codex 能列出 `README.md`（以及你实际有的文件），并说明 Git 干净或指出差异；没有主动改文件。

### 3. 自己核对

另开一个终端（仍在同一项目目录）执行：

```bash
git status --short
```

第一次任务结束后应没有输出。若出现文件，先用 `git diff` 看内容，不要直接提交。

```bash
git diff
```

### 4. 认识最小交互命令

| 命令           | 作用                               |
| -------------- | ---------------------------------- |
| `/status`      | 查看当前会话的目录、模型与权限状态 |
| `/permissions` | 选择当前会话允许的操作范围         |
| `/model`       | 选择可用模型和推理强度             |
| `/review`      | 审查当前 Git 改动                  |
| `/init`        | 为当前项目生成 `AGENTS.md` 起点    |

选项会随版本变化；以当前 CLI 中 `?` 或官方命令参考为准。不确定某个斜杠命令是否还在时，先看界面提示，或到 [官方资料索引](/codex/official-sources/) 复核。

### 5. 失败恢复：目录错了或悄悄改了文件

**Codex 描述的文件和你看到的不一样：**

```bash
pwd
git rev-parse --show-toplevel
```

确认你在练习仓库根目录后，退出会话，重新 `cd` 到正确路径再运行 `codex`。第一次学习时优先用 `cd`，而不是急着记 `codex -C <目录>`。

**`git status --short` 出现了意外文件：**

1. 先 `git diff` 看改了什么，不要立刻 `git restore` 或删除。
2. 若确认是本次误改且未提交，可恢复单个文件，例如：

```bash
git restore README.md
git status --short
```

3. 把下一次 prompt 写得更窄：「只读，不要修改任何文件」。

更系统的排查见 [Codex 故障排查](/codex/troubleshooting/)。

## 常见坑

- **错误认知：AI 说「没有改文件」就不必检查** → `git status --short` 才是可重复的证据。失败恢复：另开终端跑 Git，有输出就先看 `git diff`。
- **错误认知：prompt 越长越好** → 关键是范围、产物、限制和验证清楚。失败恢复：删掉空话，只保留本页那四条交付物。
- **错误认知：第一次就要一次性做完整产品** → 先证明「理解正确」，再进入小步修改。失败恢复：中止大任务，改回只读 prompt。
- **错误认知：在错误目录启动也没关系** → Codex 会读错上下文。失败恢复：`/status` + `pwd`，不对就退出重开。

## Checkpoint

确认你完成了以下操作：

- □ Codex 能准确列出仓库文件和 Git 状态
- □ `git status --short` 为空（或你已看懂并处理了意外改动）
- □ 你能指出 prompt 中的范围、禁止项、交付物和验证方法
- □ 你知道 `/status` 用来确认当前目录与会话状态

全部勾上？下一步是给项目贴上可复用的规则。

## 下一步

- 下一步：[用 AGENTS.md 写项目规则](/codex/agents-md/)——让 Codex 每次进入仓库都知道边界
- 想把 prompt 写得更稳？读 [Prompt 的结构](/methodology/prompt-anatomy/)
- 目录或登录又乱了？回 [Codex 故障排查](/codex/troubleshooting/)

官方依据：[Codex CLI quickstart](https://developers.openai.com/codex/cli)。
