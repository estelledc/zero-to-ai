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

## 先说结论

本站 1.0 曾把 Agnes 描述成“完全免费、可直接替代 Claude”的入门路线。这个结论不能继续作为教程承诺：第三方服务的价格、模型、限额和兼容性会独立变化，Anthropic 也不为第三方网关提供支持。

因此，这一页保留原 URL 作为历史迁移说明，但不再提供“一键免费配置”。零基础主路径只使用 Anthropic 官方支持的订阅登录或 Claude Console API。

## 为什么不能把“兼容”当成“等价”

类比一下：第三方转接头像一个转接插头。接口形状相同，只说明可能插得上；它不保证电压、保修、稳定性和原装配件一致。

Anthropic 兼容 API 也一样：能接受部分相同请求，不代表 Claude Code 的登录、模型选择、工具调用、checkpoint、计费或安全边界都得到同等级验证。

## 使用前必须确认的五件事

1. **价格和限额**：只相信提供方当前控制台，不把“免费”截图当长期政策。
2. **数据去向**：阅读提供方隐私和数据保留条款；不要发送公司代码、个人数据或凭证。
3. **模型映射**：确认请求的模型名、实际响应模型和能力边界，不能只问模型自报身份。
4. **认证优先级**：Claude Code 中的 API 环境变量可能覆盖订阅登录；使用 `/status` 检查当前来源。
5. **恢复路径**：实验前记录设置，实验后移除第三方 base URL 和 token，再次用 `/status` 确认回到官方入口。

## 最小、安全的验证方式

不要在真实项目里直接试。新建一个不含敏感数据的临时目录，并为实验开一个全新的终端窗口：

```bash
mkdir provider-compat-test
cd provider-compat-test
git init
```

然后只按第三方提供方**当前官方文档**配置临时环境变量，不写入 `~/.zshrc`、项目文件或 Git。验证至少包括：

- `/status` 显示的认证来源符合预期；
- 只创建一个无敏感内容的文本文件；
- `git diff` 能看清全部修改；
- 提供方控制台显示的模型和用量与预期一致；
- 清除变量并重启后，Claude Code 回到原认证入口。

任何一项无法确认，就把结果记为“未验证”，不要把它传播成可复用教程。

## 恢复官方认证

macOS、Linux 或 WSL 中，先清除常见的第三方覆盖变量，再重启 Claude Code：

```bash
unset ANTHROPIC_BASE_URL
unset ANTHROPIC_AUTH_TOKEN
unset ANTHROPIC_API_KEY
```

PowerShell 使用 `Remove-Item Env:<变量名>`。如果你原本使用 Claude Console API，只在新的终端会话重新设置官方 key；如果使用订阅登录，按官方认证流程登录。最后运行 `/status`，不要仅凭“能收到回复”判断恢复成功。

## Checkpoint

完成这一页后，你应能回答：

1. 为什么 API 格式兼容不等于产品完整兼容？
2. 为什么“当前免费”不能写成教程的长期承诺？
3. 怎样在不污染真实项目和全局 shell 配置的前提下做实验？
4. 怎样用 `/status` 和提供方控制台留下可核验的证据？

如果还不能回答，先继续使用官方认证入口，不要进行第三方实验。
