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

## 这一页解决什么问题

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

```bash
cd ~/Desktop
mkdir my-page
cd my-page
```

如果你学过 [Git](/appendix/git-basics/)，顺手初始化一下（可选但推荐）：

```bash
git init
```

### 2. 启动 Claude Code，给出完整需求

```bash
claude
```

输入你的第一句 prompt——不要只说"帮我写个网页"，**把你想要的内容告诉它**：

```text
帮我创建一个个人介绍页面 index.html，要求：
- 页面标题写我的名字（用"你的名字"占位）
- 有一段 2-3 句话的自我介绍
- 有 3 个链接（GitHub、邮箱、一个你喜欢的网站）
- 页面要好看：有背景色、居中排版、圆角卡片效果
- CSS 直接写在 HTML 文件里，不要单独的 CSS 文件
- 全部用中文
```

Claude 会在当前目录创建 `index.html`。等它写完。

### 3. 在浏览器中打开

```bash
open index.html
```

Windows 用户用 `start index.html`，Linux 用户用 `xdg-open index.html`。

你应该看到一个有样式的页面。如果看到了——恭喜，这是你的第一个 AI 页面。

### 4. 让 AI 帮你改

页面可能不完全符合你的想象。**这完全正常**——告诉 Claude 哪里要改：

```text
背景色换成深蓝色，文字改成白色。自我介绍改成："我是一个正在学习 AI 编程的新手，这是我用 Claude Code 做的第一个页面。"
```

改完后刷新浏览器（`Cmd+R` 或 `F5`）看效果。不满意就继续改——这就是 vibe coding 的工作方式：说出想法 → AI 改代码 → 你看效果 → 再调整。

### 5. 验证你的页面

用 quickstart 学到的方法做一次简单验证：

```text
检查 index.html：1) 有没有语法错误 2) 所有链接是不是都写对了 3) 在手机上看会不会排版乱掉
```

Claude 会逐项检查并告诉你结果。如果有问题，它会直接帮你修。

### 6. 存档你的成果

如果你之前初始化了 Git：

```bash
git add index.html
git commit -m "我的第一个 AI 页面"
```

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

## Checkpoint

确认你的第一个 AI 页面已完成：

1. 你有一个 `index.html` 文件，双击能在浏览器打开
2. 页面上有你的名字和至少一段自我介绍
3. 你至少让 Claude 修改过一次页面（体验了"说需求 → AI 改 → 看效果"的循环）
4. 如果用了 Git，你已经 `git commit` 保存了成果

全部通过？这是你从"用过 AI"到"用 AI 做出东西"的分界线。

## 常见坑

- **页面打开是空白**：大概率是 HTML 语法有错误。让 Claude 检查：`检查 index.html 有没有语法错误`
- **样式没生效**：如果 CSS 写在单独文件里但你没创建那个文件，样式不会加载。要求 Claude 把 CSS 内联到 HTML 里
- **链接点不开**：检查 `href` 里的 URL 是不是完整的（以 `https://` 开头）
- **手机上看排版乱**：让 Claude 加上 `<meta name="viewport" content="width=device-width, initial-scale=1">`——这是移动端适配的基础

## 下一步

- 继续第二个 capstone：[把个人页面发布成小站](/projects/publish-first-site/)——补齐 Git、GitHub Pages、线上验证和恢复
- 想了解第三方兼容网关？先读[第三方兼容实验的边界](/claude-code/agnes-free-vibe-coding/)，不要把它当成 Anthropic 官方免费方案
- 想控制开销？学 [成本与计费](/claude-code/cost/)
- 想让 Claude 更懂你？学 [核心配置](/claude-code/config/)——写你自己的 CLAUDE.md
