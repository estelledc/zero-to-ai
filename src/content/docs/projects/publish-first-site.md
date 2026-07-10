---
title: 把第一张个人页面发布成小站
description: 第二个零成本 capstone — 修改、验证、Git、GitHub Pages 发布与故障恢复
tags: [project, github-pages, capstone]
difficulty: beginner
prerequisites:
  - claude-code/first-page
  - appendix/git-basics
relatedContent:
  - { slug: 'claude-code/first-page', label: '你的第一个 AI 页面' }
  - { slug: 'claude-code/verify', label: '验证方法论' }
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
  - { slug: 'appendix/troubleshooting', label: '常见问题排查' }
  - { slug: 'codex/capstone', label: 'Codex 公开作品 Capstone' }
lastVerified: '2026-07-10'
toolVersion: 'GitHub Pages branch publishing (2026-07)'
---

## 这是什么

上一个 capstone 做出了一张只在自己电脑上打开的个人页面。这次把它升级成任何人都能访问的小站，并留下三类证据：公开 URL、Git 提交历史、桌面与移动端截图。

完成标准不是「AI 说发布好了」，而是你能在无痕窗口打开 URL，并能用 Git 历史说明如何恢复一次坏提交。

## 类比

本地 HTML 像写在家里白板上的海报；Git 仓库是可追溯的印刷稿；GitHub Pages 是把海报贴到公共展板。三者缺一个，都不能证明「做完并可恢复」。

push 成功只等于「印刷稿送到了印刷厂」；Pages workflow 跑完、公开 URL 能打开，才等于「展板上真的贴出去了」。

## 开始之前

- 已完成 [你的第一个 AI 页面](/claude-code/first-page/)，本地有可打开的 `index.html`（或等价个人页）
- 已读 [Git 10 分钟速成](/appendix/git-basics/)，能 `init` / `add` / `commit` / `diff` / `log`
- 有 GitHub 账号，并愿意创建一个**公开**仓库（GitHub Free 可从公开仓库发布 Pages）
- **macOS / Linux / WSL2**：下列 bash 命令可直接用
- **原生 Windows**：Git 与浏览器步骤相同；若在 PowerShell，把路径写成 `~\Desktop\...`；若项目在 WSL 里，请在 WSL 终端完成 Git 操作
- 页面一旦发布就是公开内容：先移除手机号、住址、API key、内部项目名和不想公开的照片

:::note[Codex 路径]
若你走的是 Codex 零基础路线，公开作品验收在 [Codex Capstone](/codex/capstone/)；本页的 Pages 发布与故障恢复步骤两边通用。
:::

## 实际操作

### 1. 在本地做一次有目标的升级

进入上一课的页面目录。先让 AI 只提出计划，不要立刻改文件：

```text
先不要改文件。检查 index.html，给我一个最小升级计划：
1. 增加“我正在学习什么”区块；
2. 手机宽度下不横向滚动；
3. 保留现有配色和姓名。
列出验收方法，等我确认后再修改。
```

确认计划后再让它实施。改完不要只听「已完成」，自己检查：

```bash
git diff -- index.html
```

打开 `index.html`，把浏览器缩窄到手机宽度，确认文字可读、链接可点、没有横向滚动。开发者工具报错也要记录。

**打开本地页（按系统）：**

- macOS：`open index.html`
- Windows：`start index.html`（CMD）或 `Invoke-Item index.html`（PowerShell）
- Linux：`xdg-open index.html`

### 2. 建立可恢复的 Git 历史

如果目录还不是 Git 仓库：

```bash
git init
git add index.html
git commit -m "创建个人页面"
```

完成本次升级后再提交一次：

```bash
git add index.html
git commit -m "完善移动端和学习介绍"
git log --oneline
```

两次提交不是形式主义：第一份是能工作的基线，第二份是升级。发布出错时，你能用 `git diff` 和提交历史判断问题从哪里开始。

### 3. 创建 GitHub 仓库并推送

在 GitHub 网页创建一个空的公开仓库，例如 `my-first-site`。不要勾选自动生成 README、`.gitignore` 或 license，避免和本地历史冲突。

回到终端，把下面的 `<你的用户名>` 和仓库名换成真实值：

```bash
git branch -M main
git remote add origin https://github.com/<你的用户名>/my-first-site.git
git push -u origin main
```

如果认证失败，不要把密码或 token 粘进教程、Issue 或 AI 对话。优先按 GitHub 登录提示完成浏览器认证，或使用 GitHub Desktop。

**失败恢复（push 被拒）：**

| 你看到什么 | 先试什么 |
| ---------- | -------- |
| `remote origin already exists` | `git remote -v` 核对 URL；错了用 `git remote set-url origin <正确URL>` |
| `failed to push` / 认证弹窗反复失败 | 用浏览器登录 GitHub，或改用 SSH / GitHub Desktop；不要把 PAT 贴进聊天 |
| 远程已有 README，本地也有历史 | 不要强推覆盖；新建空仓库重来，或先 `git pull --rebase origin main` 再 push（先读懂冲突） |

### 4. 开启 GitHub Pages

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **Deploy from a branch**。
3. 分支选 `main`，目录选 `/ (root)`，保存。
4. 等待仓库 **Actions** 页中的 Pages workflow 完成（绿色勾）。
5. 回到 Settings → Pages，点击 **Visit site**。

项目站默认地址形如：

```text
https://<你的用户名>.github.io/my-first-site/
```

GitHub 官方说明发布可能需要数分钟。不要在 workflow 仍运行时反复改设置。

### 5. 发布后验收

在无痕窗口打开公开 URL，避免浏览器缓存掩盖问题：

- 首页返回成功，不是仓库 README 或 404。
- 标题、学习区块和链接与本地一致。
- 手机宽度不横向滚动，触控目标容易点击。
- 地址始终是 `https://`。
- 刷新页面仍能打开。

保存两张截图（桌面、移动端），再把公开 URL 写进仓库 README。截图里不要包含浏览器账号、书签或其他隐私信息。

### 6. 故障恢复演练（必做）

发布成功后，故意做一次「坏了再修好」的演练，留下可追溯记录。

**场景 A：Pages 显示 404**

依次检查：仓库是否公开、Pages source 是否为 `main` + root、根目录是否有小写 `index.html`、Actions workflow 是否成功。Linux 和 GitHub Pages 区分大小写，`Index.html` 不等于 `index.html`。

**场景 B：本地正常，线上样式丢失**

项目站位于 `/<仓库名>/` 子路径。不要把资源写成从域名根目录开始的 `/style.css`；同目录文件使用 `./style.css`。修改后提交并 push，再等 workflow 完成。

**场景 C：新版本坏了**

先看差异和历史：

```bash
git log --oneline
git diff HEAD~1..HEAD
```

不要直接删除仓库。创建一个修复提交，或在理解影响后用 `git revert <错误提交>` 生成可追溯的反向提交。

```bash
# 示例：撤销最近一次坏提交（会生成新的 revert commit）
git revert HEAD --no-edit
git push
```

等 Actions 再次变绿，用无痕窗口确认公开 URL 恢复。

## 常见坑

- **错误认知：push 成功就等于网站已发布** → 还要看 Pages workflow 和公开 URL。
- **错误认知：私有信息放在 HTML 注释里没人看得到** → 发布后的源码对访问者可见。
- **错误认知：404 就应该重建仓库** → 先检查 source、文件名、Actions 和 base path。
- **错误认知：截图就是全部完成证据** → 还需要公开 URL 和 Git 历史证明可访问、可恢复。
- **错误认知：资源写成 `/style.css` 在本地没事就行** → 本地用 `file://` 或根路径服务器时可能碰巧正常；项目站在子路径下会丢样式。
- **错误认知：私有仓库也能随便用 Free Pages** → 本练习要求公开仓库；私有仓库的 Pages 能力随 GitHub 方案变化，不要假设免费可用。

## Checkpoint

完成后应能给出以下证据：

- [ ] 一个可在无痕窗口打开的 GitHub Pages URL
- [ ] `git log --oneline` 至少两条有意义的提交
- [ ] 桌面与移动端各一张脱敏截图
- [ ] 一段故障演练记录：说明如果最后一次提交破坏页面，你会如何定位并恢复（`diff` / `revert` / 再验证）
- [ ] 用自己的话解释为什么项目站资源路径要考虑 `/<仓库名>/`

## 下一步

把这三类证据保存好，再继续学习 [核心配置](/claude-code/config/) 和 [验证方法论](/claude-code/verify/)。以后新增功能时仍遵循「小改动 → 本地验证 → commit → push → 线上验证」的循环。

若走 Codex 路径，对照 [Codex Capstone](/codex/capstone/) 补齐工具侧验收。发布仍卡在 Pages / Git？去 [常见问题排查](/appendix/troubleshooting/)。

官方依据（复核于 2026-07-10）：[GitHub Pages 是什么](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[创建 Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
