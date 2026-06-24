---
title: 零成本 vibe coding — Claude Code + Agnes 免费模型
description: 用 Claude Code 免费写代码。注册 Agnes AI 获取免费 API Key，2 行配置把 Claude Code 的后端切到 Agnes，零费用开始 vibe coding。
tags: [claude-code, agnes-ai]
difficulty: beginner
prerequisites:
  - claude-code/quickstart
relatedContent:
  - { slug: 'claude-code/config', label: '核心配置' }
  - { slug: 'claude-code/cost', label: '成本与计费' }
  - { slug: 'claude-code/verify', label: '验证方法论' }
  - { slug: 'claude-code/quickstart', label: '10 分钟上手' }
  - { slug: 'claude-code/context', label: '上下文窗口管理' }
lastVerified: '2026-06-24'
toolVersion: 'Claude Code CLI v2.1'
prev: false
next: false
---

## 这是什么

Claude Code 默认用 Anthropic 官方的 Claude 模型，按 token 收费。对于零基础学习者，刚开始探索时不确定“这工具到底适不适合我”，先花钱再体验有心理压力。

Agnes AI 是一个**完全免费**的 AI API 平台。它的 `agnes-2.0-flash` 模型支持 Anthropic Messages API 格式——这意味着 Claude Code 可以直接把它当后端用。零成本、零绑卡，只需要一个邮箱。

本文教你：**用 Claude Code 的界面和功能，跑 Agnes 的免费模型**。学会之后，你可以随时在“免费模式（Agnes）”和“高性能模式（Claude）”之间切换。

## 类比

Claude Code 是一辆车，Anthropic 官方模型是付费汽油，Agnes 是免费充电桩。车还是那辆车（Claude Code 的终端界面、代码理解、工具调用能力都在），只是动力来源换了。免费充电桩输出功率低一些（思考深度不如 Claude），但日常通勤完全够用。

## 实际操作

### 1. 注册 Agnes AI 获取 API Key

打开 [platform.agnes-ai.com](https://platform.agnes-ai.com)，用邮箱注册。

注册后在平台上创建一个 API Key。你会得到一个长字符串，格式如 `sk-xxxxxxxxxx...`。**复制保存好，只显示一次。**

> 不需要绑信用卡，不需要任何付费。截至 2026 年 6 月，Agnes 对全部模型提供免费访问（政策可能变化，以官网为准）。

### 2. 配置 Claude Code 使用 Agnes

打开终端，执行两条命令：

```bash
# 把 YOUR_AGNES_KEY 替成你第 1 步拿到的 key
export ANTHROPIC_AUTH_TOKEN="你的Agnes API Key"
export ANTHROPIC_BASE_URL="https://apihub.agnes-ai.com"
```

> 不确定用哪个变量名？两个都设置一下：`export ANTHROPIC_API_KEY="$ANTHROPIC_AUTH_TOKEN"`。这样不管 Claude Code 版本读哪个都能找到。

解释：

- `ANTHROPIC_AUTH_TOKEN`：原本填 Anthropic 的 key，现在填 Agnes 的 key
- `ANTHROPIC_BASE_URL`：告诉 Claude Code 去哪里调用模型。Agnes 的 Anthropic 兼容端点就是 `https://apihub.agnes-ai.com`

### 3. 指定用 Agnes 的模型

Claude Code 默认会尝试调用当前版本的默认模型（如 `claude-sonnet-4`）等 Anthropic 模型名，但 Agnes 的模型叫 `agnes-2.0-flash`。需要多设置一个环境变量：

```bash
export ANTHROPIC_MODEL="agnes-2.0-flash"
```

如果你用到了 Claude Code 的自动模型切换功能（比如它自动把大任务分给 Opus、小任务给 Haiku），也需要覆盖这些：

```bash
export ANTHROPIC_DEFAULT_OPUS_MODEL="agnes-2.0-flash"
export ANTHROPIC_DEFAULT_SONNET_MODEL="agnes-2.0-flash"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="agnes-1.5-flash"
```

全部设置生效后，像往常一样输入 `claude` 启动——Claude Code 已经在用 Agnes 的免费模型了。

### 4. 验证是否生效

启动 Claude Code 后，输入这句 prompt：

```text
What model are you using? Reply with just the model name.
```

如果回复 `agnes-2.0-flash`，说明配置成功。

也可以输入 `/status` 查看当前模型信息。

### 5. 永久保存配置（可选）

上面的 `export` 命令只在当前终端窗口有效。想让配置永久生效，写入 `~/.zshrc`：

```bash
cat >> ~/.zshrc << 'EOF'

# Claude Code → Agnes AI（免费模式）
export ANTHROPIC_AUTH_TOKEN="你的Agnes API Key"
export ANTHROPIC_BASE_URL="https://apihub.agnes-ai.com"
export ANTHROPIC_MODEL="agnes-2.0-flash"
export ANTHROPIC_DEFAULT_OPUS_MODEL="agnes-2.0-flash"
export ANTHROPIC_DEFAULT_SONNET_MODEL="agnes-2.0-flash"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="agnes-1.5-flash"
EOF
```

关掉终端重开，或执行 `source ~/.zshrc`，就能永久使用。

### 6. 在免费和付费之间切换

**切回 Anthropic Claude（付费）**：

```bash
unset ANTHROPIC_BASE_URL
export ANTHROPIC_AUTH_TOKEN="你的Anthropic API Key"
```

**切到 Agnes（免费）**：

```bash
export ANTHROPIC_BASE_URL="https://apihub.agnes-ai.com"
export ANTHROPIC_AUTH_TOKEN="你的Agnes API Key"
```

> 提示：如果你已经装了 [CC Switch](https://ccswitch.io)（一个桌面端 provider 管理器），可以在图形界面中一键切换，不用记这些命令。

## Agnes 免费模型能做什么

| 场景                   | 能不能做 | 备注                                               |
| ---------------------- | :------: | -------------------------------------------------- |
| 日常问答、解释概念     |    能    | 反应快，适合学习                                   |
| 写代码片段、函数       |    能    | 简单函数质量不错                                   |
| 读项目、理解代码结构   |    能    | 256K [上下文](/claude-code/context/)，能读很大项目 |
| 写文件、跑命令、改 bug |    能    | tool calling 实测可用                              |
| 复杂多步重构           |   一般   | 思考深度不如 Claude，可能需要多轮对话              |
| 生成图片（文生图）     |    能    | 用 `agnes-image-2.1-flash`，但需要单独调 API       |
| 生成视频               |    能    | 用 `agnes-video-v2.0`，异步生成，需等待            |
| 深度推理、数学证明     |  不太行  | 免费模型的推理能力弱于 Claude Opus                 |

**免费的代价**：Agnes 免费模型在推理深度、代码生成质量和多步任务的连贯性上不如 Claude 官方模型。如果你发现 Agnes 在某个任务上反复出错或给出低质量结果，这可能不是你的 prompt 问题——而是模型能力的天花板。这时候切回 Claude 官方模型（参考上面第 6 步）是正确的选择，不要在免费模型上死磕。

## 常见坑

- **`ANTHROPIC_AUTH_TOKEN` 不是 `ANTHROPIC_API_KEY`**：注意变量名。Agnes 提供商配置使用 `ANTHROPIC_AUTH_TOKEN`（注意不是标准的 `ANTHROPIC_API_KEY`），网上很多老教程写的 `ANTHROPIC_API_KEY` 也能用，但建议用前者。
- **模型名必须精确匹配**：`agnes-2.0-flash`，不能写成 `agnes-2.0` 或 `agnes2.0flash`。
- **免费模型有速率限制**：Agnes 对免费用户有请求频率限制。如果频繁报错 429（Too Many Requests），等几秒再试。
- **Thinking 模式在 Claude Code 中不生效**：`agnes-2.0-flash` 支持 Thinking，但 Claude Code 的 Anthropic 客户端不会自动传 `chat_template_kwargs` 参数。如果追求思考深度，用 Anthropic 官方 Claude 模型。
- **恢复 Anthropic 官方**：如果哪天切不回来，`unset ANTHROPIC_BASE_URL` 然后重设 `ANTHROPIC_AUTH_TOKEN` 为 Anthropic key。

## 遇到问题的排查顺序

1. `echo $ANTHROPIC_AUTH_TOKEN` — 确认 key 已设置。输出为空？重新 export。
2. `echo $ANTHROPIC_BASE_URL` — 确认 `https://apihub.agnes-ai.com` 已设置。
3. `curl -s https://apihub.agnes-ai.com/v1/messages -H "x-api-key: $ANTHROPIC_AUTH_TOKEN" -H "anthropic-version: 2023-06-01" -H "Content-Type: application/json" -d '{"model":"agnes-2.0-flash","max_tokens":10,"messages":[{"role":"user","content":"Say OK"}]}'` — 直接测试 API 是否连通。
4. 如果 API 返回 401 — key 有问题，回 Agnes 平台重新生成。
5. 如果 API 返回 200 但 Claude Code 报错 — 检查模型名是否拼写正确。

## Checkpoint

确认你的免费配置已经生效：

1. 启动 Claude Code 后问 "What model are you using?"，回复中包含 `agnes`
2. 你能让 Claude 创建一个文件（比如 `帮我创建一个 hello.html`）
3. 你知道怎么在 Agnes（免费）和 Anthropic（付费）之间切换

## 下一步

- 现在已经零成本开始 vibe coding，建议快速浏览[验证方法论](/claude-code/verify/)——AI 写的代码你要会验证
- 想深入定制 Claude Code？看[核心配置](/claude-code/config/)中的 settings.json
- 遇到复杂任务觉得 Agnes 不够用？随时切回 Anthropic 官方 Claude——参考上面第 6 步的切换命令
