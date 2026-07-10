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
  - { slug: 'codex/official-sources', label: 'Codex 官方资料索引' }
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
lastVerified: '2026-07-10'
toolVersion: 'Codex CLI v0.144.x'
---

## 这是什么

这一页是 Codex 零基础路线的综合验收：用 Codex 做一个「我的阅读清单」静态小站，完成规则、实现、验证、Git、GitHub Pages 发布，以及一次故障恢复演练。完成标准不是「Codex 说做完了」，而是四类证据：公开 URL、至少两条（路径上建议三条）有意义的 Git 提交、桌面/移动端截图、一次故障恢复记录。

## 类比

前面几页像分项练习：装工具、只读参观、贴规程、小改一刀。Capstone 像第一次把菜端上桌给客人看——还要能解释「万一上错菜怎么撤回来」。公开 URL 是端上桌；Git 历史是后厨记录；故障演练是消防演习。

## 开始之前

- 已完成 [修改、验证与 Git](/codex/modify-verify-git/)
- 有 GitHub 账号，并愿意创建一个**公开**仓库（发布步骤见 [把个人页面发布成小站](/projects/publish-first-site/)）
- **macOS / Linux / WSL2**：下列命令可直接用
- **原生 Windows**：Git 与浏览器验证相同；若用 WSL 开发，请在 WSL 内完成仓库操作，再按同一套 GitHub Pages 流程发布
- 不要在源码里放 token、内部项目名或不想公开的个人信息

## 实际操作

### 1. 建立项目与规则

```bash
mkdir reading-list-site
cd reading-list-site
git init
```

创建 `AGENTS.md`（可复制后按需微调）：

```markdown
# 阅读清单项目规则

## 范围

- 纯静态站，可发布到 GitHub Pages。
- 只允许本地 HTML/CSS/JavaScript；不使用外部 CDN、框架或追踪脚本。
- 不放个人隐私、密钥、账号截图或内部项目名。

## 修改约定

- 每次只完成一个小目标；修改前说明计划，修改后给出 diff 摘要。
- 不删除已有内容，除非任务明确要求。

## 验证

- 三个筛选状态可点击；键盘 Tab 焦点可见。
- 手机宽度无横向滚动。
- 提交前运行 `git diff --check`。
```

把规则先提交：

```bash
git add AGENTS.md
git commit -m "定义阅读清单项目规则"
```

### 2. 让 Codex 先规划

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

实施时可跟一句：

```text
按刚才确认的计划实现。只创建/修改完成阅读清单所需的文件，优先单文件 index.html。完成后展示 git status 与 diff 摘要，不要自行 git commit。
```

### 3. 本地验收与提交

打开 `index.html`，实际点击三个筛选按钮，再用键盘 Tab 检查焦点。把浏览器缩窄到手机宽度，确认卡片不溢出。

- macOS：`open index.html`
- Windows：`start index.html`
- Linux：`xdg-open index.html`

```bash
git diff -- index.html
git diff --check
git add index.html
git commit -m "创建可筛选的阅读清单"
```

再让 Codex 做一个独立小改进，例如增加「已读数量」文字，并重复「看 diff → 本地验证 → 单独提交」。这样历史中有规则、初版、改进三个检查点。

```bash
git log --oneline
```

### 4. 发布到 GitHub Pages

发布流程与工具无关，直接按 [把第一张个人页面发布成小站](/projects/publish-first-site/) 执行：创建公开仓库、push 到 `main`、在 Settings → Pages 选择从 `main` 根目录发布、等待 Actions 成功，再用无痕窗口访问公开 URL。

发布前再次检查源码里没有真实姓名之外不想公开的信息、账号截图、token 或内部项目名。

**成功标准：** 无痕窗口能打开公开 URL，筛选与移动端布局仍可用。

### 5. 故障演练（失败恢复路径）

在本地临时把 `index.html` 改名为 `index-backup.html`，观察 Git 状态并说明为什么 Pages 可能 404，然后只恢复这次重命名：

```bash
git mv index.html index-backup.html
git status --short
git mv index-backup.html index.html
git status --short
```

不要把故障版本 push 到公开站。按下面模板记一条恢复记录（可写在本地笔记里）：

```text
现象：本地把入口文件改名后，站点会找不到首页（公开站若同步则可能 404）。
根因：GitHub Pages 默认寻找仓库根目录的 index.html。
恢复命令：git mv index-backup.html index.html
恢复后验证：git status --short 干净或符合预期；本地重新 open/start/xdg-open index.html。
```

若你不小心改乱了未提交内容，也可用上一页练过的：

```bash
git restore index.html
```

## 常见坑

- **错误认知：Codex 说做完了就可以发布** → 完成标准是公开 URL + Git 历史 + 截图 + 恢复记录。失败恢复：按 Checkpoint 逐项补证据，缺哪项补哪项。
- **错误认知：可以顺手加 React / 外部字体让页面更好看** → 会破坏单文件与「无外部资源」边界。失败恢复：提醒遵守 `AGENTS.md`，改回本地 HTML/CSS/JS。
- **错误认知：故障演练要 push 到公开站才算数** → 本地演练即可；公开站保持可访问。失败恢复：不要 push 故障提交；用 `git status` 确认干净。
- **错误认知：截图里带上 token 或邮箱也没关系** → 公开作品要脱敏。失败恢复：重截图，检查仓库里是否误提交密钥。

## Checkpoint

确认你完成了以下操作：

- [ ] 无痕窗口能打开公开 GitHub Pages URL
- [ ] 三个筛选状态都可用，键盘焦点可见，手机宽度无横向滚动
- [ ] `git log --oneline` 至少有三条有意义的提交（规则 / 初版 / 改进）
- [ ] 保存桌面和移动端两张脱敏截图
- [ ] 你能解释 `AGENTS.md`、权限控制和 Git 分别解决什么问题
- [ ] 有一条完整的故障恢复记录（现象 → 根因 → 命令 → 验证）

全部勾上？你已经走完 Codex 零基础主路径的交付环节。

## 下一步

- 按需查阅：[Codex 故障排查](/codex/troubleshooting/)——安装、认证、权限、目录与卡住任务
- 学会自己核对变化：[官方资料索引](/codex/official-sources/)
- 发布步骤若卡住：回 [把个人页面发布成小站](/projects/publish-first-site/)

官方依据：[Codex CLI](https://developers.openai.com/codex/cli)、[AGENTS.md](https://developers.openai.com/codex/guides/agents-md)、[GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
