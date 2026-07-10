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
lastVerified: '2026-07-10'
toolVersion: 'GitHub Pages branch publishing (2026-07)'
---

## 这次要交付什么

上一个 capstone 做出了一张只在自己电脑上打开的个人页面。这次把它升级成任何人都能访问的小站，并留下三类证据：公开 URL、Git 提交历史、桌面与移动端截图。

**类比**：本地 HTML 像写在家里白板上的海报；Git 仓库是可追溯的印刷稿；GitHub Pages 是把海报贴到公共展板。三者缺一个，都不能证明“做完并可恢复”。

GitHub Free 可以从公开仓库发布 Pages；整个练习不需要购买域名或部署服务。页面一旦发布就是公开内容，先移除手机号、住址、API key、内部项目名和不想公开的照片。

## 1. 在本地做一次有目标的升级

在上一课的页面目录中，先让 AI 只提出计划：

```text
先不要改文件。检查 index.html，给我一个最小升级计划：
1. 增加“我正在学习什么”区块；
2. 手机宽度下不横向滚动；
3. 保留现有配色和姓名。
列出验收方法，等我确认后再修改。
```

确认计划后再让它实施。改完不要只听“已完成”，自己检查：

```bash
git diff -- index.html
```

打开 `index.html`，把浏览器缩窄到手机宽度，确认文字可读、链接可点、没有横向滚动。开发者工具报错也要记录。

## 2. 建立可恢复的 Git 历史

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

## 3. 创建 GitHub 仓库并推送

在 GitHub 网页创建一个空的公开仓库，例如 `my-first-site`。不要勾选自动生成 README、`.gitignore` 或 license，避免和本地历史冲突。

回到终端，把下面的 `<你的用户名>` 和仓库名换成真实值：

```bash
git branch -M main
git remote add origin https://github.com/<你的用户名>/my-first-site.git
git push -u origin main
```

如果认证失败，不要把密码或 token 粘进教程、Issue 或 AI 对话。优先按 GitHub 登录提示完成浏览器认证，或使用 GitHub Desktop。

## 4. 开启 GitHub Pages

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **Deploy from a branch**。
3. 分支选 `main`，目录选 `/ (root)`，保存。
4. 等待仓库 **Actions** 页中的 Pages workflow 完成。
5. 回到 Settings → Pages，点击 **Visit site**。

项目站默认地址形如：

```text
https://<你的用户名>.github.io/my-first-site/
```

GitHub 官方说明发布可能需要数分钟。不要在 workflow 仍运行时反复改设置。

## 5. 发布后验收

在无痕窗口打开公开 URL，避免浏览器缓存掩盖问题：

- 首页返回成功，不是仓库 README 或 404。
- 标题、学习区块和链接与本地一致。
- 手机宽度不横向滚动，触控目标容易点击。
- 地址始终是 `https://`。
- 刷新页面仍能打开。

保存两张截图（桌面、移动端），再把公开 URL 写进仓库 README。截图里不要包含浏览器账号、书签或其他隐私信息。

## 6. 故障恢复

### Pages 显示 404

依次检查：仓库是否公开、Pages source 是否为 `main` + root、根目录是否有小写 `index.html`、Actions workflow 是否成功。Linux 和 GitHub Pages 区分大小写，`Index.html` 不等于 `index.html`。

### 本地正常，线上样式丢失

项目站位于 `/<仓库名>/` 子路径。不要把资源写成从域名根目录开始的 `/style.css`；同目录文件使用 `./style.css`。修改后提交并 push，再等 workflow 完成。

### 新版本坏了

先看差异和历史：

```bash
git log --oneline
git diff HEAD~1..HEAD
```

不要直接删除仓库。创建一个修复提交，或在理解影响后用 `git revert <错误提交>` 生成可追溯的反向提交。

## 常见误区

- **错误认知：push 成功就等于网站已发布** → 还要看 Pages workflow 和公开 URL。
- **错误认知：私有信息放在 HTML 注释里没人看得到** → 发布后的源码对访问者可见。
- **错误认知：404 就应该重建仓库** → 先检查 source、文件名、Actions 和 base path。
- **错误认知：截图就是全部完成证据** → 还需要公开 URL 和 Git 历史证明可访问、可恢复。

## Checkpoint

完成后应能给出以下证据：

1. 一个可在无痕窗口打开的 GitHub Pages URL。
2. `git log --oneline` 至少两条有意义的提交。
3. 桌面与移动端各一张脱敏截图。
4. 一段故障演练：说明如果最后一次提交破坏页面，你会如何定位并恢复。
5. 用自己的话解释为什么项目站资源路径要考虑 `/<仓库名>/`。

## 下一步

把这三类证据保存好，再继续学习[核心配置](/claude-code/config/)和[验证方法论](/claude-code/verify/)。以后新增功能时仍遵循“小改动 → 本地验证 → commit → push → 线上验证”的循环。

官方依据（复核于 2026-07-10）：[GitHub Pages 是什么](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[创建 Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
