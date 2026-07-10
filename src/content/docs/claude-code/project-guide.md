---
title: 写一份项目指令文件
description: 把你在前面学到的配置、上下文、Skill、记忆系统全串起来，为自己的项目写一份 CLAUDE.md — 零基础路径的第二个实操交付
tags: [claude-code]
difficulty: beginner
prerequisites:
  - claude-code/first-page
  - claude-code/skills
  - claude-code/memory
relatedContent:
  - { slug: 'claude-code/first-page', label: '你的第一个 AI 页面' }
  - { slug: 'claude-code/config', label: '配置三层结构' }
  - { slug: 'claude-code/skills', label: 'Skill 系统' }
  - { slug: 'claude-code/memory', label: '记忆系统' }
  - { slug: 'methodology/claude-md-philosophy', label: 'CLAUDE.md 编写哲学（进阶）' }
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
---

## 这是什么

你已经能用 Claude Code 做出一个页面了。但每次开新对话，Claude 都像个失忆的新同事——不知道你的项目结构、不知道你踩过什么坑、不知道你的偏好。你得反复解释同样的事情。

这一页带你写一份 **CLAUDE.md**——项目根目录的指令文件。写完之后，Claude 每次打开你的项目都会自动读取它，像一个看过了交接文档的同事一样开始工作。

这是零基础路径的第二个实操交付。第一个（[你的第一个 AI 页面](/claude-code/first-page/)）让你做出了东西；这一个让你和 AI 的协作质量从“每次重新解释”升级到“打开就能干活”。

## 类比

CLAUDE.md 就像餐厅后厨的交接本。

白班厨师下班前在本子上写：今天酱油快用完了（**踩坑记录**）；周五有 30 人包场要提前备菜（**项目背景**）；切洋葱用 3 号刀不要用 5 号，5 号有缺口（**工具偏好**）。晚班厨师上班翻一遍本子，不用问任何人就知道该注意什么。

没有交接本的后厨，每次换班都在重复犯同样的错。有交接本的后厨，错误只犯一次。

CLAUDE.md 就是你和 AI 之间的交接本。但和纸质本不同的是——Claude 每次打开项目会**自动**读它，不需要你提醒。

## 开始之前

你需要具备：

- 完成了 [你的第一个 AI 页面](/claude-code/first-page/)，手里有一个可以工作的项目目录
- 理解 [Skill 系统](/claude-code/skills/) 的基本概念（指令文件在 Skill 目录层级中的位置）
- 理解 [记忆系统](/claude-code/memory/) 的运作方式（CLAUDE.md 是“每次都读”的记忆，Memory 是“按需检索”的记忆）

如果还没有自己的项目目录，先回到 [first-page](/claude-code/first-page/) 创建一个。

## 先看一个真实案例

在教你动手写之前，先看看一份在真实项目中用了几个月的 CLAUDE.md 长什么样。

下面这份来自一个全栈 AI 应用项目（React + FastAPI + Docker），已经脱敏处理，但结构和写法都是真实使用中打磨出来的：

```markdown
# 项目指令文件

> 全栈 AI 应用 — React 19 + FastAPI + PostgreSQL + Redis + Celery + Docker Compose
> 文档入口: docs/guides/WORKFLOW.md（开发流程）| DEPLOY.md（运维手册）

## 常用命令

### 本机

git pull origin main # 拉最新代码
git diff --cached # 查看暂存区改了什么
npm run build --prefix frontend # 前端构建

### 开发服务器

make remote cmd="docker compose logs -f backend --tail 100" # 看后端日志
make remote cmd="docker compose exec backend pytest -x" # 跑测试
make remote cmd="docker compose restart backend" # 重启后端

## 踩坑记录

| 现象                         | 根因                                 | 修复                                            |
| ---------------------------- | ------------------------------------ | ----------------------------------------------- |
| CSV 导出中文乱码             | Excel 需要 UTF-8 BOM 头              | 写文件时加 `\ufeff` 前缀                        |
| 前端拿到的字段名和后端不一致 | 后端 snake_case，前端 camelCase      | API 层已有自动转换，但 URL 查询参数需要手动处理 |
| Docker 构建莫名失败          | poetry.lock 和 pyproject.toml 不同步 | 每次改依赖后先跑 `poetry lock --no-update`      |
| 数据库迁移报"多个 head"      | 多人同时新增迁移文件                 | `alembic merge heads` 合并后再迁移              |

## 推送前必查

| 改了什么        | 必须做                                         |
| --------------- | ---------------------------------------------- |
| 后端 Python     | `pytest -x` 全过 + `ruff check` 无报错         |
| 前端 TypeScript | `npm run build` 无报错 + `npm test` 全过       |
| 数据库模型      | 生成迁移文件 `alembic revision --autogenerate` |
| Docker 配置     | 本地 `docker compose build` 验证               |
| 环境变量        | 同步更新 .env.example                          |

## 关键设计决策

- 前端状态管理用 Zustand，不用 Redux — 项目体量不需要那么重的方案
- 后端 Worker 按任务类型拆成独立队列 — 语音识别、图像处理、AI 推理互不阻塞
- 外部 AI API 调用包了熔断器 — 第三方服务挂了不会拖垮整个系统
- 用户 Token 配额在数据库层面做原子扣减 — 防止并发超扣
```

这份文件大约 60 行。注意几个特点：

**只写 Claude 会反复犯的错**。踩坑记录表里的 4 条都是真实翻车之后加进去的，不是预设的。如果 Claude 从没犯过“CSV 乱码”的错，这条就不应该出现在文件里。

**命令是可以直接复制粘贴的**。不写“运行测试命令”，而是写 `pytest -x`。Claude 可以直接执行，不需要猜。

**设计决策写“不用什么”**。“用 Zustand，不用 Redux”比单独写“用 Zustand”更有价值——它告诉 Claude 不要建议你换成 Redux。

## 实际操作

现在轮到你了。我们为你在 [first-page](/claude-code/first-page/) 中创建的项目写一份 CLAUDE.md。

### 1. 打开你的项目

**macOS / Linux：**

```bash
cd ~/Desktop/my-page    # 替换成你的实际项目目录
pwd
ls
```

**Windows PowerShell：**

```powershell
cd ~\Desktop\my-page    # 替换成你的实际项目目录
pwd
dir
```

如果你还记得当时的目录名，直接进去。如果不记得：

- macOS / Linux：`ls ~` 或 `ls ~/Desktop`
- Windows PowerShell：`dir ~` 或 `dir ~\Desktop`

确认目录里已有 `index.html`（或你的项目入口文件）再继续。

### 2. 用 Claude 创建最小版本

启动 Claude Code，然后用一句话让它帮你生成初始版本：

```bash
claude
```

```text
帮我在项目根目录创建 CLAUDE.md，包含：
1. 一句话描述这个项目是什么
2. 我常用的命令（打开页面、启动开发服务器之类的，写成可复制粘贴的命令）
3. 一个空的踩坑记录表（现象/根因/修复三列）
4. 一个「偏好」小节，先放：用中文回复
不要写空话，不要编造我没踩过的坑。
```

Claude 会生成一份初始文件。不用纠结它写得好不好——你接下来会改。

**成功标准**：项目根目录出现名为 `CLAUDE.md` 的文件（注意大小写）。

确认文件存在：

```bash
ls -la CLAUDE.md
```

Windows PowerShell：

```powershell
Get-Item CLAUDE.md
```

如果文件名变成了 `claude.md` 或 `Claude.md`：在多数系统上可能仍能工作，但为避免跨平台差异，请改成全大写 `CLAUDE.md`：

```bash
mv claude.md CLAUDE.md
```

PowerShell：

```powershell
Rename-Item claude.md CLAUDE.md
```

### 3. 检查并修正项目描述

打开生成的 CLAUDE.md，看第一段。它应该能用一句话告诉一个新 Claude 会话“这是什么项目”。

好的项目描述：

```markdown
> 个人介绍页面 — 纯 HTML/CSS，用浏览器直接打开，不需要服务器
```

不好的项目描述：

```markdown
> 这是一个使用 Claude Code 构建的项目，旨在帮助用户创建个人网页...
```

第二个版本说了一堆正确的废话，但没告诉 Claude 任何有用的信息。用你自己的话重写它。

也可以让 Claude 按你的口述改：

```text
把 CLAUDE.md 开头的项目描述改成一句话：这是个人介绍页，纯 HTML/CSS，浏览器直接打开，不需要服务器。删掉所有正确但无用的套话。
```

### 4. 补充你真正踩过的坑

回忆一下做 first-page 时遇到过什么问题。比如：

- 打开 `index.html` 看到空白页？（可能是文件路径写错了）
- CSS 改了但浏览器没反应？（缓存问题，需要强制刷新）
- Claude 生成的代码在手机上显示错乱？（没加 viewport meta 标签）

如果你确实踩过这些坑，加进表格：

```markdown
## 踩坑记录

| 现象                    | 根因               | 修复                                          |
| ----------------------- | ------------------ | --------------------------------------------- |
| 改了 CSS 但浏览器没变化 | 浏览器缓存了旧文件 | Cmd+Shift+R 强制刷新（Windows: Ctrl+Shift+R） |
```

也可以直接让 Claude 追加（把现象换成你真实遇到的）：

```text
在 CLAUDE.md 的踩坑记录表里追加一行：
现象：改了 CSS 但浏览器没变化
根因：浏览器缓存了旧文件
修复：macOS 用 Cmd+Shift+R，Windows/Linux 用 Ctrl+Shift+R 强制刷新
```

如果你没踩过任何坑，表格留空就好。**不要编造没发生过的问题**——以后真的踩坑了再加。

### 5. 加上你的偏好

这是 CLAUDE.md 最容易被忽略但最有价值的部分。想想你和 Claude 合作时有什么偏好：

```markdown
## 偏好

- 用中文回复，代码注释也用中文
- 改代码前先告诉我要改哪里、为什么，等我确认再动手
- HTML 标签用小写，缩进用 2 个空格
```

这些偏好每个人都不一样。写下来之后，你就不用每次对话都重复说“请用中文”了。

### 6. 验证它能被读取

保存文件后，关掉当前 Claude Code 会话（`Ctrl + C` 或退出），重新在**同一项目目录**启动一个新会话：

```bash
claude
```

然后问它：

```text
这个项目是做什么的？请根据项目指令文件回答，不要猜。
```

**成功标准**：Claude 能准确回答（比如“这是一个个人介绍页面，纯 HTML/CSS”），且内容与你写在 CLAUDE.md 里的描述一致。

如果它含糊其辞或答非所问，按下面排查：

1. 确认你在项目根目录启动了 `claude`（`pwd` 应指向含 `CLAUDE.md` 的目录）
2. 确认文件名是 `CLAUDE.md`，不是别的名字
3. 再问一次：

```text
请列出你读到的 CLAUDE.md 里的项目描述和偏好条目。如果读不到，告诉我你当前工作目录。
```

## 做完了，你手里有什么

- 一份 **CLAUDE.md** 文件，放在项目根目录
- 内容包含：项目描述（1 句话）、常用命令、踩坑记录表、个人偏好
- 新开的 Claude 会话能自动识别你的项目，不再需要从头解释

这份文件现在可能只有 20-30 行。这完全正常——前面看到的那份 60 行的案例，是经过几个月使用、反复添加踩坑记录后才变成那样的。你的 CLAUDE.md 会随着项目一起成长。

## 常见坑

**写太多**：把项目所有代码的文档都塞进 CLAUDE.md。这不是 API 文档——只放 Claude 需要反复知道的信息。如果某个信息只在特定任务中有用，放在子目录的 CLAUDE.md 或者 Memory 里更合适。

**写太抽象**：写“遵循最佳实践”这种正确但无用的话。Claude 自己也知道最佳实践。要写具体的、你这个项目特有的约束和偏好。

**从不更新**：写完一次就忘了。CLAUDE.md 应该是活文档——每次 Claude 犯了一个你不想再看到的错，就加一条踩坑记录。可复制这句话：

```text
把刚才这个错误总结成一行，追加到 CLAUDE.md 的踩坑记录表：现象 / 根因 / 修复。
```

**和 Memory 混淆**：CLAUDE.md 是“每次必读”，适合放不变的项目规则和配置；Memory 是“按需检索”，适合放随时间变化的上下文。如果一条信息需要 Claude 每次都知道，放 CLAUDE.md；如果只是偶尔需要回忆，放 Memory。

**在错误目录启动会话**：CLAUDE.md 只对“当前工作目录所属的项目”生效。如果你在家目录启动 `claude`，它读不到 `~/Desktop/my-page/CLAUDE.md`。先 `cd` 进项目再启动。

**把密钥写进 CLAUDE.md**：不要写入 API key、密码、token。指令文件常被提交到 Git；密钥应走环境变量或本机私密配置，详见[核心配置](/claude-code/config/)与[成本与计费](/claude-code/cost/)中的安全提醒。

## Checkpoint

- [ ] 项目根目录有 `CLAUDE.md`（用 `ls -la CLAUDE.md` 或 `Get-Item CLAUDE.md` 确认）
- [ ] 文件里有一句话项目描述——新 Claude 会话能正确回答“这个项目是做什么的”
- [ ] 常用命令是可以直接复制粘贴执行的——不是“运行构建命令”而是具体的 `open index.html` / `start index.html`
- [ ] 踩坑记录来自真实经历——没有编造不存在的问题（空表也可以）
- [ ] 至少有一条个人偏好——Claude 不再需要你每次重复的那件事

全部勾上？你已经从“能用 AI 做东西”升级到了“能和 AI 高效协作”。接下来学习日常节奏，把这种协作变成每天的工作方式。

## 下一步

- 想深入理解 CLAUDE.md 的设计哲学？→ [CLAUDE.md 编写哲学](/methodology/claude-md-philosophy/)，那篇讲“删不掉的就是好规则”测试、100-200 行的 sweet spot、两层架构
- 想把日常使用 Claude Code 变成固定节奏？→ [日常工作节奏](/claude-code/daily-rhythm/)，学完这篇你就知道每天开工、收工该做什么
- 想学更复杂的项目指令文件？→ 前面案例中的踩坑表、推送前必查表、Skill 路由表，都在 [配置三层结构](/claude-code/config/) 和 [Skill 工程化](/methodology/skill-engineering/) 中有更深入的讲解
