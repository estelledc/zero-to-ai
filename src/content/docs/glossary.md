---
title: 术语对照表
description: Zero to AI 教程中使用的术语及其中英文对照
tags: [reference]
---

本教程中所有术语遵循以下规范：
- **正文中用中文**，方便零基础读者理解
- **代码/配置中保留英文**，匹配你终端里实际看到的
- **首次提及时用双语**，例如"技能（Skill）"

## AI 编程核心

| 英文 | 中文 | 说明 |
|---|---|---|
| /clear | /clear（不翻译） | 清空当前对话上下文，切换任务时使用 |
| /compact | /compact（不翻译） | 主动压缩对话历史为摘要，释放上下文空间 |
| /rewind | /rewind（不翻译） | 回退到上一个对话状态，快捷键 Esc+Esc |
| /usage | /usage（不翻译） | 查看当前会话的 token 消耗和费用 |
| agentic loop | 代理循环 | Claude Code 的"读取-思考-行动-观察-重复"工作方式 |
| compaction | 压缩 | 将长对话总结为关键信息，释放上下文空间 |
| context window | 上下文窗口 | Claude 一次能"记住"的最大信息量，类比办公桌大小 |
| MCP (Model Context Protocol) | 模型上下文协议 | 让 Claude Code 连接外部工具的标准协议 |
| model | 模型 | AI 的"大脑版本"，如 Haiku（快而便宜）、Sonnet（均衡）、Opus（强而贵） |
| Plan Mode | 计划模式 | 让 Claude 先出方案再写代码的工作模式 |
| prompt | 提示词 / prompt | 发送给 AI 的指令或问题 |
| subagent | 子代理 | Claude Code 创建的独立工作进程，完成特定子任务 |
| token | 令牌 | AI 收费的基本单位，处理一段文字的计费单元 |
| CLI (Command Line Interface) | 命令行界面 | 在终端里输入文字命令来操作电脑的方式 |
| IDE (Integrated Development Environment) | 集成开发环境 | 写代码的专用软件，如 VS Code、Cursor |

## Claude Code 配置

| 英文 | 中文 | 说明 |
|---|---|---|
| CLAUDE.md | CLAUDE.md（不翻译） | Claude Code 的项目指令文件，告诉 Claude 项目约定和行为准则 |
| dotfiles | 点文件 / 配置文件 | 以点开头的配置文件（如 .zshrc、.claude/），通常放在用户目录下 |
| Hook | 钩子 | 特定事件触发时自动执行的动作 |
| Memory | 记忆 / 记忆系统 | 持久化存储用户偏好和上下文 |
| settings.json | settings.json（不翻译） | Claude Code 的权限和行为配置文件 |
| Skill | 技能 | 可复用的工作流指令，放在 .claude/skills/ 目录下 |

## Git

| 英文 | 中文 | 说明 |
|---|---|---|
| branch | 分支 | 独立的开发线，不影响主线代码 |
| clone | 克隆 | 将远程仓库下载到本地的操作 |
| commit | 提交 | 将修改保存到 git 历史中的一次操作 |
| diff | diff（不翻译） | 查看文件修改前后的差异 |
| git | git（不翻译） | 版本控制工具，记录文件的每次修改历史 |
| PR (Pull Request) | 拉取请求 | 请求将你的修改合并到主分支 |
| repo (repository) | 仓库 | git 跟踪的项目文件夹 |
| staging area | 暂存区 | commit 前的"准备区"，选择哪些修改要提交 |
| push | 推送 | 将本地提交同步到远程仓库 |
| merge | 合并 | 将两个分支的修改合到一起 |
| remote | 远程仓库 | 存放在 GitHub 等服务上的仓库副本 |

## 通用

| 英文 | 中文 | 说明 |
|---|---|---|
| API Key | API 密钥 | 调用 AI 服务需要的身份凭证 |
| Environment Variable | 环境变量 | 存储在操作系统中的配置值，如 API Key |
| frontmatter | frontmatter（不翻译） | Markdown 文件顶部的 YAML 元数据区域，用 `---` 包裹 |
| Package Manager | 包管理器 | 安装/卸载/更新软件包的工具 |
| PATH | PATH（不翻译） | 系统查找可执行程序的目录列表 |
| symlink (symbolic link) | 符号链接 | 文件系统的"快捷方式"，指向另一个文件或目录 |
| Terminal | 终端 | 输入文字命令操作电脑的窗口 |
| YAML | YAML（不翻译） | 一种人类可读的数据格式，Claude Code 配置和 frontmatter 常用 |
| LLM (Large Language Model) | 大语言模型 | AI 对话工具的底层技术，如 Claude、GPT |
| VS Code | VS Code（不翻译） | 微软开发的代码编辑器，Claude Code 可集成其中 |
