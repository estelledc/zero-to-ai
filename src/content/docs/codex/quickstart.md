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

## 这是什么

这一页带你完成三件事：把 Codex CLI 装进电脑、选对登录与计费入口、看清权限边界。做完后你能运行 `codex --version`，并确认自己用的是 ChatGPT 订阅还是 API key。

## 类比

安装 Codex 像装一把电动工具：安装包只是把工具放进电脑；登录决定「电费从哪个账户结算」；权限决定工具能碰哪些文件和网络。三件事不要混在一起排查——装好了不等于已登录，已登录不等于额度够用，额度够用也不等于可以随便关沙箱。

## 开始之前

- 你会打开终端并输入命令（如果不会，先看[通用环境基础设施](/methodology/basics/)）
- **macOS / Linux**：可直接用官方独立安装器
- **Windows**：Codex 有原生 Windows 路线，也支持 WSL2；零基础若已有 Linux 工具链，可按 OpenAI 的 [WSL 指南](https://learn.chatgpt.com/docs/windows/wsl) 操作。Codex 0.115 起不再支持 WSL1
- 你准备好 ChatGPT 账号（Free / Go / Plus / Pro / Business / Edu / Enterprise 等方案可能包含 Codex，以官方定价页为准），或准备走 API key 按量计费

> **成本先看一眼**
>
> 截至 2026-07-10，OpenAI 官方定价页写明 Codex 包含在 ChatGPT Free、Go、Plus、Pro、Business、Edu 和 Enterprise 中；具体额度会随方案和任务变化。API key 是另一条按 API token 计费的入口，不能拿 ChatGPT 订阅额度抵扣，而且不包含 Codex cloud 等云功能。开始前请重新查看[官方定价页](https://developers.openai.com/codex/pricing)，不要把本站日期当成永久承诺。

## 实际操作

### 1. 安装

**macOS / Linux / WSL2：**

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

安装后**关掉终端再开一个新窗口**，然后验证：

```bash
codex --version
```

**成功标准：** 终端打印出版本号（本教程按 Codex CLI v0.144.x 复核）。

**Windows：**

- **原生 Windows**：按官方 [Codex CLI](https://developers.openai.com/codex/cli) 安装说明操作；装好后在同一类终端（PowerShell 或 CMD）里验证 `codex --version`。
- **WSL2**：管理员 PowerShell 先运行 `wsl --install`，进入 WSL 后再执行上面的 Linux 安装命令。在 WSL 内确认：

```bash
echo $WSL_DISTRO_NAME
codex --version
```

不要在 Windows PowerShell 和 WSL 里各装一份后混着使用。同一个项目选定一种环境；WSL 项目优先放在 Linux 家目录下。

### 2. 登录

运行：

```bash
codex login
```

浏览器会打开 ChatGPT 登录流程。完成后检查：

```bash
codex login status
```

**成功标准：** `codex login status` 显示有效登录。

如果你明确选择 API 按量计费，官方 CLI 通过标准输入读取 key（避免把 key 直接写进 shell 历史）：

**macOS / Linux / WSL：**

```bash
printenv OPENAI_API_KEY | codex login --with-api-key
```

若环境变量尚未设置，可先临时导出（不要把真实 key 写进仓库或截图）：

```bash
export OPENAI_API_KEY="你的 API Key"
printenv OPENAI_API_KEY | codex login --with-api-key
```

仍然不要把 `.env`、截图、终端日志或 `~/.codex/auth.json` 提交到 Git。退出登录使用：

```bash
codex logout
```

### 3. 确认权限边界

第一次运行 `codex` 后，可在交互界面输入：

```text
/status
/permissions
```

把 sandbox 想成「技术上能到哪里」，approval policy 想成「到某些门口是否先问你」。本地默认网络访问关闭；需要联网或访问工作区外目录时，不要为了省一次确认就切到无沙箱模式。

可复制的最小自检 prompt：

```text
先不要改任何文件。用一句话说明：当前工作目录是什么、我现在的登录方式看起来是什么、网络默认是否关闭。不确定就明确说不确定。
```

### 4. 失败恢复：装上了但用不了

按症状对号入座，一次只改一个变量：

| 你看到什么                 | 先做什么                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `codex: command not found` | 重开终端；确认安装环境与当前终端一致（WSL 装的不能当 PowerShell 命令）；再跑一次官方安装器 |
| 登录失败 / 额度不对        | `codex login status` → `codex logout` → `codex login`；确认你要的是订阅还是 API key        |
| 想用订阅却像在走 API       | 退出 API 登录后重新 `codex login`；不要把 key 粘贴到公开地方                               |
| 权限弹窗看不懂             | 先用 `/permissions` 选更窄的范围；不要默认 `dangerously-bypass-approvals-and-sandbox`      |

更完整的排查见 [Codex 故障排查](/codex/troubleshooting/)。

## 常见坑

- **错误认知：安装成功就代表已经有可用额度** → 还要登录，并确认订阅或 API 组织有权限。失败恢复：跑 `codex login status`，对照[官方定价页](https://developers.openai.com/codex/pricing)。
- **错误认知：ChatGPT 订阅和 API key 是同一个账单** → 它们是两条认证与计费路径。失败恢复：用 `codex logout` 清掉当前入口，再按你真正要用的方式重新登录。
- **错误认知：`dangerously-bypass-approvals-and-sandbox` 只是「少弹窗」** → 它同时跳过确认和沙箱，不适合作为日常默认值。失败恢复：回到 `/permissions`，选可解释的最小权限。
- **错误认知：PowerShell 和 WSL 可以混用同一套安装** → PATH 与家目录不同，最常见结果是「这边能跑、那边找不到」。失败恢复：选定一种环境，只在该环境里安装和启动。

## Checkpoint

确认你完成了以下操作：

- □ `codex --version` 能输出版本号
- □ `codex login status` 显示有效登录
- □ 你能说出自己使用 ChatGPT 订阅还是 API key
- □ 你知道网络默认关闭，权限不够时先看提示而不是关闭保护
- □ 你知道本机用的是 macOS/Linux、原生 Windows，还是 WSL2（且不是 WSL1）

全部勾上？可以进入第一次只读任务了。

## 下一步

- 下一步：[第一次只读任务](/codex/first-task/)——先理解项目，不改文件
- 卡住了？先看 [Codex 故障排查](/codex/troubleshooting/)
- 想核对官方说法？打开 [官方资料索引](/codex/official-sources/)

官方依据：[Codex CLI](https://developers.openai.com/codex/cli)、[认证](https://developers.openai.com/codex/auth)、[定价](https://developers.openai.com/codex/pricing)、[权限与安全](https://learn.chatgpt.com/docs/agent-approvals-security)。
