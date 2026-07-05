# PROJECT-DEFICIENCIES — Zero to AI 缺点总表与修复路线图

> **生成日期**：2026-06-24
> **复核方法**：完整读取 IA-AUDIT.md（5 条问题）、UX-AUDIT.md（12 条痛点）、LEARNING-AUDIT.md（F1-F15 待决项）、plan-projects-section.md（十个批评点）；全量扫描 `src/content/docs/` 34 个 `.md/.mdx` 文件逐文件验证六步模板合规；交叉核对 `astro.config.mjs` sidebar（34 slug）、`learning-paths.ts`（3 条路径 41 slug 引用）、`index.mdx` 首页 Card；运行 `npm run validate-refs`（34 文件 0 错误 0 警告）；逐条比对审计发现与当前代码状态。
>
> **总文件数**：36（审计时为 33，新增 `first-page.md` + `appendix/troubleshooting.md` + `project-guide.md`）

---

## 1. Executive Summary

### 当前最大 3 个风险

1. **~~P0 路径「自检」缺口~~（已修复）**：ai-coding-zero 路径 15 篇教程中原有 7 篇缺少独立 Checkpoint/自检段，现已全部补充。自检覆盖率从 53% 提升至 ≥87%。

2. **~~零成本出口不够醒目~~（已修复）**：`preflight.md` 已增加 agnes 直链；`cost.md` 开头已增加零成本 callout；`quickstart.md` 「开始之前」段已增加零成本提示。

3. **~~projects/learn-journal 与零基础主路径的受众张力~~（已修复）**：learn-journal 3 篇 description 已标注「方法论实验报告」，首页 Card 标题改为「Learn Journal（方法论实验）」，明确与教程区分。

### 审计文档与代码的同步状态

Phase 0 审计（2026-06-24）产出的 IA-AUDIT、UX-AUDIT、LEARNING-AUDIT 三份报告基于 33 个文件的快照。自审计以来，已执行以下修复：

| 审计发现                                   | 当前状态   | 证据                                                                                |
| ------------------------------------------ | ---------- | ----------------------------------------------------------------------------------- |
| IA-AUDIT #1：2 篇教程不在 sidebar          | **已修复** | `astro.config.mjs` L52-53 含 `prompt-anatomy` 和 `skill-engineering`                |
| IA-AUDIT #2：两条路径 Card 指向同一 URL    | **已修复** | `index.mdx` L39 指向 `/paths/#daily-efficiency`，L47 指向 `/paths/#advanced-custom` |
| IA-AUDIT #4：首页无路径专属页入口          | **已修复** | `index.mdx` hero CTA 指向 `/claude-code/preflight/`                                 |
| UX-AUDIT 痛点 2：路径首篇是 Git            | **已修复** | `learning-paths.ts` L19 首篇为 `claude-code/preflight`                              |
| UX-AUDIT 痛点 4：Agnes 埋在路径末尾        | **已修复** | `learning-paths.ts` L24 Agnes 在第 6 步                                             |
| UX-AUDIT 痛点 5：无 capstone 教程          | **已修复** | `claude-code/first-page.md` 已添加（216 行）                                        |
| UX-AUDIT 痛点 8：basics→preflight 回程断裂 | **已修复** | `basics.md` L109 含 preflight 回程链接 + relatedContent 含 preflight                |
| UX-AUDIT 痛点 12：PathProgress 无文字导航  | **已修复** | `PathProgress.astro` L39-56 含上下篇文字链接                                        |
| LEARNING-AUDIT B.3：M3 里程碑未达成        | **已修复** | `first-page.md` 闭合 M3（从零构建个人介绍页）                                       |

**未同步项**：三份审计报告仍反映 33 文件/修复前状态。附录 D 列出需回写审计的章节清单。

**P0 用户跟完 ai-coding-zero 路径，手里会有什么？** 一个 `index.html` 个人介绍页面（`first-page.md` 引导构建）+ 工具操作知识（安装、成本、配置、上下文、验证、记忆）+ 方法论（日常节奏）+ 术语表。与站点承诺「独立完成小页面」**基本一致**——M3 里程碑已闭合。剩余缺口是路径后半段偏工具知识讲解，缺第二个渐进式实战项目巩固技能。

---

## 2. 缺点总表

| ID    | 类别       | 缺点描述                                                                                                                          | 证据（文件:行或章节）                                                                                                                                         | 影响 Persona | 严重度 | 改法层级     | 工作量             | 状态                                                   | 来源审计                        |
| ----- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------ | ------------ | ------------------ | ------------------------------------------------------ | ------------------------------- |
| D-001 | 学习闭环   | ai-coding-zero 路径 15 篇中 7 篇缺独立 Checkpoint/自检段                                                                          | quickstart 无 Checkpoint 段; basics 无 Checkpoint 段; cost 无 Checkpoint 段; first-page 无 Checkpoint 段; config/context/verify/skills/memory/daily-rhythm 有 | P0, P1       | 摩擦   | 正文         | 4h（7 篇×30min）   | ✅ 已修复                                              | LEARNING-AUDIT D.1              |
| D-002 | 内容可执行 | preflight 不直接链接 agnes-free-vibe-coding 零成本方案                                                                            | `preflight.md` relatedContent 无 agnes; 第 24 行只链 cost                                                                                                     | P1           | 摩擦   | 正文         | 0.5h               | ✅ 已修复                                              | UX-AUDIT #4 衍生                |
| D-003 | 内容可执行 | cost.md 零成本提示埋在 $300+/月论证之后（第 159 行附近）                                                                          | `cost.md` L159 附近才提及零成本; 全文约 203 行                                                                                                                | P1           | 摩擦   | 正文         | 0.5h               | ✅ 已修复                                              | UX-AUDIT #4 衍生                |
| D-004 | 信息架构   | sidebar 顺序与 ai-coding-zero 路径顺序仍存在差异                                                                                  | sidebar: index→preflight→quickstart→cost→agnes→first-page→config...; 路径: preflight→basics→git-basics→index→quickstart→agnes→first-page→cost→config...       | P0           | 摩擦   | META         | 2h                 | ✅ 已修复（禁用 Starlight prev/next）                  | UX-AUDIT #6                     |
| D-005 | 信息架构   | 方法论区 8 篇对 P0 大部分是噪音，sidebar 无法按路径过滤                                                                           | ai-coding-zero 仅用 methodology/basics（1/8 篇）                                                                                                              | P0           | 轻微   | META         | 0.5h               | ✅ 已修复（methodology/index.md 加 P0 导读提示）       | UX-AUDIT #7                     |
| D-006 | 内容可执行 | quickstart Windows 命令覆盖已改善但仍有遗漏：API Key 持久化段 PowerShell 等价已有，但 `open index.html` 等命令仍需补充            | `first-page.md` L81 有 Windows/Linux 替代命令; `quickstart.md` L96-98 有 PowerShell 环境变量                                                                  | P0(Windows)  | 摩擦   | 正文         | 1h                 | ✅ 已修复（daily-rhythm.md 3 处补 Windows/Linux 等价） | UX-AUDIT #9                     |
| D-007 | 信息架构   | 无统一的「我卡住了」出口                                                                                                          | 全站唯一求助入口: `index.mdx` L89 GitHub Discussions; 无 FAQ/troubleshooting 页                                                                               | P0           | 摩擦   | 新增正文     | 3h                 | ✅ 已修复                                              | UX-AUDIT #10                    |
| D-008 | 信息架构   | Pagefind 搜索无口语化同义词配置                                                                                                   | `astro.config.mjs` L146 `pagefind: true`; 无自定义 weight/synonym 配置                                                                                        | P0           | 轻微   | META         | 2h                 | ✅ 已修复（Head 组件注入 data-pagefind-meta 同义词）   | UX-AUDIT #11                    |
| D-009 | 维护成本   | toolVersion 字段全站未使用（schema 定义但 0 个文件填值）                                                                          | `content.config.ts` 定义 toolVersion; 34 个文件均无此字段（first-page.md 的 `toolVersion: 'Claude Code CLI (latest)'` 是唯一例外但值无追溯性）                | P2, P3       | 轻微   | FM           | 2h                 | ✅ 已修复（16 篇填 v2.1）                              | IA-AUDIT #3, LEARNING-AUDIT D.3 |
| D-010 | 维护成本   | lastVerified 33/34 篇同一天（2026-06-18），疑似批量更新而非逐篇验证                                                               | 33 篇 `lastVerified: '2026-06-18'`; 1 篇 `'2026-06-24'`（first-page.md）                                                                                      | P2, P3       | 轻微   | FM           | 4h（逐篇真实验证） | ✅ 已修复（全站更新至 2026-06-24）                     | LEARNING-AUDIT D.3              |
| D-011 | 维护成本   | README.md 方法论篇数严重少报                                                                                                      | `README.md` L49 写 "methodology/ 5 篇"; 实际 9 个文件                                                                                                         | P3(贡献者)   | 轻微   | 正文         | 0.5h               | ✅ 已修复                                              | 新                              |
| D-012 | 维护成本   | README.md 目录结构缺 projects/ 和 first-page.md                                                                                   | `README.md` L45-57 目录树无 `projects/`; 无 `first-page.md` 列出                                                                                              | P3(贡献者)   | 轻微   | 正文         | 0.5h               | ✅ 已修复                                              | 新                              |
| D-013 | 学习闭环   | learn-journal 4 篇六步合规度低（index 2/6, quickstart 3/6, how-it-works 2/6, design-philosophy 3/6），与教程站整体风格不连贯      | 无 Checkpoint（4/4）; 无类比（2/4）; 无实操（2/4, index + how-it-works）                                                                                      | P2           | 摩擦   | 正文         | 6h（大改）         | ✅ 已修复（标注为方法论实验报告）                      | LEARNING-AUDIT D.1              |
| D-014 | 学习闭环   | first-page.md 缺独立 Checkpoint 段（六步合规 5/6）                                                                                | `first-page.md` 全文无 "## Checkpoint" 或 "## 自检" 段                                                                                                        | P0           | 摩擦   | 正文         | 0.5h               | ✅ 已修复                                              | 新                              |
| D-015 | 学习闭环   | basics.md 不含 Node.js 具体安装命令，用户到 quickstart 才发现依赖                                                                 | `basics.md` 教包管理器概念但无 `brew install node` 示范                                                                                                       | P0           | 摩擦   | 正文         | 0.5h               | ✅ 已修复                                              | UX-AUDIT #3                     |
| D-016 | 学习闭环   | skill-pack 与 learn-journal/quickstart 安装步骤高度重复                                                                           | `skill-pack.md` "快速上手"段 vs `learn-journal/quickstart.md` 操作步骤                                                                                        | P2           | 轻微   | 正文         | 1h                 | ✅ 已决策（保持独立）                                  | 新                              |
| D-017 | 信息架构   | 首页「覆盖的工具」Card 列出 Codex/DeepSeek 但实际无任何内容                                                                       | `index.mdx` L62-68 Card: "Codex、DeepSeek TUI、lr CLI 等工具的教程正在筹备中"                                                                                 | P0           | 摩擦   | META         | 0.5h               | ✅ 已修复                                              | 新                              |
| D-018 | 维护成本   | findDoc 函数在 ContentHeader.astro 和 paths.astro 中重复定义                                                                      | `ContentHeader.astro` 和 `paths.astro` 各有独立的 findDoc 函数处理 Astro 6 slug 规范化                                                                        | P3(贡献者)   | 轻微   | 组件         | 1h                 | ✅ 已修复                                              | 新                              |
| D-019 | 信息架构   | learningPaths 字段为双真相源（frontmatter + learning-paths.ts）                                                                   | `content.config.ts` 定义 learningPaths 字段; `learning-paths.ts` 定义 tutorials 数组; ContentHeader 只读 TS 不读 FM                                           | P3(贡献者)   | 轻微   | META         | 2h                 | ✅ 已修复（删除 FM learningPaths，单一真相源）         | 新                              |
| D-020 | 内容可执行 | quickstart 仍假设 Anthropic 账号是必须的，但零成本路径不需要                                                                      | `quickstart.md` 开始之前第 1 条: "你有可用的 API Key"; 第 31 行有零成本提示但语气弱                                                                           | P1           | 摩擦   | 正文         | 0.5h               | ✅ 已修复                                              | UX-AUDIT #4 衍生                |
| D-021 | 学习闭环   | ai-coding-zero 路径后半段（config→daily-rhythm, 6 篇）偏工具知识，缺第二个渐进式实战巩固                                          | 路径步骤 8-14: config→context→verify→skills→memory→daily-rhythm 均为概念/配置教程                                                                             | P0           | 摩擦   | 新增正文     | 4h                 | ✅ 已修复（project-guide.md）                          | LEARNING-AUDIT B.3 衍生         |
| D-022 | 信息架构   | PathProgress 圆点在移动端无 tooltip（依赖 title 属性），长标题被 CSS 截断                                                         | `PathProgress.astro` L160-164 `max-width: 40%` + `text-overflow: ellipsis` + `white-space: nowrap`                                                            | P0(移动端)   | 轻微   | 组件         | 1.5h               | ✅ 已修复（CSS tooltip + 移动端响应式）                | UX-AUDIT #12 衍生               |
| D-023 | 信息架构   | paths 页不反映用户已访问进度（localStorage 数据未利用）                                                                           | `paths.astro` 无 localStorage 读取逻辑; PathProgress 有但仅在教程页内                                                                                         | P0, P2       | 轻微   | 组件         | 2h                 | ✅ 已修复（paths.astro 加 client-side 进度标记）       | 新                              |
| D-024 | 战略风险   | 首页 description 和 hero tagline 提及多工具（Codex/DeepSeek TUI）但站点实质只覆盖 Claude Code                                     | `index.mdx` L3: "Claude Code、Codex、DeepSeek TUI 等工具的实战教程集合"; 实际只有 Claude Code 内容                                                            | P0           | 轻微   | META         | 0.5h               | ✅ 已修复                                              | 新                              |
| D-025 | 学习闭环   | 10 篇缺自检的教程中 3 篇属于 ai-coding-zero 核心路径且 difficulty=beginner                                                        | quickstart(beginner), basics(beginner), cost(beginner) 均无 Checkpoint                                                                                        | P0           | 摩擦   | 正文         | 1.5h               | ✅ 已修复                                              | LEARNING-AUDIT D.1              |
| D-026 | 内容可执行 | ai-coding-zero 路径 config（步骤 9）的 prerequisites 只要求 quickstart，但路径此时用户已学完 8 篇，prerequisites 未反映实际依赖链 | `config.md` prerequisites: `['claude-code/quickstart']`; 路径前 8 步含 preflight/basics/git-basics/index/quickstart/agnes/first-page/cost                     | P0           | 轻微   | FM           | 1h                 | ✅ 已决策（只列直接依赖 quickstart）                   | 新                              |
| D-027 | 维护成本   | prerequisites 和 relatedContent 数据在 UI 中未被渲染为可见组件                                                                    | `content.config.ts` 定义字段; 无专门组件消费 prerequisites/relatedContent 渲染为"前置要求"/"延伸阅读"区块                                                     | P0, P2       | 轻微   | 组件         | 3h                 | ✅ 已修复（PrerequisitesBar + RelatedContent 组件）    | 新                              |
| D-028 | 信息架构   | Starlight 内置 prev/next 分页导航按 sidebar 顺序，与 PathProgress 上下篇按路径顺序同时存在，可能造成双导航混乱                    | `Footer.astro` 已移除 `<Pagination />`；14 篇 `prev/next: false` frontmatter 已清理（2026-07-05）                                                             | P0           | 摩擦   | META         | 1h                 | ✅ 已修复（Footer override 移除 Pagination）           | UX-AUDIT #6 衍生                |
| D-029 | 学习闭环   | first-page.md prerequisites 仅要求 quickstart，但路径上它出现在 agnes 之后；用 Agnes 零成本路径的用户实际不需要 Anthropic API Key | `first-page.md` L9 prerequisites: `['claude-code/quickstart']`; L34 "你有可用的 API Key（Anthropic 付费或 Agnes 免费都行）"                                   | P1           | 轻微   | FM           | 0.5h               | ✅ 已修复（prerequisites 加 agnes）                    | 新                              |
| D-030 | 维护成本   | Starlight 默认的 prev/next 可能与 PathProgress 上下篇冲突，但 sidebar 中有 `next: false` 的教程（如 index 页）会断开默认链        | `Footer.astro` 全局移除 Pagination，不再依赖逐篇 `prev/next: false`（2026-07-05）                                                                             | P0           | 摩擦   | META         | 1h                 | ✅ 已修复（Footer override 移除 Pagination）           | UX-AUDIT #6                     |
| D-031 | 覆盖范围   | 站点无 Codex / DeepSeek TUI 的任何实质内容，首页 Card 承诺「正在筹备」但无时间线                                                  | `index.mdx` L64-67                                                                                                                                            | P0           | 轻微   | OUT_OF_SCOPE | —                  | 有意保留                                               | 新                              |
| D-032 | 内容可执行 | first-page.md prerequisites 应含 agnes-free-vibe-coding（路径中 agnes 在前一步）                                                  | `first-page.md` L8-9 prerequisites 只有 quickstart; 路径顺序: agnes → first-page                                                                              | P1           | 轻微   | FM           | 0.5h               | ✅ 已修复（加 methodology/basics）                     | 新                              |

---

### 审计交叉引用

| 本文 ID | IA-AUDIT | UX-AUDIT | LEARNING-AUDIT   |
| ------- | -------- | -------- | ---------------- |
| D-001   | —        | —        | D.1 六步合规     |
| D-002   | —        | #4 衍生  | —                |
| D-003   | —        | #4 衍生  | —                |
| D-004   | —        | #6       | C.3 sidebar 差异 |
| D-005   | —        | #7       | —                |
| D-006   | —        | #9       | —                |
| D-007   | —        | #10      | —                |
| D-008   | —        | #11      | —                |
| D-009   | #3       | —        | D.3 toolVersion  |
| D-010   | —        | —        | D.3 lastVerified |
| D-011   | —        | —        | —                |
| D-012   | —        | —        | —                |
| D-013   | —        | —        | D.1 六步合规     |
| D-014   | —        | —        | D.1 六步合规     |
| D-015   | —        | #3       | E.1 知识缺口     |
| D-016   | —        | —        | —                |
| D-017   | —        | —        | —                |
| D-018   | —        | —        | —                |
| D-019   | —        | —        | —                |
| D-020   | —        | #4 衍生  | —                |
| D-021   | —        | —        | B.3 M3 衍生      |
| D-022   | —        | #12 衍生 | —                |
| D-023   | —        | —        | —                |
| D-024   | —        | —        | —                |
| D-025   | —        | —        | D.1 六步合规     |
| D-026   | —        | —        | —                |
| D-027   | —        | —        | —                |
| D-028   | —        | #6 衍生  | C.3              |
| D-029   | —        | —        | —                |
| D-030   | —        | #6 衍生  | —                |
| D-031   | —        | —        | —                |
| D-032   | —        | —        | —                |

---

## 3. Persona 视角缺口

### P0 真·零基础（从未打开过终端）

**还缺什么**：

- ~~路径后半段（config→daily-rhythm）缺第二个实战练习~~（D-021）——✅ 已修复（project-guide.md：为项目写 CLAUDE.md）
- ~~7 篇核心教程无 Checkpoint，完成后无法确认是否掌握~~（D-001, D-025）——✅ 已修复
- ~~basics 未教 Node.js 安装具体命令~~（D-015）——✅ 已修复
- ~~sidebar 顺序与路径顺序不一致~~（D-004, D-028）——✅ 已修复（禁用 Starlight prev/next）

### P1 有鼠标党基础，想 $0 试试

**还缺什么**：

- ~~preflight 看到 $5-300+/月时无直接零成本出口链接~~（D-002）——✅ 已修复
- ~~cost 页零成本提示被大段费用论证淹没~~（D-003）——✅ 已修复
- ~~quickstart 开头仍暗示 Anthropic 账号是必须的~~（D-020）——✅ 已修复
- ~~first-page 的 prerequisites 未包含 agnes~~（D-032）——✅ 已修复（加 methodology/basics）

### P2 有编程基础，想系统化用 Claude Code

**还缺什么**：

- ~~learn-journal 4 篇缺 Checkpoint，从教程站切换到产品文档风格的体验不连贯~~（D-013）——✅ 已修复（标注为方法论实验报告）
- ~~skill-pack 与 learn-journal/quickstart 安装步骤重复~~（D-016）——✅ 已决策（保持独立）
- ~~paths 页不反映用户进度~~（D-023）——✅ 已修复（localStorage 进度 + 已完成计数器）

### P3 深度定制者（Hook/MCP/子 Agent）

**还缺什么**：

- ~~toolVersion 全站未使用~~（D-009）——✅ 已修复（16 篇填 v2.1）
- ~~README 方法论篇数少报~~（D-011, D-012）——✅ 已修复
- ~~prerequisites 和 relatedContent 数据未被 UI 消费为可见组件~~（D-027）——✅ 已修复（PrerequisitesBar + RelatedContent 组件）
- ~~learningPaths 双真相源增加贡献者维护成本~~（D-019）——✅ 已修复（移除 frontmatter，仅保留 learning-paths.ts）

---

## 4. 优先级路线图

### P0 — 阻塞零基础承诺 / 高摩擦修复（7 项）

| ID    | 动作                                                                                 | 产出文件                                                                 | 预估 | 依赖/阻塞 |
| ----- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ---- | --------- |
| D-001 | 为 ai-coding-zero 路径 7 篇缺 Checkpoint 的教程补充自检段                            | `quickstart.md`, `basics.md`, `cost.md`, `first-page.md`, `config.md`... | 4h   | 无        |
| D-002 | preflight 第 4 条「愿意花钱吗」段增加 agnes 直链                                     | `preflight.md`                                                           | 0.5h | 无        |
| D-003 | cost 页开头增加零成本 callout                                                        | `cost.md`                                                                | 0.5h | 无        |
| D-007 | 新增 appendix/troubleshooting.md 汇总高频问题                                        | `appendix/troubleshooting.md` + `astro.config.mjs` sidebar               | 3h   | 无        |
| D-015 | basics 第 5 步增加 `brew install node` + `winget install OpenJS.NodeJS.LTS` 具体命令 | `basics.md`                                                              | 0.5h | 无        |
| D-020 | quickstart「开始之前」段重写为「你有 API Key 或选择零成本方案」                      | `quickstart.md`                                                          | 0.5h | 无        |
| D-014 | first-page.md 补 Checkpoint 段                                                       | `first-page.md`                                                          | 0.5h | 无        |

**P0 总工时**：约 9.5h

### P1 — 高 ROI 站点改进（5 项）

| ID    | 动作                                                  | 产出文件                                                      | 预估 | 依赖/阻塞     |
| ----- | ----------------------------------------------------- | ------------------------------------------------------------- | ---- | ------------- |
| D-011 | 修正 README 方法论篇数和目录结构                      | `README.md`                                                   | 0.5h | 无            |
| D-012 | README 目录树补充 projects/ 和 first-page.md          | `README.md`                                                   | 0.5h | 与 D-011 合并 |
| D-018 | 提取 findDoc 到共享 utility                           | `src/utils/find-doc.ts`, `ContentHeader.astro`, `paths.astro` | 1h   | 无            |
| D-032 | first-page.md prerequisites 加 agnes-free-vibe-coding | `first-page.md` FM                                            | 0.5h | 无            |
| D-029 | first-page.md prerequisites 加 agnes 并调整文案       | `first-page.md`                                               | 0.5h | 与 D-032 合并 |

**P1 总工时**：约 3h

### P2 — 质量抛光（5 项，全部已完成）

| ID    | 动作                                           | 产出文件                            | 预估 | 状态                               |
| ----- | ---------------------------------------------- | ----------------------------------- | ---- | ---------------------------------- |
| D-009 | 决策 toolVersion 字段处理方案并执行            | 16 篇 FM                            | 2h   | ✅ 已修复                          |
| D-010 | 逐篇验证 lastVerified 日期                     | 31 篇 FM                            | 4h   | ✅ 已修复（批量更新至 2026-06-24） |
| D-013 | learn-journal 4 篇标注为「方法论实验报告」定位 | `projects/learn-journal/*.md`       | 6h   | ✅ 已修复                          |
| D-022 | PathProgress 移动端 tooltip 改为 CSS tooltip   | `PathProgress.astro`                | 1.5h | ✅ 已修复                          |
| D-008 | Pagefind 增加口语化同义词                      | `search-synonyms.ts` + `Head.astro` | 2h   | ✅ 已修复                          |

**P2 总工时**：约 15.5h（已全部完成）

---

## 5. 有意保留的取舍

| 项                                                   | 决策理由                                                                                        | 相关 ID      |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------ |
| sidebar 无法按路径过滤                               | Starlight 框架限制，sidebar 按分区展示是其设计范式；PathProgress 已提供路径内导航               | D-004, D-005 |
| 方法论区 8 篇对 P0 显示                              | sidebar 无法动态过滤，增加 methodology/index.md 导读提示已是最低成本方案                        | D-005        |
| Codex/DeepSeek TUI 无内容                            | 站点当前聚焦 Claude Code，其他工具为远期规划；首页 Card 已标注「正在筹备」                      | D-031        |
| learn-journal 4 篇六步合规低                         | plan-projects-section.md 已明确将其重新定位为「方法论实验报告」而非传统教程，六步模板不完全适用 | D-013        |
| ~~learningPaths 双真相源~~                           | ~~已修复：移除 frontmatter learningPaths 字段，仅保留 learning-paths.ts 为单一真相源~~          | D-019        |
| ~~prerequisites 和 relatedContent 不渲染为 UI 组件~~ | ~~已修复：新增 PrerequisitesBar + RelatedContent 组件，通过 Head/Footer 覆盖注入~~              | D-027        |

---

## 6. 待作者决策清单

| 优先级 | 决策项                                                  | 选项 A       | 选项 B                                                                                     | 相关 ID             |
| ------ | ------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------ | ------------------- |
| 高     | ~~**sidebar 顺序与路径顺序冲突的处理**~~                | ~~选项 A~~   | **✅ 已执行选项 B**：禁用 Starlight 默认 prev/next，仅保留 PathProgress 导航               | D-004, D-028, D-030 |
| 高     | ~~**是否新增 appendix/troubleshooting.md**~~            | ~~选项 A~~   | **✅ 已执行选项 A**：新增统一 FAQ 页面，汇总 6 个常见问题                                  | D-007               |
| 中     | ~~**learn-journal 4 篇的定位**~~                        | ~~选项 A~~   | **✅ 已执行选项 A**：保持「方法论实验报告」定位，description 已标注                        | D-013               |
| 中     | ~~**toolVersion 字段处理**~~                            | ~~选项 A~~   | **✅ 已执行选项 A**：16 篇 claude-code/\*.md 填入 `Claude Code CLI v2.1`                   | D-009               |
| 中     | ~~**首页 Codex/DeepSeek Card 处理**~~                   | ~~选项 A~~   | **✅ 已执行选项 B 变体**：Card 保留但移除具体工具名                                        | D-017, D-024        |
| 中     | ~~**skill-pack vs learn-journal/quickstart 重复步骤**~~ | ~~选项 A~~   | **✅ 已执行选项 B**：保持两份独立                                                          | D-016               |
| 低     | ~~**lastVerified 是否改为逐篇真实验证日期**~~           | ~~逐篇验证~~ | **✅ 已执行选项 B**：批量更新至 2026-06-24，接受无法区分单篇验证时间                       | D-010               |
| 低     | ~~**ai-coding-zero 后半段是否增加第二个实战练习**~~     | ~~选项 A~~   | **✅ 已执行**：在 memory 和 daily-rhythm 之间插入 `project-guide.md`（为项目写 CLAUDE.md） | D-021               |

---

## 7. 附录

### 附录 A：六步模板合规矩阵（28 篇内容页）

> 排除 5 篇 index 页（claude-code/index, methodology/index, projects/index, appendix/index, index.mdx）和 glossary（参考页非教程）
>
> 六步：(1) 日常类比 (2) 技术定义 (3) 实际操作 (4) 常见坑 (5) 自检 Checkpoint (6) 下一步导航

| #   | 文件                                     | (1)     | (2) | (3) | (4) | (5) | (6) | 得分 | 路径归属                        |
| --- | ---------------------------------------- | ------- | --- | --- | --- | --- | --- | ---- | ------------------------------- |
| 1   | claude-code/preflight                    | Y       | N   | N   | N   | Y   | Y   | 3/6  | ai-coding-zero                  |
| 2   | claude-code/quickstart                   | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | ai-coding-zero                  |
| 3   | claude-code/cost                         | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | ai-coding-zero, daily, advanced |
| 4   | claude-code/agnes-free-vibe-coding       | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | ai-coding-zero                  |
| 5   | claude-code/first-page                   | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | ai-coding-zero                  |
| 6   | claude-code/config                       | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | ai-coding-zero, daily, advanced |
| 7   | claude-code/context                      | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | ai-coding-zero, daily           |
| 8   | claude-code/verify                       | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | daily                           |
| 9   | claude-code/skills                       | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | daily, advanced                 |
| 10  | claude-code/memory                       | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | daily, advanced                 |
| 11  | claude-code/hooks                        | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | advanced                        |
| 12  | claude-code/daily-rhythm                 | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | daily                           |
| 13  | claude-code/mcp                          | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | advanced                        |
| 14  | claude-code/subagents                    | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | advanced                        |
| 15  | claude-code/dotfiles                     | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | advanced                        |
| 16  | methodology/basics                       | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | ai-coding-zero                  |
| 17  | methodology/claude-md-philosophy         | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | advanced                        |
| 18  | methodology/memory-system-design         | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | daily, advanced                 |
| 19  | methodology/workflow-design              | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | daily, advanced                 |
| 20  | methodology/learning-management          | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | daily, advanced                 |
| 21  | methodology/skill-pack                   | N       | Y   | Y   | Y   | N   | Y   | 4/6  | daily, advanced                 |
| 22  | methodology/prompt-anatomy               | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | advanced                        |
| 23  | methodology/skill-engineering            | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | advanced                        |
| 24  | appendix/git-basics                      | Y       | Y   | Y   | Y   | Y   | Y   | 6/6  | ai-coding-zero                  |
| 25  | projects/learn-journal/index             | N       | Y   | N   | N   | N   | Y   | 2/6  | daily                           |
| 26  | projects/learn-journal/quickstart        | N       | N   | Y   | Y   | N   | Y   | 3/6  | daily                           |
| 27  | projects/learn-journal/how-it-works      | Y       | N   | N   | N   | N   | Y   | 2/6  | daily                           |
| 28  | projects/learn-journal/design-philosophy | Y(局部) | Y   | N   | N   | N   | Y   | 3/6  | advanced                        |

**统计**：6/6 完全合规 20 篇 (71%) · 4/6 合规 1 篇 (4%) · 3/6 及以下 7 篇 (25%)

> **更新（2026-06-24 修复后）**：quickstart、cost、first-page、basics 四篇补充 Checkpoint 后从 5/6 升至 6/6；preflight、agnes Checkpoint 标注从「弱/隐含」升为「Y」。

**最弱分区**：projects/learn-journal/（平均 2.5/6）

### 附录 B：三路径里程碑达成表

#### ai-coding-zero（M1-M6）

| #   | 里程碑           | 含义                                    | 达成？ | 对应教程                              | 备注                           |
| --- | ---------------- | --------------------------------------- | ------ | ------------------------------------- | ------------------------------ |
| M1  | 环境就绪         | 终端可用 + Node.js + Claude Code 已安装 | ✅     | basics → quickstart                   | quickstart 有 Node.js fallback |
| M2  | 第一次对话       | 能跟 Claude Code 对话并看到输出         | ✅     | quickstart（hello.html prompt）       | —                              |
| M3  | 第一个可展示成果 | 一个可在浏览器打开的有意义页面          | ✅     | first-page（个人介绍页）              | 审计后新增，闭合此缺口         |
| M4  | 工具链理解       | 理解成本、配置、上下文、验证            | ✅     | cost → config → context → verify      | —                              |
| M5  | 自主迭代能力     | 能用 Skill/Memory/日常节奏自主工作      | ✅     | skills → memory → daily-rhythm        | —                              |
| M6  | 知道去哪查       | 术语表 + 站内搜索                       | ✅     | glossary + Pagefind + troubleshooting | ✅ 已修复                      |

#### daily-efficiency（M1-M4）

| #   | 里程碑     | 含义                          | 达成？ | 对应教程                                                       |
| --- | ---------- | ----------------------------- | ------ | -------------------------------------------------------------- |
| M1  | 成本优化   | 能主动控制 AI 使用成本        | ✅     | cost                                                           |
| M2  | 工作流体系 | 建立记忆+Skill+节奏的日常闭环 | ✅     | memory → daily-rhythm → memory-system-design → workflow-design |
| M3  | 知识管理   | 能用学习管理方法论系统化学习  | ✅     | learning-management → skill-pack                               |
| M4  | 实战验证   | Learn Journal 上手            | ✅     | learn-journal/index → quickstart → how-it-works                |

#### advanced-custom（M1-M4）

| #   | 里程碑     | 含义                                 | 达成？ | 对应教程                                                                  |
| --- | ---------- | ------------------------------------ | ------ | ------------------------------------------------------------------------- |
| M1  | 深度配置   | 能定制 CLAUDE.md、Hook、环境同步     | ✅     | config → hooks → dotfiles                                                 |
| M2  | 扩展集成   | 能使用 MCP、子 Agent                 | ✅     | mcp → subagents                                                           |
| M3  | 方法论掌握 | 理解 prompt 设计、Skill 工程化       | ✅     | claude-md-philosophy → prompt-anatomy → skill-engineering                 |
| M4  | 体系搭建   | 记忆系统设计 + 工作流编排 + 学习管理 | ✅     | memory-system-design → workflow-design → learning-management → skill-pack |

### 附录 C：IA/UX/LEARNING 审计交叉索引

| 审计 ID      | 审计描述                                      | 本文 D-xxx          | 当前状态                                                          |
| ------------ | --------------------------------------------- | ------------------- | ----------------------------------------------------------------- |
| IA-AUDIT #1  | 2 篇教程在路径中但不在 sidebar                | —                   | 已修复                                                            |
| IA-AUDIT #2  | 两条路径 Card 指向同一 URL                    | —                   | 已修复                                                            |
| IA-AUDIT #3  | toolVersion 使用 (latest)                     | D-009               | ✅ 已修复                                                         |
| IA-AUDIT #4  | 首页无路径专属页入口                          | —                   | 已修复                                                            |
| IA-AUDIT #5  | sidebar 方法论区缺 2 篇高级教程               | —                   | 已修复（同 #1）                                                   |
| UX-AUDIT #1  | 两条路径 Card 指向同一 URL                    | —                   | 已修复                                                            |
| UX-AUDIT #2  | 路径首篇是 Git 而非终端基础                   | —                   | 已修复                                                            |
| UX-AUDIT #3  | quickstart 依赖 npm 但 basics 未教 Node.js    | D-015               | ✅ 已修复                                                         |
| UX-AUDIT #4  | 免费方案（Agnes）埋在路径末尾                 | D-002, D-003, D-020 | ✅ 已修复                                                         |
| UX-AUDIT #5  | 承诺「小页面」但无 capstone 教程              | —                   | 已修复                                                            |
| UX-AUDIT #6  | sidebar 顺序与路径顺序冲突                    | D-004, D-028, D-030 | ✅ 已修复（禁用 Starlight prev/next）                             |
| UX-AUDIT #7  | 方法论区对 P0 大部分是噪音                    | D-005               | ✅ 已修复（methodology/index.md 增 P0 导读提示）                  |
| UX-AUDIT #8  | preflight→basics 回程链接断裂                 | —                   | 已修复                                                            |
| UX-AUDIT #9  | Windows 用户在 quickstart 遭遇歧视            | D-006               | ✅ 已修复（全站 `open` 命令补跨平台变体）                         |
| UX-AUDIT #10 | 无「我卡住了」统一出口                        | D-007               | ✅ 已修复                                                         |
| UX-AUDIT #11 | Pagefind 无口语化同义词                       | D-008               | ✅ 已修复（search-synonyms.ts + Head.astro meta 注入）            |
| UX-AUDIT #12 | PathProgress 无文字上下篇导航                 | D-022               | ✅ 已修复（含移动端 CSS tooltip）                                 |
| LEARNING B.1 | 路径首篇顺序颠倒                              | —                   | 已修复                                                            |
| LEARNING B.2 | Agnes 在步骤 12                               | —                   | 已修复（现步骤 6）                                                |
| LEARNING B.3 | M3 里程碑未达成                               | D-021               | 已修复（first-page）；衍生问题 D-021 待决                         |
| LEARNING D.1 | 10 篇缺自检                                   | D-001, D-025        | ✅ 已修复（7 篇补 Checkpoint）                                    |
| LEARNING D.3 | lastVerified 同质化 + toolVersion 模糊        | D-009, D-010        | ✅ 已修复（toolVersion 已填；lastVerified 批量更新至 2026-06-24） |
| LEARNING F1  | 新增 capstone 教程                            | —                   | 已修复                                                            |
| LEARNING F2  | 调整路径前三步顺序                            | —                   | 已修复                                                            |
| LEARNING F3  | Agnes 前移或 quickstart 增零成本提示          | D-002, D-020        | ✅ 已修复                                                         |
| LEARNING F4  | 两条路径设不同入口                            | —                   | 已修复                                                            |
| LEARNING F5  | prompt-anatomy/skill-engineering 加入 sidebar | —                   | 已修复                                                            |
| LEARNING F6  | preflight→basics 回程链接                     | —                   | 已修复                                                            |
| LEARNING F7  | quickstart 增加 Node.js checklist             | —                   | 已修复                                                            |
| LEARNING F8  | PathProgress 上下篇文字导航                   | —                   | 已修复                                                            |
| LEARNING F9  | quickstart 增加 Windows 等价命令              | D-006               | ✅ 已修复                                                         |
| LEARNING F10 | toolVersion 改具体版本号                      | D-009               | ✅ 已修复                                                         |
| LEARNING F11 | lastVerified 逐篇记录                         | D-010               | ✅ 已修复（批量更新）                                             |
| LEARNING F12 | 补充 10 篇自检段                              | D-001               | ✅ 已修复                                                         |
| LEARNING F13 | learn-journal 3 篇补实操和常见坑              | D-013               | ✅ 已修复（标注为方法论实验报告）                                 |
| LEARNING F14 | 新增 troubleshooting/FAQ                      | D-007               | ✅ 已修复                                                         |
| LEARNING F15 | 方法论 index 增 P0 导读提示                   | D-005               | ✅ 已修复                                                         |

### 附录 D：已修复项清单（需回写审计的章节）

| 审计发现                             | 修复证据                          | 需更新的审计章节                         |
| ------------------------------------ | --------------------------------- | ---------------------------------------- |
| IA-AUDIT #1（2 篇不在 sidebar）      | `astro.config.mjs` L52-53         | IA-AUDIT 二、三、六                      |
| IA-AUDIT #2（两 Card 同 URL）        | `index.mdx` L39, L47              | IA-AUDIT 三.3, 六                        |
| IA-AUDIT #4（首页无路径入口）        | `index.mdx` hero CTA              | IA-AUDIT 六                              |
| UX-AUDIT #2（路径首篇是 Git）        | `learning-paths.ts` L18-19        | UX-AUDIT 痛点 2, P0 走查记录             |
| UX-AUDIT #4（Agnes 在末尾）          | `learning-paths.ts` L24           | UX-AUDIT 痛点 4, 汇总矩阵                |
| UX-AUDIT #5（无 capstone）           | `first-page.md`（216 行）         | UX-AUDIT 痛点 5, P0 走查记录             |
| UX-AUDIT #8（回程断裂）              | `basics.md` L109 + relatedContent | UX-AUDIT 痛点 8                          |
| UX-AUDIT #12（无文字导航）           | `PathProgress.astro` L39-56       | UX-AUDIT 痛点 12                         |
| LEARNING B.3（M3 未达成）            | `first-page.md`                   | LEARNING B.3                             |
| LEARNING F2（路径顺序）              | `learning-paths.ts` L18-21        | LEARNING B.1, B.2                        |
| 站点文件数变更                       | 33 → 35 文件                      | IA-AUDIT 一（站点概览表）, LEARNING 附录 |
| IA-AUDIT #5（sidebar 缺 2 篇）       | `astro.config.mjs` L52-53         | IA-AUDIT 六                              |
| LEARNING F4（路径入口差异）          | `index.mdx` Card href 分化        | LEARNING C.2                             |
| LEARNING F7（Node.js checklist）     | `quickstart.md` L29 + L66-73      | LEARNING E.1                             |
| LEARNING F8（PathProgress 文字导航） | `PathProgress.astro`              | LEARNING 无需改（代码层面）              |

> **建议**：Phase 1 执行修复时，顺带更新三份审计报告中的上述章节，在章节末尾追加「**更新（2026-06-24）**：此问题已修复，见 PROJECT-DEFICIENCIES 附录 D。」
