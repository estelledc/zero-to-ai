---
title: 常见问题排查
description: 教程中最常遇到的报错和解决方案 — 按「看到什么 → 试什么 → 为什么」结构组织
tags: [appendix]
difficulty: beginner
prerequisites: []
relatedContent:
  - { slug: 'claude-code/quickstart', label: '10 分钟上手 Claude Code' }
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
  - { slug: 'claude-code/agnes-free-vibe-coding', label: '第三方兼容实验边界' }
lastVerified: '2026-07-10'
---

## 这页是什么

各教程的「常见坑」段落收录了该篇场景下的典型错误。这一页把**跨教程**、**最高频**的问题集中到一处，方便你遇到报错时直接来这里查。

每个问题的结构：你看到了什么（症状）→ 先试什么（快速修复）→ 为什么会这样（根因）。

## 安装与环境

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

macOS/Linux 原生安装通常位于 `~/.local/bin/claude`。先确认该目录在 `PATH` 中；仍失败时按[官方安装页](https://code.claude.com/docs/en/installation)重新执行对应平台的原生安装命令。不要同时保留原生、Homebrew 和旧 npm 全局安装。

**根因**：安装文件存在，但当前终端的 `PATH` 没包含它所在的目录，或机器上并存了多个安装来源。

详细说明 → [通用环境基础设施](/methodology/basics/)

### 旧教程要求 npm / Node.js

**症状**：你看到旧教程要求先安装 Node.js，再执行 npm 全局安装。

**快速修复**：

**快速修复**：回到[10 分钟上手](/claude-code/quickstart/)选择 macOS/Linux/WSL、PowerShell 或 CMD 的官方原生安装命令。当前原生安装不要求你先为 Claude Code 安装 Node.js；只有你自己的项目需要 npm 时，才单独安装 Node.js。

**根因**：npm 曾是 Claude Code 的安装方式，旧页面仍可能保留该路径。把“项目依赖需要 Node.js”和“Claude Code 本身安装”混在一起，会给初学者增加无关前置步骤。

详细说明 → [通用环境基础设施](/methodology/basics/)

### 登录后仍提示认证失败

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

## 使用过程

### Claude 回复越来越差 / 开始「忘事」

**症状**：聊了一段时间后，Claude 的回复质量明显下降，开始重复、跑题、或者忘记前面说过的内容。

**快速修复**：

- 如果还在做同一个任务：输入 `/compact`，压缩对话历史
- 如果要切换任务：输入 `/clear`，清空上下文重新开始

**根因**：上下文窗口（context window）有容量上限。对话越长，早期内容被挤出窗口的概率越大。这是模型的物理限制，不是 bug。

详细说明 → [上下文窗口管理](/claude-code/context/)

### Claude 改错了代码 / 改了不该改的文件

**症状**：让 Claude 改一个文件，结果它连带改了别的文件，或者改法不对。

**快速修复**：

```bash
# 回退单个文件
git restore 文件名

# 回退所有未提交修改
git stash
```

以后养成习惯：让 AI 动手之前先 `git commit`，改完用 `git diff` 检查。

**根因**：AI 对代码库的理解可能不完整。第一次接触你的项目时，它对命名习惯、文件组织、依赖关系的了解是空白的。给反馈让它重新来，第二次通常好很多。

详细说明 → [Git 10 分钟速成](/appendix/git-basics/)

### 第三方兼容网关配置后不生效

**症状**：设置第三方网关变量后，Claude Code 仍使用原认证入口，或出现模型、认证和工具调用错误。

**快速修复**：

不要继续往全局 shell 配置追加变量。先在 Claude Code 运行 `/status`，再到提供方控制台核对请求和模型；无法确认时清除第三方 base URL/token 并恢复官方认证。

**根因**：第三方网关只保证它声明的 API 子集，不保证 Claude Code 全部产品行为；价格、模型映射和认证变量也可能随提供方变化。

详细说明 → [第三方兼容实验边界](/claude-code/agnes-free-vibe-coding/)

## 成本相关

### 月底账单比预期高

**症状**：用了一个月发现 API 费用比想象的高。

**快速修复**：

- 先用 `/status` 确认自己走订阅还是 API 认证
- API 用户用 `/usage` 看本地估算，再到 Claude Console 对账
- 订阅用户查看方案用量；不要把会话里的估算金额当成订阅外账单
- 用 `/context` 找出不需要的 MCP 工具或冗余上下文，跨任务时 `/clear`

**根因**：认证入口、模型、输入/输出 token、缓存和工具上下文都会影响用量。固定“每月多少钱”或“聊多久一定贵几倍”都不是可靠结论；先确认入口，再用实际任务建立基线。

详细说明 → [成本与计费](/claude-code/cost/)

## 还是解决不了？

- 检查你正在看的教程页面的「常见坑」段落——那里有更具体的场景
- 在 [GitHub Discussions](https://github.com/estelledc/zero-to-ai/discussions) 提问，附上报错信息和你的操作系统版本
