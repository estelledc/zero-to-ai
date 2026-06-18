---
title: 术语对照表
description: Zero to AI 教程中使用的术语及其中英文对照
tags: [reference]
difficulty: beginner
learningPaths: ['ai-coding-zero']
prerequisites: []
relatedContent:
  - { slug: 'claude-code/index', label: 'Claude Code 教程总览' }
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
  - { slug: 'claude-code/quickstart', label: '10 分钟上手 Claude Code' }
  - { slug: 'claude-code/cost', label: '成本与计费' }
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
lastVerified: '2026-06-18'
---

本教程中所有术语遵循以下规范：

- **产品特性名称保留英文**——Hook、Skill、子 Agent 等 Claude Code 特有概念在正文中直接使用英文形式，因为你在终端和文档中看到的就是这些名字。中文释义见下表
- **通用概念用中文**——上下文窗口、提示词、工件等通用术语正文中用中文，方便零基础读者理解
- **代码/配置中保留英文**，匹配你终端里实际看到的

## AI 编程核心

| 英文                                     | 中文               | 说明                                                                                                                                                           |
| ---------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /clear                                   | /clear（不翻译）   | 清空当前对话上下文，切换任务时使用                                                                                                                             |
| /compact                                 | /compact（不翻译） | 主动压缩对话历史为摘要，释放上下文空间                                                                                                                         |
| /rewind                                  | /rewind（不翻译）  | 回退到上一个对话状态，快捷键 Esc+Esc                                                                                                                           |
| /usage                                   | /usage（不翻译）   | 查看当前会话的 token 消耗和费用                                                                                                                                |
| agentic loop                             | 代理循环           | Claude Code 的“读取-思考-行动-观察-重复”工作方式                                                                                                               |
| compaction                               | 压缩               | 将长对话总结为关键信息，释放上下文空间                                                                                                                         |
| context window                           | 上下文窗口         | Claude 一次能“记住”的最大信息量，类比办公桌大小。详见[上下文管理](/claude-code/context/)                                                                       |
| MCP (Model Context Protocol)             | 模型上下文协议     | 让 Claude Code 连接外部工具的标准协议。详见 [MCP 集成](/claude-code/mcp/)                                                                                      |
| model                                    | 模型               | AI 的“大脑版本”，如 Haiku（快而便宜）、Sonnet（均衡）、Opus（强而贵）。实际使用时带版本号，如 `claude-sonnet-4-20250514`，详见[成本与计费](/claude-code/cost/) |
| Plan Mode                                | 计划模式           | 让 Claude 先出方案再写代码的工作模式                                                                                                                           |
| prompt                                   | 提示词 / prompt    | 发送给 AI 的指令或问题                                                                                                                                         |
| subagent                                 | 子 Agent           | Claude Code 创建的独立工作进程，完成特定子任务。详见[子 Agent 协作](/claude-code/subagents/)                                                                   |
| token                                    | 令牌               | AI 收费的基本单位，处理一段文字的计费单元。详见[成本与计费](/claude-code/cost/)                                                                                |
| CLI (Command Line Interface)             | 命令行界面         | 在终端里输入文字命令来操作电脑的方式                                                                                                                           |
| IDE (Integrated Development Environment) | 集成开发环境       | 写代码的专用软件，如 VS Code、Cursor                                                                                                                           |
| artifact                                 | 工件               | 结构化的知识记录单元，如日报（daily）、学习笔记（learnings）、问题记录（problems）                                                                             |
| cold start                               | 冷启动             | 新用户/新系统从零开始的初始化阶段，需要特殊策略降低上手门槛。详见[设计哲学](/projects/learn-journal/design-philosophy/)                                        |
| kill switch                              | 终止开关           | 预设的自动检测条件，当指标异常时提醒用户系统可能失效，需要干预。详见[设计哲学](/projects/learn-journal/design-philosophy/)                                     |

## Claude Code 配置

| 英文                    | 中文                    | 说明                                                                                                                    |
| ----------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| CLAUDE.md               | CLAUDE.md（不翻译）     | Claude Code 的项目指令文件，告诉 Claude 项目约定和行为准则。详见[核心配置](/claude-code/config/)                        |
| dotfiles                | 点文件 / 配置文件       | 以点开头的配置文件（如 .zshrc、.claude/），通常放在用户目录下                                                           |
| Hook                    | Hook（钩子）            | 特定事件触发时自动执行的动作。详见 [Hook 系统](/claude-code/hooks/)                                                     |
| Memory                  | 记忆 / 记忆系统         | 持久化存储用户偏好和上下文。详见[记忆系统](/claude-code/memory/)                                                        |
| settings.json           | settings.json（不翻译） | Claude Code 的权限和行为配置文件                                                                                        |
| Skill                   | Skill（技能）           | 可复用的工作流指令，放在 .claude/skills/ 目录下。详见 [Skill 体系](/claude-code/skills/)                                |
| dual-layer architecture | 双层架构                | 概率层（AI 协议指令）+ 确定性层（脚本硬检查）的系统设计模式。详见[设计哲学](/projects/learn-journal/design-philosophy/) |
| deterministic layer     | 确定性层                | 双层架构中由脚本/lint 执行的硬性检查层，不依赖 AI 判断                                                                  |
| probability layer       | 概率层                  | 双层架构中由 CLAUDE.md/Skill 定义的 AI 行为指令层，执行效果有概率性                                                     |

## Git

| 英文              | 中文           | 说明                                    |
| ----------------- | -------------- | --------------------------------------- |
| branch            | 分支           | 独立的开发线，不影响主线代码            |
| clone             | 克隆           | 将远程仓库下载到本地的操作              |
| commit            | 提交           | 将修改保存到 git 历史中的一次操作       |
| diff              | diff（不翻译） | 查看文件修改前后的差异                  |
| git               | git（不翻译）  | 版本控制工具，记录文件的每次修改历史    |
| PR (Pull Request) | 拉取请求       | 请求将你的修改合并到主分支              |
| repo (repository) | 仓库           | git 跟踪的项目文件夹                    |
| staging area      | 暂存区         | commit 前的“准备区”，选择哪些修改要提交 |
| push              | 推送           | 将本地提交同步到远程仓库                |
| merge             | 合并           | 将两个分支的修改合到一起                |
| remote            | 远程仓库       | 存放在 GitHub 等服务上的仓库副本        |

## 通用

| 英文                       | 中文                  | 说明                                                        |
| -------------------------- | --------------------- | ----------------------------------------------------------- |
| API Key                    | API 密钥              | 调用 AI 服务需要的身份凭证                                  |
| Environment Variable       | 环境变量              | 存储在操作系统中的配置值，如 API Key                        |
| frontmatter                | frontmatter（不翻译） | Markdown 文件顶部的 YAML 元数据区域，用 `---` 包裹          |
| Package Manager            | 包管理器              | 安装/卸载/更新软件包的工具                                  |
| PATH                       | PATH（不翻译）        | 系统查找可执行程序的目录列表                                |
| symlink (symbolic link)    | 符号链接              | 文件系统的“快捷方式”，指向另一个文件或目录                  |
| Terminal                   | 终端                  | 输入文字命令操作电脑的窗口                                  |
| YAML                       | YAML（不翻译）        | 一种人类可读的数据格式，Claude Code 配置和 frontmatter 常用 |
| LLM (Large Language Model) | 大语言模型            | AI 对话工具的底层技术，如 Claude、GPT                       |
| VS Code                    | VS Code（不翻译）     | 微软开发的代码编辑器，Claude Code 可集成其中                |

## 本站技术栈

| 英文                | 中文                   | 说明                                                                                                                       |
| ------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Astro               | Astro（不翻译）        | 本站使用的静态网站框架，以内容为中心，构建速度快                                                                           |
| Starlight           | Starlight（不翻译）    | Astro 的文档主题，提供侧边栏、搜索、暗色模式等文档站标配功能                                                               |
| vibe coding         | 氛围编程               | 一种 AI 编程方式：用自然语言描述想要的效果，让 AI 生成代码。详见[零成本 vibe coding](/claude-code/agnes-free-vibe-coding/) |
| context engineering | 上下文工程             | 精心设计提供给 AI 的信息（记忆、Skill、CLAUDE.md），以提升输出质量                                                         |
| verification loop   | 验证循环               | 每次 AI 完成操作后，人类进行检查和确认的反馈闭环                                                                           |
| Content Collection  | 内容集合               | Astro 管理结构化内容（如教程、博客）的方式，支持类型安全和数据校验                                                         |
| GitHub Pages        | GitHub Pages（不翻译） | GitHub 提供的免费静态网站托管服务，本站部署于此                                                                            |

## Learn Journal / 方法论

| 英文                         | 中文                | 说明                                                                                                                           |
| ---------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| anti-ghostwriting            | 反代写              | AI 不代替你思考，只辅助记录。你必须用自己的话表达理解。详见[运作原理](/projects/learn-journal/how-it-works/)                   |
| progressive template         | 渐进模板            | 从最简单的 Level 0 模板逐步升级到完整版，降低冷启动阶段的认知负担。详见[快速上手](/projects/learn-journal/quickstart/)         |
| natural reuse                | 自然复用            | 不安排专门复习时间，而是在日常工作中自然触发对已学知识的回顾。详见[运作原理](/projects/learn-journal/how-it-works/)            |
| artifact selection heuristic | 工件选择启发式      | “命中即停”规则：按优先级判断该用哪种工件记录。详见[学习管理](/methodology/learning-management/)                                |
| teach mode / execute mode    | 教学模式 / 实施模式 | Claude 在解释概念时用教学模式（六步讲解），在执行任务时用实施模式（直接操作）。详见[工作流设计](/methodology/workflow-design/) |
