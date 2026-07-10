---
title: 成本与计费
description: 分清订阅额度和 API token 账单，用官方数据建立自己的成本基线
tags: [claude-code]
difficulty: beginner
prerequisites:
  - claude-code/quickstart
relatedContent:
  - { slug: 'claude-code/context', label: '上下文窗口管理' }
  - { slug: 'claude-code/mcp', label: 'MCP 集成' }
  - { slug: 'claude-code/agnes-free-vibe-coding', label: 'Agnes 第三方兼容路线' }
  - { slug: 'claude-code/quickstart', label: '10 分钟上手' }
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
---

## 这是什么

成本像手机套餐：先分清你用的是“包月额度”还是“按流量计费”，再谈怎么省。把两种入口混在一起，是 Claude Code 成本教程最常见的错误。

## 两种官方计费入口

| 入口                                 | 怎么认证                        | `/usage` 里的金额意味着什么                                    | 去哪里核对                                                           |
| ------------------------------------ | ------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| Claude Pro / Max / Team / Enterprise | 浏览器登录                      | token 和活动统计可用于理解用量；订阅已包含的使用不按该金额结算 | [Claude 方案与价格](https://www.anthropic.com/pricing)               |
| Claude Console API                   | `ANTHROPIC_API_KEY` 等 API 认证 | 当前会话 token 的本地费用估算；最终账单以 Console 为准         | [Claude Console Usage](https://console.anthropic.com/settings/usage) |

第三方兼容网关由提供方决定价格、限额和可用性，不要把它的“免费”或“包月”结论写成 Claude Code 本身的承诺。

## Token 怎么变成费用

API 账单的基本公式是：

```text
费用 = 输入 token × 输入单价 + 输出 token × 输出单价 + 缓存相关费用
```

不同模型、缓存写入和缓存命中的单价不同，而且会调整。不要把某天的价格表记成永久常量；计算时打开 [Anthropic 模型定价](https://docs.anthropic.com/en/docs/about-claude/pricing)，把当日单价代入。

### 一个不冒充真实账单的练习

假设某模型每百万输入 token 单价为 `I`，每百万输出 token 单价为 `O`；一次任务用了 80,000 输入 token 和 8,000 输出 token：

```text
估算费用 = 0.08 × I + 0.008 × O
```

这里的 `I`、`O` 必须从官方当日价格取得。练习的重点是会算，不是背一个会过期的数字。

## 怎么看自己的真实基线

在 Claude Code 中运行：

```text
/usage
```

- API 用户：看 Session 区块的 token 和本地费用估算，再到 Claude Console 对账。
- 订阅用户：看方案用量条、活动统计和来源拆分；Session 金额不代表订阅外一定会被收取的账单。
- 多设备用户：本机统计不会自动代表其他设备或 claude.ai 的全部使用。

记录 5 个真实工作日，比猜“轻度/中度/重度用户月均多少钱”更可靠：每天记认证入口、主要任务、模型、`/usage` 摘要和是否发生返工。第五天再决定是否需要换模型或改工作方式。

## 五条可验证的控制方法

1. **跨任务时 `/clear`**：无关旧上下文会在后续每轮重复消耗 token。
2. **长任务主动 `/compact`**：可以附上要保留的重点，例如 `/compact Focus on test output and code changes`。
3. **用 `/model` 选择合适模型**：日常任务先用能稳定完成任务的较低成本模型，复杂架构再升级。
4. **用 `/context` 检查占用**：不用的 MCP server 应禁用；工具定义和额外上下文都会增加成本。
5. **把任务和验收条件说具体**：模糊的“改进整个项目”会触发广泛扫描，具体文件和测试目标能减少无效探索。

## 常见误区

- **错误认知：`/usage` 显示的钱就是所有人的最终账单** → 订阅与 API 用户含义不同，API 最终以 Console 为准。
- **错误认知：便宜模型一定更省** → 如果需要多轮返工，总成本可能更高；用真实任务数据判断。
- **错误认知：多装 MCP 没有成本** → Claude Code 会延迟加载工具定义，但启用的集成仍可能占用上下文；用 `/context` 实测。
- **错误认知：固定月均值可以长期复用** → 模型、价格、缓存与方案都会变化，教程应给公式和官方入口。

## Checkpoint

1. 运行 `/status`，确认自己使用订阅登录还是 API 认证。
2. 运行 `/usage`，指出哪些数字是本机估算、哪里才是权威账单。
3. 打开官方定价页，用当天单价完成上面的 `0.08 × I + 0.008 × O` 练习。
4. 写下未来 5 个工作日要记录的最小字段，建立自己的成本基线。

## 下一步

- 学[上下文窗口管理](/claude-code/context/)，把 `/clear`、`/compact` 和 checkpoint 用到真实任务。
- 使用第三方兼容网关前，阅读 [Agnes 兼容路线](/claude-code/agnes-free-vibe-coding/)的认证优先级与恢复步骤。

官方依据（复核于 2026-07-10）：[Claude Code 成本管理](https://code.claude.com/docs/en/costs)、[Anthropic 模型定价](https://docs.anthropic.com/en/docs/about-claude/pricing)。
