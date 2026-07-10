---
title: Codex 故障排查
description: 从安装、认证、权限、目录、Git 与卡住的任务中恢复，并安全整理求助证据
tags: [codex, troubleshooting, recovery]
difficulty: beginner
prerequisites:
  - codex/quickstart
relatedContent:
  - { slug: 'appendix/troubleshooting', label: '通用排错方法' }
  - { slug: 'codex/official-sources', label: 'Codex 官方资料索引' }
  - { slug: 'codex/quickstart', label: '安装、登录与成本' }
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 这是什么

这一页按**严重程度**排列常见 Codex 故障：先保住现场，再处理「完全跑不起来」，然后是「跑错地方 / 权限过宽」，最后是「任务跑偏与 Git 混乱」。每个条目都直接给出答案与可复制命令——这不是考试。

## 类比

排错像医生问诊：先记录症状、版本和最近变化，再开药。不要一遇到报错就重装、删仓库或关闭全部保护。先量体温（版本与登录状态），再决定要不要动手术。

## 开始之前：先保留现场

复制错误时只保留必要几行。Codex 日志和会话记录可能含文件内容、路径或密钥；分享前必须脱敏。

**macOS / Linux / WSL：**

```bash
codex --version
codex login status
git status --short
pwd
```

**Windows（原生 PowerShell）：** 同样运行 `codex --version` 与 `codex login status`；用 `Get-Location` 代替 `pwd`。若 Codex 装在 WSL 里，请进入 WSL 再跑上述 bash 命令——PowerShell 里找不到 WSL 安装的命令是预期行为。

## 实际操作（按严重程度）

下面从「完全不可用」到「可用但混乱」排序。先处理更上面的条目。

### 1. `codex: command not found`（阻塞：装不上 / 找不到）

**答案：** 多半是 PATH、终端未重开，或 Windows 原生环境与 WSL 混用。

1. 重新打开终端。
2. 再运行官方安装器，而不是从陌生镜像下载二进制（安装命令见 [安装、登录与成本](/codex/quickstart/)）。
3. 确认当前终端与安装环境一致：WSL 内安装的 `codex` 不能直接当作 PowerShell 命令。
4. Windows WSL 运行：

```bash
echo $WSL_DISTRO_NAME
```

确认你真的在 WSL2。Codex 0.115 起不再支持 WSL1。

**失败恢复示例：** 你在 PowerShell 输入 `codex` 报 not found，但记得在 Ubuntu WSL 里装过——进入 WSL 终端再试；或在原生 Windows 按官方文档单独安装，不要两套混用。

### 2. 登录失败或额度不对（阻塞：不能开始任务）

**答案：** 先分清 ChatGPT 订阅与 API key 是两条入口，再重新登录。

```bash
codex login status
codex logout
codex login
```

若你走 API key：

```bash
printenv OPENAI_API_KEY | codex login --with-api-key
```

API key 按 API 用量计费，不会继承 ChatGPT 订阅额度；受管工作区还可能有管理员权限限制。不要把 key 粘贴到 Issue 或聊天里。

**失败恢复示例：** 你想用订阅额度，但 `login status` 显示 API——先 `codex logout`，再 `codex login` 走浏览器 ChatGPT 流程，最后再次 `codex login status` 确认。

### 3. Codex 看错项目（高：改错目录会伤文件）

**答案：** 退出会话，在普通终端确认目录，再重新启动。

```bash
pwd
git rev-parse --show-toplevel
git status --short
```

切到正确目录后重新运行 `codex`。也可用 `codex -C <目录>` 明确工作根目录，但第一次学习时，先 `cd` 到项目里更容易建立目录直觉。

**可复制核对 prompt：**

```text
先不要改文件。告诉我当前工作目录的绝对路径，并列出顶层文件名。
```

若路径不对：退出，`cd` 到正确仓库，再开新会话。

### 4. 权限请求反复出现（中高：容易误关保护）

**答案：** 看清请求的是文件写入、工作区外目录还是网络；用最小授权，而不是永久关闭沙箱。

- sandbox 决定技术范围，approval policy 决定何时询问。
- 若任务只需要读文件，可在 `/permissions` 选择只读。
- 若确实要安装依赖，再针对具体命令授权。
- 不要把「任务需要联网」推导成「永久关闭沙箱」，也不要把 `dangerously-bypass-approvals-and-sandbox` 当日常默认值。

**失败恢复：** 回到 `/permissions`，选回更窄的策略；用只读任务验证仍能工作，再按需放开。

### 5. 任务卡住或方向跑偏（中：浪费时间 / 留下半成品）

**答案：** 先看是不是在等你批准；再检查 Git；然后拆小任务重来。

1. 检查终端是否在等你批准命令。
2. 在另一个终端运行 `git status --short`，确认有没有留下半成品。
3. 中止当前任务，保存错误和 diff。
4. 把大任务拆成「只读分析」或「只改一个文件」的新 prompt。
5. 重新启动会话后先让 Codex 复述 `AGENTS.md` 和完成标准。

**可复制拆分 prompt：**

```text
停止扩大范围。先只读，不要改文件。
用五条以内列出：已完成什么、卡在哪、下一步最小改动应该改哪个文件。
```

### 6. Git 面板出现「不是 Codex 改的文件」（中：误删用户改动）

**答案：** Git 展示的是整个工作区状态，不会只显示某一个 agent 的修改。

先按文件和时间辨认来源；不确定的用户改动要保留，不能为了清理列表直接 `git restore` 或删除。

```bash
git status --short
git diff
```

只恢复你**确认**是本次误改且未提交的文件，例如：

```bash
git restore path/to/unwanted-file
```

### 7. 求助时证据怎么整理（低：不影响继续，但影响别人帮你）

附上脱敏后的：

- `codex --version`
- `codex login status`（不要包含 key）
- 操作系统：macOS / Linux / 原生 Windows / WSL2
- 相关几行报错
- `git status --short`（可打码路径中的用户名）

官方排错入口：[Troubleshooting](https://learn.chatgpt.com/docs/reference/troubleshooting)。命令是否仍存在，用本机 `--help` 复核，见 [官方资料索引](/codex/official-sources/)。

## 常见坑

- **一报错就重装** → 先保留 `version` / `login status` / `git status`。失败恢复：回到本页对应严重级别条目，只改一个变量。
- **在 PowerShell 排查 WSL 安装** → 环境不一致会得到假阴性。失败恢复：进入 WSL 再测，或承认你要用原生 Windows 安装。
- **为了少弹窗关闭全部保护** → 排错成本会变成数据损失。失败恢复：`/permissions` 回到最小够用权限。
- **把未知文件全部 restore** → 可能丢掉你自己的未提交工作。失败恢复：先 `git diff` 辨认来源。

## Checkpoint

下面三个场景——答案已写在题目后面，用来对照你的第一反应是否找对入口：

1. **WSL 中能运行 Codex，PowerShell 中找不到命令。**  
   **答案：** 这是环境边界，不是“坏了”。在 WSL 里用，或在原生 Windows 单独安装；不要混用。

2. **你想用订阅额度，但当前登录方式是 API key。**  
   **答案：** `codex logout` → `codex login`（浏览器订阅流）→ 再 `codex login status` 确认。

3. **Codex 说任务完成，`git status` 却出现五个无关文件。**  
   **答案：** 保留未知改动；用 `git diff` 逐个核对；只处理你确认的误改，不要整表清空。

再确认：

- [ ] 你知道排错前先收集 version / login / git status
- [ ] 你能按严重程度优先处理「找不到命令」和「登录/额度」
- [ ] 你知道 Windows 原生与 WSL2 不能混着排查
- [ ] 你分享日志前会脱敏

## 下一步

- 学会自己核对官方变化：[官方资料索引](/codex/official-sources/)
- 回到主路径继续：[第一次只读任务](/codex/first-task/) 或 [公开作品 Capstone](/codex/capstone/)
- 跨工具的终端 / PATH 问题：[通用排错方法](/appendix/troubleshooting/)

官方依据：[Troubleshooting](https://learn.chatgpt.com/docs/reference/troubleshooting)、[认证](https://developers.openai.com/codex/auth)、[WSL](https://learn.chatgpt.com/docs/windows/wsl)、[权限与安全](https://learn.chatgpt.com/docs/agent-approvals-security)。
