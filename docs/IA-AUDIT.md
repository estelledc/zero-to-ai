# IA 审计报告 — Zero to AI 站点信息架构

> 生成日期：2026-06-24 · Phase 0 审计（只读，未改任何文件）
>
> 数据来源：`src/content/docs/` 全部 33 个 `.md/.mdx` 文件逐文件扫描 + `learning-paths.ts` + `astro.config.mjs` + `validate-cross-refs.ts` 交叉核对
>
> 审计视角：一个「不会写代码、从未用过终端」的读者，能否仅凭本站内容和导航结构，找到并走完「AI 编程零基础入门」路径？

---

## 一、站点概览

| 指标                          | 数值                                                                                   |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| 总 .md/.mdx 文件              | 33                                                                                     |
| sidebar 可见文件              | 30（astro.config.mjs 中列出的 slug）                                                   |
| sidebar 未列出文件            | 3（`methodology/skill-engineering`、`methodology/prompt-anatomy`、`projects/index`\*） |
| 学习路径                      | 3 条（ai-coding-zero / daily-efficiency / advanced-custom）                            |
| 内容分区                      | 4（Claude Code / 方法论 / 实战项目 / 附录）                                            |
| 教程篇数（含 index/glossary） | 33                                                                                     |
| 交叉引用校验结果              | ✅ 通过（0 错误 0 警告，`npm run validate-refs`）                                      |

\*注：`projects/index` 在 sidebar 中通过 `{ slug: 'projects' }` 展现，Astro 6 会自动解析 `index.md`。`methodology/skill-engineering` 和 `methodology/prompt-anatomy` 在 sidebar 配置中**未列出**，但在 `learning-paths.ts` 的 `advanced-custom` 路径中包含。

---

## 二、完整文件清单

### 2.1 Claude Code 分区（15 篇）

| 文件                                    | Sidebar 可见 | FM 完整性 | difficulty   | learningPaths                                     | prerequisites 入度         | relatedContent 出度 | toolVersion | lastVerified |
| --------------------------------------- | ------------ | --------- | ------------ | ------------------------------------------------- | -------------------------- | ------------------- | ----------- | ------------ |
| `claude-code/index.md`                  | ✅           | ✅ 完整   | beginner     | ai-coding-zero                                    | 0                          | 2                   | ✅          | 2026-06-18   |
| `claude-code/preflight.md`              | ✅           | ✅ 完整   | beginner     | ai-coding-zero                                    | 0                          | 3                   | ✅          | 2026-06-18   |
| `claude-code/quickstart.md`             | ✅           | ✅ 完整   | beginner     | ai-coding-zero                                    | 1（methodology/basics）    | 6                   | ✅          | 2026-06-18   |
| `claude-code/cost.md`                   | ✅           | ✅ 完整   | beginner     | ai-coding-zero, daily-efficiency, advanced-custom | 1（quickstart）            | 6                   | ✅          | 2026-06-18   |
| `claude-code/agnes-free-vibe-coding.md` | ✅           | ✅ 完整   | beginner     | ai-coding-zero                                    | 1（quickstart）            | 5                   | ✅          | 2026-06-18   |
| `claude-code/config.md`                 | ✅           | ✅ 完整   | intermediate | ai-coding-zero, advanced-custom                   | 1（quickstart）            | 8                   | ✅          | 2026-06-18   |
| `claude-code/context.md`                | ✅           | ✅ 完整   | intermediate | ai-coding-zero                                    | 1（quickstart）            | 5                   | ✅          | 2026-06-18   |
| `claude-code/verify.md`                 | ✅           | ✅ 完整   | intermediate | ai-coding-zero, advanced-custom                   | 1（quickstart）            | 7                   | ✅          | 2026-06-18   |
| `claude-code/skills.md`                 | ✅           | ✅ 完整   | intermediate | ai-coding-zero, advanced-custom                   | 1（config）                | 8                   | ✅          | 2026-06-18   |
| `claude-code/memory.md`                 | ✅           | ✅ 完整   | intermediate | ai-coding-zero, daily-efficiency, advanced-custom | 1（config）                | 5                   | ✅          | 2026-06-18   |
| `claude-code/hooks.md`                  | ✅           | ✅ 完整   | advanced     | advanced-custom                                   | 2（config, skills）        | 6                   | ✅          | 2026-06-18   |
| `claude-code/daily-rhythm.md`           | ✅           | ✅ 完整   | intermediate | ai-coding-zero, daily-efficiency                  | 2（quickstart, skills）    | 5                   | ✅          | 2026-06-18   |
| `claude-code/mcp.md`                    | ✅           | ✅ 完整   | advanced     | advanced-custom                                   | 1（quickstart）            | 6                   | ✅          | 2026-06-18   |
| `claude-code/subagents.md`              | ✅           | ✅ 完整   | advanced     | advanced-custom                                   | 3（skills, hooks, verify） | 5                   | ✅          | 2026-06-18   |
| `claude-code/dotfiles.md`               | ✅           | ✅ 完整   | advanced     | advanced-custom                                   | 3（config, hooks, memory） | 5                   | ✅          | 2026-06-18   |

### 2.2 方法论分区（8 篇 + 1 index）

| 文件                                  | Sidebar 可见    | FM 完整性 | difficulty   | learningPaths                     | prerequisites 入度                 | relatedContent 出度 |
| ------------------------------------- | --------------- | --------- | ------------ | --------------------------------- | ---------------------------------- | ------------------- |
| `methodology/index.md`                | ✅              | ✅        | beginner     | —                                 | 0                                  | 2                   |
| `methodology/basics.md`               | ✅              | ✅        | beginner     | ai-coding-zero                    | 0                                  | 4                   |
| `methodology/claude-md-philosophy.md` | ✅              | ✅        | intermediate | advanced-custom                   | 2（basics, config）                | 4                   |
| `methodology/memory-system-design.md` | ✅              | ✅        | intermediate | daily-efficiency, advanced-custom | 2（basics, memory）                | 7                   |
| `methodology/workflow-design.md`      | ✅              | ✅        | intermediate | daily-efficiency, advanced-custom | 2（basics, skills）                | 7                   |
| `methodology/learning-management.md`  | ✅              | ✅        | intermediate | daily-efficiency, advanced-custom | 2（daily-rhythm, workflow-design） | 5                   |
| `methodology/skill-pack.md`           | ✅              | ✅        | intermediate | daily-efficiency, advanced-custom | 1（learning-management）           | 6                   |
| `methodology/skill-engineering.md`    | ❌ 未在 sidebar | ✅        | advanced     | advanced-custom                   | 2（skills, prompt-anatomy）        | 9                   |
| `methodology/prompt-anatomy.md`       | ❌ 未在 sidebar | ✅        | advanced     | advanced-custom                   | 2（claude-md-philosophy, skills）  | 9                   |

### 2.3 实战项目分区（5 篇）

| 文件                                          | Sidebar 可见 | FM 完整性 | difficulty   | learningPaths    | prerequisites 入度       | relatedContent 出度 |
| --------------------------------------------- | ------------ | --------- | ------------ | ---------------- | ------------------------ | ------------------- |
| `projects/index.md`                           | ✅           | ✅        | beginner     | —                | 0                        | 2                   |
| `projects/learn-journal/index.md`             | ✅           | ✅        | beginner     | daily-efficiency | 0                        | 3                   |
| `projects/learn-journal/quickstart.md`        | ✅           | ✅        | beginner     | daily-efficiency | 1（learn-journal/index） | 4                   |
| `projects/learn-journal/how-it-works.md`      | ✅           | ✅        | intermediate | daily-efficiency | 1（learn-journal/index） | 4                   |
| `projects/learn-journal/design-philosophy.md` | ✅           | ✅        | advanced     | advanced-custom  | 1（learn-journal/index） | 3                   |

### 2.4 附录与参考（3 篇）

| 文件                     | Sidebar 可见 | FM 完整性 | difficulty | learningPaths  | prerequisites 入度 | relatedContent 出度 |
| ------------------------ | ------------ | --------- | ---------- | -------------- | ------------------ | ------------------- |
| `appendix/index.md`      | ✅           | ✅        | beginner   | —              | 0                  | 3                   |
| `appendix/git-basics.md` | ✅           | ✅        | beginner   | ai-coding-zero | 0                  | 2                   |
| `glossary.md`            | ✅           | ✅        | beginner   | ai-coding-zero | 0                  | 5                   |

---

## 三、Sidebar vs Learning Paths 差异分析

### 3.1 Sidebar 有但 learning-paths.ts 无

| 文件                   | 在 sidebar | 在 learning-paths                | 影响                                               |
| ---------------------- | ---------- | -------------------------------- | -------------------------------------------------- |
| `claude-code/index.md` | ✅         | ❌ 不在任何路径的 tutorials 数组 | 轻微：index 是导航页，不是教程步骤，不需要在路径中 |
| `methodology/index.md` | ✅         | ❌                               | 轻微：同上                                         |
| `projects/index.md`    | ✅         | ❌                               | 轻微：同上                                         |
| `appendix/index.md`    | ✅         | ❌                               | 轻微：同上                                         |

### 3.2 Learning-paths.ts 有但 sidebar 无

| 文件                               | 在 learning-paths   | 在 sidebar                               | 影响                                                                        |
| ---------------------------------- | ------------------- | ---------------------------------------- | --------------------------------------------------------------------------- |
| `methodology/prompt-anatomy.md`    | ✅ advanced-custom  | ❌                                       | **摩擦**：高级路径用户在 sidebar 找不到此教程，只能通过路径页或交叉引用到达 |
| `methodology/skill-engineering.md` | ✅ advanced-custom  | ❌                                       | **摩擦**：同上                                                              |
| `projects/learn-journal/index.md`  | ✅ daily-efficiency | ✅（通过 `projects/learn-journal` slug） | 无影响                                                                      |

**关键发现**：`methodology/prompt-anatomy` 和 `methodology/skill-engineering` 两篇教程被 `advanced-custom` 路径引用，但不在 `astro.config.mjs` 的 sidebar 配置中。用户通过 sidebar 浏览「方法论」分区时**看不到这两篇**。仅通过「学习路径」页面或其他教程的 `relatedContent` 链接可达。

### 3.3 Index.mdx 首页 Card 链接一致性

| 路径名            | Card href               | learning-paths.ts 首篇 | 一致？ | 问题 |
| ----------------- | ----------------------- | ---------------------- | ------ | ---- |
| AI 编程零基础入门 | `/appendix/git-basics/` | `appendix/git-basics`  | ✅     | —    |
| 日常效率提升      | `/claude-code/cost/`    | `claude-code/cost`     | ✅     | —    |
| 高级定制与自动化  | `/claude-code/cost/`    | `claude-code/cost`     | ✅     | —    |

**问题**：「日常效率提升」和「高级定制与自动化」两条路径的首页 Card 链接**完全相同**——都指向 `/claude-code/cost/`。这不是 bug（两条路径确实都从 cost 开始），但对用户造成**困惑**：点两个不同的卡片进了同一个页面，不知道差别在哪。

---

## 四、Frontmatter 完整性总结

### 4.1 字段覆盖率

| 字段           | 覆盖数 / 总数 | 覆盖率 | 说明                        |
| -------------- | ------------- | ------ | --------------------------- |
| title          | 33/33         | 100%   | —                           |
| description    | 33/33         | 100%   | —                           |
| tags           | 33/33         | 100%   | —                           |
| difficulty     | 33/33         | 100%   | —                           |
| prerequisites  | 33/33         | 100%   | 含空数组                    |
| relatedContent | 33/33         | 100%   | 含空数组                    |
| lastVerified   | 33/33         | 100%   | 全部为 2026-06-18           |
| learningPaths  | 28/33         | 85%    | 5 个 index 页无路径（合理） |
| toolVersion    | 15/33         | 45%    | 仅 Claude Code 分区有       |

### 4.2 Difficulty 分布

| 级别         | 篇数 | 占比 |
| ------------ | ---- | ---- |
| beginner     | 13   | 39%  |
| intermediate | 12   | 36%  |
| advanced     | 8    | 24%  |

### 4.3 lastVerified 时效性

全部 33 篇的 `lastVerified` 均为 `2026-06-18`，距审计日期（2026-06-24）仅 6 天。无过期风险。

### 4.4 toolVersion 一致性

15 篇有 `toolVersion` 的文件全部标注为 `Claude Code CLI (latest)`。这种标注方式**无法追溯具体版本**——当 Claude Code 更新导致行为变化时，读者无法知道教程基于哪个版本写的。建议改为具体版本号（如 `Claude Code CLI v1.0.78`）。

---

## 五、链接图分析

### 5.1 Prerequisites 链（入度统计）

| 入度        | 文件                                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| 0（无前置） | 10 篇：所有 index 页 + basics + git-basics + glossary + preflight + learn-journal/index                   |
| 1           | 14 篇：quickstart → basics; cost/agnes/config/context/verify/mcp → quickstart; 等                         |
| 2           | 6 篇：hooks, daily-rhythm, claude-md-philosophy, memory-system-design, workflow-design, skill-engineering |
| 3           | 3 篇：subagents, dotfiles, prompt-anatomy                                                                 |

### 5.2 是否存在死锁

Prerequisites 链中**无循环依赖**。所有链最终指向入度 0 的节点。最长链：

```
dotfiles ← config ← quickstart ← basics（3 跳）
subagents ← skills ← config ← quickstart ← basics（4 跳）
```

### 5.3 孤儿页

**无孤儿页**。所有 33 篇均至少被一个其他页面的 `relatedContent` 或 `prerequisites` 引用。

### 5.4 交叉引用校验

```
交叉引用校验通过 (已检查 33 个文件)
```

0 错误、0 警告。所有 `prerequisites`、`relatedContent`、`learningPaths` 引用均指向有效 slug。

---

## 六、问题发现汇总

| #   | 问题                                              | 涉及文件                                                      | 严重度 | 类型     |
| --- | ------------------------------------------------- | ------------------------------------------------------------- | ------ | -------- |
| 1   | 2 篇教程在路径中但不在 sidebar                    | `methodology/prompt-anatomy`, `methodology/skill-engineering` | 摩擦   | 导航缺陷 |
| 2   | 日常效率 / 高级定制两条路径首页 Card 指向同一 URL | `index.mdx` L38-48                                            | 摩擦   | 入口混淆 |
| 3   | `toolVersion` 使用 `(latest)` 而非具体版本号      | 15 篇 Claude Code 教程                                        | 轻微   | 可追溯性 |
| 4   | 首页无「学习路径」专属页面的显著入口              | `index.mdx`                                                   | 轻微   | 导航遗漏 |
| 5   | sidebar 方法论区缺少 2 篇高级教程                 | `astro.config.mjs` L43-51                                     | 摩擦   | 配置遗漏 |

## 七、当前状态附录（2026-07-10）

以上正文保留 2026-06-24 审计快照，不回写原始判断。当前实现已补齐当时发现的 sidebar、路径入口、交叉引用和导航问题；详细映射见 `PROJECT-DEFICIENCIES.md`。

1. 站点已升级到 Astro 7 / Starlight 0.41，构建不再出现旧 Markdown 配置弃用提示。
2. 路由、学习路径 slug、frontmatter 和 progress localStorage key 保持兼容。
3. 新增 `audit:content-freshness`、Playwright smoke 和 PR 构建产物，原审计未覆盖这些门禁。
4. 1.1 复审发现的教程协议、显式完成语义和安全边界属于后续状态，不应反向改写本快照。
