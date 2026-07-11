---
title: 常见问题排查
description: 跨教程高频报错手册 — 按严重程度排列，含 Claude Code、Codex、Git 与发布
tags: [appendix]
difficulty: beginner
prerequisites: []
relatedContent:
  - { slug: 'claude-code/quickstart', label: '10 分钟上手 Claude Code' }
  - { slug: 'codex/troubleshooting', label: 'Codex 故障排查' }
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
  - { slug: 'claude-code/agnes-free-vibe-coding', label: '第三方兼容实验边界' }
  - { slug: 'projects/publish-first-site', label: '发布第一个小站' }
lastVerified: '2026-07-10'
---

## 这是什么

各教程的「常见坑」段落收录了该篇场景下的典型错误。这一页把**跨教程**、**最高频**的问题集中到一处，方便你遇到报错时直接来这里查。

条目按**严重程度**排列：先处理「完全跑不起来 / 会伤文件」，再处理「能用但质量差 / 账单异常」。每个问题的结构：你看到了什么（症状）→ 先试什么（快速修复）→ 为什么会这样（根因）。

> **Codex 专属深排障**
>
> 安装、登录、权限、看错目录等 Codex 细节，优先看 [Codex 故障排查](/codex/troubleshooting/)。本页只收跨工具也会撞上、或需要和 Claude 路径对照的条目。

## 开始之前：先保留现场

不要一报错就重装或删仓库。先记下：

1. 完整报错原文（可截断中间重复行，保留首尾）
2. 操作系统：macOS / Linux / 原生 Windows / WSL2
3. 你执行的命令与当前目录（`pwd` / `Get-Location`）
4. 工具版本（若有）：`claude --version` 或 `codex --version`、`git --version`
5. 分享前脱敏：去掉 API key、token、邮箱、内部路径中的真实用户名

## 阻塞：装不上 / 找不到命令

### `command not found: claude`

**症状**：安装完 Claude Code 后输入 `claude`，终端提示 `command not found`。

**快速修复**：

```bash
# 方法 1：关掉终端重新打开
# 方法 2：手动刷新 PATH
source ~/.zshrc    # macOS/Linux (zsh)
source ~/.bashrc   # macOS/Linux (bash)
```

如果仍然找不到，运行官方诊断：

```bash
claude doctor
```

macOS/Linux 原生安装通常位于 `~/.local/bin/claude`。先确认该目录在 `PATH` 中；仍失败时按 [官方安装页](https://code.claude.com/docs/en/installation) 重新执行对应平台的原生安装命令。不要同时保留原生、Homebrew 和旧 npm 全局安装。

**根因**：安装文件存在，但当前终端的 `PATH` 没包含它所在的目录，或机器上并存了多个安装来源。

详细说明 → [通用环境基础设施](/methodology/basics/)

### `codex: command not found`

**症状**：按 Codex 教程安装后，终端提示找不到 `codex`。

**快速修复**：

1. 重开终端后再试 `codex --version`
2. 确认安装环境与当前终端一致：在 **WSL** 里装的 `codex`，不能当作 **PowerShell** 命令
3. Windows 在 WSL 内运行 `echo $WSL_DISTRO_NAME` 确认你在 WSL2（Codex 新版本不支持 WSL1）
4. 仍失败：回到 [Codex 快速开始](/codex/quickstart/) 用官方安装器重装，不要从陌生镜像下二进制

**根因**：PATH 未刷新，或原生 Windows 与 WSL 混用。

详细说明 → [Codex 故障排查](/codex/troubleshooting/)

### 旧教程要求 npm / Node.js

**症状**：你看到旧教程要求先安装 Node.js，再执行 npm 全局安装 Claude Code。

**快速修复**：回到 [10 分钟上手](/claude-code/quickstart/) 选择 macOS/Linux/WSL、PowerShell 或 CMD 的官方原生安装命令。当前原生安装不要求你先为 Claude Code 安装 Node.js；只有你自己的项目需要 npm 时，才单独安装 Node.js。

**根因**：npm 曾是 Claude Code 的安装方式，旧页面仍可能保留该路径。把「项目依赖需要 Node.js」和「Claude Code 本身安装」混在一起，会给初学者增加无关前置步骤。

详细说明 → [通用环境基础设施](/methodology/basics/)

## 阻塞：认证 / 额度不对

### 登录后仍提示认证失败（Claude Code）

**症状**：你已用订阅账号登录，但 Claude Code 仍提示 API key 无效、余额不足或认证失败。

**快速修复**：

在 Claude Code 中运行 `/status`，确认当前认证来源。若你想使用订阅登录，但环境中残留了 API key，取消它后重启：

```bash
# macOS / Linux / WSL
unset ANTHROPIC_API_KEY
```

PowerShell 使用 `Remove-Item Env:ANTHROPIC_API_KEY`。

**根因**：API key 认证优先于订阅登录。环境变量里残留的失效 key 会覆盖已登录的订阅会话。若你本来就使用 Claude Console API，再在当前终端设置 key，并以 Console 账单为准；不要把 key 写进仓库、截图或公开 Issue。

详细说明 → [10 分钟上手](/claude-code/quickstart/)

### Codex 登录失败或额度不对

**症状**：`codex` 能启动，但登录失败、或用量与预期的 ChatGPT 订阅不符。

**快速修复**：

```bash
codex login status
codex logout
codex login
```

若走 API key：按 [Codex 快速开始](/codex/quickstart/) 使用 `codex login --with-api-key` 一类官方流程；**不要**把 key 粘进 Issue 或聊天。API key 按 API 用量计费，不会继承 ChatGPT 订阅额度。

**根因**：ChatGPT 订阅与 API key 是两条入口；混用或残留旧登录状态会导致「以为在用订阅、实际在走 API」。

详细说明 → [Codex 故障排查](/codex/troubleshooting/)

## 高：会改错地方 / 伤文件

### Claude 或 Codex 改错了代码 / 改了不该改的文件

**症状**：让 AI 改一个文件，结果它连带改了别的文件，或者改法不对。

**快速修复**：

```bash
# 回退单个文件的未提交修改
git restore 文件名

# 暂存所有未提交修改（可稍后 git stash pop）
git stash
```

以后养成习惯：让 AI 动手之前先 `git commit`，改完用 `git diff` 检查。已提交的坏改动优先 `git revert`，不要直接删仓库。

**根因**：AI 对代码库的理解可能不完整；工作目录也可能不对。

详细说明 → [Git 10 分钟速成](/appendix/git-basics/)

### Codex 看错项目目录

**症状**：Codex 在错误文件夹里改文件，或列出的顶层文件根本不是你的项目。

**快速修复**：退出会话，在普通终端确认目录后再启动：

```bash
pwd
git rev-parse --show-toplevel
git status --short
```

切到正确目录后重新运行 `codex`。也可使用 `codex -C <目录>` 明确工作根目录。可先发只读核对：

```text
先不要改文件。告诉我当前工作目录的绝对路径，并列出顶层文件名。
```

**根因**：会话继承了错误 cwd，或从错误终端启动。

详细说明 → [Codex 故障排查](/codex/troubleshooting/)

## 中：能用但质量差 / 发布失败

### Claude 回复越来越差 / 开始「忘事」

**症状**：聊了一段时间后，Claude 的回复质量明显下降，开始重复、跑题、或者忘记前面说过的内容。

**快速修复**：

- 如果还在做同一个任务：输入 `/compact`，压缩对话历史
- 如果要切换任务：输入 `/clear`，清空上下文重新开始

**根因**：上下文窗口（context window）有容量上限。对话越长，早期内容被挤出窗口的概率越大。这是模型的物理限制，不是 bug。

详细说明 → [上下文窗口管理](/claude-code/context/)

### GitHub Pages 404 或样式丢失

**症状**：本地 `index.html` 正常，公开 URL 404，或线上 CSS/图片全丢。

**快速修复**：

1. 确认仓库为**公开**，Settings → Pages 的 source 为 `main` + `/ (root)`
2. 根目录文件名必须是小写 `index.html`（大小写敏感）
3. 打开 Actions，等 Pages workflow 变绿后再访问
4. 项目站资源路径用 `./style.css`，不要用从域名根开始的 `/style.css`

**根因**：push ≠ 已发布；项目站位于 `/<仓库名>/` 子路径。

详细说明 → [把第一张个人页面发布成小站](/projects/publish-first-site/)

### 第三方兼容网关配置后不生效

**症状**：设置第三方网关变量后，Claude Code 仍使用原认证入口，或出现模型、认证和工具调用错误。

**快速修复**：

不要继续往全局 shell 配置追加变量。先在 Claude Code 运行 `/status`，再到提供方控制台核对请求和模型；无法确认时清除第三方 base URL/token 并恢复官方认证。

**根因**：第三方网关只保证它声明的 API 子集，不保证 Claude Code 全部产品行为；价格、模型映射和认证变量也可能随提供方变化。

详细说明 → [第三方兼容实验边界](/claude-code/agnes-free-vibe-coding/)

## 低：成本与预期不符

### 月底账单比预期高（Claude）

**症状**：用了一个月发现 API 费用比想象的高。

**快速修复**：

- 先用 `/status` 确认自己走订阅还是 API 认证
- API 用户用 `/usage` 看本地估算，再到 Claude Console 对账
- 订阅用户查看方案用量；不要把会话里的估算金额当成订阅外账单
- 用 `/context` 找出不需要的 MCP 工具或冗余上下文，跨任务时 `/clear`

**根因**：认证入口、模型、输入/输出 token、缓存和工具上下文都会影响用量。固定「每月多少钱」或「聊多久一定贵几倍」都不是可靠结论；先确认入口，再用实际任务建立基线。

详细说明 → [成本与计费](/claude-code/cost/)

### Codex 用量与预期不符

**症状**：以为在用 ChatGPT 订阅额度，实际消耗像 API；或短任务耗额度异常。

**快速修复**：运行 `codex login status` 确认入口；对照 [Codex 快速开始](/codex/quickstart/) 的计费说明；缩小任务范围、避免无意义的大仓库全量扫描。不要把 key 或账单截图里的敏感信息发到公开讨论区。

**根因**：入口混用，或任务上下文过大。

详细说明 → [Codex 故障排查](/codex/troubleshooting/)

## 升级求助清单

本页与专页都试过仍失败时，按下面清单发帖（缺一项都会拖慢回复）：

- □ 操作系统与终端类型（macOS Terminal / WSL2 Ubuntu / PowerShell 等）
- □ 工具与版本（`claude --version` 或 `codex --version`、`git --version`）
- □ 你执行的**完整命令**与 `pwd` 结果
- □ **完整报错原文**（已脱敏）
- □ 你已经试过的修复（例如「重开终端」「unset API key」「换 Pages source」）
- □ 相关教程 slug（如 `claude-code/quickstart`、`codex/first-task`、`projects/publish-first-site`）

发到 [GitHub Discussions](https://github.com/estelledc/zero-to-ai/discussions)。不要只发「不行了」。

## Checkpoint

- □ 你知道先保留现场，再按严重程度处理
- □ Claude 找不到命令 → PATH / `claude doctor`；Codex 找不到 → 终端与安装环境是否一致
- □ 改错文件 → `git restore` / `stash`，而不是删仓库
- □ Pages 问题 → 公开仓库 + Actions + 子路径资源
- □ 仍失败时，升级求助清单六项能填齐

## 下一步

- Claude 安装与登录：回 [10 分钟上手](/claude-code/quickstart/)
- Codex 专属排障：去 [Codex 故障排查](/codex/troubleshooting/)
- Git 回退不会：去 [Git 10 分钟速成](/appendix/git-basics/)
- 发布卡点：去 [把第一张个人页面发布成小站](/projects/publish-first-site/)
- 环境基础：去 [通用环境基础设施](/methodology/basics/)
