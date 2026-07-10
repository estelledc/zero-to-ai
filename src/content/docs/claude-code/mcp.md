---
title: MCP 集成
description: 让 Claude Code 连接外部工具 — MCP 是什么、适合谁、以及关键的上下文成本警告
tags: [claude-code]
difficulty: advanced
prerequisites:
  - claude-code/quickstart
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
relatedContent:
  - { slug: 'methodology/workflow-design', label: '工作流编排思路' }
  - { slug: 'claude-code/subagents', label: '子 Agent 协作' }
  - { slug: 'claude-code/cost', label: '成本与计费' }
  - { slug: 'claude-code/config', label: '核心配置' }
  - { slug: 'claude-code/skills', label: 'Skill 体系' }
  - { slug: 'claude-code/context', label: '上下文窗口管理' }
---

## 这是什么

MCP（Model Context Protocol）是 Anthropic 定义的一套开放协议，让 Claude Code 可以连接外部工具——数据库、浏览器、设计软件、文档系统等。它不是 Claude Code 独有的功能，任何支持 MCP 的 AI 工具都可以用同一套协议对接同样的外部服务。

这篇文章不是教你“必须学 MCP”。恰恰相反——读完你会知道大部分人不应该装 MCP，以及如果你需要它，该怎么安全地使用。

## 类比

MCP 像 USB-C 接口。

无论什么设备——鼠标、键盘、硬盘、显示器——只要支持 USB-C，插上就能用。你不用关心设备内部的芯片和电路，USB-C 帮你处理了所有通信细节。

MCP 是 AI 世界的 USB-C。无论什么外部服务——数据库（Supabase）、浏览器（Chrome）、设计工具（Figma）、技术文档（Context7）——只要支持 MCP 协议，Claude Code 就能连接使用。

没有 MCP 时：每种工具需要单独开发插件，开发者要学每个工具不同的对接方式。有了 MCP：任何支持 MCP 的工具，用一种统一的方式就能接入。

## 开始之前

- 你已经用 Claude Code 完成过日常工作（参考[快速上手](/claude-code/quickstart/)）
- 你理解 CLAUDE.md、Skill、Hook 的基本概念（参考[核心配置](/claude-code/config/)、[Skill 体系](/claude-code/skills/)）
- 重要心态：MCP 是可选的高级功能，不是必修课

## 什么时候你需要 MCP

**先读这一段。** MCP 不是 Claude Code 用户必须学的内容。绝大多数用户完全不需要碰它。

你需要 MCP 的场景：

- 让 Claude Code 直接操作数据库——比如执行 SQL 查询、创建表、部署数据库函数
- 让 Claude Code 控制浏览器做自动化测试——比如打开网页、截图、检查页面元素
- 让 Claude Code 读写设计文件——比如从 Figma 拿设计稿、把代码同步到 Figma
- 让 Claude Code 查最新技术文档——比如查 React 某个 API 的最新用法，而不是依赖训练数据里的旧知识

你不需要 MCP 的场景：

- 你只是让 Claude 写代码、改 bug、学编程
- 你不需要让 Claude 直接操作外部服务
- 你的工作流程用 CLAUDE.md + Skill + Hook 已经完全覆盖
- 你不会同时做前端、后端、数据库、设计——大多数人只专注 1-2 个领域

判断方法很简单：你现在的日常工作中，有没有哪一步需要你切到浏览器去操作数据库后台、切到 Figma 看设计稿、或者打开 Chrome DevTools 手动调试？如果有，且你希望 Claude 替你完成这些——这时候才考虑 MCP。如果没有，跳过这篇，你不需要它。

## 关键警告：MCP 会增加上下文和权限面

MCP server 会向 Claude Code 暴露工具定义和外部能力。它可能增加上下文占用，也扩大能访问的数据与可执行操作；实际成本取决于 server 暴露的工具数量、Claude Code 的工具搜索行为和当前会话配置。

类比：MCP server 像在办公桌上放参考书。你放了一本数据库手册、一本浏览器调试指南、一本 Figma 组件文档、一本 API 参考手册——它们确实有用，随时可以翻。但你有没有发现，书太多的时候，桌上留给你真正写东西的空间就少了？

上下文是什么？它是 Claude 在你每次对话中能“记住”的总信息量。用完了，Claude 就会“忘记”对话开头的内容。上下文不够的后果：

- Claude 忘记你之前告诉它的事情
- 对话中途需要“压缩”，丢失部分上下文
- 处理大型代码文件时更容易出错
- 长任务可能中途“断片”

简单建议：

- 初学者：先不用 MCP，确认基础文件和终端工具确实无法完成需求再添加
- 其他用户：一次只添加一个明确需要的 server，检查发布者、权限范围和 `/context`，不用时禁用或移除

## MCP 怎么工作

整个过程分四步，跟安装打印机驱动类似：

**1. 安装 MCP server**

MCP server 是一个独立的小程序，比如 Supabase 的 MCP server 就是用 npm 安装的。本质上它就是一个“翻译官”——把 Claude Code 的请求翻译成 Supabase 能理解的数据库操作，再把结果翻译回 Claude Code 能理解的格式。

**2. 在 settings.json 里配置**

你需要告诉 Claude Code 这个 server 在哪、怎么启动。配置写在 `.claude/settings.json` 或 `~/.claude/settings.json` 里：

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@some-scope/mcp-server-name"]
    }
  }
}
```

**3. Claude Code 启动时自动连接**

你启动 `claude` 时，它会自动读取 settings.json，启动你配置的 MCP server，建立连接。这个过程是自动的——你不需要手动做什么。

**4. 对话中调用 MCP 工具**

连接建立后，Claude Code 在对话中就能调用 server 提供的工具。比如数据库 MCP server 注册了一个 `execute_sql` 工具，你就可以直接说“查一下 users 表里所有本周注册的用户”——Claude 会自动调用 MCP 工具去执行这条 SQL。

整个过程对你是透明的：你说人话，Claude 决定什么时候该调用哪个 MCP 工具，MCP server 去执行实际操作，结果返回给你。

## 一个多工具工作流示例

下面只是能力分类示例，不代表这些 server 已被本站逐一安装或安全审计，也不是推荐清单：

| MCP Server          | 用途                                     | 典型场景                                 |
| ------------------- | ---------------------------------------- | ---------------------------------------- |
| **Chrome DevTools** | 调试网页、跑 Lighthouse 审计、分析性能   | 开发前端页面时直接在浏览器里检查效果     |
| **Figma**           | 读取设计稿、生成设计、代码同步到设计     | 做 UI 时不用在 Figma 和编辑器之间来回切  |
| **Supabase**        | 管理数据库、执行 SQL、部署 Edge Function | 后端开发时直接在对话里查数据、改表结构   |
| **Playwright**      | 浏览器自动化测试                         | 写前端测试时让 Claude 操作浏览器验证功能 |
| **Context7**        | 查最新技术文档                           | 用库的 API 时直接查官方文档而不是凭记忆  |

是否需要某个 server，只由当前任务能否从它获得不可替代的外部能力决定，不由数量或“工具齐全”决定。

## 安装你的第一个 MCP server（最小示例）

下面用占位 server 演示官方 CLI 形态。把发布者文档给出的命令填入 `<name>` 和 `<command>`；不要直接复制未知包名：

```bash
# 1. 安装 MCP server
claude mcp add <name> -- <command> [args...]

# 2. 查看已安装的 MCP server
claude mcp list
```

第一条命令注册本地 stdio server；是否下载程序取决于你填写的 `<command>`。第二条命令列出当前已注册的 server。

注册后运行 `claude mcp list` 检查状态，再在一个不含敏感数据的测试项目中验证。首次调用前阅读权限提示，确认 server 只获得完成任务所需的最小权限。

如果想删掉它：

```bash
claude mcp remove <name>
```

## 常见坑

**坑 1：装太多 MCP server 导致上下文不够用**

新手容易觉得“这个看起来有用，那个也可能用得上”，一口气注册多个 server。结果是工具选择更复杂、权限面更大，也可能增加上下文占用。

解决：从 0 开始，只添加当前任务确实需要的一个；用 `/context` 和实际任务结果观察影响，不使用网上流传的固定百分比估算。

**坑 2：MCP server 启动失败但不报明显错误**

症状：对话中 Claude 没有使用你预期的 MCP 工具。原因通常是 server 配置写错了——比如路径不对、命令不存在。

排查：看 settings.json 里 MCP server 的命令你能不能在终端里单独跑起来。如果 `npx -y @some-scope/server` 在终端里报错，那 MCP 自然也启动不了。

**坑 3：把 MCP 当必修课**

社区里有很多“我的 MCP 全家桶”分享，看起来很强。但 MCP 是工具，不是成就。它解决的是“需要让 Claude 操作外部服务”这个特定问题。如果你没有这个需求，装 MCP 不会让你的 Claude Code 用得更快——只会更慢（上下文被吃掉）。

绝大多数 Claude Code 用户不需要 MCP。你不是例外，除非你搞清楚了为什么是。

## 下一步

你已经进入了高级话题区域。MCP 是 Claude Code 的“外接设备接口”——需要时再来学，不需要时跳过。

- 回到[日常节奏](/claude-code/daily-rhythm/)巩固基础工作流——这才是每天都会用的东西
- 看看[上下文管理](/claude-code/context/)了解如何更有效地利用上下文空间
- 如果确实需要外部服务，从发布者可验证、权限最小的一个 server 开始，并先在测试项目验证
