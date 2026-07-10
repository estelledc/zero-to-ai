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
  - { slug: 'codex/troubleshooting', label: 'Codex 故障排查' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 这是什么

`AGENTS.md` 是放在仓库里的项目工作指南。Codex 启动时会读取它，从而知道范围、修改约定和验证方式。它不是程序配置，也不能替代 sandbox / permissions 这类真实权限控制。

## 类比

把 `AGENTS.md` 想成贴在工作台上的**操作规程贴纸**，而不是门锁：

- 贴纸告诉新来的人：「这里只做静态页」「改完要跑什么检查」「不要删已有内容」
- 门锁（sandbox / approval）才真正决定「能不能联网、能不能写文件、要不要先问你」
- 你把「禁止联网」写进贴纸，不等于网线被拔掉；贴纸丢了或没被读到，门锁也不会自动替你执行那句话

所以：规则文件解决「重复交代」；权限系统解决「能力边界」。两者要一起用，不能互相替代。

## 开始之前

- 已完成 [第一次只读任务](/codex/first-task/)，有一个练习仓库
- 你会在仓库根目录创建或编辑文本文件
- **macOS / Linux / WSL2** 与 **原生 Windows** 都适用；路径写法不同，但文件名仍是 `AGENTS.md`
- 可选：在 Codex 里用 `/init` 生成起点，再人工删改

## 实际操作

### 1. 写一个最小版本

在仓库根目录创建 `AGENTS.md`（可直接复制）：

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

**macOS / Linux / WSL** 可用编辑器或重定向创建；**Windows PowerShell** 可用记事本 / VS Code，或：

```powershell
@"
# 项目工作指南
"@ | Set-Content -Path AGENTS.md -Encoding utf8
```

更省事的做法：在交互界面运行 `/init` 生成起点，再人工删掉空泛或不适用的条目。不要把完整产品文档整页粘进来。

### 2. 理解加载顺序

Codex 启动时只读取一次规则链：

1. 全局目录 `~/.codex/` 中优先取 `AGENTS.override.md`，否则取 `AGENTS.md`。
2. 项目内从 Git 根目录一路走到当前工作目录；每层优先 `AGENTS.override.md`，再看 `AGENTS.md`。
3. 从根到近处合并，离当前目录更近的规则出现在后面，因此可以覆盖上层规则。

默认合并上限是 32 KiB。保留高频、稳定、可执行的约定，把长背景链接到仓库文档。

### 3. 验证规则真的被读到

修改规则后**重新启动** `codex`（不要复用改规则前的旧会话），发送：

```text
先不要改文件。用自己的话总结本项目对范围、修改和验证的要求，并说明你读取了哪些 AGENTS.md。
```

**成功标准：** 复述里出现「纯静态」「小目标」「`git diff --check`」等你写过的要点，并能指出读到的规则文件。

### 4. 失败恢复：`/init` 或规则看起来没生效

按这个顺序排查，一次只动一步：

1. **确认文件位置**  
   规则应在 Git 根目录（或你期望生效的子目录）。在仓库根执行：

   ```bash
   ls -la AGENTS.md AGENTS.override.md 2>/dev/null
   git rev-parse --show-toplevel
   ```

   Windows PowerShell：

   ```powershell
   Get-Item AGENTS.md, AGENTS.override.md -ErrorAction SilentlyContinue
   git rev-parse --show-toplevel
   ```

2. **确认不是旧会话**  
   规则通常在启动时读取。改完 `AGENTS.md` 后退出 Codex，再重新运行 `codex`，用上一节的复述 prompt 重测。

3. **`/init` 生成了空泛内容**  
   这很常见。把不适用条目删掉，换成上面的最小三块（范围 / 修改约定 / 验证）。然后再重启会话验证。

4. **全局规则盖过了项目规则，或子目录规则「看起来没生效」**  
   回忆加载顺序：更近的规则在合并链后面。检查 `~/.codex/AGENTS.md` / `AGENTS.override.md`，以及子目录是否另有一份覆盖文件。用复述 prompt 让 Codex 列出它实际读到的路径。

5. **仍然复述旧内容**  
   确认你编辑的是正在打开的那份文件（没有同名副本）；保存后再重启。若全局 override 在捣乱，先临时移走或改名全局文件，用最小项目规则重测。

规则文件永远不能替代 `/permissions` 与 sandbox。若任务需要联网或写文件，仍要在权限界面按需授权。

## 常见坑

- **错误认知：AGENTS.md 越长越可靠** → 过长会稀释关键约束，还可能碰到 32 KiB 上限。失败恢复：删到「范围 + 约定 + 验证」三块，重启再测复述。
- **错误认知：写了「禁止联网」就等于网络被技术封锁** → 文档是指令，sandbox/permissions 才是能力边界。失败恢复：用 `/permissions` 收紧能力，而不是只加长文档。
- **错误认知：子目录规则不会影响根目录规则** → 越近的规则在合并链后面，可以覆盖上层约定。失败恢复：让 Codex 列出读到的文件路径，对照加载顺序。
- **错误认知：改完规则不用重启** → 旧会话可能仍按启动时读到的内容工作。失败恢复：退出并重新 `codex`。

## Checkpoint

确认你完成了以下操作：

- [ ] 仓库根目录有一份可读的 `AGENTS.md`
- [ ] 它至少写清范围、禁止项和验证命令
- [ ] 新启动的 Codex 能正确复述这些规则
- [ ] 你能解释规则文件与 sandbox 的区别
- [ ] 你知道规则不生效时，先查路径、再重启会话、再查全局/覆盖文件

全部勾上？可以进入「小改 + 验证 + Git」循环了。

## 下一步

- 下一步：[修改、验证与 Git](/codex/modify-verify-git/)——完成一次可审查、可回退的小改动
- 想理解「项目指令文件」为什么有效？读 [项目指令文件的方法论](/methodology/claude-md-philosophy/)
- 规则怎么读都不对？对照 [Codex 故障排查](/codex/troubleshooting/) 与 [官方 AGENTS.md 指南](https://developers.openai.com/codex/guides/agents-md)

官方依据：[Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)、[权限与安全](https://learn.chatgpt.com/docs/agent-approvals-security)。
