---
title: Codex 官方资料索引
description: 按问题类型定位 OpenAI 官方 Codex 文档，并理解本站的版本与复核边界
tags: [codex, official-docs, reference]
difficulty: beginner
relatedContent:
  - { slug: 'codex/index', label: 'Codex 零基础路线' }
  - { slug: 'codex/troubleshooting', label: 'Codex 故障排查' }
  - { slug: 'codex/quickstart', label: '安装、登录与成本' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 这是什么

Codex 更新很快。本站负责把稳定的学习流程讲清楚，命令和能力边界仍以 OpenAI 官方文档和你本机 `--help` 为准。本站不会复制整页官方原文，也不会用 Claude Code 的行为替代 Codex 证据。

## 类比

把本站教程想成「带教学长写的实验指导书」，把官方文档和 `--help` 想成「仪器说明书」。指导书教你先做哪几步实验；仪器旋钮改名了、量程变了，以说明书和机身铭牌为准。发现两边不一致时，先停高风险操作，留下版本证据，而不是猜着继续拧。

## 实际操作

### 1. 按问题找来源

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

### 2. 本站验证口径

- 官方页面复核日期：2026-07-10。
- 教程版本范围：Codex CLI v0.144.x。
- 本地命令契约：在 `codex-cli 0.144.0-alpha.4` 检查 `--version` 和三个 `--help` 输出；不调用模型、不消耗账户额度。
- 登录、付费、组织权限和 GitHub Pages 发布仍需人工验收。
- 官方页面或本地 CLI 与本站冲突时，先暂停操作，在 Issue 中附脱敏版本与链接，不要猜测。

### 3. 如何复核一个变化

1. 运行 `codex --version`，记录具体版本。
2. 用对应 `--help` 确认命令是否存在。
3. 在上表中找到官方页面，确认认证、权限或平台边界。
4. 用无敏感数据的测试仓库做最小验证。
5. 更新教程的 `lastVerified`、版本范围、官方资料矩阵和 Changelog。

可复制的本机复核命令：

```bash
codex --version
codex --help
codex login --help
codex exec --help
```

### 4. 做过一遍：文档漂移了怎么办

下面是一个**虚构但结构真实**的演练，教你在「教程写法」和「官方/本机现实」不一致时怎么处理。

**场景：** 某篇旧笔记写着「用 `codex auth` 登录」。你按笔记操作，终端报错或提示没有该命令。

**你的做法（失败恢复路径）：**

1. 留下证据，不要改来改去猜命令：

```bash
codex --version
codex --help
codex login --help
```

2. 对照本页表格：登录应查 [Authentication](https://developers.openai.com/codex/auth)，并以当前 CLI 为准。若 `--help` 列出的是 `codex login`（本站 2026-07-10 口径），就按官方/本机帮助操作，而不是坚持旧笔记。

3. 用最小无敏感步骤验证：

```bash
codex login status
```

4. 若官方页面与本站教程冲突：暂停高风险操作（尤其是权限绕过、生产仓库大改），记录：

   - 本机 `codex --version` 输出
   - 相关 `--help` 片段（脱敏）
   - 官方页面 URL 与你看到的日期/表述
   - 本站页面路径与 `lastVerified`

5. 把上述证据带到 Issue 或维护者渠道；在本地先以官方 + `--help` 继续学习路径中的安全步骤。

**结论口诀：** 旧截图 < 本站教程 < 官方文档 + 本机 `--help`。冲突时停高风险动作，保留版本证据。

## 常见坑

- **把过期博客或聊天记录当命令来源** → 先跑 `--help`。失败恢复：按本页「文档漂移」四步走。
- **用 Claude Code 的行为推断 Codex** → 认证、规则文件、权限模型都不同。失败恢复：只采用本专区与 OpenAI 链接中的证据。
- **发现冲突仍继续 `dangerously-bypass-approvals-and-sandbox`** → 风险被放大。失败恢复：先回到最小权限，再核对官方安全页。
- **不记录版本就说「文档错了」** → 无法复现。失败恢复：始终附上 `codex --version` 与链接。

## Checkpoint

确认你掌握了复核习惯：

- □ 你知道定价变化要查 Pricing，而不是引用旧截图
- □ 你知道 CLI 参数先用本机 `--help` 复核
- □ 你知道官方文档与教程冲突时应保留版本证据并暂停高风险操作
- □ 你能按「文档漂移」示例走完：version → help → 官方页 → 最小验证 → 记录证据

## 下一步

- 回到路线入口：[Codex 零基础路线](/codex/)
- 若当前卡在报错：[Codex 故障排查](/codex/troubleshooting/)
- 若还没安装：[安装、登录与成本](/codex/quickstart/)
