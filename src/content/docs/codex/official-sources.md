---
title: Codex 官方资料索引
description: 按问题类型定位 OpenAI 官方 Codex 文档，并理解本站的版本与复核边界
tags: [codex, official-docs, reference]
difficulty: beginner
relatedContent:
  - { slug: 'codex/index', label: 'Codex 零基础路线' }
  - { slug: 'codex/troubleshooting', label: 'Codex 故障排查' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

Codex 更新很快。本站负责把稳定的学习流程讲清楚，命令和能力边界仍以 OpenAI 官方文档和你本机 `--help` 为准。本站不会复制整页官方原文，也不会用 Claude Code 的行为替代 Codex 证据。

## 按问题找来源

| 你要确认什么                  | 一手来源                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| 安装、启动、第一次任务        | [Codex CLI](https://developers.openai.com/codex/cli)                                       |
| ChatGPT / API key 登录        | [Authentication](https://developers.openai.com/codex/auth)                                 |
| 当前方案、额度和 API 计费边界 | [Pricing](https://developers.openai.com/codex/pricing)                                     |
| `AGENTS.md` 查找与覆盖顺序    | [Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md) |
| sandbox、审批和网络边界       | [Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security)      |
| Windows WSL2                  | [WSL](https://learn.chatgpt.com/docs/windows/wsl)                                          |
| 安装、Git、任务卡住等问题     | [Troubleshooting](https://learn.chatgpt.com/docs/reference/troubleshooting)                |
| CLI 参数是否仍存在            | `codex --help`、`codex login --help`、`codex exec --help`                                  |

## 本站验证口径

- 官方页面复核日期：2026-07-10。
- 教程版本范围：Codex CLI v0.144.x。
- 本地命令契约：在 `codex-cli 0.144.0-alpha.4` 检查 `--version` 和三个 `--help` 输出；不调用模型、不消耗账户额度。
- 登录、付费、组织权限和 GitHub Pages 发布仍需人工验收。
- 官方页面或本地 CLI 与本站冲突时，先暂停操作，在 Issue 中附脱敏版本与链接，不要猜测。

## 如何复核一个变化

1. 运行 `codex --version`，记录具体版本。
2. 用对应 `--help` 确认命令是否存在。
3. 在上表中找到官方页面，确认认证、权限或平台边界。
4. 用无敏感数据的测试仓库做最小验证。
5. 更新教程的 `lastVerified`、版本范围、官方资料矩阵和 Changelog。

## Checkpoint

- 你知道定价变化要查 Pricing，而不是引用旧截图。
- 你知道 CLI 参数先用本机 `--help` 复核。
- 你知道官方文档与教程冲突时应保留版本证据并暂停高风险操作。
