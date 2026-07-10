---
title: Learn Journal 快速上手
description: 方法论实验报告 — 从下载到第一次使用的完整指南
tags: [projects, learn-journal]
difficulty: beginner
prerequisites:
  - projects/learn-journal/index
lastVerified: '2026-06-24'
relatedContent:
  - { slug: 'methodology/skill-pack', label: '学习日志 Skill Pack' }
  - { slug: 'projects/learn-journal/how-it-works', label: '运作原理' }
  - { slug: 'claude-code/daily-rhythm', label: '日常节奏' }
  - { slug: 'methodology/learning-management', label: '学习管理系统' }
---

## 前提条件（诚实版）

你需要：

- 一个你已经会用的 AI 编程助手（Claude Code / Codex / CatDesk / Cursor，任选一个）
- 能打开终端，能 `cd` 到文件夹，能复制粘贴命令
- 一个空文件夹（或者你想放学习记录的任何地方）
- 10 分钟时间（第一次设置，不是 30 秒）

你不需要：git（可选但推荐）、Python（lint 脚本需要，但第一周不用）、markdown 深度知识（会看就行）。

如果你连 AI 编程助手都还没装，先去装一个再回来。这不是本指南的范围。

## 第一步：下载并解压

从 [这里下载 skill-pack.zip](/downloads/skill-pack.zip)，解压到你准备好的文件夹里。

解压后你会看到一个 `skill-pack/` 目录：

```text
my-learning/              # 你的文件夹
└── skill-pack/
    ├── protocols/        # AI 遵循的规则（概率层）
    ├── templates/        # 笔记模板（三级渐进：L0/L1/L2）
    ├── skills/           # 功能描述
    ├── adapters/         # 平台适配文件
    ├── scripts/          # 确定性层（lint/stats/health-check）
    └── config.yaml.example
```

## 第二步：放置适配文件

根据你用的 AI 工具，把对应的文件复制到你的文件夹根目录：

| 你用的工具  | 复制这个文件                                | 放到根目录后叫 |
| ----------- | ------------------------------------------- | -------------- |
| Claude Code | `skill-pack/adapters/claude-code/CLAUDE.md` | `CLAUDE.md`    |
| Codex       | `skill-pack/adapters/codex/AGENTS.md`       | `AGENTS.md`    |
| CatDesk     | `skill-pack/adapters/catdesk/CATDESK.md`    | `CATDESK.md`   |

Claude Code 还需要把 Skill 入口复制到官方发现目录：

```bash
mkdir -p .claude/skills
cp -R skill-pack/skills/. .claude/skills/
```

每个入口应形如 `.claude/skills/<name>/SKILL.md`。Codex、CatDesk 和 Cursor 当前只有规则适配器，真实平台触发尚未完成同等级验收，不应理解为“完整支持”。
| Cursor | `skill-pack/adapters/cursor/.cursorrules` | `.cursorrules` |

然后把 `skill-pack/config.yaml.example` 复制为 `config.yaml`：

```bash
cp skill-pack/config.yaml.example config.yaml
```

## 第三步：初始化

打开你的 AI 助手，在这个文件夹里说：

> “帮我初始化学习空间”

AI 会问你几个问题（名字、学习方向、经验水平），然后帮你创建目录结构。

如果中途想退出 AI 对话，不同工具的退出方式不同：Claude Code 用 `/quit` 或 `Ctrl+C`，CatDesk 关闭窗口即可，Cursor 按 `Esc`。退出不会丢失已创建的文件。

初始化完成后，你的文件夹变成：

```text
my-learning/
├── config.yaml           # 你的配置
├── CLAUDE.md             # （或对应的适配文件）
├── skill-pack/           # 协议和模板
├── daily/                # 每天的日志
├── learnings/            # 学习笔记
├── problems/             # 问题记录
└── sources/              # 学习材料
```

## 冷启动：第一周只记 problems/

Learn Journal 的冷启动策略是刻意设计的——**第一周只引导你记录 problems/**（遇到的问题和解决方案）。

为什么？因为问题记录的复用价值最快兑现。下次遇到同样的报错，AI 搜索你的 `problems/` 目录直接找到解决方案。这让你在第一周就能体验到“记录的回报”。

第二周才引入 `learnings/`，第三周才开完整工件路由。不要急着用所有功能——先让“记录 - 复用”的正反馈循环跑起来。

## 第一天：两种方式记问题

遇到一个问题并解决后，你有两个选择：

**选择 A：对话模式**（适合不知道怎么组织的时候）

对 AI 说“刚解决了一个问题”，AI 会引导你结构化：

```text
你: 刚解决了一个 Nginx 502 的问题，折腾了一小时。

AI: 不错！我来帮你记下来。先用你自己的话说说：
    1. 什么现象触发了这个问题？
    2. 根因是什么？
    3. 最终怎么解决的？
```

注意 AI 会先问你“用自己的话说说”——这是反代写机制。不是 AI 帮你写，是你先表达，AI 再结构化。

**选择 B：快速模式**（适合知道要写什么的时候）

直接用 Level 0 模板——标题 + 一段文本就够了：

```markdown
# Nginx 502 Bad Gateway

upstream 配置里 server 地址写错了，写成了 localhost:3000 但服务跑在 8080。
改成 localhost:8080 后正常。以后先 curl 确认后端端口再配 upstream。
```

30 秒搞定。不需要完整的模板字段，Level 0 就是这么简单。

## 渐进模板：从 Level 0 到 Level 2

你不需要一开始就写“完美笔记”。三级渐进：

**Level 0**（第一周够用）— 标题 + 一段文本。甚至一句话都行。

**Level 1**（第二周引入）— 加上来源和一句话总结：

```markdown
---
来源: 配置 Nginx 时遇到
---

# Nginx 502 Bad Gateway

一句话：upstream server 地址端口写错导致 502。

upstream 配置里 server 地址写错了...
```

**Level 2**（熟练后可选）— 加上 why/how、踩坑、关联：

```markdown
---
来源: 配置 Nginx 时遇到
关联: [learnings/nginx-reverse-proxy.md]
---

# Nginx 502 Bad Gateway

一句话：upstream server 地址端口写错导致 502。

## 为什么会出这个问题

Nginx 作为反向代理转发请求到 upstream，如果 upstream 地址不可达就返回 502...

## 踩坑

- 第一反应是看 Nginx 日志，但默认 error.log 没开 debug 级别
- 应该先 curl localhost:端口 确认后端是否存活
```

你可以永远停在 Level 0。AI 会在合适的时机建议升级，但不强制。

## 第一周后你的文件夹长这样

```text
my-learning/
├── config.yaml
├── daily/
│   └── (第二周才开始用)
├── learnings/
│   └── (第二周才开始用)
├── problems/
│   ├── nginx-502-bad-gateway.md
│   ├── docker-port-conflict.md
│   └── git-merge-conflict-resolution.md
└── sources/
    └── (第三周才开始用)
```

所有文件都是普通 markdown，用任何编辑器都能打开看。

## 确定性层：脚本工具

`skill-pack/scripts/` 里有几个 shell 脚本，是系统的确定性层——不依赖 AI，可复现：

- `lint-notes.sh` — 检查笔记格式（来源字段、文件名规范）
- `stats.sh` — 统计客观指标（active_days_ratio、reuse_rate、ai_assist_ratio）
- `health-check.sh` — 系统健康检查（目录结构、配置完整性）

第一周不需要用这些。等你积累了 10+ 篇笔记后，跑一次 `stats.sh` 看看数据。

## 常见坑

**“AI 没有按照协议行为”** — 检查适配文件（CLAUDE.md / .cursorrules 等）是否在文件夹根目录。如果放错了位置，AI 读不到它。另一个可能：你的 AI 工具的上下文窗口太小，协议文件被截断了。这是概率层的固有限制——确定性层（脚本）不受影响。

**“对话模式太慢，每次都要聊好几轮”** — 用快速模式。或者对 AI 说“今天用简洁模式，不要追问，直接帮我记”。协议支持这种切换。

**“不知道该说什么”** — 就说“刚解决了一个问题”或者“今天遇到了 X 报错”。第一周只记 problems/，范围很窄，不需要想太多。

**“笔记格式不对”** — 第一周不用在意格式。Level 0 没有格式要求。先养成“遇到问题就记一笔”的习惯。

**“我用的 AI 工具不在列表里”** — 如果你用的是 Windsurf、GitHub Copilot 或其他支持 system prompt 的工具，可以试试 Cursor 的 `.cursorrules` 适配文件。不保证完美兼容，但基本功能应该能用。

## 如果你第三天就不想用了

这很正常。学习 journaling 类工具的典型曲线是“前 3 天热情、第 2 周断崖”。

几个建议：

- 把目标降到最低——“遇到问题写一句话”也算。Level 0 就是为这个设计的。
- 只记 problems/——复用价值最快兑现，能给你正反馈。
- 如果连一句话都不想写，那可能这套方法不适合你，这没什么问题。不是所有人都需要结构化学习记录。

## 下一步

- [它是怎么工作的](/projects/learn-journal/how-it-works/)——理解背后的核心循环和自然复用
- [日常节奏](/claude-code/daily-rhythm/)——完整的日循环工作流（如果你用 Claude Code）
- [学习管理系统](/methodology/learning-management/)——工件选择和知识捕获的完整理论
