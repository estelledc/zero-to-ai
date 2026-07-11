---
title: 附录
description: 零基础预备知识、Git 速成与跨教程排障手册
tags: [appendix]
difficulty: beginner
prerequisites: []
relatedContent:
  - { slug: 'appendix/git-basics', label: 'Git 10 分钟速成' }
  - { slug: 'methodology/basics', label: '通用环境基础设施' }
  - { slug: 'glossary', label: '术语对照表' }
  - { slug: 'appendix/troubleshooting', label: '常见问题排查' }
lastVerified: '2026-07-10'
---

这里收录的是教程正文前后都用得上的**预备知识与排障出口**。  
如果你从来没用过终端、不知道 Git 是什么，从这里开始。已经有基础的读者可以直接跳到 [Claude Code](/claude-code/) 或 [Codex](/codex/)。

## 这个分区解决什么问题

| 痛点                      | 去哪                                                                 | 成功标准                                 |
| ------------------------- | -------------------------------------------------------------------- | ---------------------------------------- |
| 不会打开终端 / 命令找不到 | [通用环境基础设施](/methodology/basics/)（方法论分区，但零基础必读） | 能打开终端并运行 `pwd` / 包管理器检查    |
| 不敢改文件，怕改坏        | [Git 10 分钟速成](git-basics)                                        | 本地仓库里能看到至少两次 commit          |
| 安装、权限、发布报错      | [常见问题排查](troubleshooting)                                      | 按症状找到修复步骤，或知道如何贴证据求助 |
| 术语看不懂                | [术语对照表](/glossary/)                                             | 能用白话解释当前页出现的词               |

## 推荐阅读顺序

1. **环境**：[/methodology/basics/](/methodology/basics/)（约 10 分钟）
2. **存档**：[/appendix/git-basics/](git-basics)（约 10 分钟）
3. **回工具路径**：Claude → [preflight](/claude-code/preflight/)；Codex → [quickstart](/codex/quickstart/)
4. **按需排障**：任何时候打开 [troubleshooting](troubleshooting)

> **与学习路径的关系**
>
> 零基础路径通常把 basics 与 git-basics 排在工具安装前后。本附录是「随时可回跳」的抽屉，不是第三条独立工具路线。

## 文档地图

| 文档                                     | 类型         | 约时    | 一句话                                          |
| ---------------------------------------- | ------------ | ------- | ----------------------------------------------- |
| [Git 10 分钟速成](git-basics)            | 教程         | 10 分钟 | 用「游戏存档」类比学会 init/add/commit/diff/log |
| [常见问题排查](troubleshooting)          | 手册         | 按需    | 跨教程高频报错：症状 → 修复 → 仍失败时下一步    |
| [通用环境基础设施](/methodology/basics/) | 教程（外链） | 10 分钟 | 终端、PATH、包管理器、环境变量                  |
| [术语对照表](/glossary/)                 | 参考         | 按需    | 第一周必懂 + 全表                               |

## 卡住了仍出不去时

1. 把**完整报错原文**、操作系统、你执行的命令、所在教程 slug 记下来
2. 先在 [troubleshooting](troubleshooting) 搜症状关键词
3. 仍无解：到 [GitHub Discussions](https://github.com/estelledc/zero-to-ai/discussions) 发帖（不要只发「不行了」）

## Checkpoint

- □ 你知道改文件前应先有 Git 存档习惯（或已读完 git-basics）
- □ 你知道本站统一排障入口是 [troubleshooting](troubleshooting)
- □ 你已选好下一站：补环境 / 补 Git / 回 Claude 或 Codex 路径

## 下一步

→ 还不会终端？去 [通用环境基础设施](/methodology/basics/)。

→ 会终端但不会存档？去 [Git 10 分钟速成](git-basics)。

→ 已经在报错？去 [常见问题排查](troubleshooting)。
