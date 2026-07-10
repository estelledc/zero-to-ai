---
title: 修改、验证与 Git
description: 用 Codex 完成一次小改动，亲自审查 diff、运行验证并留下可恢复的 Git 检查点
tags: [codex, git, verify, review]
difficulty: beginner
prerequisites:
  - codex/agents-md
  - appendix/git-basics
relatedContent:
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
  - { slug: 'methodology/prompt-anatomy', label: 'Prompt 的结构' }
  - { slug: 'codex/capstone', label: 'Codex 公开作品 Capstone' }
  - { slug: 'codex/troubleshooting', label: 'Codex 故障排查' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 这是什么

这一页把 Codex 从「只读理解」推进到「小步修改」：建立干净基线 → 限定任务 → 看 diff → 本地验证 → 提交检查点 → 练习恢复。做完后你手里应有一次可解释的改动，而不是「AI 说做完了」。

## 类比

把 Codex 当成会使用工具的搭档，而不是「输入一句话就交付成品」的按钮。稳定的循环只有五步：建立基线 → 限定任务 → 看改动 → 运行验证 → 提交检查点。像厨房备菜：先确认案板干净，再只切这一道菜，尝一口，装盘，打翻了还能从冰箱拿出上一份。

## 开始之前

- 已完成 [用 AGENTS.md 写项目规则](/codex/agents-md/)
- 会基本 [Git](/appendix/git-basics/)：`status` / `diff` / `add` / `commit` / `restore`
- 练习仓库里最好已有（或即将创建）`index.html`；若还没有，可先让 Codex **只创建**一个最小页面，再做本节的「增加区块」任务
- **macOS / Linux / WSL2**：下列 bash 命令可直接用
- **原生 Windows**：Git 命令相同；用浏览器打开文件时可用 `start index.html`

## 实际操作

### 1. 建立干净基线

```bash
git status --short
git log -1 --oneline
```

如果第一条有输出，先弄清是谁的改动。不要让 Codex 在未知脏工作区上继续叠加，也不要为了「干净」随手删除别人的文件。

若还没有 `index.html`，可先发送一个**单独**的创建任务（创建并提交后再继续本节）：

```text
请先读取 AGENTS.md。只创建一个最小的 index.html 个人主页：
- 有标题和一段自我介绍占位；
- CSS 内联；
- 不使用外部 CDN。
创建后展示 git diff 摘要，等我本地打开验证后再提交。
```

### 2. 交给 Codex 一个小目标

在练习仓库运行 `codex`，发送：

```text
请先读取 AGENTS.md，再完成一个小改动：
为 index.html 增加“我正在学习什么”区块。

边界：
- 只修改 index.html；
- 不使用外部 CDN、框架或追踪脚本；
- 保持现有姓名和配色。

验收：
- HTML 结构完整；
- 手机宽度无横向滚动；
- 最后展示改动摘要和实际运行的检查。
```

看到命令或文件写入请求时，核对它是否落在任务范围内。审批不是「自动点继续」。

### 3. 自己审查证据

Codex 完成后，在普通终端运行：

```bash
git status --short
git diff -- index.html
git diff --check
```

也可以在 Codex 中使用 `/review` 辅助找问题，但最终仍要亲自打开页面、缩窄浏览器并点击链接。模型复述「验证通过」不等于测试证据。

打开页面：

- macOS：`open index.html`
- Windows：`start index.html`
- Linux：`xdg-open index.html`

### 4. 提交检查点

确认结果正确后：

```bash
git add index.html
git commit -m "增加学习内容区块"
git status --short
```

只暂存本次任务文件。提交后工作区应为空。

### 5. 练习恢复（失败恢复路径）

让 Codex 故意把标题改成临时文本，但先不要提交。观察后撤销：

```bash
git diff -- index.html
git restore index.html
git status --short
```

**成功标准：** `git status --short` 再次为空，页面标题回到提交时的版本。

这一步证明你不依赖「AI 帮我撤回」，自己也能恢复未提交改动。已提交错误优先使用新的修复提交；涉及 `git revert` 前先看 [Git 附录](/appendix/git-basics/)。

若 `git restore` 不可用（极旧 Git），可用：

```bash
git checkout -- index.html
```

## 常见坑

- **错误认知：`/review` 通过就不必运行项目** → 它是额外审查层，不能代替浏览器和测试。失败恢复：亲自打开页面并缩窄窗口，再决定是否提交。
- **错误认知：`git add .` 最省事** → 它可能把密钥、日志或无关改动一起提交。失败恢复：用 `git status` 列出文件，只 `git add` 本次相关路径。
- **错误认知：Codex 做的改动只能让 Codex 恢复** → Git 才是跨工具、可审计的恢复机制。失败恢复：未提交用 `git restore`；已提交用新的修复提交。
- **错误认知：脏工作区上继续叠任务没关系** → 出问题后分不清来源。失败恢复：先 `git status` / `git diff`，弄清现状再开新任务。

## Checkpoint

确认你完成了以下操作：

- [ ] 一次任务只修改了 `index.html`（或你明确批准的文件）
- [ ] 你亲自看过 `git diff` 并运行 `git diff --check`
- [ ] Git 历史中新增一条有意义的提交
- [ ] 你成功用 `git restore`（或等价命令）恢复一次未提交的练习改动
- [ ] 你没有把「模型说验证通过」当成唯一证据

全部勾上？可以去做公开作品 Capstone 了。

## 下一步

- 下一步：[Codex 公开作品 Capstone](/codex/capstone/)——阅读清单小站 + GitHub Pages + 故障恢复
- Git 不熟？回看 [Git 10 分钟速成](/appendix/git-basics/)
- diff 里出现莫名文件？去 [Codex 故障排查](/codex/troubleshooting/)

官方依据：[Codex CLI](https://developers.openai.com/codex/cli)、[权限与安全](https://learn.chatgpt.com/docs/agent-approvals-security)。
