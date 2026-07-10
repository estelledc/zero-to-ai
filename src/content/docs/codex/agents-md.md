---
title: 用 AGENTS.md 写项目规则
description: 让 Codex 每次进入仓库都知道项目边界、验证命令和协作约定
tags: [codex, agents-md, workspace, rules]
difficulty: beginner
prerequisites:
  - codex/first-task
relatedContent:
  - { slug: 'methodology/claude-md-philosophy', label: '项目指令文件的方法论' }
  - { slug: 'codex/modify-verify-git', label: '修改、验证与 Git' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 它是什么

`AGENTS.md` 像贴在工作台上的操作规程：Codex 每次开始工作前先读它，不需要你在每个 prompt 里重复“怎么运行、哪些文件不能动、完成后跑什么测试”。它不是程序配置，也不能替代真实的权限控制。

## 1. 写一个最小版本

在仓库根目录创建：

```markdown
# 项目工作指南

## 范围

- 这是一个纯静态个人主页。
- 不添加后端、数据库或第三方追踪脚本。

## 修改约定

- 每次只完成一个小目标。
- 修改前先说明计划，修改后展示 `git diff` 摘要。
- 不删除已有内容，除非任务明确要求。

## 验证

- 确认 `index.html` 可以在浏览器打开。
- 检查手机宽度下没有横向滚动。
- 提交前运行 `git diff --check`。
```

也可以在交互界面运行 `/init` 生成起点，再人工删掉空泛或不适用的条目。

## 2. 理解加载顺序

Codex 启动时只读取一次规则链：

1. 全局目录 `~/.codex/` 中优先取 `AGENTS.override.md`，否则取 `AGENTS.md`。
2. 项目内从 Git 根目录一路走到当前工作目录；每层优先 `AGENTS.override.md`，再看 `AGENTS.md`。
3. 从根到近处合并，离当前目录更近的规则出现在后面，因此可以覆盖上层规则。

默认合并上限是 32 KiB。不要把完整产品文档复制进来；保留高频、稳定、可执行的约定，把长背景链接到仓库文档。

## 3. 验证规则真的被读到

修改规则后重新启动 `codex`，发送：

```text
先不要改文件。用自己的话总结本项目对范围、修改和验证的要求，并说明你读取了哪些 AGENTS.md。
```

如果 Codex 引用了旧内容，先确认你是否复用了修改前启动的会话。规则通常在启动时读取，重启会话再测。

## 常见误区

- **错误认知：AGENTS.md 越长越可靠** → 过长会稀释关键约束，还可能碰到大小上限。
- **错误认知：写了“禁止联网”就等于网络被技术封锁** → 文档是指令，sandbox/permissions 才是能力边界。
- **错误认知：子目录规则不会影响根目录规则** → 越近的规则在合并链后面，可以覆盖上层约定。

## Checkpoint

1. 仓库根目录有一份可读的 `AGENTS.md`。
2. 它至少写清范围、禁止项和验证命令。
3. 新启动的 Codex 能正确复述这些规则。
4. 你能解释规则文件与 sandbox 的区别。

下一步：[修改、验证与 Git](/codex/modify-verify-git/)。

官方依据：[Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)、[权限与安全](https://learn.chatgpt.com/docs/agent-approvals-security)。
