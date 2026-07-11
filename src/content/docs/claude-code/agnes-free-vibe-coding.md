---
title: 第三方兼容网关实验边界
description: 解释 Claude Code 接入第三方 Anthropic 兼容网关的风险、验证方法和安全恢复，不承诺免费或官方支持
tags: [claude-code, third-party-provider]
difficulty: advanced
prerequisites:
  - claude-code/quickstart
  - claude-code/cost
relatedContent:
  - { slug: 'claude-code/quickstart', label: '10 分钟上手' }
  - { slug: 'claude-code/cost', label: '成本与计费' }
  - { slug: 'claude-code/verify', label: '验证方法论' }
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
---

## 这是什么

本站 1.0 曾把 Agnes 描述成“完全免费、可直接替代 Claude”的入门路线。这个结论不能继续作为教程承诺：第三方服务的价格、模型、限额和兼容性会独立变化，Anthropic 也不为第三方网关提供支持。

因此，这一页保留原 URL 作为历史迁移说明，但不再提供“一键免费配置”。零基础主路径只使用 Anthropic 官方支持的订阅登录或 Claude Console API。

> **先读再实验**
>
> 如果你还在学 [10 分钟上手](/claude-code/quickstart/)，请先走官方路径。本页面向已经能稳定使用官方认证、并主动选择做兼容性实验的读者。

## 类比

第三方转接头像一个转接插头。接口形状相同，只说明可能插得上；它不保证电压、保修、稳定性和原装配件一致。

Anthropic 兼容 API 也一样：能接受部分相同请求，不代表 Claude Code 的登录、模型选择、工具调用、checkpoint、计费或安全边界都得到同等级验证。

## 实际操作

### 1. 使用前必须确认的五件事

1. **价格和限额**：只相信提供方当前控制台，不把“免费”截图当长期政策。
2. **数据去向**：阅读提供方隐私和数据保留条款；不要发送公司代码、个人数据或凭证。
3. **模型映射**：确认请求的模型名、实际响应模型和能力边界，不能只问模型自报身份。
4. **认证优先级**：Claude Code 中的 API 环境变量可能覆盖订阅登录；使用 `/status` 检查当前来源。
5. **恢复路径**：实验前记录设置，实验后移除第三方 base URL 和 token，再次用 `/status` 确认回到官方入口。

### 2. 最小、安全的验证方式

不要在真实项目里直接试。新建一个不含敏感数据的临时目录，并为实验开一个全新的终端窗口：

**macOS / Linux / WSL：**

```bash
mkdir provider-compat-test
cd provider-compat-test
git init
```

**Windows PowerShell：**

```powershell
mkdir provider-compat-test
cd provider-compat-test
git init
```

然后只按第三方提供方**当前官方文档**配置临时环境变量，不写入 `~/.zshrc`、项目文件或 Git。验证至少包括：

- `/status` 显示的认证来源符合预期；
- 只创建一个无敏感内容的文本文件（可复制 prompt：`在当前目录创建一个 note.txt，内容写 experiment-ok`）；
- `git diff` 能看清全部修改；
- 提供方控制台显示的模型和用量与预期一致；
- 清除变量并重启后，Claude Code 回到原认证入口。

**成功标准：** 以上五项都能留下可核验证据；任何一项无法确认，就把结果记为“未验证”，不要把它传播成可复用教程。

### 3. 恢复官方认证（失败恢复路径）

实验结束、认证混乱、或不确定当前走的是哪条入口时，按下面清干净再重启 Claude Code。

**macOS / Linux / WSL：**

```bash
unset ANTHROPIC_BASE_URL
unset ANTHROPIC_AUTH_TOKEN
unset ANTHROPIC_API_KEY
```

**Windows PowerShell：**

```powershell
Remove-Item Env:ANTHROPIC_BASE_URL -ErrorAction SilentlyContinue
Remove-Item Env:ANTHROPIC_AUTH_TOKEN -ErrorAction SilentlyContinue
Remove-Item Env:ANTHROPIC_API_KEY -ErrorAction SilentlyContinue
```

如果你原本使用 Claude Console API，只在新的终端会话重新设置官方 key；如果使用订阅登录，按官方认证流程登录。最后运行：

```text
/status
```

不要仅凭“能收到回复”判断恢复成功——必须看到认证来源回到你预期的官方入口。

## 常见坑

- **把“API 格式兼容”写成“产品完整兼容”**：工具调用、计费、模型能力都可能不一致。失败恢复：只在临时目录验证，不把结论写进主教程或团队文档。
- **把“当前免费”当长期承诺**：提供方政策会变。失败恢复：以提供方控制台当日显示为准，并准备随时切回官方入口。
- **把第三方变量写进 `~/.zshrc` 或项目 `.env` 并提交**：会污染全局和仓库。失败恢复：从配置文件删除相关行，开新终端，按上一节 unset / Remove-Item，再 `/status`。
- **在真实业务仓库里试网关**：泄露风险高。失败恢复：立刻停止会话，检查 `git status` / `git diff`，必要时丢弃改动并轮换已暴露的凭证。

## Checkpoint

完成这一页后，你应能勾选：

- □ 我能解释：为什么 API 格式兼容不等于产品完整兼容
- □ 我能解释：为什么“当前免费”不能写成教程的长期承诺
- □ 我知道怎样在不污染真实项目和全局 shell 配置的前提下做实验
- □ 我知道怎样用 `/status` 和提供方控制台留下可核验的证据，以及如何恢复官方认证

如果还不能勾选，先继续使用官方认证入口，不要进行第三方实验。

## 下一步

零基础主路径请回到官方入口，不要把本页当成入门捷径：

- [开始之前](/claude-code/preflight/) — 重新确认计费入口与心态
- [10 分钟上手](/claude-code/quickstart/) — 用 Anthropic 官方订阅或 Claude Console API 安装并登录
- [你的第一个 AI 页面](/claude-code/first-page/) — 在官方认证下完成第一个可展示作品
- [成本与计费](/claude-code/cost/) — 分清订阅额度与 API 账单后再决定是否做兼容实验
