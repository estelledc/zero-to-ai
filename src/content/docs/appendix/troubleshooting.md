---
title: 常见问题排查
description: 教程中最常遇到的报错和解决方案 — 按「看到什么 → 试什么 → 为什么」结构组织
tags: [appendix]
difficulty: beginner
prerequisites: []
prev: false
next: false
relatedContent:
  - { slug: 'claude-code/quickstart', label: '10 分钟上手 Claude Code' }
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
  - { slug: 'claude-code/agnes-free-vibe-coding', label: '零成本 vibe coding' }
lastVerified: '2026-06-24'
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

如果仍然找不到，确认安装是否成功：

```bash
npm list -g @anthropic-ai/claude-code
```

没有输出？重新安装：`npm install -g @anthropic-ai/claude-code`。

**根因**：npm 全局安装把可执行文件放到一个目录里，但当前终端窗口的 PATH 还没更新。重新打开终端或 `source` 配置文件让 PATH 生效。

详细说明 → [通用环境基础设施](/methodology/basics/)

### `command not found: npm` / `command not found: node`

**症状**：安装 Claude Code 的第一步就卡住了。

**快速修复**：

```bash
# macOS（需要先装 Homebrew，见下方说明）
brew install node

# Windows
winget install OpenJS.NodeJS.LTS

# 验证
node --version
npm --version
```

macOS 没装 Homebrew？先装它：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

装完后关掉终端重开，再 `brew install node`。

**根因**：Node.js 不是操作系统自带的。Claude Code 是一个 npm 包，需要 Node.js 运行环境。

详细说明 → [通用环境基础设施](/methodology/basics/)

### `ANTHROPIC_API_KEY not set`

**症状**：启动 `claude` 后提示 API Key 没有设置。

**快速修复**：

```bash
# 确认当前终端有没有这个变量
echo $ANTHROPIC_API_KEY

# 没有输出？设置它
export ANTHROPIC_API_KEY="你的-API-Key"
```

如果每次开新终端都要重设，写入配置文件：

```bash
echo 'export ANTHROPIC_API_KEY="你的-API-Key"' >> ~/.zshrc
```

**根因**：`export` 只在当前终端窗口有效。写入 `~/.zshrc`（或 `~/.bashrc`）才能持久化。

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

### 免费模型（Agnes）配置后不生效

**症状**：设置了 Agnes 的环境变量，但 Claude Code 仍然调用 Anthropic 官方模型，或者报错。

**快速修复**：

```bash
# 逐个检查环境变量
echo $ANTHROPIC_AUTH_TOKEN
echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_MODEL

# 直接测试 API 连通性
curl -s https://apihub.agnes-ai.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_AUTH_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"model":"agnes-2.0-flash","max_tokens":10,"messages":[{"role":"user","content":"Say OK"}]}'
```

**根因**：通常是变量名拼错（`ANTHROPIC_AUTH_TOKEN` 不是 `ANTHROPIC_API_KEY`）、URL 没设、或模型名不精确匹配。

详细说明 → [零成本 vibe coding](/claude-code/agnes-free-vibe-coding/)

## 成本相关

### 月底账单比预期高

**症状**：用了一个月发现 API 费用比想象的高。

**快速修复**：

- 每次对话结束前输入 `/usage` 看费用
- 简单任务切 Haiku：`claude --model claude-haiku-4-5`
- 遵守 2 小时规则——超过 2 小时的对话每轮 input token 可能是新对话的 5-10 倍

**根因**：Claude 每轮都要把完整对话历史重新读一遍（这是 input token 的来源）。对话越长，每轮消耗越大。加上默认用 Sonnet 模型，简单任务也在吃高价 token。

详细说明 → [成本与计费](/claude-code/cost/)

## 还是解决不了？

- 检查你正在看的教程页面的「常见坑」段落——那里有更具体的场景
- 在 [GitHub Discussions](https://github.com/estelledc/zero-to-ai/discussions) 提问，附上报错信息和你的操作系统版本
