---
title: Skill 工程化设计
description: 从开源 Skill 项目中学习如何把提示词升级为可安装、可版本化的工程资产
tags: [methodology]
difficulty: advanced
lastVerified: '2026-06-24'
prerequisites:
  - claude-code/skills
  - methodology/prompt-anatomy
relatedContent:
  - { slug: 'claude-code/skills', label: 'Skill 体系' }
  - { slug: 'methodology/prompt-anatomy', label: '系统提示解剖学' }
  - { slug: 'methodology/skill-pack', label: '学习日志 Skill Pack' }
  - { slug: 'methodology/claude-md-philosophy', label: 'CLAUDE.md 编写哲学' }
  - { slug: 'methodology/workflow-design', label: '工作流编排思路' }
  - { slug: 'claude-code/context', label: '上下文窗口管理' }
  - { slug: 'claude-code/verify', label: '验证方法论' }
  - { slug: 'claude-code/subagents', label: '子 Agent 并行' }
  - { slug: 'projects/learn-journal/design-philosophy', label: 'Learn Journal 设计哲学' }
---

## 类比

你写过一段好用的快捷指令，自己用得很顺手。朋友也想用，你把文本发给他——但他的环境不同、习惯不同，用不起来。于是你开始思考：怎么把它变成一个"任何人下载就能用"的工具？

这就是 Skill 工程化要解决的问题。上一篇[系统提示解剖学](/methodology/prompt-anatomy/)是"偷看大厨的后厨"——从泄露的系统提示中学习设计模式。这一篇是"开自己的餐厅"——把学到的模式打包成可安装、可版本化、跨平台复用的 Skill。

研究对象是开源项目 [garden-skills](https://github.com/ConardLi/garden-skills)，它包含 5 个生产级 Skill 和 168 个 reference 文件，是目前最成熟的开源 Skill 工程实践之一。

## 开始之前

这篇文章假设你已经：

- 创建过至少一个 [Skill](/claude-code/skills/)（知道 SKILL.md 长什么样）
- 读过[系统提示解剖学](/methodology/prompt-anatomy/)中"分层架构"和"Skill 内职责隔离"两个模式
- 理解[上下文窗口](/claude-code/context/)的基本限制

如果还没有，先读上面三篇。这篇是在"会写 Skill"基础上的进阶——讨论的不是怎么写好一个 Skill，而是怎么让 Skill 变成一个可分发的工程资产。

## 模式一：分层知识架构 — References 是按需知识库

你可能已经知道 Skill 可以拆出 `references/` 子目录来减少主文件长度。但 garden-skills 把这个思路推到了极致——gpt-image-2 这个 Skill 有 94 个 reference 文件，按 18 个分类目录组织（产品海报、技术图表、信息图、UI 原型图……）。

关键不是"文件多"，而是**路由设计**。SKILL.md 充当路由器，按工作流阶段指向不同的 reference 文件。Agent 在生成"信息图"时只读 `references/infographics/` 下的 6 个文件，不浪费 context window 在"产品海报"或"技术图表"的模板上。

这和我们之前学过的[渐进加载三级架构](/claude-code/skills/#三层加载架构)一脉相承：

| 层级 | 内容               | 加载时机         |
| ---- | ------------------ | ---------------- |
| L1   | description 字段   | 始终在全局上下文 |
| L2   | SKILL.md 正文      | 触发时加载       |
| L3   | references/ 子文件 | 按需 Read 加载   |

但 garden-skills 展示了 L3 可以多深——94 个文件意味着你可以把整个领域的知识图谱编码进去，只要路由表设计得好，Agent 每次只消耗必要的 context。

**实践要点**：当你的 Skill 需要处理多种场景时，不要把所有场景的指令都写在 SKILL.md 里。给每种场景建一个 reference 文件，在 SKILL.md 里只写"当用户要做 X 时，先 Read `references/x.md`"。路由表比文档库更重要。

## 模式二：主题即契约 — 给 AI 看的设计规范

传统主题是 CSS 文件或设计 token JSON——精确但死板。garden-skills 的 web-design-engineer Skill 用了一种完全不同的思路：**主题是给 Agent 看的 Markdown 协议**。

它内置了 25 套"锚定风格配方"，每套是一个 Markdown 文件，包含：

- 调色板 + 排版规范（具体到字体和行高）
- 签名设计动作（signature moves）——这个风格最标志性的视觉元素
- 反模式列表——什么做法会破坏这个风格
- 适用场景——这个风格最适合哪类产品

Agent 读完后理解设计意图，再用 CSS/React 自由实现。这比硬编码 CSS 变量更灵活（Agent 可以根据具体需求调整），也比"参考 Apple 风格"这种模糊指令更精确（Agent 知道 Apple 风格的具体组成要素和边界）。

这种"契约式"设计不限于主题。任何需要 Agent 做创意性工作的场景都适用——你不告诉 Agent 怎么做（实现细节），你告诉它做成什么样（设计意图）+ 什么不能做（边界），让它在约束内自由发挥。

**实践要点**：当你的 Skill 需要产出有"风格"的东西（UI、文案、报告），试着用 Markdown 描述风格的"意图 + 签名 + 反模式"，而不是给一个 CSS 模板让 Agent 填空。

## 模式三：Checkpoint 驱动协作 — 决策收集不是走过场

garden-skills 的所有复杂 Skill 都有硬 checkpoint。beautiful-article 的 8 个工作阶段中有 3 个是显式 checkpoint，每个 checkpoint 有严格的规则：

- 必须停下来等用户（不能静默推进）
- 逐项收集决策（禁止打包成一个 yes/no 问题）
- 可以推荐但不能替用户选
- 优先使用 AskQuestion 工具

为什么不能打包确认？因为 LLM 天生倾向于"急于推进"。如果你给它一个 checkpoint 但允许打包确认，Agent 很快会变成"我帮你选好了，要不要继续？"——名义上是在等确认，实际上已经替用户做了所有决策。逐项收集迫使 Agent 在每个决策点真正等待用户输入。

这个模式在我们的[验证方法论](/claude-code/verify/)中也有体现——验证是一个不能跳过的 checkpoint，不管 Agent 多有信心代码是对的。但 garden-skills 把这个思想系统化了，从"验证"扩展到了"所有重要决策点"。

**实践要点**：在你的 Skill 中识别出"如果 Agent 做错了，回头成本很高"的节点。在这些节点设置硬 checkpoint——明确写出"此处必须等用户确认后再继续，逐项展示选项"。

## 模式四：Anti-AI-Slop — 系统性对抗 AI 审美同质化

web-design-engineer 做了一件很少见的事：它明确列出了 8 种"AI 生成审美陷阱"，并且每条都给出了"何时例外"的判断条件。

几个例子：

紫粉渐变背景——AI 生成的 Web 页面 80% 会用这个，已经成为"AI 味"的标志。例外条件：如果品牌本身的视觉体系就用了紫粉渐变（比如 Instagram），那就不是 slop。

emoji 代替图标——廉价感的来源。例外条件：面向儿童的产品，emoji 反而更亲切。

Inter 字体作为显示字体——Inter 是个好的正文字体，但用它做标题显得缺乏设计判断。例外条件：品牌设计系统明确指定了 Inter。

这个列表的价值不在于它列了什么，而在于**它证明了一件事：AI 的默认审美偏好是可以被系统性识别和对抗的**。你可以在自己的 Skill 中建立类似的"反默认列表"——不是在设计领域，而是在 AI 倾向于产出平庸结果的任何领域。

比如在代码生成领域，"每个函数都加 try-catch"、"所有注释都用英文写"、"默认用 any 类型"可能就是 AI 代码的 slop 信号。

**实践要点**：观察你的 AI 工具在特定领域的"默认行为"，识别出哪些是"AI 味"的标志。在 Skill 中明确列出这些，并给出判断条件——不是绝对禁止，而是"除非满足条件 X，否则避免"。

## 模式五：自检协议分层 — 不同节点用不同的检查方式

garden-skills 的质检不是一刀切的。它根据节点的特性选择不同的检查方式：

**上下文热 + 内容量小** → 主 Agent 内联自查（禁止开 SubAgent）。比如 beautiful-article 的 Plan Checkpoint，主 Agent 刚刚完成计划，对上下文记忆犹新，开 SubAgent 反而需要重新传递大量背景信息，得不偿失。

**需要独立视角** → [SubAgent](/claude-code/subagents/) + 写文件。比如 First Spread（第一版展示效果）的审查，需要一个"没有参与创作过程"的新视角来评判，SubAgent 天然具备这种独立性。审查结果写入文件，方便追溯。

**高频重复节点** → SubAgent + 消息返回（不写文件）。比如每个 section 完成后的检查，频率高但每次内容量不大，写文件太重了，直接在消息中返回结果即可。

这个分层设计的核心洞察是：**SubAgent 不是万能的**。它的优势是独立视角和并行能力，但代价是上下文切换和 token 消耗。在上下文还"热"的时候，主 Agent 自查比开 SubAgent 更高效。

**实践要点**：在 Skill 中加入自检步骤时，不要默认都用 SubAgent。问自己两个问题：主 Agent 当前的上下文是否足够做出判断？这个检查需要"新鲜眼光"吗？只有后者的答案是"需要"时才开 SubAgent。

## 完整 Skill 目录结构

把以上模式落地，一个工程化的 Skill 目录长这样：

```
<skill-name>/
├── SKILL.md            ← YAML frontmatter + Agent 指令（契约 + 路由器）
├── manifest.json       ← 机器可读元数据：name / version / category / compat
├── README.md           ← 人类文档
├── references/         ← 按需加载的知识模块
│   ├── type-a.md       ← 场景 A 的详细指令
│   └── type-b.md       ← 场景 B 的详细指令
├── scripts/            ← 确定性可执行代码（scaffold、check-mode 等）
├── templates/          ← 脚手架模板
└── themes/             ← 主题/素材（Markdown 契约形式）
```

SKILL.md 是入口和路由器；references 是知识库；scripts 是可执行工具；themes 是创意约束。四者分工明确，各自可以独立更新。

配套的发布体系让每个 Skill 独立版本化：per-skill SemVer 版本号、5 种安装方式（npx CLI / 插件市场 / zip / 手动 / submodule）、SHA256 校验确保完整性。

## 与 prompt-anatomy 的关系

上一篇[系统提示解剖学](/methodology/prompt-anatomy/)和这一篇研究了 Skill 生态的两个不同阶段：

system_prompts_leaks 代表**观察阶段**——通过逆向工程学习大厂怎么写系统提示。它的价值是透明度和研究。

garden-skills 代表**工程化阶段**——把学到的模式打包成可安装、可版本化、可分发的标准化资产。它的价值是可复用性和生产力。

两者合在一起，构成了从"看懂别人怎么写"到"自己写出可分发的 Skill"的完整学习路径。prompt-anatomy 教你"知道好的 Skill 长什么样"，本篇教你"怎么把好的 Skill 做成别人能用的工程资产"。

## 常见坑

- **把目录结构当银弹**：有 manifest.json 和 references/ 不等于 Skill 就工程化了。核心是路由设计——SKILL.md 能不能在正确的时机把 Agent 引导到正确的 reference 文件。目录结构只是容器，路由逻辑才是灵魂。
- **过度拆分**：不是所有 Skill 都需要 94 个 reference 文件。garden-skills 的 kb-retriever 只有 3 个 reference，一样好用。拆分的判断标准是"Agent 是否需要在不同场景下读不同的知识"，不是"文件越多越专业"。
- **忽视 Anti-AI-Slop**：工程化的框架再好，如果 Skill 没有对抗 AI 默认行为的机制，产出依然会平庸。每个领域都有自己的"AI 味"，识别并写进 Skill 是工程化的一部分。

## Checkpoint

用这 5 个模式审视你当前的 Skill：

1. 你的 reference 文件有路由表吗？还是 Agent 需要自己猜该读哪个文件？
2. 如果你的 Skill 产出有"风格"的东西，你给了 Agent 设计意图还是只给了模板？
3. 你的 Skill 里重要决策是逐项收集的，还是打包成 yes/no 问完的？
4. 你列过 AI 在你这个领域的"默认平庸行为"吗？
5. 你的自检步骤区分了"主 Agent 自查"和"SubAgent 独立审查"吗？

不需要一次全部改完。如果你的 Skill 只在自己用，先从模式一（路由设计）开始；如果要分享给别人，模式三（checkpoint）和完整目录结构最优先。

## 下一步

- [Skill 体系](/claude-code/skills/) — 如果还没写过 Skill，从这里开始
- [系统提示解剖学](/methodology/prompt-anatomy/) — 配套阅读，逆向工程视角的 5 个设计模式
- [学习日志 Skill Pack](/methodology/skill-pack/) — 一个实际的 Skill 工程化产物，可以对照学习
- [子 Agent 并行](/claude-code/subagents/) — 自检协议分层中 SubAgent 的使用细节
- [验证方法论](/claude-code/verify/) — Checkpoint 思想的具体实践
