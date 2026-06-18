---
title: 核心配置
description: CLAUDE.md、settings.json 和 Hook 系统 — Claude Code 的灵魂配置
tags: [claude-code]
difficulty: intermediate
learningPaths:
  - ai-coding-zero
  - advanced-custom
prerequisites:
  - claude-code/quickstart
relatedContent:
  - { slug: 'methodology/claude-md-philosophy', label: 'CLAUDE.md 编写哲学' }
  - { slug: 'claude-code/skills', label: 'Skill 体系' }
  - { slug: 'methodology/workflow-design', label: '工作流编排思路' }
  - { slug: 'claude-code/hooks', label: 'Hook 系统' }
  - { slug: 'claude-code/quickstart', label: '10 分钟上手' }
  - { slug: 'claude-code/cost', label: '成本与计费' }
  - { slug: 'claude-code/mcp', label: 'MCP 集成' }
lastVerified: '2026-06-18'
toolVersion: 'Claude Code CLI (latest)'
---

## 这是什么

Claude Code 的核心配置文件决定了 AI 的行为方式、权限范围、以及在不同项目中的“人格”。配置得当，Claude Code 从“偶尔用用”变成“日常高效搭档”。

三个配置层级的职责分工：

- **CLAUDE.md**：告诉 Claude“在这个项目里，我们怎么做”—— 行为规范、工作流、项目结构
- **settings.json**：告诉 Claude“在这个项目里，你能做什么”—— 权限边界、允许/禁止的操作
- **Hook 系统**：在特定时机自动触发检查 —— 门禁、提醒、上下文注入

## 类比

**CLAUDE.md** 像入职第一天交给新同事的“工作手册”—— 告诉他你的工作习惯、常用工具、不能碰的雷区、什么情况下该走什么流程。每一行规则都在说：“在这个项目里，我们这样做。”

**settings.json** 像公司 IT 部门的“权限清单”—— 规定哪些操作需要审批、哪些可以自己决定。它只管边界，不管方法。

**Hook 系统** 像大楼的门禁系统 —— 有人刷卡（事件发生）时自动检查权限、记录日志、或开门放行。你不用每次手动说“检查一下这个”，它是自动的。

## 开始之前

- 已经用 Claude Code 完成过至少 5-10 次对话任务，对基本用法不陌生
- 能区分“全局行为”和“项目特定行为”的差别
- 理解终端命令的基本概念（路径、权限、脚本可执行性）

## 实际操作

### 1. CLAUDE.md 实战 — 用真实范例学

下面是一个经过实战打磨的 CLAUDE.md（来自 Jason 的实习日志项目，超过百行），拆开讲解每个部分的存在理由。

#### 项目身份 — 告诉 Claude“我在什么项目里”

```markdown
## 项目身份

- **用途**：实习生结构化学习记录系统
- **用户画像**：零经验初学者，中文环境
- **风格**：先日常类比再技术定义；结论先行；列表 > 段落；不用 emoji
```

这三行看似简单，实际决定了 Claude 的整个“人格”：

- `用途`：Claude 知道自己的任务是“辅助学习记录”，不是“写产品代码”。同样是让你“解释一个概念”，Claude 在实习日志项目里会用教学口吻，在产品项目里会简洁直给。
- `用户画像`：零经验初学者 —— Claude 不会假设你懂术语，每次解释从日常类比开始。如果这一行写成“高级工程师”，Claude 会跳过基础解释，直接给技术方案。
- `风格`：这是输出格式的硬约束。没有这一行，Claude 可能会用 emoji、段落叙事、先讲结论再讲过程。有了它，Claude 的输出风格就固定了。

#### 目录与模板 — 告诉 Claude“文件放哪里”

```markdown
## 目录与模板

| 目录       | 模板                   | 触发时机     |
| ---------- | ---------------------- | ------------ |
| daily/     | daily/\_template.md    | 每天下班前   |
| learnings/ | learnings/template.md  | 学会新东西时 |
| problems/  | problems/\_template.md | 遇到问题时   |
```

为什么需要这个表？因为 Claude 不知道你的项目有哪些目录、每个目录用来放什么、什么时候该创建文件。这张表解决了三个问题：

1. **什么时候创建**：用户说“我懂了”→ Claude 自动建议写 `learnings/`；用户说“遇到个 bug”→ Claude 引导记 `problems/`
2. **用哪个模板**：创建新文件时不凭空写，而是复制模板文件，保证格式统一
3. **不怕忘记**：你不需要每次手动告诉 Claude“用这个模板”，它自己会查表

下面的“工件选择判断”进一步明确优先级 —— 命中即停，防止选错目录：

```markdown
**工件选择判断**（命中即停）：

1. mentor / 同事 / code review 给的反馈 → feedback/inbound/
2. 新概念 / 模式 / 技能（未来可复用）→ learnings/
3. 排查 > 30min 且根因清晰可写 → problems/
4. 其他（含小困难、todo、心得）→ daily/
```

#### SOP — 告诉 Claude“遇到这个场景做什么”

```markdown
## SOP（按场景查）

### 每日循环

**触发**：用户说"下班了"/"收工"/"今天就到这"
Claude 的职责：

1. 日报：提示填 daily/YYYY-MM-DD.md
2. 问题：先引导排查（"观察到什么？""试过什么？"）
3. 知识捕获：用户表达"懂了" → 建议写 learnings/
```

SOP = Standard Operating Procedure（标准操作流程）。这一段是 Claude 的行为剧本 —— 不需要你在每次对话中重复说“帮我记笔记”“帮我排查问题”“帮我填日报”。Claude 看到触发词就自动执行。

同样的模式用在其他场景：

```markdown
### 源码学习

**触发**：/source-learn 或讨论 projects/ 下源码

1. 精读模式每段暂停等用户消化
2. 提炼模式必须写 learnings/，不能只停留对话
```

#### Skill 协作 — 告诉 Claude“有哪些工具可以用”

```markdown
## Skill 协作

| 学习阶段     | 主 skill      | 触发信号          |
| ------------ | ------------- | ----------------- |
| 不知道做什么 | /learn        | "下一步/学习进度" |
| 缺口研究     | /research-gap | "找资料/缺口"     |
| 读源码       | /source-learn | "读代码/精读"     |
```

这个表做了两件事：一是列出了项目中可用的 skill，二是告诉 Claude 什么时候该调用哪个 skill。用户不需要记住 14 个 skill 名字 —— 只要自然说话，Claude 自己匹配。

#### 行为准则 — 因为失败而存在的规则

```markdown
## 行为准则

- 用户阅读优先开 html（open path/foo.html）；agent 自己读 md
- 不重复创建已有学习笔记 → 处理请求前先 grep learnings/ problems/
- 多文件改动 / 架构级重构 → 必须先 EnterPlanMode
```

这些规则不是“我觉得应该这样”，而是“Claude 曾经做错了，造成了实际损失，所以我加上这条规则”。每条规则背后都有一个故事。

#### 全局 vs 项目 — 两层架构

Claude Code 实际加载两层 CLAUDE.md：

1. **全局** `~/.claude/CLAUDE.md` —— 所有项目都加载，放跨项目通用的内容
2. **项目** `<项目根目录>/CLAUDE.md` —— 只在这个项目里生效，放项目特有的内容

| 放全局                              | 放项目                                  |
| ----------------------------------- | --------------------------------------- |
| 跨项目永远适用                      | 只在这个项目有用                        |
| 教学节奏偏好（“小段讲解 + 等回答”） | 项目特定目录结构（daily/、learnings/）  |
| 输出风格要求（“列表 > 段落”）       | 项目特定的命令/工具（/commit、/render） |
| 工具使用规范（Read 不用 Bash cat）  | 项目特定的行为底线（“不重复创建笔记”）  |
| 工作目录地图（多个项目的位置）      | 项目特定的模板和工作流                  |

原则：**全局放一次，所有项目受益。项目只放上下文特有的规则，不重复全局规则。**

举例：Jason 的全局 CLAUDE.md 里写了“技术解释从日常类比开始”，那所有项目的 Claude 都会这样做。实习日志项目就不需要再写一遍。实习日志项目只写自己特有的东西 —— 日报怎么填、learnings 放哪个目录、skill 协作表。

### 2. 错误日志模式 — 好规则是“长”出来的

一个好的 CLAUDE.md 不是一次性设计出来的，而是在使用中逐步“长”出来的。具体做法：

1. Claude 犯了一个错误（比如创建了重复的文件）
2. 打开 CLAUDE.md
3. 新增一行规则：“Claude 不要 **\_**”
4. 自问：“删掉这行，Claude 会再犯同样的错吗？”
5. 如果不会 —— 删掉（这是过时的规则）
6. 如果会 —— 保留（这是好规则）

**真实案例**：Jason 的 `不重复创建已有学习笔记` 规则是怎么来的？

有一天 Claude 创建了一篇新的 learnings 笔记，但 Jason 之前已经写过同一主题。两篇内容有重叠，知识库出现了分歧。根因是 Claude 在创建前没有检查是否已有相关笔记。

修复：在 CLAUDE.md 的行为准则里加上 `不重复创建已有学习笔记 → 处理请求前先 grep learnings/ problems/`。之后每次处理请求，Claude 都会先 grep 已有笔记，确认不重复再创建。这条规则上线后再也没出现过重复。

**定期修剪**：每两周回顾一次 CLAUDE.md，逐条问“删掉这行 Claude 会犯什么错？”。删掉那些答案模糊的规则。好规则的特点是：删掉后 Claude 立刻会以某种具体方式做错。

### 3. 100-200 行 — 最好的长度

- **太短（<20 行）**：不够具体，Claude 知道的信息太少，行为跟没配置差不多。比如只写“技术栈：React + TypeScript”，Claude 不知道你的项目结构、工作流、偏好。
- **太长（>500 行）**：Claude 不会仔细读每一行，后面的规则可能被忽略。而且每次都吃掉几百行 context，浪费 token。
- **刚好（100-200 行）**：覆盖项目身份、目录结构、SOP、skill 协作、行为准则 —— 不臃肿不空洞。Jason 的 CLAUDE.md 就在这个区间。

判断标准：拿出一条规则，问“删掉它，Claude 会犯具体什么错？”如果答不出来，这条规则就不该存在。

### 4. settings.json — 权限与行为

`~/.claude/settings.json`（全局）或 `<项目>/.claude/settings.json`（项目级）：

```json
{
  "permissions": {
    "allow": ["Bash(npm test:*)", "Bash(git diff:*)", "Bash(git status:*)"],
    "deny": ["Bash(rm -rf:*)", "Bash(git push --force:*)"]
  }
}
```

除了权限，settings.json 还能控制：

- **`model`**：指定使用的模型，如 `"claude-sonnet-4"`、`"claude-opus-4"`。项目级设置覆盖全局设置。注意 Anthropic 会定期更新模型名——比如原来的 `claude-sonnet-4-20250514` 可能在后续更新中被新版本替代。建议使用不带日期后缀的短名（如 `"claude-sonnet-4"`），这样 Anthropic 更新时你不需要手动改配置
- **`permissions.bash.maxOutputSize`**：限制 bash 命令的输出大小，防止 Claude 读入太多无用输出
- **全局与项目级合并**：项目级 settings.json 的权限是“收紧”的方向 —— allow 列表取交集，deny 列表取并集

**CLAUDE.md vs settings.json 的分工**：

| 问题                            | 答案在哪                     |
| ------------------------------- | ---------------------------- |
| Claude 可以做 X 吗？            | settings.json（PERMISSIONS） |
| Claude 应该怎么做 X？           | CLAUDE.md（BEHAVIOR）        |
| 禁止 Claude 执行 `rm -rf`       | settings.json.deny           |
| Claude 写文件前先 grep 已有内容 | CLAUDE.md 行为准则           |

一个判断方法：如果规则是“Claude 不要做 **\_**”，先想这是权限问题还是行为问题。操作层面的禁止（删文件、强推代码）放 settings.json；行为层面的规范（检查重复、用对模板）放 CLAUDE.md。

### 5. Hook 入门 — 事件驱动的自动化

Hook 是 Claude Code 的事件触发器：在特定时刻（事件发生）自动执行你设定的脚本（响应动作）。四种类型覆盖了操作前拦截（PreToolUse）、操作后检查（PostToolUse）、会话开始注入上下文（SessionStart）、会话结束记录日志（SessionStop）。

Hook 在 `settings.json` 中注册，脚本通过 stdin 接收事件 JSON、通过 stdout 返回决策 JSON。一个最小示例——拦截 `git add .`：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "~/.claude/hooks/guard-git-add.sh" }]
      }
    ]
  }
}
```

Hook 的完整教程（4 种类型的详细示例、分层防御思维、调试方法、常见坑）见 [Hook 系统](/claude-code/hooks/)。

### 6. 常见坑

- **CLAUDE.md 写了不生效**：确认文件在项目根目录（不是 src/ 下）。重开 Claude Code 会话加载新配置。已经打开的会话不会自动重读 CLAUDE.md。

- **settings.json 权限太窄**：一开始就把 deny 写满，结果 Claude 什么操作都被拦截。正确的节奏是：从允许开始，发现哪些操作不该让 Claude 做，再加 deny。

- **CLAUDE.md 和 settings.json 放错了东西**：把“不要用 git add .”写在 CLAUDE.md 里 —— Claude 可能听也可能不听，因为是行为建议不是权限阻止。应该放 settings.json.deny。反过来，把“写文件前先 grep 已有内容”放 settings.json 也实现不了 —— settings.json 只能允许/阻止操作，不能指导行为。行为规范放 CLAUDE.md，权限控制放 settings.json。

- **Hook 脚本能执行吗**：新建的 Hook 脚本默认没有执行权限。需要 `chmod +x ~/.claude/hooks/pre-tool-use.sh`。如果 Hook 注册后不生效，先手动跑一遍脚本看有没有报错。

- **全局和项目配置冲突**：项目级 settings.json 会收紧全局权限（allow 取交集，deny 取并集）。如果 Claude 在某个项目里做不了全局允许的操作，检查项目级 settings.json 的 deny 列表。

- **Hook 路径**：settings.json 里的 Hook 命令可以用绝对路径，也可以用相对路径（相对项目根目录）。建议用绝对路径避免混淆。

### 7. Checkpoint 练习

1. 打开你的 CLAUDE.md，逐条问“删掉这行 Claude 会犯什么错？”。删掉 3 条答不出具体场景的规则。
2. 新增 1 条规则：今天 Claude 犯了什么错？按照错误日志模式写。
3. 创建一个 PreToolUse Hook 脚本，阻止 `git push --force`。
4. 用 `chmod +x` 给它执行权限，在 settings.json 中注册。
5. 你的 CLAUDE.md 的行数在 100-200 之间吗？过长就修剪，过短就补充。

### 8. 下一步

- 配置好了基础？学 [Skill 体系](/claude-code/skills/) —— 把常见的任务封装成可复用技能
- 想看配置背后的设计思想：[CLAUDE.md 编写哲学](/methodology/claude-md-philosophy/)
- 想把多个 skill 串联成自动化工作流：[工作流编排思路](/methodology/workflow-design/)
- 想让 Claude 记住跨会话的信息：[记忆系统设计原则](/methodology/memory-system-design/)
