---
title: 学习日志 Skill Pack
description: 一键部署的结构化学习系统 — 让任何 AI 编程助手变成你的学习伙伴
tags: [methodology, tool]
difficulty: intermediate
prerequisites:
  - methodology/learning-management
relatedContent:
  - { slug: 'methodology/learning-management', label: '学习管理系统' }
  - { slug: 'claude-code/daily-rhythm', label: '日常节奏' }
  - { slug: 'projects/learn-journal/index', label: 'Learn Journal 实战项目' }
  - { slug: 'projects/learn-journal/quickstart', label: 'Learn Journal 快速开始' }
  - { slug: 'projects/learn-journal/design-philosophy', label: 'Learn Journal 设计哲学' }
  - { slug: 'methodology/skill-engineering', label: 'Skill 工程化设计' }
  - { slug: 'codex/agents-md', label: 'Codex AGENTS.md' }
lastVerified: '2026-07-10'
---

## 这是什么

前面几篇方法论讲了“学习管理系统”的设计思想：工件选择、知识捕获管线、文件系统哲学。但从“理解原理”到“自己搭一套”之间还有不少工程量——要写协议文件、要配模板、要写 lint 脚本、要适配不同的 AI 工具。

**Skill Pack 把这些全部打包好了。** 你只需要下载一个 ZIP，解压，复制一个适配文件，就能立刻开始用。

它从 [intern-journal](https://github.com/estelledc/intern-journal) 项目中提炼而来。原作者工作流有 50+ 天实践记录；这不能自动证明压缩包在所有平台都可迁移，平台状态见下方兼容性矩阵。

:::note[诚实边界]
Claude Code：结构与初始化 smoke 已验证，账户内触发仍需你本地验收。Codex：`AGENTS.md` 适配器存在，真实触发与官方文档对齐仍在推进。Cursor / CatDesk：适配器在，真实环境未充分验证。换工具前先看兼容性表，不要假设「解压即全功能」。
:::

## 下载

[skill-pack.zip](/downloads/skill-pack.zip)

## 快速上手

1. 解压 ZIP，把 `skill-pack/` 文件夹放到你的项目根目录（或任意空文件夹）
2. 根据你用的 AI 工具，把对应的适配文件复制到根目录：
   - Claude Code → `adapters/claude-code/CLAUDE.md`
   - Codex → `adapters/codex/AGENTS.md`
   - CatDesk → `adapters/catdesk/CATDESK.md`
   - Cursor → `adapters/cursor/.cursorrules`
3. 复制 `config.yaml.example` 为 `config.yaml`，填入你的名字和学习方向
4. 打开 AI 助手，说：“帮我初始化学习空间”
5. 回答几个问题，开始使用

## 它能做什么

装好之后，你的 AI 助手会自动获得以下能力：

**日终回顾** — 每天下班前引导你回顾今天做了什么、学了什么，生成结构化日报。

**知识捕获** — 聊天中提到新概念时，AI 帮你结构化记录成学习笔记，自动选择正确的工件类型。

**六步讲解** — 解释新概念时遵循“定位 → 类比 → 机制 → 代码 → 误区 → 验证”的教学结构，确保你真正理解而不是死记硬背。

**交叉引用** — 新笔记自动关联已有知识，形成知识网络。写之前先搜索已有内容，避免重复。

**自然复用** — 不用专门安排“复习时间”。AI 在工作中遇到相关问题时自动引用旧笔记、写新笔记时发现关联并建议交叉引用。知识巩固融入日常工作流，而非依赖算法调度。

**质量门禁** — lint 脚本检查笔记格式（来源字段、死链等），确保知识库不会随时间腐烂。

## 文件结构

```text
skill-pack/
├── protocols/              ← 核心方法论（AI 遵循的规则）
│   ├── artifact-routing.md ← 工件选择路由
│   ├── daily-rhythm.md     ← 日终回顾节奏
│   ├── explain-protocol.md ← 六步讲解协议
│   ├── quality-gates.md    ← 质量门禁规则
│   └── review-system.md    ← 自然复用策略
├── templates/          ← 工件模板（日报、笔记等的格式）
├── skills/             ← 每个 Skill 一个目录，入口为 SKILL.md
├── adapters/           ← 平台适配（不同 AI 工具的入口文件）
├── scripts/            ← lint 和初始化脚本
└── config.yaml.example ← 配置模板
```

## 初始化后你的学习空间

```text
my-learning/
├── config.yaml         ← 你的配置（名字、方向、复习偏好）
├── CLAUDE.md           ← （或 AGENTS.md / .cursorrules）
├── daily/              ← 每天的工作日志
├── learnings/          ← 学到的新知识
├── problems/           ← 解决过的问题
└── sources/            ← 学习材料收藏
```

所有内容都是普通 markdown 文件，用 Git 追踪，任何编辑器都能打开。

## 兼容性

| AI 工具        | 支持状态                                              |
| -------------- | ----------------------------------------------------- |
| Claude Code    | 结构、ZIP 与初始化 smoke 已验证；账户内触发需人工验收 |
| OpenAI Codex   | 规则适配器存在；官方文档复核与真实触发待 2.0 完成     |
| CatDesk        | 规则适配器存在；真实环境未验证                        |
| Cursor         | 规则适配器存在；真实环境未验证                        |
| Windsurf       | 未测试（理论兼容）                                    |
| GitHub Copilot | 未测试                                                |

## 设计哲学

这个 skill pack 的核心设计决策：

**协议驱动** — AI 的行为不是硬编码的，而是通过 markdown 协议文件定义的。你可以随时修改协议来调整 AI 的行为，不需要写代码。

**具体例子**：想把「日终回顾」从三问改成五问？打开 `protocols/daily-rhythm.md` 改条目，不必改适配器或脚本。下次会话助手按新协议走。

**无状态** — 文件系统就是状态。没有数据库、没有后端、没有账号。Git 提供版本控制，markdown 提供可读性。

**平台无关** — 同一套协议通过不同的适配器文件支持多个 AI 工具。换工具不需要重新学习。Claude 复制 `CLAUDE.md`，Codex 复制 `AGENTS.md`，协议目录共用。

**渐进式** — 第一天只需要写 daily，熟悉后逐步引入知识捕获和交叉引用。不会一上来就用复杂度压垮你。

**具体例子**：Day 1 只建 `daily/2026-07-10.md` 写三行；Day 7 再开第一条 `learnings/`；等笔记超过 10 篇再认真跑 lint。复杂度跟着你的使用量长，而不是反过来。

## 和本站其他内容的关系

- [学习管理系统](/methodology/learning-management/) 讲的是“为什么这样设计”——原理和思想
- 本页的 Skill Pack 是“拿来就用”——打包好的实现
- [日常节奏](/claude-code/daily-rhythm/) 讲的是“每天怎么用”——具体的工作流

三者互补：先理解原理，再下载工具，最后按节奏使用。

## 常见坑

- **Skill 文件路径写错**：Claude Code 的项目 Skill 必须是 `.claude/skills/<skill-name>/SKILL.md`。ZIP 中的 `skills/` 是分发源码，安装时还要按 `SETUP.md` 复制到 `.claude/skills/`。
- **Skill 内容过长撑爆上下文窗口**：一个 Skill 文件写了上千行，Claude 把它全部读进来，留给实际工作的 context 空间就不够了。Skill 应该精瘦——只写“什么时候触发”和“触发后做什么”，详细的参考文档放在单独文件里按需读取。
- **多个 Skill 定义冲突**：两个 Skill 都声称自己处理“用户说写完了”这个触发词，Claude 不知道该听谁的。解决方法是让触发条件互斥——比如一个管“写完代码”，另一个管“写完笔记”，不要用模糊的“写完了”同时匹配两个。

## 动手试一试

约 10 分钟，完成一次「最小安装验收」（不必一次用完全部能力）：

1. 下载并解压 [skill-pack.zip](/downloads/skill-pack.zip)
2. 按你的工具复制适配器（Claude → `CLAUDE.md`；Codex → `AGENTS.md`）
3. 复制 `config.yaml.example` → `config.yaml`，填名字与学习方向
4. 对助手说：「帮我初始化学习空间」，确认生成了 `daily/`（或等价目录）
5. 写一条最短 daily（三行即可），保存后用编辑器打开确认是普通 markdown

**成功标准：** 适配文件在仓库根目录；至少有一个 `daily/` 文件可读；你知道下一步该读 ZIP 内 `SETUP.md` 还是本站 Learn Journal quickstart。

## Checkpoint

- [ ] 我能说出 Skill Pack 与「学习管理系统」原理篇的分工（实现 vs 思想）
- [ ] 我知道 Claude / Codex 各自该复制哪个适配器，且兼容性并非全部「已验证」
- [ ] 我完成了上面的「动手试一试」，或至少打开过 ZIP 结构与 `SETUP.md`
- [ ] 我理解协议可改、状态在文件里、应渐进启用能力
- [ ] （Claude）我知道分发用的 `skills/` 还需按 `SETUP.md` 装到 `.claude/skills/`

## 下一步

- [Learn Journal 产品介绍](/projects/learn-journal/)——完整产品视角
- [快速上手](/projects/learn-journal/quickstart/)——从下载到第一次使用
- [设计哲学](/projects/learn-journal/design-philosophy/)——协议驱动与渐进增强
- [Skill 工程化设计](/methodology/skill-engineering/)——如何把协议做成可版本化资产

下载后如果遇到问题，查看 ZIP 内的 `SETUP.md` 获取详细安装说明和常见问题解答。
