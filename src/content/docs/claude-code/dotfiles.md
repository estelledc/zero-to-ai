---
title: 配置即代码
description: 把 Claude Code 配置纳入版本管理 — symlink 架构、新机初始化、模板与凭证安全
tags: [claude-code]
difficulty: advanced
learningPaths:
  - advanced-custom
prerequisites:
  - claude-code/config
  - claude-code/hooks
  - claude-code/memory
relatedContent:
  - { slug: 'methodology/claude-md-philosophy', label: 'CLAUDE.md 编写哲学' }
  - { slug: 'claude-code/skills', label: 'Skill 体系' }
lastVerified: '2026-06-12'
toolVersion: 'Claude Code CLI (latest)'
---

## 这是什么

搬家时你不用重新买家具。一个 U 盘插上新电脑，跑一个脚本，所有配置自动到位。

IaC（Infrastructure as Code）传统上用于管理服务器配置——用代码描述服务器应该装什么软件、开什么端口、设什么权限。你的 Claude Code 配置同样可以 IaC：CLAUDE.md、settings.json、Skill、Hook、Memory 全部纳入 git 版本管理。

目标：换电脑 → clone 一个仓库 → 跑一个脚本 → Claude Code 完全恢复，包括所有偏好、规则、技能和记忆。

## Symlink 架构

核心思想：所有配置文件的实际内容存在 git 仓库里，`~/.claude/` 下的文件通过 symlink 指向它们。编辑 `~/.claude/` = 编辑 git 仓库 = 自动跟踪。

```
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

关键：编辑 `~/.claude/CLAUDE.md` 实际上在编辑 `dotfiles/home-claude/CLAUDE.md`——git 自动看到变更。不需要"备份"这一步——备份是自动的，它就是 git。

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
  "apiKey": "${ANTHROPIC_API_KEY}",
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

```
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

判断标准："换一台新电脑，这个东西我需要手动重建吗？" 需要 → 进 dotfiles。不需要（比如项目本身的文件在项目仓库里）→ 不进。

## 常见坑

1. **编辑 ~/.claude/ 下的文件而不是 symlink 源**：如果创建 symlink 前文件已存在，或者某次操作替换了 symlink 为普通文件，你的编辑就不在 git 跟踪里。验证：`ls -la ~/.claude/CLAUDE.md`——看输出中有没有 `->` 箭头

2. **settings.json 含真实 API key 进 git**：即使你后来删了、加了 `.gitignore`，git 历史里还有。检查：`git log -p -- settings.json`。如果泄漏了，立即在服务端 revoke 那个 key

3. **symlink 断掉**：源文件被移动或删除后，symlink 变成"悬空链接"。Claude Code 读不到配置但不会报明显错误。验证：`ls -la ~/.claude/` 逐个看箭头

4. **新机跑脚本前没装依赖**：git、node、jq、envsubst、Claude Code 本身——这些是脚本的前提。脚本开头加依赖检查

## 下一步

- 回到配置基础 → [核心配置](/claude-code/config/)
- 理解这套架构的哲学 → [CLAUDE.md 编写哲学](/methodology/claude-md-philosophy/)
- 看看另一个高级主题 → [子 Agent 协作](/claude-code/subagents/)
