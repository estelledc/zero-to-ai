---
title: Windows Agent 沙箱：把权限边界做成可验证系统
description: 用受限令牌、合成 SID、网络防火墙与 DPAPI 拆解 Codex Windows 沙箱
tags: [ai-tech-practice, codex, windows, sandbox, security]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'Building a safe, effective sandbox to enable Codex on Windows'
  publisher: OpenAI
  url: https://openai.com/index/building-codex-windows-sandbox/
  published: '2026-05-13'
---

## 先说结论

Windows 上的 Agent 沙箱不能只靠“用低权限账户运行”。真正可靠的边界要同时回答四件事：进程拿到什么令牌、文件 ACL 如何继承、网络能否外连、凭证能否被解密。安全设计的重点也不是宣称“已经隔离”，而是让每条授权都能用相反方向的测试证明。

## 原文解决什么

Codex 需要读写工作区、启动编译器和测试，却不应顺手读取用户其他目录、复用登录凭证或任意联网。Windows 的访问控制又与 Unix 权限模型不同：子进程会继承令牌，目录会传播 ACL，已有应用还可能通过 DPAPI 访问当前用户保护的数据。原文讨论的是怎样在保留开发可用性的同时，把这些能力缩到任务所需范围。

## 核心机制

- **Restricted token：** 从进程令牌移除或限制高风险权限，子进程默认继承同一约束。
- **Synthetic SID：** 为沙箱会话创建专用身份，并把允许写入的目录 ACL 精确授予它，而不是放宽整个用户权限。
- **Firewall：** 文件隔离不等于网络隔离；出站规则单独控制依赖下载、遥测和数据外传路径。
- **DPAPI：** 即使文件可读，受保护数据的解密能力仍需单独审视，不能把“看不到明文”当成永远安全。

这四层是组合关系。任何一层漏掉，都可能让 Agent 通过子进程、继承权限或网络绕开预期边界。

## 和 Zero-to-AI 现有实践如何接上

本站的 [Codex 修改、验证与 Git](/codex/modify-verify-git/) 已强调先看工作树、只改授权文件和检查 diff；Windows 沙箱补上的是操作系统层的强制约束。可把 `AGENTS.md` 的“不要访问工作区外”视为意图，把 ACL、令牌和防火墙视为不可越过的执行门。两者缺一不可：规则便于解释，沙箱负责兜底。

## 一个低成本实验

准备四个格子：工作区内可写文件、工作区外私有文件、允许访问的本地服务、默认禁止的公网地址。让同一脚本先直接运行，再在受限会话及其子进程中运行，记录每格的读写或连接结果。

**成功证据：** 父进程和子进程都只能写工作区；私有文件与公网访问稳定失败；明确允许的本地服务仍可用，并留下可检查的退出码。

**停止线：** 任何失败只靠提示词阻止，或子进程获得了比父进程更宽的权限；先修身份与继承规则，不继续扩大 Agent 自治。

## 常见误区

- “非管理员账户就安全”：普通用户仍可能读取大量个人数据和凭证。
- “禁网即可”：本地文件、命名管道和已登录进程仍是独立通道。
- “一次拒绝就证明边界”：必须同时测父进程、子进程和允许路径，避免把环境故障误判为安全策略生效。

## 原文与证据边界

本文依据 OpenAI 官方页面提炼机制，并把它转成本站可执行的四格实验；没有取得 TraceFetch 验签包，不能写成 `verification.valid=true`。本站也未独立复现 OpenAI 的 Windows 生产部署、威胁模型或内部测试覆盖，因此这里只说明设计方法，不宣称同等级安全保证。

本文是原创中文实践解读，不是逐句翻译。阅读[英文原文](https://openai.com/index/building-codex-windows-sandbox/)。
