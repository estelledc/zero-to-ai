---
title: Codex 公开作品 Capstone
description: 用 Codex 做一个阅读清单小站，完成修改、验证、Git、GitHub Pages 发布和故障恢复
tags: [codex, capstone, github-pages]
difficulty: beginner
prerequisites:
  - codex/modify-verify-git
relatedContent:
  - { slug: 'projects/publish-first-site', label: 'GitHub Pages 发布步骤' }
  - { slug: 'codex/troubleshooting', label: 'Codex 故障排查' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 最终产物

你要做一个“我的阅读清单”静态小站：有标题、三张书籍卡片、状态筛选和一段学习说明。它不需要后端、付费部署或第三方统计脚本。

完成标准不是“Codex 说做完了”，而是四类证据：公开 URL、至少两条 Git 提交、桌面/移动端截图、一次故障恢复记录。

## 1. 建立项目与规则

```bash
mkdir reading-list-site
cd reading-list-site
git init
```

创建 `AGENTS.md`，写清：纯静态站；只允许本地 HTML/CSS/JavaScript；不放个人隐私和密钥；修改后检查手机宽度、交互和 `git diff --check`。

把规则先提交：

```bash
git add AGENTS.md
git commit -m "定义阅读清单项目规则"
```

## 2. 让 Codex 先规划

运行 `codex`，发送：

```text
先读取 AGENTS.md，只做计划，不修改文件。
我要一个可发布到 GitHub Pages 的阅读清单：
- index.html 单文件；
- 三张示例书籍卡片；
- “全部 / 想读 / 已读”筛选；
- 键盘可操作，手机宽度不横向滚动；
- 不使用外部资源。
列出实现步骤、验收方法和可能失败点，等我确认。
```

确认范围后再让它实施。若 Codex 提议框架、构建工具或外部字体，提醒它遵守单文件边界。

## 3. 本地验收与提交

打开 `index.html`，实际点击三个筛选按钮，再用键盘 Tab 检查焦点。把浏览器缩窄到手机宽度，确认卡片不溢出。

```bash
git diff -- index.html
git diff --check
git add index.html
git commit -m "创建可筛选的阅读清单"
```

再让 Codex 做一个独立小改进，例如增加“已读数量”文字，并重复“看 diff → 本地验证 → 单独提交”。这样历史中有规则、初版、改进三个检查点。

## 4. 发布到 GitHub Pages

发布流程与工具无关，直接按[把第一张个人页面发布成小站](/projects/publish-first-site/)执行：创建公开仓库、push 到 `main`、在 Settings → Pages 选择从 `main` 根目录发布、等待 Actions 成功，再用无痕窗口访问公开 URL。

发布前再次检查源码里没有真实姓名之外不想公开的信息、账号截图、token 或内部项目名。

## 5. 故障演练

在本地临时把 `index.html` 改名为 `index-backup.html`，观察 Git 状态并说明为什么 Pages 可能 404，然后只恢复这次重命名：

```bash
git mv index.html index-backup.html
git status --short
git mv index-backup.html index.html
git status --short
```

不要把故障版本 push 到公开站。记录“现象 → 根因 → 恢复命令 → 恢复后验证”。

## Checkpoint

1. 无痕窗口能打开公开 GitHub Pages URL。
2. 三个筛选状态都可用，键盘焦点可见，手机宽度无横向滚动。
3. `git log --oneline` 至少有三条有意义的提交。
4. 保存桌面和移动端两张脱敏截图。
5. 你能解释 `AGENTS.md`、权限控制和 Git 分别解决什么问题。
6. 有一条完整的故障恢复记录。

下一步：[Codex 故障排查](/codex/troubleshooting/)和[官方资料索引](/codex/official-sources/)。

官方依据：[Codex CLI](https://developers.openai.com/codex/cli)、[AGENTS.md](https://developers.openai.com/codex/guides/agents-md)、[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
