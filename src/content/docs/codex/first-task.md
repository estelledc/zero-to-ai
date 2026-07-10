---
title: 第一次只读任务
description: 在项目目录启动 Codex，先理解项目、限定范围并把完成标准写清楚
tags: [codex, prompt, beginner]
difficulty: beginner
prerequisites:
  - codex/quickstart
relatedContent:
  - { slug: 'methodology/prompt-anatomy', label: 'Prompt 的结构' }
  - { slug: 'codex/agents-md', label: '用 AGENTS.md 写项目规则' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 为什么第一次先不改文件

新同事入职第一天，最安全的任务不是“重构整个系统”，而是“读一下项目，告诉我入口、运行方式和风险”。只读任务能同时验证工作目录、登录、上下文理解和沟通方式，又不会留下难以恢复的修改。

## 1. 准备一个练习仓库

如果你还没有项目，创建一个最小目录：

```bash
mkdir my-codex-project
cd my-codex-project
git init
printf '# My Codex Project\n' > README.md
git add README.md
git commit -m "创建练习仓库"
```

Windows WSL 使用相同命令。原生 PowerShell 可手动创建 `README.md`，但 Git 步骤不变。

## 2. 启动并确认目录

```bash
codex
```

先输入 `/status`，确认显示的是当前练习目录。然后发送：

```text
只读当前项目，不要修改文件、不要安装依赖。
告诉我：
1. 这个项目现在有什么文件；
2. Git 是否干净；
3. 如果下一步要做一个静态个人主页，最小计划是什么；
4. 我应该怎样验证结果。
不确定的地方明确标出来。
```

这个 prompt 包含范围、禁止项、交付物和验证方式。它比“帮我看看”更容易得到可核对的结果。

## 3. 自己核对

另开一个终端执行：

```bash
git status --short
```

第一次任务结束后应没有输出。若出现文件，先用 `git diff` 看内容，不要直接提交。

## 4. 认识最小交互命令

| 命令           | 作用                               |
| -------------- | ---------------------------------- |
| `/status`      | 查看当前会话的目录、模型与权限状态 |
| `/permissions` | 选择当前会话允许的操作范围         |
| `/model`       | 选择可用模型和推理强度             |
| `/review`      | 审查当前 Git 改动                  |
| `/init`        | 为当前项目生成 `AGENTS.md` 起点    |

选项会随版本变化；以当前 CLI 中 `?` 或官方命令参考为准。

## 常见误区

- **错误认知：AI 说“没有改文件”就不必检查** → `git status --short` 才是可重复的证据。
- **错误认知：prompt 越长越好** → 关键是范围、产物、限制和验证清楚。
- **错误认知：第一次就要一次性做完整产品** → 先证明“理解正确”，再进入小步修改。

## Checkpoint

1. Codex 能准确列出仓库文件和 Git 状态。
2. `git status --short` 为空。
3. 你能指出 prompt 中的范围、禁止项、交付物和验证方法。

下一步：[用 AGENTS.md 写项目规则](/codex/agents-md/)。

官方依据：[Codex CLI quickstart](https://developers.openai.com/codex/cli)。
