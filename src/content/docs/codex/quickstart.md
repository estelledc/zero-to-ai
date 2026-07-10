---
title: 安装、登录与成本
description: 安装 Codex CLI，选择 ChatGPT 或 API key 登录，并在第一次任务前确认费用与权限边界
tags: [codex, install, auth, pricing]
difficulty: beginner
prerequisites:
  - methodology/basics
relatedContent:
  - { slug: 'codex/first-task', label: '第一次只读任务' }
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
  - { slug: 'codex/troubleshooting', label: 'Codex 故障排查' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 先理解三件事

安装 Codex 像装一把电动工具：安装包只是把工具放进电脑；登录决定“电费从哪个账户结算”；权限决定工具能碰哪些文件和网络。三件事不要混在一起排查。

截至 2026-07-10，OpenAI 官方定价页写明 Codex 包含在 ChatGPT Free、Go、Plus、Pro、Business、Edu 和 Enterprise 中；具体额度会随方案和任务变化。API key 是另一条按 API token 计费的入口，不能拿 ChatGPT 订阅额度抵扣，而且不包含 Codex cloud 等云功能。开始前请重新查看[官方定价页](https://developers.openai.com/codex/pricing)，不要把本站日期当成永久承诺。

## 1. 安装

### macOS / Linux

官方独立安装器：

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

重新打开终端后验证：

```bash
codex --version
```

### Windows

Codex 有原生 Windows 路线，也支持 WSL2。零基础用户若已有 Linux 教程或工具链，可以按 OpenAI 的[WSL 指南](https://learn.chatgpt.com/docs/windows/wsl)操作：管理员 PowerShell 先运行 `wsl --install`，进入 WSL 后再执行上面的 Linux 安装命令。Codex 0.115 起不再支持 WSL1。

不要在 Windows PowerShell 和 WSL 里各装一份后混着使用。同一个项目选定一种环境；WSL 项目优先放在 Linux 家目录下。

## 2. 登录

运行：

```bash
codex login
```

浏览器会打开 ChatGPT 登录流程。完成后检查：

```bash
codex login status
```

如果你明确选择 API 按量计费，官方 CLI 通过标准输入读取 key：

```bash
printenv OPENAI_API_KEY | codex login --with-api-key
```

这条命令避免把 key 直接写进 shell 历史。仍然不要把 `.env`、截图、终端日志或 `~/.codex/auth.json` 提交到 Git。退出登录使用 `codex logout`。

## 3. 确认权限边界

第一次运行 `codex` 后，可在交互界面输入：

```text
/status
/permissions
```

把 sandbox 想成“技术上能到哪里”，approval policy 想成“到某些门口是否先问你”。本地默认网络访问关闭；需要联网或访问工作区外目录时，不要为了省一次确认就切到无沙箱模式。

## 常见误区

- **错误认知：安装成功就代表已经有可用额度** → 还要登录，并确认订阅或 API 组织有权限。
- **错误认知：ChatGPT 订阅和 API key 是同一个账单** → 它们是两条认证与计费路径。
- **错误认知：`dangerously-bypass-approvals-and-sandbox` 只是“少弹窗”** → 它同时跳过确认和沙箱，不适合作为日常默认值。

## Checkpoint

1. `codex --version` 输出版本号。
2. `codex login status` 显示有效登录。
3. 你能说出自己使用 ChatGPT 订阅还是 API key。
4. 你知道网络默认关闭，权限不够时先看提示而不是关闭保护。

下一步：[第一次只读任务](/codex/first-task/)。

官方依据：[Codex CLI](https://developers.openai.com/codex/cli)、[认证](https://developers.openai.com/codex/auth)、[定价](https://developers.openai.com/codex/pricing)、[权限与安全](https://learn.chatgpt.com/docs/agent-approvals-security)。
