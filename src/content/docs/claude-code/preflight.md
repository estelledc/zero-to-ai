---
title: 开始之前
description: 几分钟确认这个教程适不适合你 — 自评估、心理模型、成本预期
tags: [claude-code]
difficulty: beginner
prerequisites: []
relatedContent:
  - { slug: 'claude-code/cost', label: '成本与计费' }
  - { slug: 'claude-code/quickstart', label: '10 分钟上手' }
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
---

## 这是什么

这一页不是安装教程，而是**出发前的自检**：确认你能打开终端、有 GitHub 账号、接受“AI 第一次输出大概率不对”，并知道自己走哪种计费入口。几分钟做完，后面的安装和对话才不会卡在心态或账号上。

## 类比

把 Claude 想象成一个非常聪明、但完全不了解你项目的新同事。他第一天上班，还没读过你的文档、不知道你的命名习惯、不清楚你讨厌哪种代码风格。他第一次写的代码大概率需要你告诉他哪里不对、重新来。这不是 bug，这是工作方式——Claude 需要你的反馈来校准，和 mentor 给你 code review 是一个道理。

## 实际操作

### 1. 四条自评估

1. **你能打开终端吗？** 能——继续。不能——先去[通用环境基础设施](/methodology/basics/)花 10 分钟，再回来。
2. **你有 GitHub 账号吗？** 有——继续。没有——去 [github.com/signup](https://github.com/signup) 注册一个（约 2 分钟，免费）。后面 `gh` CLI 和 Git 操作会用到。
3. **你能接受“AI 第一次输出大概率不对”吗？** 这是最重要的心态。回去重读上面的类比，直到你觉得“返工是正常流程”而不是“工具坏了”。
4. **你知道自己走哪种计费入口吗？** Claude.ai 免费方案不包含 Claude Code。订阅用户使用共享用量额度；Claude Console API 用户按 token 计费。先选入口，再看[成本完整指南](/claude-code/cost/)中的官方价格链接。

以上 4 条全中？继续往下。有一条不满足？先去补那条，再回来——页面在，不跑。

### 2. 动手微练习：证明你摸过终端

光说“我会开终端”不够。请现在打开终端，复制粘贴下面这条**无害命令**并回车：

**macOS / Linux / WSL：**

```bash
echo "preflight-ok" && pwd
```

**Windows PowerShell：**

```powershell
Write-Output "preflight-ok"; Get-Location
```

**Windows CMD：**

```bat
echo preflight-ok && cd
```

**成功标准：** 终端里出现一行 `preflight-ok`，以及你当前目录的路径。

若打不开终端、或命令报错，先去[通用环境基础设施](/methodology/basics/)完成“打开终端 + 第一条命令”，再回到本页重做这一步。

### 3. 心理模型：10 秒理解 AI 编程

Claude 每次只能看到有限的信息——就像你的桌面只能摊开一定数量的文件。这个“桌面大小”就是上下文窗口。桌子满了，最早的内容就会被挤掉。

详细了解上下文管理 → [上下文窗口管理](/claude-code/context/)

### 4. 学完你能做什么

教程按三条学习路径组织：

**学完基础路径后：** 用 Claude Code 写小页面、改 bug、理解陌生代码。不再对着报错信息干瞪眼——把报错贴给 Claude，它告诉你哪里错了、怎么修。

**学完效率路径后：** Claude 记住你的偏好（CLAUDE.md），换项目不用重新自我介绍。日常开发有固定节奏：新任务先 `/clear`，长任务主动 `/compact`，做完用[验证方法论](/claude-code/verify/)验收。

**学完高级路径后：** Claude 自动触发检查（Hook）、多个子 Agent 并行工作、配置可以跨机器同步。你不再是一个人——你有一个能自动执行重复工作的小团队。

一句话：不是“成为 10x 程序员”，而是“不让重复的机械操作吃掉你的注意力”。

### 5. 需要花多少钱

成本取决于认证入口、方案额度、模型和实际 token 用量，不能用一个固定月均值概括：

- **订阅登录**：先看你的 Claude 方案价格和使用限额；额度会跨 Claude 使用界面共享。
- **Claude Console API**：按模型的输入、输出和缓存 token 计费；以 [Anthropic 官方定价](https://www.anthropic.com/pricing)为准。
- **第三方兼容网关**：由提供方决定价格、限额和可用性，不属于 Anthropic 官方支持路径。

怎么识别当前认证来源、如何估算和控制开销，见[成本完整指南](/claude-code/cost/)。

## 常见坑

- **只读不练**：跳过上面的 `echo` / `Write-Output` 微练习，后面安装页会卡在“找不到终端”。失败恢复：现在就打开终端，跑通微练习再继续。
- **把“免费 Chat”当成“免费 Claude Code”**：Claude.ai 免费方案不包含 Claude Code。失败恢复：确认你有 Pro / Max / Team / Enterprise，或准备 Claude Console API 额度；第三方路线见[实验边界](/claude-code/agnes-free-vibe-coding/)。
- **期望第一次输出就完美**：会反复失望。失败恢复：把第一次输出当草稿，用一句具体反馈（“不要 X，要 Y”）让它改第二版。
- **计费入口没选就安装**：装完才发现登不进去或账单看不懂。失败恢复：先读[成本与计费](/claude-code/cost/)里的两种入口表，再去 quickstart。

## Checkpoint

全部勾选后再进入安装页：

- [ ] 我已在本机终端跑通微练习，看到了 `preflight-ok` 和当前路径
- [ ] 我能在终端里输入命令（不能 → 先去[通用环境基础设施](/methodology/basics/)）
- [ ] 我有 GitHub 账号（没有 → 去 [github.com/signup](https://github.com/signup)）
- [ ] 我理解“AI 第一次输出大概率不对”，返工是正常流程
- [ ] 我已选定订阅、Claude Console API 或第三方兼容路线中的一种，并知道去哪里确认当前价格和限额

## 下一步

[10 分钟上手——安装 Claude Code，输入你的第一句 prompt](/claude-code/quickstart/)

想评估第三方兼容路线？先阅读[第三方兼容实验边界](/claude-code/agnes-free-vibe-coding/)中的支持范围、验证方法和恢复方式，再决定是否使用。
