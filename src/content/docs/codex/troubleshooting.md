---
title: Codex 故障排查
description: 从安装、认证、权限、目录、Git 与卡住的任务中恢复，并安全整理求助证据
tags: [codex, troubleshooting, recovery]
difficulty: beginner
prerequisites:
  - codex/quickstart
relatedContent:
  - { slug: 'appendix/troubleshooting', label: '通用排错方法' }
  - { slug: 'codex/official-sources', label: 'Codex 官方资料索引' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 先保留现场

排错像医生问诊：先记录症状、版本和最近变化，再开药。不要一遇到报错就重装、删仓库或关闭全部保护。

```bash
codex --version
codex login status
git status --short
```

复制错误时只保留必要几行。Codex 日志和会话记录可能含文件内容、路径或密钥；分享前必须脱敏。

## `codex: command not found`

1. 重新打开终端。
2. 再运行官方安装器，而不是从陌生镜像下载二进制。
3. 确认当前终端与安装环境一致：WSL 内安装的 `codex` 不能直接当作 PowerShell 命令。
4. Windows WSL 运行 `echo $WSL_DISTRO_NAME`，确认你真的在 WSL2。

## 登录失败或额度不对

```bash
codex login status
codex logout
codex login
```

先确认你本来打算使用 ChatGPT 订阅还是 API key。API key 按 API 用量计费，不会继承 ChatGPT 订阅额度；受管工作区还可能有管理员权限限制。不要把 key 粘贴到 Issue 或聊天里。

## Codex 看错项目

先退出会话，在普通终端运行：

```bash
pwd
git rev-parse --show-toplevel
git status --short
```

切到正确目录后重新运行 `codex`。也可用 `codex -C <目录>` 明确工作根目录，但第一次学习时，先 `cd` 到项目里更容易建立目录直觉。

## 权限请求反复出现

看清请求的是文件写入、工作区外目录还是网络。sandbox 决定技术范围，approval policy 决定何时询问。若任务只需要读文件，可在 `/permissions` 选择只读；若确实要安装依赖，再针对具体命令授权。不要把“任务需要联网”推导成“永久关闭沙箱”。

## 任务卡住或方向跑偏

1. 检查终端是否在等你批准命令。
2. 在另一个终端运行 `git status --short`，确认有没有留下半成品。
3. 中止当前任务，保存错误和 diff。
4. 把大任务拆成“只读分析”或“只改一个文件”的新 prompt。
5. 重新启动会话后先让 Codex复述 `AGENTS.md` 和完成标准。

## Git 面板出现“不是 Codex 改的文件”

Git 展示的是整个工作区状态，不会只显示某一个 agent 的修改。先按文件和时间辨认来源；不确定的用户改动要保留，不能为了清理列表直接 restore 或删除。

## Checkpoint

给下面场景写出第一步，不要直接看答案：

1. WSL 中能运行 Codex，PowerShell 中找不到命令。
2. 你想用订阅额度，但当前登录方式是 API key。
3. Codex 说任务完成，`git status` 却出现五个无关文件。

合理答案应分别从“环境边界”“认证入口”“保留未知改动并核对 diff”开始。

官方依据：[Troubleshooting](https://learn.chatgpt.com/docs/reference/troubleshooting)、[认证](https://developers.openai.com/codex/auth)、[WSL](https://learn.chatgpt.com/docs/windows/wsl)、[权限与安全](https://learn.chatgpt.com/docs/agent-approvals-security)。
