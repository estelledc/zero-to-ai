---
title: 你的第一个 AI 页面
description: 用 Claude Code 从零构建一个可打开、可截图、可展示的个人介绍页面 — 零基础路径的交付时刻
tags: [claude-code]
difficulty: beginner
prerequisites:
  - claude-code/quickstart
  - methodology/basics
relatedContent:
  - { slug: 'projects/publish-first-site', label: '把个人页面发布成小站' }
  - { slug: 'claude-code/quickstart', label: '10 分钟上手' }
  - { slug: 'claude-code/verify', label: '验证方法论' }
  - { slug: 'claude-code/cost', label: '成本与计费' }
  - { slug: 'claude-code/agnes-free-vibe-coding', label: '第三方兼容实验边界' }
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
  - { slug: 'claude-code/context', label: '上下文窗口管理' }
lastVerified: '2026-07-10'
toolVersion: 'Claude Code CLI v2.1'
---

## 这是什么

你已经装好了 Claude Code，在 quickstart 里输入过 `帮我创建一个 hello.html`，看到了 AI 能写代码。但那只是一句话的演示——你手里没有一个**真正属于你的、可以展示给别人看的页面**。

这一页带你从零构建一个**个人介绍页面**：有你的名字、一段自我介绍、几个链接，打开浏览器就能看到。做完后你可以截图发给朋友，或者直接把文件发出去——这是你用 AI 做的第一个完整作品。

## 类比

quickstart 的 hello.html 像试吃——尝一口知道味道。这一页是你第一次点了一整份餐、吃完、拍照发朋友圈。试吃不算一顿饭，完整的页面才算。

## 开始之前

- 你已经完成 [10 分钟上手](/claude-code/quickstart/)，Claude Code 能正常启动
- 你已经按快速上手完成 Claude Code 登录：使用包含 Claude Code 的订阅，或 Claude Console API 凭证
- 你知道怎么在终端里 `cd` 到一个文件夹

## 实际操作

### 1. 准备工作目录

打开终端，创建一个干净的文件夹：

**macOS / Linux：**

```bash
cd ~/Desktop
mkdir my-page
cd my-page
```

**Windows PowerShell：**

```powershell
cd ~\Desktop
mkdir my-page
cd my-page
```

:::tip[桌面路径找不到？]
不一定非要用 Desktop。任意空文件夹都行，例如 `mkdir ~/my-page && cd ~/my-page`（macOS/Linux）或 `mkdir ~\my-page; cd ~\my-page`（PowerShell）。关键是：之后所有命令都在这个目录里执行。
:::

如果你学过 [Git](/appendix/git-basics/)，顺手初始化一下（可选但推荐）：

```bash
git init
```

### 2. 启动 Claude Code，给出完整需求

```bash
claude
```

如果提示 `claude: command not found`，先回到 [10 分钟上手](/claude-code/quickstart/) 的安装与 `claude doctor` 排查；修好后再继续本页。

输入你的第一句 prompt——不要只说"帮我写个网页"，**把你想要的内容告诉它**：

```text
帮我创建一个个人介绍页面 index.html，要求：
- 页面标题写我的名字（用"你的名字"占位）
- 有一段 2-3 句话的自我介绍
- 有 3 个链接（GitHub、邮箱、一个你喜欢的网站）
- 页面要好看：有背景色、居中排版、圆角卡片效果
- CSS 直接写在 HTML 文件里，不要单独的 CSS 文件
- 加上移动端 viewport meta，避免手机排版乱掉
- 全部用中文
```

Claude 会在当前目录创建 `index.html`。等它写完。

**成功标准**：当前目录出现 `index.html`，且文件大小不是 0。可先确认：

```bash
ls -la index.html
```

Windows PowerShell：

```powershell
Get-Item index.html
```

如果 Claude 说写完了但目录里没有文件：把完整路径告诉它，再试一次：

```text
请确认当前工作目录，并在该目录创建 index.html。创建后用 ls（或 dir）列出文件给我看。
```

### 3. 在浏览器中打开

**macOS：**

```bash
open index.html
```

**Windows（CMD / PowerShell）：**

```bat
start index.html
```

**Linux：**

```bash
xdg-open index.html
```

你应该看到一个有样式的页面。如果看到了——恭喜，这是你的第一个 AI 页面。

如果命令报错或浏览器没弹出：在文件管理器中双击 `index.html`，或把文件拖进浏览器窗口。效果一样。

### 4. 让 AI 帮你改

页面可能不完全符合你的想象。**这完全正常**——告诉 Claude 哪里要改：

```text
背景色换成深蓝色，文字改成白色。自我介绍改成："我是一个正在学习 AI 编程的新手，这是我用 Claude Code 做的第一个页面。"
```

改完后刷新浏览器看效果：

- macOS：`Cmd + R`（强制刷新：`Cmd + Shift + R`）
- Windows / Linux：`F5` 或 `Ctrl + R`（强制刷新：`Ctrl + Shift + R`）

不满意就继续改——这就是 vibe coding 的工作方式：说出想法 → AI 改代码 → 你看效果 → 再调整。

想换布局时，可以再贴一句：

```text
把自我介绍和三个链接改成垂直居中卡片；链接用按钮样式，鼠标悬停时颜色变浅。
```

### 5. 验证你的页面

用 quickstart 学到的方法做一次简单验证：

```text
检查 index.html：1) 有没有语法错误 2) 所有链接是不是都写对了 3) 在手机上看会不会排版乱掉 4) 是否包含 viewport meta
```

Claude 会逐项检查并告诉你结果。如果有问题，它会直接帮你修。

**成功标准**：浏览器里能看到名字、自我介绍、至少 3 个可点击链接；缩小窗口后内容仍可读（不横向溢出到看不见）。

### 6. 存档你的成果

如果你之前初始化了 Git：

```bash
git add index.html
git commit -m "我的第一个 AI 页面"
```

如果 `git commit` 失败并提示未配置 user.name / user.email，先设置（仅本机、可改成你的信息）：

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

然后再执行一次 `git commit`。不要把真实密码或 API key 写进页面或提交记录。

如果没用 Git，至少把 `my-page` 文件夹复制一份到安全的地方——这是你的第一个作品，值得保留。

## 做完了，你手里有什么

- 一个 `index.html` 文件，双击就能在浏览器打开
- 一个有你名字、自我介绍、链接的完整页面
- 你知道了 AI 编程的核心循环：说需求 → AI 写代码 → 看效果 → 迭代调整

这不是 Claude Code 的全部能力——但它是你从"用过 AI"到"用 AI 做出东西"的分界线。

## 想继续？三个方向

做完第一个页面后，你可以选一个方向继续：

**加功能**：在当前对话里继续告诉 Claude 加东西——倒计时、暗色模式切换、访客计数器。每加一个功能就 `git commit` 一次。

**做第二个页面**：`/clear` 清空对话，在同一个文件夹里做一个完全不同的页面——比如一个简单的计算器或待办清单。

**继续学习路径**：回到零基础路径，学[成本控制](/claude-code/cost/)、[配置](/claude-code/config/)等进阶内容。工具知识和实战是交替进行的——你已经有了实战的基础。

## 常见坑

- **页面打开是空白**：大概率是 HTML 语法有错误。让 Claude 检查：

  ```text
  检查 index.html 有没有语法错误；如果有，直接修好并说明改了什么。
  ```

  修好后强制刷新浏览器。若仍空白，在浏览器打开开发者工具（`F12` → Console）把红色报错贴给 Claude。

- **样式没生效**：如果 CSS 写在单独文件里但你没创建那个文件，样式不会加载。要求：

  ```text
  把所有 CSS 内联到 index.html 的 <style> 里，不要依赖外部 CSS 文件。
  ```

- **链接点不开**：检查 `href` 是否完整（网站以 `https://` 开头；邮箱用 `mailto:你的邮箱`）。可让 Claude：

  ```text
  列出 index.html 里所有链接的 href，标出不完整或无效的，并修好。
  ```

- **手机上看排版乱**：让 Claude 加上：

  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ```

  这是移动端适配的基础。

- **`open` / `xdg-open` / `start` 都失败**：跳过命令，直接在资源管理器中双击 `index.html`。本教程的成功标准是“浏览器能打开页面”，不是“必须用某条 shell 命令”。

- **Claude 改错了、想回退**：若已用 Git 且刚 commit 过，可用 `git checkout -- index.html` 恢复到上次提交（会丢掉未提交修改）。若没用 Git，让 Claude 根据你的描述重写，或从你复制的备份文件夹取回。

## Checkpoint

确认你的第一个 AI 页面已完成：

- [ ] 项目目录里有 `index.html`，用浏览器打开不是空白页
- [ ] 页面上有你的名字和至少一段自我介绍
- [ ] 至少有 3 个链接，点击行为符合预期（或已按上面的坑修好）
- [ ] 你至少让 Claude 修改过一次页面（体验了“说需求 → AI 改 → 看效果”的循环）
- [ ] 你已用 Git commit 存档，或已把文件夹复制到安全位置

全部勾上？这是你从“用过 AI”到“用 AI 做出东西”的分界线。

## 下一步

- 继续第二个 capstone：[把个人页面发布成小站](/projects/publish-first-site/)——补齐 Git、GitHub Pages、线上验证和恢复
- 想了解第三方兼容网关？先读[第三方兼容实验的边界](/claude-code/agnes-free-vibe-coding/)，不要把它当成 Anthropic 官方免费方案
- 想控制开销？学 [成本与计费](/claude-code/cost/)
- 想让 Claude 更懂你？学 [核心配置](/claude-code/config/)——写你自己的 CLAUDE.md
