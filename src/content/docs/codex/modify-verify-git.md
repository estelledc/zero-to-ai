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
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 核心循环

把 Codex 当成会使用工具的搭档，而不是“输入一句话就交付成品”的按钮。稳定的循环只有五步：建立基线 → 限定任务 → 看改动 → 运行验证 → 提交检查点。

## 1. 建立干净基线

```bash
git status --short
git log -1 --oneline
```

如果第一条有输出，先弄清是谁的改动。不要让 Codex 在未知脏工作区上继续叠加，也不要为了“干净”随手删除别人的文件。

## 2. 交给 Codex 一个小目标

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

看到命令或文件写入请求时，核对它是否落在任务范围内。审批不是“自动点继续”。

## 3. 自己审查证据

Codex 完成后，在普通终端运行：

```bash
git status --short
git diff -- index.html
git diff --check
```

也可以在 Codex 中使用 `/review` 辅助找问题，但最终仍要亲自打开页面、缩窄浏览器并点击链接。模型复述“验证通过”不等于测试证据。

## 4. 提交检查点

确认结果正确后：

```bash
git add index.html
git commit -m "增加学习内容区块"
git status --short
```

只暂存本次任务文件。提交后工作区应为空。

## 5. 练习恢复

让 Codex 故意把标题改成临时文本，但先不要提交。观察后撤销：

```bash
git diff -- index.html
git restore index.html
git status --short
```

这一步证明你不依赖“AI 帮我撤回”，自己也能恢复未提交改动。已提交错误优先使用新的修复提交；涉及 `git revert` 前先看[Git 附录](/appendix/git-basics/)。

## 常见误区

- **错误认知：`/review` 通过就不必运行项目** → 它是额外审查层，不能代替浏览器和测试。
- **错误认知：`git add .` 最省事** → 它可能把密钥、日志或无关改动一起提交。
- **错误认知：Codex 做的改动只能让 Codex 恢复** → Git 才是跨工具、可审计的恢复机制。

## Checkpoint

1. 一次任务只修改了 `index.html`。
2. 你亲自看过 `git diff` 并运行 `git diff --check`。
3. Git 历史中新增一条有意义的提交。
4. 你成功用 `git restore` 恢复一次未提交的练习改动。

下一步：[Codex 公开作品 Capstone](/codex/capstone/)。

官方依据：[Codex CLI](https://developers.openai.com/codex/cli)、[权限与安全](https://learn.chatgpt.com/docs/agent-approvals-security)。
