# 安装指南

## 前置条件

- 一个 AI 编程助手（Claude Code / Codex / CatDesk / Cursor，任选其一）
- 一个空文件夹（或已有项目的根目录）

不需要：git、Python、Node.js、任何编程经验。

---

## 方式一：最简安装（推荐）

### 步骤 1：下载 skill-pack

```bash
# 如果你有 git
git clone https://github.com/estelledc/learn-journal-app.git
cd learn-journal-app/skill-pack

# 如果没有 git，直接下载 ZIP 解压
```

### 步骤 2：复制到你的学习文件夹

```bash
# 创建学习文件夹
mkdir ~/my-learning
cd ~/my-learning

# 复制 skill-pack 内容
cp -r /path/to/learn-journal-app/skill-pack/* .
cp -r /path/to/learn-journal-app/skill-pack/.* . 2>/dev/null
```

### 步骤 3：创建配置文件

```bash
cp config.yaml.example config.yaml
# 编辑 config.yaml，填入你的名字和学习方向
```

### 步骤 4：放置适配文件

根据你用的 AI 工具，复制对应文件到根目录：

**Claude Code：**

```bash
cp adapters/claude-code/CLAUDE.md .
mkdir -p .claude/skills
cp -R skills/. .claude/skills/
```

**Codex：**

```bash
cp adapters/codex/AGENTS.md .
```

**CatDesk：**

```bash
# CatDesk 会自动读取 workspace rules，把 adapters/catdesk/CATDESK.md 内容
# 添加到 CatDesk 的 workspace rules 设置中
```

**Cursor：**

```bash
cp adapters/cursor/.cursorrules .
```

### 步骤 5：开始使用

打开你的 AI 助手，在学习文件夹中说：

> "帮我初始化学习空间"

AI 会引导你完成配置。

---

## 方式二：本地初始化脚本（如果你有 bash）

```bash
bash skill-pack/scripts/init.sh ~/my-learning
```

脚本只创建本地目录和配置，不从网络下载或执行远端脚本。完成后仍需按上面的步骤复制适配文件和平台 Skill。

---

## 初始化后的目录结构

```
~/my-learning/
├── CLAUDE.md (或 AGENTS.md 或 .cursorrules)  ← AI 入口
├── config.yaml                                ← 你的配置
├── protocols/                                 ← 方法论规则
├── templates/                                 ← 工件模板
├── skills/                                    ← 功能描述
├── daily/                                     ← 日报（空）
├── learnings/                                 ← 学习笔记（空）
├── problems/                                  ← 问题记录（空）
└── sources/                                   ← 学习材料（空）
```

---

## 日常使用

安装完成后，你只需要跟 AI 对话就行：

| 你说                      | AI 做什么              |
| ------------------------- | ---------------------- |
| "下班了" / "收工"         | 引导你写今天的日报     |
| "今天学了 X" / "搞懂了 X" | 帮你创建学习笔记       |
| "终于解决了那个 bug"      | 帮你记录问题和解决方案 |
| "不知道做什么" / "复习"   | 推荐复习或学习方向     |
| "检查一下知识库"          | 运行健康检查           |

---

## 常见问题

**Q：AI 没有按照规则行事怎么办？**

确认适配文件在项目根目录。有些 AI 工具需要重新打开项目才能读取新的规则文件。

**Q：可以跟已有项目一起用吗？**

可以。把 skill-pack 内容放到项目根目录即可。学习笔记和代码共存没有问题。

**Q：数据存在哪里？**

全部在你的本地文件夹里，都是普通 markdown 文件。没有云端、没有数据库、没有账号。

**Q：可以用 git 管理吗？**

可以但不强制。如果你想用 git，直接 `git init` 就行。scripts/lint-notes.py 可以作为 pre-commit hook 使用。

**Q：换了 AI 工具怎么办？**

换一个适配文件就行。你的数据（daily/learnings/problems/）完全不受影响。
