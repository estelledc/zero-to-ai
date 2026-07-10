---
title: Codex 零基础路线
description: 从安装和成本，到规则、修改、验证、Git 与公开作品的完整 Codex CLI 学习路径
tags: [codex, openai, beginner]
difficulty: beginner
relatedContent:
  - { slug: 'codex/quickstart', label: '安装、登录与成本' }
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
  - { slug: 'appendix/troubleshooting', label: '常见问题排查' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 类比

把 Codex CLI 想成「只在你指定的项目文件夹里干活的电动工具」：插电（安装与登录）→ 先只看不改（只读任务）→ 贴上使用说明书（`AGENTS.md`）→ 小改一刀并验收 → 最后把作品挂到公开展示墙（GitHub Pages）。

Codex CLI 是运行在终端里的 OpenAI 编程助手。它能在你选定的项目目录中读取文件、提出计划、修改代码并运行本机工具。这个专区不是 Claude Code 教程的「改名版」：认证、规则文件、权限模型和命令都按 OpenAI 官方资料独立复核。

## 零基础先读谁

1. 还不会终端？先读 [通用环境基础设施](/methodology/basics/)
2. 还不会 Git？先读 [Git 10 分钟速成](/appendix/git-basics/)
3. 然后进入本专区第一站：[安装、登录与成本](/codex/quickstart/)

完整路径与里程碑见 [Codex 零基础完整路线](/paths/#codex-zero)。

:::caution[常见焦虑]
不要一上来就让 AI 大范围改文件。本路线强制「先只读 → 再写规则 → 再小改并 Git 存档」。权限收紧与恢复步骤见各篇 Checkpoint。
:::

## 学完能得到什么

你会完成一个可公开访问的小站，并留下四类证据：

1. 一个能打开的 GitHub Pages URL。
2. 至少两次有意义的 Git 提交（路径要求里会写清次数）。
3. 桌面与移动端验收截图。
4. 一份能让 Codex 稳定遵守项目约定的 `AGENTS.md`。

## 推荐顺序

| 步骤 | 教程 | 产物 | 约时 |
| ---- | ---- | ---- | ---- |
| 1 | [安装、登录与成本](/codex/quickstart/) | `codex --version` 和登录状态 | 15–20 分钟 |
| 2 | [第一次只读任务](/codex/first-task/) | 项目说明与验证清单 | 15 分钟 |
| 3 | [用 AGENTS.md 写项目规则](/codex/agents-md/) | 仓库级工作约定 | 20 分钟 |
| 4 | [修改、验证与 Git](/codex/modify-verify-git/) | 一次可审查、可回退的修改 | 25 分钟 |
| 5 | [公开作品 Capstone](/codex/capstone/) | 公开小站与完成证据 | 40–60 分钟 |
| 6 | [故障排查](/codex/troubleshooting/) | 能从安装、认证和改坏代码中恢复 | 按需 |
| 7 | [官方资料索引](/codex/official-sources/) | 知道去哪里复核变化 | 10 分钟 |

## Claude Code 与 Codex 的边界

两种工具共享「小步修改、先看 diff、运行验证、留下 Git 检查点」的方法论，所以公共知识继续放在[方法论](/methodology/)和[Git 附录](/appendix/git-basics/)中。但不要照搬命令：Codex 使用 `AGENTS.md`，认证命令是 `codex login`，权限由 sandbox 与 approval policy 共同决定。

## 卡住了去哪

| 症状 | 去哪 |
| ---- | ---- |
| 终端 / PATH / 包管理器 | [通用环境基础设施](/methodology/basics/) |
| Git 存档与回退 | [Git 10 分钟速成](/appendix/git-basics/) |
| 跨工具高频报错 | [常见问题排查](/appendix/troubleshooting/) |
| Codex 安装、登录、权限 | [Codex 故障排查](/codex/troubleshooting/) |

## Checkpoint

- [ ] 你能说出最终要交付的四类证据
- [ ] 你知道 `/claude-code/` 与 `/codex/` 是两条独立路线
- [ ] 你准备从只读任务开始，而不是一上来就让 AI 大范围改文件
- [ ] 你已打开第一站：[安装、登录与成本](/codex/quickstart/)

## 下一步

→ [安装、登录与成本](/codex/quickstart/)

官方依据：[Codex CLI](https://developers.openai.com/codex/cli)、[认证](https://developers.openai.com/codex/auth)、[AGENTS.md](https://developers.openai.com/codex/guides/agents-md)。
