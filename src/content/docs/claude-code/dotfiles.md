---
title: 配置即代码
description: 把 Claude Code 配置纳入版本管理 — symlink 架构、新机初始化、模板与凭证安全
tags: [claude-code]
difficulty: advanced
prerequisites:
  - claude-code/config
  - claude-code/hooks
  - claude-code/memory
relatedContent:
  - { slug: 'methodology/claude-md-philosophy', label: 'CLAUDE.md 编写哲学' }
  - { slug: 'claude-code/skills', label: 'Skill 体系' }
  - { slug: 'claude-code/config', label: '核心配置' }
  - { slug: 'claude-code/hooks', label: 'Hook 系统' }
  - { slug: 'claude-code/memory', label: '记忆系统' }
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
---

## 这是什么

搬家时你不用重新买家具。一个 U 盘插上新电脑，跑一个脚本，所有配置自动到位。

**IaC（Infrastructure as Code，基础设施即代码）** 传统上用于管理服务器配置——用代码描述服务器应该装什么软件、开什么端口、设什么权限。你的 Claude Code 配置同样可以 IaC：CLAUDE.md、settings.json、Skill、Hook、Memory 全部纳入 git 版本管理。

本页说的 **dotfiles**，就是把这些“以点开头的配置目录/文件”（如 `~/.claude/`）收进一个 git 仓库，用脚本在新机器上复原。

**目标：** 换电脑 → clone 一个仓库 → 跑一个脚本 → Claude Code 完全恢复，包括所有偏好、规则、技能和记忆。

**安全警告（先读）：**

- API key、token、密码**绝对不能**进 git（含历史）
- 仓库里只放模板与占位符；真实 `settings.json` 本地生成并加入 `.gitignore`
- 若凭证曾误提交：立刻在服务端 revoke（吊销）该 key，并视为已泄漏
- Hook / MCP 配置随 dotfiles 传播时，同样只信任你自己审过的脚本与 server

**术语速查：**

| 词 | 含义 |
| --- | --- |
| symlink（符号链接） | 一个“指针”文件，指向真实文件路径；编辑链接目标 = 编辑源文件 |
| `envsubst` | 把文本里的 `${VAR}` 替换成环境变量实际值的命令 |
| 模板（template） | 含占位符、可安全进 git 的配置骨架 |
| revoke | 在服务端作废已泄漏的密钥，使其立即失效 |

## Symlink 架构

**Symlink（符号链接）** 像快捷方式：`~/.claude/` 下看到的文件其实指向 git 仓库里的源文件。

核心思想：所有配置文件的实际内容存在 git 仓库里，`~/.claude/` 下的文件通过 symlink 指向它们。编辑 `~/.claude/` = 编辑 git 仓库 = 自动跟踪。

```text
~/intern-journal/dotfiles/          ← git 仓库中的配置源
  home-claude/
    CLAUDE.md                       ← 全局 CLAUDE.md 的源文件
    settings.template.json          ← settings.json 的模板（不含真实凭证）
    memory/                         ← 记忆文件的源
    skills/                         ← Skill 定义的源
    hooks/                          ← Hook 脚本的源

~/.claude/
    CLAUDE.md        → symlink → dotfiles/home-claude/CLAUDE.md
    settings.json    ← 由 template + envsubst 生成（不跟踪）
    skills/          → symlink → dotfiles/home-claude/skills/
    hooks/           → symlink → dotfiles/home-claude/hooks/
```

上面是 Jason 的实际架构，以最小示例展示——不需要照搬，理解原理后按你的项目结构调整。

关键：编辑 `~/.claude/CLAUDE.md` 实际上在编辑 `dotfiles/home-claude/CLAUDE.md`——git 自动看到变更。不需要“备份”这一步——备份是自动的，它就是 git。

创建 symlink 的方法：

```bash
ln -sf ~/intern-journal/dotfiles/home-claude/CLAUDE.md ~/.claude/CLAUDE.md
```

`-s` = symbolic link（符号链接，像一个指针），`-f` = force overwrite if exists（如果目标已存在就覆盖）。

## 模板与凭证安全

敏感信息（API key、token、密码）绝对不能进 git。但你又想在 git 里保存配置结构——怎么办？

模板文件方案：

1. 在 git 里存 `settings.template.json`，敏感值用占位符
2. 生成真实 `settings.json` 时用环境变量替换
3. `settings.json` 在 `.gitignore` 中

模板示例 `settings.template.json`：

```json
{
  "model": "claude-sonnet-4",
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

> **注意**：Claude Code 的 API key 通过环境变量 `ANTHROPIC_API_KEY` 传入，不写在 settings.json 里。模板中只需要放 MCP server 等需要凭证的配置项。

生成真实配置：

```bash
envsubst < settings.template.json > settings.json
```

`envsubst` 把 `${VAR}` 替换为环境变量的实际值。生成的 `settings.json` 包含真实 API key，但它在 `.gitignore` 里——git 不会跟踪它。

验证安全性：

```bash
# 检查有没有意外把真实凭证写进了模板
grep -E '(sk-ant|sb_publishable|eyJ)' settings.template.json
# 应该没有输出。如果有 → 凭证泄漏，立即在服务端 revoke key
```

## 新机初始化

换新电脑时，初始化脚本的最小逻辑：

```bash
#!/bin/bash
# 1. Clone 配置仓库
git clone git@github.com:you/dotfiles.git ~/dotfiles

# 2. 创建 symlink
ln -sf ~/dotfiles/home-claude/CLAUDE.md ~/.claude/CLAUDE.md
ln -sf ~/dotfiles/home-claude/skills ~/.claude/skills
ln -sf ~/dotfiles/home-claude/hooks ~/.claude/hooks

# 3. 从模板生成 settings.json（需要先设置好环境变量）
envsubst < ~/dotfiles/home-claude/settings.template.json > ~/.claude/settings.json

# 4. 验证
claude --version
ls -la ~/.claude/CLAUDE.md  # 确认箭头指向 dotfiles
```

初始化脚本的本质：把你手动配置新电脑的每一步写成代码。第一次写花 30 分钟，以后每次换机器 30 秒。

## 双运行时共享

如果你同时用 Claude Code 和 Codex CLI（或其他 AI 编程工具），Skill 定义不需要维护两套。通过 symlink 让多个工具共享同一套 Skill 源：

```text
dotfiles/home-claude/skills/   ← 唯一源（git 跟踪）
~/.claude/skills/              → symlink（Claude Code 读这里）
~/.agents/skills/              → symlink（Codex 读这里）
```

修改一次，两个工具同步生效。不要手动维护两套 Skill——那是给自己找麻烦。

同样的模式可以扩展到其他共享配置：如果你有多个 AI 编程工具都需要知道你的偏好，把核心规则抽到一个共享文件，各工具的配置文件引用它。

## 什么应该进 dotfiles

**进：**

- 全局 CLAUDE.md（跨项目通用的规则）
- Skill 定义文件
- Hook 脚本
- settings.json 模板（不含凭证）
- Memory 文件
- 初始化脚本

**不进：**

- 项目级 CLAUDE.md（每个 git 项目自己管——它就是项目仓库的一部分）
- 包含真实凭证的文件
- 会话历史 / 日志
- node_modules / 依赖包
- 二进制文件

判断标准：“换一台新电脑，这个东西我需要手动重建吗？” 需要 → 进 dotfiles。不需要（比如项目本身的文件在项目仓库里）→ 不进。

## 常见坑与失败恢复

1. **编辑 ~/.claude/ 下的文件而不是 symlink 源**：如果创建 symlink 前文件已存在，或者某次操作替换了 symlink 为普通文件，你的编辑就不在 git 跟踪里。失败恢复：`ls -la ~/.claude/CLAUDE.md`——看输出中有没有 `->` 箭头；若没有，删掉普通文件后重新 `ln -sf` 指向仓库源。

2. **settings.json 含真实 API key 进 git**：即使你后来删了、加了 `.gitignore`，git 历史里还有。检查：`git log -p -- settings.json`。失败恢复：立刻在服务端 revoke 那个 key；从历史中清除敏感文件（或轮换仓库）；改用 template + envsubst，确保真实文件在 `.gitignore`。

3. **symlink 断掉**：源文件被移动或删除后，symlink 变成“悬空链接”。Claude Code 读不到配置但不会报明显错误。失败恢复：`ls -la ~/.claude/` 逐个看箭头；修复源路径后重链；用一句话问 Claude 验证全局规则是否仍生效。

4. **新机跑脚本前没装依赖**：git、node、jq、envsubst、Claude Code 本身——这些是脚本的前提。失败恢复：脚本开头加依赖检查（`command -v git` 等）；缺什么装什么，再重跑初始化。

5. **把项目级 CLAUDE.md 放进全局 dotfiles**：项目约定被错误地应用到所有仓库。失败恢复：项目特有规则留在各项目仓库的 `CLAUDE.md`；全局只保留跨项目永远适用的内容。

## 最小可验证动作

一次坐下来约 15 分钟（可在临时目录练习，不必立刻改你的真实 `~/.claude`）：

1. 建一个练习目录并放入一份假 CLAUDE.md：

```bash
mkdir -p ~/dotfiles-practice/home-claude
echo '- 练习规则：回复开头先说「dotfiles-ok」' > ~/dotfiles-practice/home-claude/CLAUDE.md
```

2. 备份（若已有）并创建 symlink：

```bash
# 若 ~/.claude/CLAUDE.md 已存在，先备份
test -e ~/.claude/CLAUDE.md && mv ~/.claude/CLAUDE.md ~/.claude/CLAUDE.md.bak-practice
mkdir -p ~/.claude
ln -sf ~/dotfiles-practice/home-claude/CLAUDE.md ~/.claude/CLAUDE.md
ls -la ~/.claude/CLAUDE.md   # 必须看到 -> 箭头
```

3. 新开 Claude Code 会话，问：“你的全局规则要求回复开头说什么？”
4. 练习结束后恢复备份（若有）：

```bash
rm ~/.claude/CLAUDE.md
test -e ~/.claude/CLAUDE.md.bak-practice && mv ~/.claude/CLAUDE.md.bak-practice ~/.claude/CLAUDE.md
```

**成功标准：** `ls -la` 显示 symlink；新会话能复述练习规则。同时用 `grep` 确认你的 **template** 里没有真实 key 形态的字符串。

## Checkpoint

- [ ] 我能解释：为什么用 symlink 后，编辑 `~/.claude/` 等于在改 git 仓库
- [ ] 我知道哪些进 dotfiles、哪些绝不进（尤其是真实凭证）
- [ ] 我完成了上面的「最小可验证动作」，或在真实 dotfiles 仓库里完成了等价的 symlink + 验证
- [ ] 我会用 `ls -la` 确认箭头，用 `grep` / `git log` 排查凭证泄漏
- [ ] 我知道泄漏后的第一步是 revoke key，而不是只删文件

## 下一步

- 回到配置基础 → [核心配置](/claude-code/config/)
- 理解这套架构的哲学 → [CLAUDE.md 编写哲学](/methodology/claude-md-philosophy/)
- Hook / Skill 也适合进 dotfiles → [Hook 系统](/claude-code/hooks/)、[Skill 体系](/claude-code/skills/)
- 看看另一个高级主题 → [子 Agent 协作](/claude-code/subagents/)
