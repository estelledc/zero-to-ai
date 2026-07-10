# UX 审计报告 — Zero to AI 零基础读者体验

> 生成日期：2026-06-24 · Phase 0 审计（只读，未改任何文件）
>
> 数据来源：`src/content/docs/` 全 33 篇逐文件扫描 + `learning-paths.ts` + `astro.config.mjs` + `index.mdx` + `paths.astro` 交叉核对
>
> 审计方法：以 4 个人物画像分别模拟从首页到第一个可展示成果的完整路径，记录点击数、卡点、站外资源依赖
>
> **快照声明（2026-07-10 回写）**：本报告是 33 文件 / 3 条路径时期的走查快照，12 个痛点截至 2.0.0 均已修复或已决策，逐项处置见 `PROJECT-DEFICIENCIES.md`（附录 E/F 为最新状态）。本文仅在对应章节追加「更新」标注，不改写原始结论。

---

## 人物画像

| ID  | 人物                                  | 核心目标                  | 时间预算  |
| --- | ------------------------------------- | ------------------------- | --------- |
| P0  | **真·零基础** — 从未打开过终端        | 用 AI 写第一个网页/小工具 | 6-8 小时  |
| P1  | **有鼠标党基础** — 会电脑不会命令行   | 花 $0 先试试              | 2-3 小时  |
| P2  | **有编程基础** — 会 Git/IDE           | 系统化用 Claude Code      | 4-6 小时  |
| P3  | **深度定制者** — 要 Hook/MCP/子 Agent | 定制工作流                | 7-10 小时 |

---

## 痛点 1：首页两条路径入口指向同一个 URL，P0 困惑

### 用户故事

「我是零基础，看到首页有三条路径。我先看了"AI 编程零基础入门"，点了"开始学习"，进了 Git 页面。好的。然后我好奇"日常效率提升"是什么，点进去发现是成本计费页面。再点"高级定制与自动化"——又是同一个成本计费页面？这两条路径有什么区别？」

### 证据

| 文件                         | 现象                                                    |
| ---------------------------- | ------------------------------------------------------- |
| `index.mdx` L39              | 「日常效率提升」Card 的 href = `/claude-code/cost/`     |
| `index.mdx` L45              | 「高级定制与自动化」Card 的 href = `/claude-code/cost/` |
| `learning-paths.ts` L42, L63 | 两条路径的 tutorials[0] 确实都是 `claude-code/cost`     |

### 影响：摩擦

P0 和 P1 用户可能误以为两条路径内容相同，或怀疑自己点错了。路径的差异化体验从第二篇教程才开始分化。

### 建议改法（META 层）

方案 A（推荐）：为「日常效率提升」和「高级定制与自动化」增设专属「路径首页」或至少链接到 `/paths/#daily-efficiency` 和 `/paths/#advanced-custom`，而非直接跳到第一篇共享教程。方案 B：在 `cost.md` 顶部根据 URL 参数或 PathProgress 组件的路径提示，告知用户「你正从 X 路径进入此页」。

---

## 痛点 2：ai-coding-zero 路径首篇是 Git，但零基础读者第一步不应是 Git

### 用户故事

「我从未打开过终端，首页说"从不会写代码到能用 AI 独立完成小页面"，我点了"开始学习"，结果第一页是 Git 速成？我连终端是什么都不知道，上来就讲 git init / git add？我是不是打开方式错了？」

### 证据

| 文件                           | 现象                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `learning-paths.ts` L19        | `ai-coding-zero` 的 tutorials[0] = `appendix/git-basics`                                                |
| `index.mdx` L34                | 零基础 Card href = `/appendix/git-basics/`                                                              |
| `appendix/git-basics.md` L1-14 | prerequisites 为空，difficulty = beginner，但内容假设读者已能打开终端（第一条命令 `cd 你的项目文件夹`） |
| `methodology/basics.md` L31-36 | 「打开终端」的实际指导在这篇，但它是路径第 3 步（tutorials[2]）                                         |
| `claude-code/preflight.md` L21 | preflight 明确说「你能打开终端吗？不能——先去 basics 花 10 分钟」，但 preflight 是路径第 2 步            |

### 影响：**阻塞**

P0 用户的第一步应该是「打开终端 + 输入 echo Hello」（basics），而非 Git。当前路径顺序：git-basics → preflight → basics，但逻辑依赖是 basics → preflight → git-basics。路径开头的三篇教程**顺序颠倒**。

### 建议改法（META 层）

修改 `learning-paths.ts` 中 `ai-coding-zero` 的 tutorials 顺序为：

```
1. claude-code/preflight  — 自评估（2 分钟）
2. methodology/basics     — 打开终端、echo、PATH（10 分钟）
3. appendix/git-basics    — Git 存档概念（10 分钟）
4. claude-code/quickstart  — 安装 Claude Code（10 分钟）
...后续不变
```

同步修改 `index.mdx` 的 Card href 为新的 tutorials[0]。

> **更新（2026-07-10）**：此问题已修复，路径首篇为 `claude-code/preflight`，首页 Card 同步指向 preflight，见 PROJECT-DEFICIENCIES 附录 D（UX-AUDIT 痛点 2）。

---

## 痛点 3：quickstart 要求有 npm，但 basics 只教了 brew，未教 Node.js 安装

### 用户故事

「我跟着 basics 学了终端和 PATH，然后到 quickstart 页面，第一步就是 `npm install -g @anthropic-ai/claude-code`。npm 是什么？basics 只教了 brew。我输入 npm，提示 command not found。quickstart 的确写了"如果提示 npm: command not found，先装 Node.js"，但 brew install node 又需要先装 Homebrew。这是套娃？」

### 证据

| 文件                               | 现象                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| `methodology/basics.md` L64-78     | 教了 brew 概念和安装方法，但**未教 Node.js / npm 安装**                        |
| `claude-code/quickstart.md` L54-71 | 安装命令 `npm install -g`，fallback 是 `brew install node`，但假设 brew 已装好 |
| `claude-code/quickstart.md` L28    | 前提写「你有一个 Anthropic 账号和 API Key」，未提及 Node.js 依赖               |

### 影响：摩擦

P0 从 basics 到 quickstart 之间有一个隐含步骤（安装 Node.js）未被任何教程的「开始之前」明确列出。quickstart 的 fallback 段（brew install node）勉强能救，但 P0 可能不理解为什么需要装这个。

### 建议改法

方案 A（META 层）：在 `quickstart.md` 的「开始之前」增加一条 checklist：「你有 Node.js 和 npm（终端输入 `npm --version`，有输出就行。没有？运行 `brew install node`，然后再来）」。方案 B（正文层）：在 `methodology/basics.md` 的 step 5 增加 `brew install node` 和验证步骤。

---

## 痛点 4：零成本路径（Agnes）与付费路径的分叉点不清晰，P1 可能在 quickstart 就放弃

### 用户故事

「我不想花钱，只是想试试。quickstart 上来就说"你有一个 Anthropic 账号和 API Key"和"$5-300+/月"。我吓到了。翻了半天才在 quickstart 的 relatedContent 里看到一个小链接"零成本 vibe coding"——原来可以免费用？为什么不在我看到价格的时候就告诉我？」

### 证据

| 文件                                    | 现象                                                                       |
| --------------------------------------- | -------------------------------------------------------------------------- |
| `claude-code/quickstart.md` L28         | 前提：「你有一个 Anthropic 账号和 API Key」——P1 看到这里会以为必须付费     |
| `claude-code/quickstart.md` L30-44      | 0. 了解成本——直接列出 $5-$300+ 价格，无「免费选项」提示                    |
| `claude-code/agnes-free-vibe-coding.md` | 完整免费方案，但在路径中排第 12 步（tutorials[12]），P0 要读完 11 篇才看到 |
| `learning-paths.ts` L31                 | agnes 在 ai-coding-zero 路径的倒数第 2 篇                                  |
| `claude-code/preflight.md` L48-61       | preflight 有成本说明但无「零成本选项」提示                                 |

### 影响：**阻塞**（对 P1 用户）

不愿花钱的 P1 用户可能在 quickstart 就放弃——因为站点给出的第一印象是「这是个付费工具」。Agnes 免费方案存在但**埋在路径末尾**，P1 不可能自然地发现它。

### 建议改法（META 层 + 正文层）

META 层：将 `agnes-free-vibe-coding` 在 `ai-coding-zero` 路径中**前移到 quickstart 之后**（tutorials[4] 或更早），或在 quickstart 中增加醒目提示：「不想花钱？跳到[零成本 vibe coding](/claude-code/agnes-free-vibe-coding/)，用免费模型走完本教程。」

正文层：在 `preflight.md` 的第 4 条自评（「愿意花钱吗」）增加一句：「如果现在不想花钱，完全没问题——本站提供[零成本方案](/claude-code/agnes-free-vibe-coding/)，用免费模型也能学完基础路径。」

> **更新（2026-07-10）**：曾按建议前移并补零成本提示（见 PROJECT-DEFICIENCIES 附录 D，UX-AUDIT 痛点 4）；1.1 复审后第三方兼容网关已整体移出核心路径，仅保留实验边界页，成本口径以 Anthropic 官方为准。

---

## 痛点 5：路径承诺「小页面」，但无教程真正教构建一个完整页面

### 用户故事

「路径描述写"从不会写代码到能用 AI 独立完成小页面"。我走完 14 篇（花了 7 小时），学会了安装、成本、配置、上下文、验证、记忆、节奏……但是——我的"小页面"在哪？quickstart 里有一个 hello.html 的 prompt 示例（一句话），但没有一篇教程带我从零构建一个稍微有意义的页面（比如个人简历页、待办事项）。」

### 证据

| 文件                                 | 现象                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------- |
| `learning-paths.ts` L14-15           | 描述：「从不会写代码到能用 AI 工具独立完成小页面」                          |
| `claude-code/quickstart.md` L119-125 | 唯一的"构建"示例：`帮我在当前目录创建一个 hello.html` — 一句 prompt、无展开 |
| 14 篇 ai-coding-zero 教程            | 无一篇以「构建一个可展示的完整成果」为核心目标                              |
| `projects/learn-journal/`            | 是一个完整项目，但定位为「学习管理系统」而非 P0 的「第一个页面」            |
| `claude-code/daily-rhythm.md`        | 提到 Checkpoint 三天挑战，但内容是日常节奏练习，非页面构建                  |

### 影响：**阻塞**

站点核心承诺（「小页面」）与实际内容之间存在**未弥合的缺口**。读者走完路径后掌握了工具操作和方法论，但没有一篇教程引导他们从零到一构建一个可打开、可截图、可展示的成果。

### 建议改法（正文层）

新增一篇「你的第一个 AI 页面」capstone 教程（插入在 daily-rhythm 之前），内容约 600-800 字：选一个场景（个人介绍页 / 计算器 / 倒计时）→ 用 Claude Code 完整构建 → 在浏览器打开验证 → 用 verify 方法论检查 → 截图庆祝。路径中 agnes 的位置也需要调整——让 P1 能在 capstone 之前就用上免费模型。

> **更新（2026-07-10）**：此问题已修复——`claude-code/first-page.md`（第一 capstone）与 `projects/publish-first-site.md`（1.1 新增第二 capstone，发布到 GitHub Pages）均已进入路径，见 PROJECT-DEFICIENCIES 附录 D（UX-AUDIT 痛点 5）。

---

## 痛点 6：Sidebar 顺序与路径推荐顺序冲突

### 用户故事

「我在 sidebar 看到 Claude Code 区的顺序是：总览 → 开始之前 → 10 分钟上手 → 成本 → Agnes → 配置 → 上下文……但路径说的顺序是 Git → 开始之前 → 基础 → 总览 → 10 分钟上手 → 成本 → 配置……我到底跟哪个？」

### 证据

| 来源                        | 顺序                                                                                                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sidebar（astro.config.mjs） | claude-code/index → preflight → quickstart → cost → agnes → config → context → verify → skills → memory → hooks → daily-rhythm → mcp → subagents → dotfiles |
| ai-coding-zero 路径         | git-basics → preflight → basics → claude-code/index → quickstart → cost → config → context → verify → skills → memory → daily-rhythm → agnes → glossary     |

**差异点**：

1. 路径把 `git-basics` 和 `basics`（方法论区）混入 Claude Code 教程之间；sidebar 无法体现这种跨分区穿插
2. `agnes` 在 sidebar 排第 5（cost 之后），在路径中排第 12（daily-rhythm 之后）
3. `glossary` 在 sidebar 是附录区最后一项，在路径中是最后一步

### 影响：摩擦

P0 如果同时看 sidebar 和路径进度条，会发现两者顺序不一致，不知道该跟哪个。PathProgress 组件（进度条点）显示路径顺序，但 sidebar 高亮的是文件系统顺序。

### 建议改法（META 层）

方案 A：在路径专属页面（`paths.astro`）增加提示：「请按路径顺序阅读，忽略 sidebar 排列」。方案 B：在每篇教程的 ContentHeader 路径 banner 中增加「上一步 / 下一步」链接（当前 PathProgress 只有点状进度条，无文字导航）。

---

## 痛点 7：方法论区 8 篇对 P0 而言大部分是噪音

### 用户故事

「sidebar 方法论区有 8 篇（不含 index）。我是零基础，路径里只用到了其中 1 篇（basics）。但 sidebar 展示了全部 8 篇——CLAUDE.md 哲学、记忆系统设计、工作流编排……标题看起来很高级，我现在不需要。」

### 证据

| ai-coding-zero 路径使用的方法论教程 | sidebar 方法论区全部                                                                                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `methodology/basics`（1 篇）        | `basics`, `claude-md-philosophy`, `memory-system-design`, `workflow-design`, `learning-management`, `skill-pack`（6 篇） + 2 篇未在 sidebar（`prompt-anatomy`, `skill-engineering`） |

### 影响：轻微

P0 用户看到 sidebar 的方法论列表可能产生「我是不是还要读这些」的焦虑，但不会真正阻塞。Starlight sidebar 不支持按路径过滤，这是技术限制。

### 建议改法（META 层）

在 `methodology/index.md` 增加一句：「零基础用户只需读 [通用环境基础设施](/methodology/basics/)，其他方法论教程在你积累经验后再看。」

---

## 痛点 8：preflight 说「先去 basics」，但 basics 的 relatedContent 回不到 preflight

### 用户故事

「preflight 第 1 条说'你能打开终端吗？不能——先去通用环境基础设施'。我去了 basics，学完了终端操作，想回到 preflight 继续。但 basics 的"下一步"导航列的是 quickstart 和 CLAUDE.md 哲学，没有 preflight。我得手动在浏览器后退。」

### 证据

| 文件                                      | 现象                                                                    |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| `claude-code/preflight.md` L21            | 「不能——先去[通用环境基础设施](/methodology/basics/)」                  |
| `methodology/basics.md` L106-111          | 「下一步」列了 quickstart、CLAUDE.md 哲学、方法论、术语表——无 preflight |
| `methodology/basics.md` FM relatedContent | 含 quickstart、glossary、git-basics、claude-code/index——无 preflight    |

### 影响：摩擦

P0 被 preflight 发送到 basics 后，回程路径断裂。虽然浏览器后退能解决，但站内导航未闭环。

### 建议改法（正文层）

在 `methodology/basics.md` 的「下一步」增加一行：「从 preflight 来的？[回去继续自评估](/claude-code/preflight/)。」或在 relatedContent 增加 preflight。

> **更新（2026-07-10）**：此问题已修复，basics 正文与 relatedContent 均含 preflight 回程链接，见 PROJECT-DEFICIENCIES 附录 D（UX-AUDIT 痛点 8）。

---

## 痛点 9：Windows 用户在 quickstart 面临隐性歧视

### 用户故事

「我用 Windows。quickstart 的安装步骤第一行是 `# macOS / Linux`，下面写 `npm install -g @anthropic-ai/claude-code`。注释只标了 macOS/Linux，Windows 怎么办？往下看 Node.js 安装也只有 `brew install node`（macOS）。basics 倒是三平台都提了，但 quickstart 的永久保存 API Key 写的是 `~/.zshrc`——这是 macOS/Linux 特有的。」

### 证据

| 文件                   | 行号                                             | 现象 |
| ---------------------- | ------------------------------------------------ | ---- |
| `quickstart.md` L54    | `# macOS / Linux` 注释，无 Windows 对应          |
| `quickstart.md` L65-71 | Node.js 安装只有 `brew install node`（macOS）    |
| `quickstart.md` L82-89 | API Key 持久化用 `~/.zshrc`，Windows 无 `.zshrc` |
| `basics.md` L33-35     | 终端打开三平台都有：macOS/Windows/Linux ✅       |
| `basics.md` L67-78     | 包管理器三平台：brew/winget/apt ✅               |

### 影响：摩擦

P0 Windows 用户在 quickstart 需要自行翻译 macOS 指令到 Windows 等价物（PowerShell profile / 系统环境变量）。basics 的跨平台覆盖未延续到 quickstart。

### 建议改法（正文层）

在 `quickstart.md` 的安装和 API Key 持久化步骤增加 Windows 等价命令：`npm install -g` 是跨平台的（只需说明）；API Key 持久化用 PowerShell profile 或系统环境变量设置。

---

## 痛点 10：无「我卡住了」的统一出口

### 用户故事

「npm install 报了一个权限错误，我不知道该怎么办。quickstart 的"常见坑"没提到这个。站点有搜索但我不知道搜什么关键词。没有 FAQ 页面、没有"遇到问题"汇总、没有社区入口……只有页面底部一行小字 GitHub Discussions。」

### 证据

| 文件                          | 现象                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `index.mdx` L89               | 页面底部：「如果某篇教程让你卡住了，欢迎 GitHub Discussions 反馈」——这是全站唯一的求助入口 |
| 33 篇教程                     | 无一篇有「遇到问题？」的统一出口段                                                         |
| 站点配置                      | Pagefind 搜索已启用，但 P0 不知道搜什么关键词                                              |
| 无 FAQ / Troubleshooting 页面 | —                                                                                          |

### 影响：摩擦

P0 遇到非典型错误时无站内解决路径。GitHub Discussions 对零基础用户有门槛（需要 GitHub 账号，需要知道如何提问）。

### 建议改法（META 层）

方案 A：在 `appendix/` 新增 `troubleshooting.md`——汇总各教程「常见坑」+ 补充高频安装问题（权限、网络、版本冲突）。方案 B：在每篇教程末尾增加统一 callout：「卡住了？1. 检查[常见坑](#常见坑) 2. 搜索[术语表](/glossary/) 3. 去 [GitHub Discussions](https://github.com/estelledc/zero-to-ai/discussions) 提问。」

---

## 痛点 11：Pagefind 搜索对零基础术语覆盖不足

### 用户故事

「我搜 node 安装 想找怎么装 Node.js，Pagefind 确实能搜到结果。但我搜"报错"或"装不上"这种零基础用户会用的关键词时，不知道能搜到什么。术语表有中英对照，但搜索不一定把术语表内容纳入索引权重。」

### 证据

| 检查项                      | 结果                                        |
| --------------------------- | ------------------------------------------- |
| Pagefind 是否启用           | ✅ `astro.config.mjs` L143 `pagefind: true` |
| `glossary.md` 是否被索引    | ✅ 在 `src/content/docs/` 下，会被自动索引  |
| 各教程「常见坑」是否被索引  | ✅ 作为正文内容会被索引                     |
| 是否有自定义搜索权重/同义词 | ❌ 未发现 Pagefind 自定义配置               |

### 影响：轻微

Pagefind 默认索引足以覆盖大部分搜索需求。但零基础用户使用的口语化关键词（如「装不上」「报错」「打不开」）可能不匹配教程正文中的技术表述。

### 建议改法（META 层）

考虑在 Pagefind 配置中增加同义词映射，或在各教程的 frontmatter `description` 中包含更多口语化关键词。

---

## 痛点 12：PathProgress 进度条只有点，无文字提示上下篇

### 用户故事

「每篇教程顶部有一个圆点进度条，我能看到自己在路径中的位置。但我不知道下一步该点哪篇——圆点太小，hover 时虽然有 title 提示，但我得一个个试才知道下一步是什么。为什么不直接写"上一篇：XX / 下一篇：XX"？」

### 证据

| 文件                         | 现象                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------- |
| `PathProgress.astro` L22-33  | 渲染 dot 列表，每个 dot 有 `title={t.title}` tooltip，但无文字"上一步/下一步" |
| `ContentHeader.astro` L70-76 | 仅渲染 PathProgress 组件，无 prev/next 文字链接                               |

### 影响：摩擦

P0 用户完成一篇后不知道下一步是什么，需要回到路径页或猜测。Starlight 的默认 prev/next 导航是按 sidebar 顺序，与路径顺序不同（见痛点 6）。

### 建议改法（META 层）

在 `ContentHeader.astro` 或 `PathProgress.astro` 中，在进度条下方增加文字导航：「← 上一篇：{prevTitle} | 下一篇：{nextTitle} →」。

> **更新（2026-07-10）**：此问题已修复，PathProgress 已提供上下篇文字导航与移动端 CSS tooltip，见 PROJECT-DEFICIENCIES 附录 D（UX-AUDIT 痛点 12）。

---

## P0 完整路径走查记录

以 P0（真·零基础）模拟从首页到「第一个可展示成果」的完整路径：

| 步骤 | 操作                                                                                              | 到达页面               | 点击数 | 卡点                                                                     |
| ---- | ------------------------------------------------------------------------------------------------- | ---------------------- | ------ | ------------------------------------------------------------------------ |
| 1    | 打开首页                                                                                          | index.mdx              | 0      | —                                                                        |
| 2    | 看到「AI 编程零基础入门」，点「开始学习」                                                         | appendix/git-basics    | 1      | **卡点 A**：上来就是 Git，还没学终端                                     |
| 3    | 看不懂 `cd 你的项目文件夹`，回退，换点首页「几分钟了解是否适合你」                                | claude-code/preflight  | 2      | —                                                                        |
| 4    | preflight 第 1 条说「不能打开终端——先去 basics」                                                  | methodology/basics     | 3      | —                                                                        |
| 5    | 学完终端 echo/pwd/ls/PATH                                                                         | —                      | —      | **卡点 B**：basics 下一步没有 preflight，不知道回去                      |
| 6    | 手动后退到 preflight，继续看                                                                      | claude-code/preflight  | 4      | —                                                                        |
| 7    | preflight 说要 API Key + $5-300+/月                                                               | —                      | —      | **卡点 C**：P1 这里就放弃了；P0 犹豫                                     |
| 8    | 点「准备好了？10 分钟上手」                                                                       | claude-code/quickstart | 5      | —                                                                        |
| 9    | `npm install -g` → command not found                                                              | —                      | —      | **卡点 D**：没装 Node.js，quickstart 有 fallback 但不够显眼              |
| 10   | 装好 Node.js + npm + Claude Code                                                                  | —                      | —      | Windows 用户额外卡一次（痛点 9）                                         |
| 11   | 设置 API Key，运行 `claude`                                                                       | —                      | —      | —                                                                        |
| 12   | 输入 `帮我创建 hello.html`                                                                        | —                      | —      | 成功！但只有一句 prompt 示例，无完整 capstone                            |
| 13   | 继续沿路径读 cost → config → context → verify → skills → memory → daily-rhythm → agnes → glossary | —                      | —      | **卡点 E**：路径末尾才看到免费方案；无一篇教带他做「第二个稍复杂的页面」 |

**总点击数从首页到第一个成功 prompt**：5 次（含一次迷路后退）。

**路径终点手里有什么**：一个 `hello.html` 文件 + 大量工具知识 + 方法论，但**没有一个可展示的「小页面」成果**。

> **更新（2026-07-10）**：本走查中的卡点 A（首篇是 Git）、B（basics 回程断裂）、D（Node.js 隐含依赖）、E（无 capstone）均已修复；路径现以 preflight 开篇，终点产物为个人页面 + GitHub Pages 公开小站。逐项证据见 PROJECT-DEFICIENCIES 附录 D。

---

## 汇总矩阵

| #   | 痛点                                       | 影响           | 主要涉及文件                                         | 建议类型         |
| --- | ------------------------------------------ | -------------- | ---------------------------------------------------- | ---------------- |
| 1   | 两条路径 Card 指向同一 URL                 | 摩擦           | `index.mdx`                                          | META             |
| 2   | 路径首篇是 Git 而非终端基础                | **阻塞**       | `learning-paths.ts`, `index.mdx`                     | META             |
| 3   | quickstart 依赖 npm 但 basics 未教 Node.js | 摩擦           | `quickstart.md`, `basics.md`                         | META + 正文      |
| 4   | 免费方案（Agnes）埋在路径末尾              | **阻塞**（P1） | `learning-paths.ts`, `preflight.md`, `quickstart.md` | META + 正文      |
| 5   | 承诺「小页面」但无 capstone 教程           | **阻塞**       | `learning-paths.ts` 描述 vs 全站内容                 | 正文（需新增）   |
| 6   | Sidebar 顺序与路径顺序冲突                 | 摩擦           | `astro.config.mjs`, `learning-paths.ts`              | META             |
| 7   | 方法论区对 P0 大部分是噪音                 | 轻微           | `methodology/index.md`                               | META             |
| 8   | preflight → basics 的回程链接断裂          | 摩擦           | `basics.md`                                          | 正文             |
| 9   | Windows 用户在 quickstart 遭遇歧视         | 摩擦           | `quickstart.md`                                      | 正文             |
| 10  | 无「我卡住了」统一出口                     | 摩擦           | 全站                                                 | META（新增页面） |
| 11  | Pagefind 无口语化同义词                    | 轻微           | 站点配置                                             | META             |
| 12  | PathProgress 无文字上下篇导航              | 摩擦           | `PathProgress.astro`, `ContentHeader.astro`          | META             |

> **更新（2026-07-10）**：矩阵中 12 个痛点截至 2.0.0 均已修复或已决策（痛点 7 采用 methodology 导读提示的最低成本方案；痛点 4 在 1.1 复审后进一步把第三方网关移出核心路径）。逐项映射见 PROJECT-DEFICIENCIES 附录 C。

## 当前状态附录（2026-07-10）

以上正文是 2026-06-24 的读者走查快照。当前代码已处理当时的路径入口、付费边界、跨平台提示、troubleshooting 和文字导航问题，历史痛点仍保留作为设计依据。

1. “访问页面即完成”已改为“访问”和“显式完成”两种状态；旧 localStorage key 继续可读。
2. smoke 测试覆盖桌面与移动端首页、路径、进度、搜索、404、主题和 base path。
3. 三条路径将展示最终产物、里程碑与完成证据，避免只显示教程列表。
4. 第三方兼容网关已移出核心路径，与 Anthropic 官方登录/计费路径明确分开，不再把第三方免费政策写成 Claude Code 承诺。
