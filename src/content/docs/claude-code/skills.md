---
title: Skill 体系
description: 创建和使用可复用技能 — 把常见的提示词封装成 Skill，下次直接调用
tags: [claude-code]
difficulty: intermediate
learningPaths:
  - ai-coding-zero
prerequisites:
  - claude-code/config
relatedContent:
  - {slug: "methodology/workflow-design", label: "工作流编排思路"}
lastVerified: "2026-06-12"
toolVersion: "Claude Code CLI (latest)"
---

## 这是什么

Skill 是可复用的任务指令。比如你每次提交代码都要说"分析变更、分组、生成规范的中文 commit message"，把它写成一个 Skill，下次直接 `/commit` 就行。

## 类比

Skill 像厨房里的预制菜包——把"切菜、调味、控制火候"这些每次都重复的步骤打包好，你只需要"这个我用/commit，那个我用/render"。

## Before you start

- CLAUDE.md 和 settings.json 已经配置好（参考[核心配置](/zero-to-ai/claude-code/config/)）
- 你发现自己在重复输入相同类型的 prompt

## 实际操作

### 1. Skill 的结构

Skill 文件放在 `.claude/skills/` 或 `~/.claude/skills/` 目录下，是普通的 markdown 文件：

```markdown
---
name: my-skill
description: 简短描述这个 Skill 做什么
---

# Skill 标题

当用户说 X 时触发。
步骤：
1. 做 A
2. 做 B
3. 做 C
```

### 2. 真实 Skill 示例：自动化提交

以 Jason 的 commit skill 为例。日常使用中，提交代码是最频繁的操作，一个好的 commit skill 能省下大量重复劳动。

这个 skill 支持 4 种工作模式：

| 用户输入 | 模式 | 行为 |
|---------|------|------|
| `/commit` | 分组模式（默认） | 分析所有变更，按主题自动分组，逐个提交 |
| `/commit single` | 合并模式 | 所有变更合为一个提交 |
| `/commit amend` | 追加模式 | 追加到上一个提交 |
| `/commit <路径>` | 指定模式 | 只提交指定的文件或目录 |

Skill 文件的结构（简化版展示关键设计）：

```markdown
---
name: commit
description: 分析 git 变更，按主题自动分组，逐个创建原子化提交
---

## 模式识别

根据用户输入选择执行模式（见上表）

## 执行步骤

### Step 1: 收集变更信息
git status + git diff --stat 看有哪些变更

### Step 2: 按主题分组
关联文件（同一目录/同一功能）合为一个提交

### Step 3: 展示分组方案，等待确认
⚠️ 必须暂停等用户确认，不直接提交

### Step 4: 执行提交
逐组 git add + git commit

### Step 5: 最终确认
git log --oneline 展示新提交
```

注意几个设计要点：

1. **模式表格放在最前面** -- Claude 先判断用哪种模式，不会选错
2. **确认步骤不可跳过** -- 提交是不可逆操作，必须等用户说"ok"
3. **安全检查内置** -- 提交前检查敏感文件、跳过临时文件
4. **提交信息规范** -- 定义清晰的格式：动词 + 对象：说明

这个 skill 比最开始的基本格式（5 步操作）复杂很多，但它解决的是真实问题：每天提交代码时不用重复输入"分析变更、分组、生成中文 commit message"。

### 3. 使用 Skill

在 Claude Code 对话中输入 `/my-commit`。

### 4. Skill 的触发方式

- **显式调用**：用户输入 `/skill-name`
- **关键词触发**：Skill 描述中的关键词匹配用户输入
- **自动加载**：`~/.claude/skills/` 下的 Skill 所有会话自动可用

## 常见坑

- **Skill 不触发**：检查文件在 `.claude/skills/` 下（不是子目录的深层位置）。确认 frontmatter 的 `name` 字段没有和已有 Skill 冲突。
- **Skill 太泛化**：描述太模糊会误触发。描述写清楚触发条件。
- **Skill 间冲突**：多个 Skill 匹配同一输入时，Claude Code 会问你选哪个。
- **Skill 示例太简单学不到东西**：教程里的示例通常是 5 步基础操作。真实 Skill 需要处理多种模式、异常情况和安全检查。先让最简单的版本跑通，再逐步加功能——不要一开始就写一个 200 行的 Skill。

## 下一步

- 想看完整的 Skill 示例：[CLAUDE.md 编写哲学](/zero-to-ai/methodology/claude-md-philosophy/) -- 了解怎么让 Skill 和其他配置协同工作
- 想学工作流编排：[工作流编排思路](/zero-to-ai/methodology/workflow-design/) -- 把多个 Skill 串成高效管线
