---
title: Skill 体系
description: 创建和使用可复用技能 — 把常见的提示词封装成 Skill，下次直接调用
tags: [claude-code]
difficulty: intermediate
prerequisites:
  - claude-code/config
relatedContent:
  - { slug: 'methodology/workflow-design', label: '工作流编排思路' }
  - { slug: 'claude-code/hooks', label: 'Hook 系统' }
  - { slug: 'claude-code/config', label: '核心配置' }
  - { slug: 'claude-code/dotfiles', label: '配置即代码' }
  - { slug: 'claude-code/daily-rhythm', label: '日常节奏' }
  - { slug: 'methodology/claude-md-philosophy', label: 'CLAUDE.md 编写哲学' }
  - { slug: 'methodology/prompt-anatomy', label: '系统提示解剖学' }
  - { slug: 'methodology/skill-engineering', label: 'Skill 工程化设计' }
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
---

## 这是什么

**Skill（技能）** 是可复用的任务指令包：把你反复说的一套步骤写成文件，下次用一条斜杠命令（如 `/commit`）就能触发。比如你每次提交代码都要说“分析变更、分组、生成规范的中文 commit message”，把它写成一个 Skill，下次直接 `/commit` 就行。

Skill 和 CLAUDE.md 的差别：CLAUDE.md 是“长期行为手册”；Skill 是“某一类任务的专用剧本”，按需加载，不会每次对话都塞满上下文。

## 类比

Skill 像厨房里的预制菜包——把“切菜、调味、控制火候”这些每次都重复的步骤打包好。你不用每次都从头描述流程，只需要说一个关键词（比如 `/commit` 或 `/render`），AI 就知道该执行哪套完整流程。

## 开始之前

- CLAUDE.md 和 settings.json 已经配置好（参考[核心配置](/claude-code/config/)）
- 你发现自己在重复输入相同类型的 prompt

## 实际操作

### 1. Skill 的结构

每个 Skill 是一个目录，入口文件固定叫 `SKILL.md`（文件名必须精确匹配，大小写敏感）：

```text
.claude/skills/my-skill/    ← 项目级：只在当前仓库生效
├── SKILL.md                ← 必填入口
├── references/             ← 可选：参考文档，Skill 需要时再读
└── scripts/                ← 可选：辅助脚本

~/.claude/skills/my-skill/  ← 个人级：所有项目都能用
└── SKILL.md
```

**YAML frontmatter** 是文件开头用 `---` 包住的元数据块；Claude Code 用它识别 Skill 名称和描述：

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

| 用户输入         | 模式             | 行为                                   |
| ---------------- | ---------------- | -------------------------------------- |
| `/commit`        | 分组模式（默认） | 分析所有变更，按主题自动分组，逐个提交 |
| `/commit single` | 合并模式         | 所有变更合为一个提交                   |
| `/commit amend`  | 追加模式         | 追加到上一个提交                       |
| `/commit <路径>` | 指定模式         | 只提交指定的文件或目录                 |

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

1. **模式表格放在最前面** — Claude 先判断用哪种模式，不会选错
2. **确认步骤不可跳过** — 提交是不可逆操作，必须等用户说“ok”
3. **安全检查内置** — 提交前检查敏感文件、跳过临时文件
4. **提交信息规范** — 定义清晰的格式：动词 + 对象：说明

这个 skill 比最开始的基本格式（5 步操作）复杂很多，但它解决的是真实问题：每天提交代码时不用重复输入“分析变更、分组、生成中文 commit message”。

### 3. 使用 Skill

在 Claude Code 对话中输入 `/commit`。普通 Skill 的命令名来自目录名 `commit/`；frontmatter 的 `name` 只是显示名，不会改掉你输入的命令。

### 4. Skill 的触发方式

- **显式调用**：用户输入 `/skill-name`
- **关键词触发**：Skill 描述中的关键词匹配用户输入
- **自动发现**：个人和项目 Skill 的描述会进入可用工具清单；完整正文只在用户或 Claude 调用时加载

## 动手试一试：从零创建你的第一个 Skill

不需要很复杂。我们来做一个“代码审查”Skill——你写完代码后输入 `/review`，Claude 自动帮你做检查。

### Step 1: 创建 Skill 目录和入口文件

在你的项目目录下创建文件（如果目录不存在，先 `mkdir -p`）：

```bash
mkdir -p .claude/skills/review
```

然后创建 `.claude/skills/review/SKILL.md`，写入以下内容：

```markdown
---
name: review
description: 审查最近的代码变更，检查常见问题
---

# 代码审查

当用户输入 /review 时执行以下步骤：

## 步骤

1. 运行 `git diff --stat` 查看有哪些文件被改动
2. 对每个改动文件，检查：
   - 是否有未处理的 TODO 或 FIXME
   - 变量命名是否清晰
   - 是否有重复代码可以提取
3. 用表格格式输出审查结果
4. 如果发现问题，给出具体修改建议
```

### Step 2: 测试你的 Skill

在 Claude Code 中输入：

```text
/review
```

Claude 会读取你的 Skill 文件并按步骤执行。如果没触发，检查入口是否精确叫 `.claude/skills/review/SKILL.md`，再确认 description 能清楚描述使用场景。新建顶层 skills 目录后，旧会话可能需要重启；已存在目录内的 `SKILL.md` 修改通常会被实时检测。

### Step 3: 迭代改进

第一版跑通后，根据实际使用中遇到的情况逐步增强。比如加上“忽略 node_modules”的规则、或者“只看最后一次 commit 的变更”。好的 Skill 是迭代出来的，不是一次写完的。

## 常见坑

- **Skill 不触发**：检查路径是否为 `.claude/skills/<命令名>/SKILL.md`，文件名大小写是否正确，description 是否包含真实触发场景。失败恢复：确认入口文件名精确为 `SKILL.md`；新建顶层 `skills/` 目录后重启会话；已存在目录内的修改通常会被实时检测，可再试一次 `/review`。
- **Skill 太泛化**：描述太模糊会误触发。描述写清楚触发条件。失败恢复：把 description 改成“仅在用户明确要求代码审查或输入 /review 时使用”，避免和日常闲聊撞车。
- **Skill 间冲突**：多个 Skill 匹配同一输入时，Claude Code 会问你选哪个。失败恢复：收窄各 Skill 的 description，或改用更具体的命令名。
- **Skill 示例太简单学不到东西**：教程里的示例通常是 5 步基础操作。真实 Skill 需要处理多种模式、异常情况和安全检查。先让最简单的版本跑通，再逐步加功能——不要一开始就写一个 200 行的 Skill。
- **想全局可用却放在了项目目录**：`.claude/skills/` 只对当前仓库生效。失败恢复：把目录移到 `~/.claude/skills/<命令名>/`，重启会话后再试。

## 最小可验证动作

一次坐下来约 10 分钟：

1. 在任意 git 项目里执行：

```bash
mkdir -p .claude/skills/review
```

2. 按上文写入 `.claude/skills/review/SKILL.md`
3. 在 Claude Code 中输入 `/review`
4. 确认 Claude 按步骤跑了 `git diff --stat`（或等价检查）并给出审查结果

**成功标准：** `/review` 有明确响应，且输出里能看到对当前变更的检查。若无响应，按“Skill 不触发”排查。

## Checkpoint

- [ ] 我能说出 Skill 目录必须叫什么、入口文件必须叫什么
- [ ] 我知道项目级（`.claude/skills/`）和个人级（`~/.claude/skills/`）的差别
- [ ] 我完成了上面的「最小可验证动作」，`/review`（或自建 Skill）能触发
- [ ] 若 `/format` 之类命令没反应，我知道先查路径、文件名、description，再考虑重启会话
- [ ] 我理解：先跑通最小版本，再迭代加模式与安全检查

## 下一步

- 了解 Skill 和其他配置的协同设计：[CLAUDE.md 编写哲学](/methodology/claude-md-philosophy/)——理解 Skill、CLAUDE.md、Hook 如何配合
- Hook 是 Skill 的互补工具 → [Hook 系统](/claude-code/hooks/)
- 想学工作流编排：[工作流编排思路](/methodology/workflow-design/)——把多个 Skill 串成高效管线
- 配置要进版本库时 → [配置即代码](/claude-code/dotfiles/)

官方依据（复核于 2026-07-10）：[Claude Code Skills](https://code.claude.com/docs/en/skills)。
