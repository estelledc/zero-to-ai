# 学习路径审计报告 — Zero to AI

> 生成日期：2026-06-24 · Phase 0 审计（只读，未改任何文件）
>
> 数据来源：`src/content/docs/` 全 33 篇逐文件扫描 + `learning-paths.ts` + `astro.config.mjs` + `index.mdx` + 组件源码交叉核对
>
> 审计方法：以 4 个人物画像（P0-P3）分别沿 3 条学习路径走查，记录里程碑达成、知识缺口、顺序依赖异常
>
> 配套报告：[IA-AUDIT.md](./IA-AUDIT.md)（信息架构）· [UX-AUDIT.md](./UX-AUDIT.md)（体验走查）

---

## A. 站点概况与核心承诺

### 站点定位

Zero to AI 是一个面向编程零基础用户的中文 AI 编程工具实战教程站，基于 Astro 6 + Starlight 构建，提供 Pagefind 全站搜索。站点宣称教程模板遵循「日常类比 → 技术定义 → 实际操作 → 常见坑 → 自检 → 下一步导航」六步结构。

### 核心承诺

站点定义了 3 条学习路径，各有明确承诺：

| 路径             | 描述                                             | 预估时长  | 教程数 |
| ---------------- | ------------------------------------------------ | --------- | ------ |
| ai-coding-zero   | 从不会写代码到能用 AI 工具独立完成**小页面**     | 6-8 小时  | 14     |
| daily-efficiency | 已经会用基础功能？把 AI 编程效率**提升一个量级** | 4-6 小时  | 10     |
| advanced-custom  | 深入底层：Hook / MCP / 子 Agent / 配置即代码     | 7-10 小时 | 17     |

**核心审计问题**：一个真正的零基础读者（P0），跟着 ai-coding-zero 走 6-8 小时，结束时手里会有什么？这与站点承诺是否一致？

### 人物画像

| ID  | 描述                               | 对应路径                     |
| --- | ---------------------------------- | ---------------------------- |
| P0  | 真·零基础：从未打开过终端          | ai-coding-zero               |
| P1  | 有鼠标党基础，想零成本试试         | ai-coding-zero（Agnes 分支） |
| P2  | 有编程基础，想系统化用 Claude Code | daily-efficiency             |
| P3  | 深度定制者，要 Hook/MCP/子 Agent   | advanced-custom              |

---

## B. ai-coding-zero 路径深度分析

### B.1 路径教程顺序与逻辑依赖

当前 `learning-paths.ts` 定义的 ai-coding-zero 顺序：

| 步骤 | 教程 slug                          | 教程标题           | 难度         | 有实操 | 有产出           |
| ---- | ---------------------------------- | ------------------ | ------------ | ------ | ---------------- |
| 0    | appendix/git-basics                | Git 速成           | beginner     | ✅     | ✅ git repo      |
| 1    | claude-code/preflight              | 开始之前           | beginner     | ❌     | ❌               |
| 2    | methodology/basics                 | 通用环境基础设施   | beginner     | ✅     | ✅ 终端+brew     |
| 3    | claude-code/index                  | Claude Code 总览   | beginner     | ❌     | ❌               |
| 4    | claude-code/quickstart             | 10 分钟上手        | beginner     | ✅     | ✅ hello.html    |
| 5    | claude-code/cost                   | 成本与计费         | beginner     | 部分   | ❌               |
| 6    | claude-code/config                 | 配置               | intermediate | ✅     | ✅ CLAUDE.md     |
| 7    | claude-code/context                | 上下文管理         | intermediate | ✅     | ✅               |
| 8    | claude-code/verify                 | 验证               | intermediate | ✅     | ✅               |
| 9    | claude-code/skills                 | Skill 系统         | intermediate | ✅     | ✅ /review skill |
| 10   | claude-code/memory                 | 记忆               | intermediate | ✅     | ✅ memory 条目   |
| 11   | claude-code/daily-rhythm           | 日常节奏           | intermediate | ✅     | ✅ 3日挑战       |
| 12   | claude-code/agnes-free-vibe-coding | 零成本 vibe coding | beginner     | ✅     | ✅ 免费配置      |
| 13   | glossary                           | 术语表             | beginner     | ❌     | ❌               |

### B.2 顺序异常

**问题 1：路径首篇是 Git，但零基础读者还没学终端**

当前顺序：git-basics（步骤 0）→ preflight（步骤 1）→ basics（步骤 2）。逻辑依赖应为：basics（终端概念）→ preflight（自评估）→ git-basics（依赖终端操作）。git-basics 的第一条指令 `cd 你的项目文件夹` 假设读者已能使用终端，但终端教学在 basics（步骤 2）。

**建议顺序**：preflight → basics → git-basics → claude-code/index → quickstart → ...

**问题 2：Agnes 零成本方案在步骤 12，P1 在步骤 4（quickstart）就可能放弃**

quickstart 开篇要求 Anthropic API Key 和 $5-300+/月预算，零成本替代方案（Agnes）要等到步骤 12。P1 用户看到价格后不会再读 8 篇教程才发现「原来可以免费」。详见 [UX-AUDIT.md 痛点 4](./UX-AUDIT.md#痛点-4零成本路径agnes与付费路径的分叉点不清晰p1-可能在-quickstart-就放弃)。

**建议**：将 Agnes 前移到 quickstart 之后（步骤 5），或在 quickstart 增加醒目提示链接。

### B.3 里程碑追踪

站点承诺 P0 在 6-8 小时后能「独立完成小页面」。按以下 6 个里程碑追踪达成情况：

| #   | 里程碑           | 含义                                    | 达成？ | 对应教程                         |
| --- | ---------------- | --------------------------------------- | ------ | -------------------------------- |
| M1  | 环境就绪         | 终端可用 + Node.js + Claude Code 已安装 | ✅     | basics → quickstart              |
| M2  | 第一次对话       | 能跟 Claude Code 对话并看到输出         | ✅     | quickstart（hello.html prompt）  |
| M3  | 第一个可展示成果 | 一个可在浏览器打开的有意义页面          | **❌** | 无 capstone 教程                 |
| M4  | 工具链理解       | 理解成本、配置、上下文、验证            | ✅     | cost → config → context → verify |
| M5  | 自主迭代能力     | 能用 Skill / Memory / 日常节奏自主工作  | ✅     | skills → memory → daily-rhythm   |
| M6  | 知道去哪查       | 术语表 + 站内搜索                       | ✅     | glossary + Pagefind              |

**M3 是唯一未达成的核心里程碑。** quickstart 的 `帮我在当前目录创建一个 hello.html` 是一句 prompt 示例，不是引导式的页面构建教程。14 篇教程中无一篇以「从零构建一个可展示的完整成果」为核心目标。

**站点承诺 vs 实际交付的缺口**：路径描述写「独立完成小页面」，但读者走完后掌握了工具操作和方法论知识，手里却没有一个超过 `hello.html` 单句 prompt 的成果。projects/learn-journal/ 是一个完整项目，但它属于 daily-efficiency 路径而非 ai-coding-zero 路径。

**建议**：在 daily-rhythm 之前插入一篇 capstone 教程（600-800 字），引导 P0 用 Claude Code 从零构建一个稍有意义的页面（个人介绍页 / 待办清单 / 倒计时页面），包含完整的 prompt → 验证 → 在浏览器打开 → 截图的流程。

### B.4 难度曲线

```
beginner ████████ 步骤 0-5, 12, 13  (8 篇)
intermediate ██████ 步骤 6-11           (6 篇)
advanced                                (0 篇)
```

难度从步骤 6（config）开始跳到 intermediate，此前 6 篇都是 beginner。跳变是合理的——config 是读者第一次编辑配置文件——但步骤 6-11 全部是 intermediate 且无一篇回落到 beginner。步骤 12（Agnes）回到 beginner，但此时读者已完成大量中级内容。

**建议**：考虑让 config 或 context 保持 beginner 难度（它们的实操复杂度与 quickstart 相当），形成更平滑的 beginner → intermediate 过渡。

---

## C. 三路径对比与交叉分析

### C.1 教程共享

33 篇教程中有 29 个唯一 slug 出现在至少一条路径中（4 篇 index 页不属于任何路径）。

| 共享度              | 教程                                                                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3 路径共享          | `claude-code/cost`, `claude-code/memory`                                                                                                             |
| 2 路径共享          | `claude-code/config`, `verify`, `skills`, `daily-rhythm`, `methodology/memory-system-design`, `workflow-design`, `learning-management`, `skill-pack` |
| 仅 ai-coding-zero   | `git-basics`, `preflight`, `basics`, `claude-code/index`, `quickstart`, `context`, `agnes`, `glossary`（8 篇）                                       |
| 仅 daily-efficiency | `learn-journal/index`, `learn-journal/quickstart`, `learn-journal/how-it-works`（3 篇）                                                              |
| 仅 advanced-custom  | `hooks`, `mcp`, `subagents`, `dotfiles`, `claude-md-philosophy`, `prompt-anatomy`, `skill-engineering`, `learn-journal/design-philosophy`（8 篇）    |

`cost` 和 `memory` 是全站最核心的两篇教程（三条路径必经）。这合理——成本意识和记忆系统是使用 Claude Code 的基础技能。

### C.2 路径入口一致性

| 路径             | index.mdx Card href     | learning-paths.ts tutorials[0] | 一致？ |
| ---------------- | ----------------------- | ------------------------------ | ------ |
| ai-coding-zero   | `/appendix/git-basics/` | `appendix/git-basics`          | ✅     |
| daily-efficiency | `/claude-code/cost/`    | `claude-code/cost`             | ✅     |
| advanced-custom  | `/claude-code/cost/`    | `claude-code/cost`             | ✅     |

技术上一致，但 daily-efficiency 和 advanced-custom 共享同一入口 URL 导致用户体验问题，详见 [UX-AUDIT.md 痛点 1](./UX-AUDIT.md#痛点-1首页两条路径入口指向同一个-url-p0-困惑)。

### C.3 sidebar 与路径的差异

sidebar（`astro.config.mjs`）定义了 30 个 slug，按分区排列。路径按学习顺序跨分区穿插。

| 差异类型                 | 详情                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| 路径中有但 sidebar 无    | `methodology/prompt-anatomy`, `methodology/skill-engineering`（均属 advanced-custom）    |
| sidebar 中有但无路径归属 | 无（所有 sidebar slug 至少属于一条路径或是 index 页）                                    |
| 顺序差异                 | sidebar 按分区排列（Claude Code → 方法论 → 项目 → 附录）；路径按学习依赖排列，跨分区穿插 |

2 篇教程不在 sidebar 意味着它们只能通过路径页面（`/paths/`）或站内搜索到达，sidebar 导航无法触及。详见 [IA-AUDIT.md 问题 1](./IA-AUDIT.md)。

---

## D. 教程质量审计

### D.1 六步模板合规

站点 README 定义的教程模板为：日常类比 → 技术定义 → 实际操作 → 常见坑 → 自检 → 下一步。排除 4 篇 index 页、glossary 和 index.mdx（共 6 篇非教程内容），剩余 27 篇内容页的合规情况：

| 合规度            | 篇数 | 教程                                                                                                                                                                                   |
| ----------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6/6（完全合规）   | 13   | verify, skills, memory, daily-rhythm, context, config, claude-md-philosophy, memory-system-design, workflow-design, learning-management, prompt-anatomy, skill-engineering, git-basics |
| 5/6（通常缺自检） | 10   | quickstart, subagents, mcp, hooks, dotfiles, cost, agnes, basics, skill-pack, learn-journal/quickstart                                                                                 |
| 4/6               | 1    | preflight                                                                                                                                                                              |
| 3/6 以下          | 3    | learn-journal/index, learn-journal/how-it-works, learn-journal/design-philosophy                                                                                                       |

**最常缺失的步骤是「自检 / Checkpoint」**——10 篇有 5 步但缺自检。自检是验证读者是否真正理解的关键环节，缺失意味着读者可能在未消化的情况下继续前进。

**合规最弱的分区是 projects/learn-journal/**——3 篇内容页（index、how-it-works、design-philosophy）更像产品文档而非教程，缺少实操、常见坑和自检。这与站点「教程站」的定位存在张力。

### D.2 实操与产出

| 类别                             | 篇数 | 占比（27 篇内容页） |
| -------------------------------- | ---- | ------------------- |
| 有明确实操练习                   | 19   | 70%                 |
| 有部分实操（代码示例但非引导式） | 3    | 11%                 |
| 无实操                           | 5    | 19%                 |
| 有明确产出物                     | 15   | 56%                 |
| 无产出物                         | 12   | 44%                 |

70% 的实操覆盖率对教程站而言良好。关键问题不在数量，而在 ai-coding-zero 路径的 14 篇中无一篇产出「可展示的完整页面」（见 B.3 M3 分析）。

### D.3 Frontmatter 元数据

| 字段           | 覆盖率          | 说明                                                                     |
| -------------- | --------------- | ------------------------------------------------------------------------ |
| title          | 100% (33/33)    | —                                                                        |
| description    | 100%            | —                                                                        |
| tags           | 100%            | —                                                                        |
| difficulty     | 100%            | beginner 13 / intermediate 12 / advanced 8                               |
| prerequisites  | 100%            | 含空数组（index 页合理）                                                 |
| relatedContent | 100%            | 含空数组                                                                 |
| lastVerified   | 100%            | **全部为 2026-06-18**，疑似批量更新而非逐篇验证                          |
| learningPaths  | 85% (28/33)     | 5 篇 index 页无路径（合理）                                              |
| toolVersion    | **45%** (15/33) | 仅 claude-code/ 分区有，且均为 `Claude Code CLI (latest)` 而非具体版本号 |

**lastVerified 同质化问题**：全部 33 篇同一天标注，无法区分哪篇是真正重新验证过、哪篇只是批量刷了日期。建议逐篇验证时记录真实日期。

**toolVersion 模糊性**：`Claude Code CLI (latest)` 无法追溯到具体版本。如果 CLI 破坏性更新，无法快速定位哪些教程受影响。建议改为具体版本号如 `Claude Code CLI v1.0.33`。

### D.4 内容规模

| 字数范围  | 篇数                                                |
| --------- | --------------------------------------------------- |
| < 500     | 5（index 页 + landing）                             |
| 500-1500  | 4                                                   |
| 1500-3000 | 10                                                  |
| 3000-4500 | 12                                                  |
| > 4500    | 2（workflow-design ~5500, design-philosophy ~4500） |

中位字数约 2500-3000。最长的 workflow-design（~5500 字）可能超出零基础读者单次阅读的注意力范围。

---

## E. 知识缺口与概念冲突

### E.1 未覆盖的关键知识

以下知识点是 P0 从零到独立完成小页面所需但站点未覆盖的：

| 缺口                  | 严重度 | 说明                                                                                                                      |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| **页面构建 capstone** | 阻塞   | 站点承诺「小页面」但无教程教构建（见 B.3 M3）                                                                             |
| **Node.js 安装**      | 摩擦   | basics 教了 brew 但未教 `brew install node`；quickstart 依赖 npm（见 UX 痛点 3）                                          |
| **HTML/CSS 最小知识** | 轻微   | P0 被要求用 AI 写页面，但不知道 HTML 文件在浏览器如何打开、什么是标签——Claude Code 可以代劳，但教程未交代读者需要知道什么 |
| **错误处理心智模型**  | 轻微   | verify 教了验证方法论，但 P0 遇到 npm 报错时不知道如何提问或搜索——缺一篇「AI 报错了怎么办」的快速指南                     |

### E.2 概念冲突

| 冲突                                                        | 涉及文件                              | 说明                                                                                                                                                                                                    |
| ----------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 「零成本」vs「$5 起」                                       | preflight + quickstart + agnes        | 站点同时传递「这是付费工具」和「可以免费用」两个信号，但它们相隔 8 篇教程；P1 接收到的第一信号是「付费」                                                                                                |
| sidebar 顺序 vs 路径顺序                                    | astro.config.mjs vs learning-paths.ts | sidebar 展示的 Claude Code 区顺序（index → preflight → quickstart → cost → agnes → config...）与 ai-coding-zero 路径顺序（git-basics → preflight → basics → index → quickstart → cost → config...）不同 |
| preflight 说「先去 basics」但 basics 的下一步不含 preflight | preflight.md + basics.md              | 单向链接，读者被发送到 basics 后无法循路径回到 preflight                                                                                                                                                |

---

## F. 待作者决策项

以下按优先级排列，标注了影响范围和改动类型：

### 优先级 1：阻塞性

| #   | 决策项                                                            | 涉及文件                           | 改动类型  |
| --- | ----------------------------------------------------------------- | ---------------------------------- | --------- |
| F1  | 新增 capstone 教程填补 M3 缺口                                    | 新文件 + learning-paths.ts         | 新增正文  |
| F2  | 调整 ai-coding-zero 前三步顺序（preflight → basics → git-basics） | learning-paths.ts + index.mdx      | META      |
| F3  | 将 Agnes 在路径中前移或在 quickstart 增加零成本提示               | learning-paths.ts 或 quickstart.md | META/正文 |

### 优先级 2：摩擦性

| #   | 决策项                                                  | 涉及文件                                 | 改动类型 |
| --- | ------------------------------------------------------- | ---------------------------------------- | -------- |
| F4  | 为 daily-efficiency 和 advanced-custom 路径设置不同入口 | index.mdx                                | META     |
| F5  | 将 prompt-anatomy 和 skill-engineering 加入 sidebar     | astro.config.mjs                         | META     |
| F6  | 修复 preflight → basics 的回程链接                      | basics.md relatedContent                 | 正文     |
| F7  | quickstart 增加 Node.js 安装 checklist                  | quickstart.md                            | 正文     |
| F8  | 增加 PathProgress 上下篇文字导航                        | PathProgress.astro / ContentHeader.astro | 组件     |
| F9  | quickstart 增加 Windows 等价命令                        | quickstart.md                            | 正文     |

### 优先级 3：改善性

| #   | 决策项                                       | 涉及文件                | 改动类型 |
| --- | -------------------------------------------- | ----------------------- | -------- |
| F10 | toolVersion 改为具体版本号                   | 15 篇 claude-code/\*.md | FM       |
| F11 | lastVerified 逐篇记录真实验证日期            | 33 篇                   | FM       |
| F12 | 补充 10 篇教程的自检/Checkpoint 段落         | 各教程                  | 正文     |
| F13 | projects/learn-journal/ 3 篇补充实操和常见坑 | learn-journal/\*.md     | 正文     |
| F14 | 新增 troubleshooting/FAQ 页面                | 新文件                  | 新增正文 |
| F15 | 方法论 index 增加 P0 友好的导读提示          | methodology/index.md    | 正文     |

---

## 附录：审计数据摘要

### 全站文件清单

| 分区         | 文件数 | 有实操 | 有产出 | 6步合规 |
| ------------ | ------ | ------ | ------ | ------- |
| claude-code/ | 15     | 12     | 10     | 10      |
| methodology/ | 8      | 7      | 7      | 7       |
| projects/    | 5      | 2      | 1      | 1       |
| appendix/    | 2      | 1      | 1      | 1       |
| 根目录       | 3      | 0      | 0      | 0       |
| **合计**     | **33** | **22** | **19** | **19**  |

### Prerequisites 依赖链

```
最深路径（4跳）：
  subagents ← skills ← config ← quickstart ← basics（无前置）

全站入度 0 节点（10个）：
  4 个 index 页 + basics + git-basics + glossary + preflight + learn-journal/index + index.mdx
```

无循环依赖。所有 `prerequisites`、`relatedContent`、`learningPaths` 引用均通过 `validate-cross-refs.ts` 校验（0 错误，0 警告）。

### 路径覆盖

33 篇中 29 篇属于至少一条路径。4 篇 index 页不属于任何路径（合理——它们是导航页）。

| 路径归属       | 篇数          |
| -------------- | ------------- |
| 属于 3 条路径  | 2             |
| 属于 2 条路径  | 8             |
| 属于 1 条路径  | 19            |
| 不属于任何路径 | 4（index 页） |

### validate-cross-refs.ts 运行结果

```
✅ 0 errors, 0 warnings
   33 files checked
```

所有双向一致性约束通过。

## G. 当前状态附录（2026-07-10）

以上 A-F 章节保留 2026-06-24 的学习审计快照。当前状态以 `src/data/learning-paths.ts`、官方资料验证矩阵和 Changelog 为准。

- 第一 capstone（本地个人页面）已存在；1.1 新增第二 capstone（Git + GitHub Pages 发布与恢复）。
- 路径元数据增加最终产物、里程碑和完成证据，学习者必须显式标记完成。
- `lastVerified` 不再等于“批量改日期”：时效性页面必须在 `OFFICIAL-SOURCE-MATRIX.json` 有同版本、同日期和一手来源记录。
- 原报告中的修复前缺口不会删除；每次复审只追加当前状态，避免把历史证据改成“从未发生”。
