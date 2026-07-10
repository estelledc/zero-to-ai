# ROADMAP — Zero to AI 未来方向与阶段规划

> **制定日期**：2026-07-10（v2.0.0 发布日）
> **适用基线**：v2.0.0 — Claude Code 与 Codex 双工具站，4 条学习路径，`npm run verify` 全量门禁。
> **维护方式**：阶段推进或方向调整时追加更新，不改写历史结论，与 `PROJECT-DEFICIENCIES.md`、`AUDIT-RECONCILIATION.md` 的治理方式一致。

---

## 1. 方向判断

2.0.0 完成了「内容层」建设。复核发布检查表、指标目录与来源矩阵后的结论是：**当前最大缺口不在内容数量，而在证据层与运营层**。

| 缺口                       | 证据位置                                                           |
| -------------------------- | ------------------------------------------------------------------ |
| 人工验证全部延期           | `RELEASE-CHECKLIST.md` 中 1.1.0 与 2.0.0 的人工停止点均为 DEFERRED |
| 指标体系已设计、从未运行   | `metrics/` 只有模板与说明，`snapshots/` 尚无任何快照               |
| 12 页 PARTIAL 验证         | `OFFICIAL-SOURCE-MATRIX.json`（经验值、第三方能力或真实账户步骤）  |
| Learn Journal 可迁移性 N=1 | `projects/learn-journal/` 自述与 CHANGELOG 1.0.0 已知限制          |
| 治理文档滞后               | D-031 未回写 Codex 落地；IA/UX/LEARNING 审计仍反映 33 文件旧快照   |

据此，未来方向按「先补证据，再做运营，最后再扩张」排序，分四个阶段推进。版本号是阶段锚点，不承诺日历时间。

| 阶段 | 版本锚点    | 主题         | 一句话目标                                              |
| ---- | ----------- | ------------ | ------------------------------------------------------- |
| 0    | 2.0.x patch | 证据补齐     | DEFERRED 人工验证闭环，指标体系从「已设计」到「在运行」 |
| 1    | 2.1         | 运营深化     | 用真实数据驱动内容维护，收敛 PARTIAL，不扩张工具        |
| 2    | 3.0         | 第三工具准入 | 用固化门槛评估新工具，复用 2.0 的接入模板               |
| 3    | 远期        | 平台演进     | CDN/CSP、上游能力跟踪、社区反馈闭环                     |

---

## 2. 阶段 0 — 2.0.x：补齐证据层（最优先）

### 关键任务

1. 完成 `RELEASE-CHECKLIST.md` 2.0.0 的 4 项 DEFERRED 并回写：真实 Codex 账户（登录、方案额度、组织权限，只记录脱敏结果）、GitHub Pages 发布后线上复查（`/codex/`、学习路径、搜索、主题、移动端）、Search Console URL-prefix 人工验证、macOS / Windows / Linux(WSL) 可迁移性证据。1.1.0 遗留的同类项（真实 Claude Code 账户 `/status`、`/permissions`、`/agents` 等）一并处理。
2. 产出首份 `metrics/snapshots/YYYY-MM-DD.json` 脱敏快照，并按 `metrics/README.md` 建立双周节奏。
3. 线上复查发现的问题走 patch 版本立即修复，不积压到 2.1。

### 责任边界

真实账户登录、Search Console Verify、跨平台真机操作必须由站点所有者完成（见 `METRICS-BASELINE.md` 人工停止点）；自动化 agent 不可替代这些步骤，也不得在证据缺席时标记「已验证」。

### 完成标准

- [ ] `RELEASE-CHECKLIST.md` 中 1.1.0 与 2.0.0 的人工停止点全部勾选，或逐项给出书面放弃理由（进展 2026-07-10：8 项中 2 项线上复查已凭生产站 Playwright 全绿闭环，余 6 项为所有者专属）
- [x] `metrics/snapshots/` 存在至少 1 份脱敏快照（2026-07-10 首份已产出；traffic 与 Search Console 数字待所有者补录）
- [x] 线上复查发现的问题已通过 patch 发布，或登记为已知限制（2026-07-10 复查 27 通过 / 0 失败，无待修问题）

---

## 3. 阶段 1 — 2.1：指标驱动运营与内容深化（不扩张工具）

### 关键任务

1. **指标驱动**：连续运行双周快照，执行 `METRICS-BASELINE.md` 的 backlog 决策规则——低 CTR 先改标题与 description；有查询无页面的进入候选池；Discussions/Issues 卡点优先复现再修正文。
2. **PARTIAL 收敛**：利用阶段 0 取得的真实账户与线上证据，把 `OFFICIAL-SOURCE-MATRIX.json` 中可收敛的 PARTIAL 页面升级为 PASS；确因经验值或第三方能力无法 PASS 的，在矩阵中注明不可收敛原因。
3. **freshness 制度化**：90 天维护警告不过期堆积，复核后统一回写 `lastVerified` 与来源矩阵。
4. **Learn Journal 可迁移性 N>1**：邀请至少 1 名非作者用户完整走通 skill-pack 安装与使用，记录脱敏结果，把「N=1 假设」升级为「有外部证据的方法论」，或如实记录失败。
5. **文档债消化**：按 `PROJECT-DEFICIENCIES.md` 附录 D 清单回写 IA/UX/LEARNING 三份审计文档，修正其中 3 路径 / 33 文件的旧口径。

### 完成标准

- [ ] 双周快照连续不少于 3 期，且至少 1 条 backlog 决策在快照 `decisions` 字段中有据可查
- [ ] PARTIAL 页面数量较 12 页基线下降，或每页附有书面不可收敛原因（收敛路径分类见 `OFFICIAL-SOURCE-MATRIX.md`）
- [ ] Learn Journal 有 N ≥ 2 的真实使用记录（成功或失败均可，但必须真实）
- [x] 附录 D 回写清单清零，审计文档与当前站点状态一致（2026-07-10 完成，历史结论未改写）

---

## 4. 阶段 2 — 3.0：第三工具准入（评估制，不点名承诺）

首页「更多 AI 编程工具」卡片的既有措辞是本阶段的总原则：**其他工具只有在官方资料稳定且可持续复核时才会加入**。

### 准入门槛（全部满足才立项）

1. **官方一手资料稳定**：安装、认证、权限、成本均有官方文档，且近一个复核周期内无推翻性变更。
2. **可持续复核**：能进入 90 天 freshness 周期；CLI 契约可以像 `test:codex-docs` 一样静态验证，不依赖模型调用、不消耗账户额度。
3. **独立零基础闭环**：能支撑「安装 → 第一次只读任务 → 项目规则 → 修改/验证/Git → capstone → 排错 → 官方索引」的完整路径。
4. **零成本或明码标价的 capstone**：学习者不花钱或花已知的钱，就能拿到有公开 URL 的作品。

### 接入模板（源自 Codex 2.0 经验，新工具照此交付）

- `src/content/docs/<tool>/` 完整教程组（对齐 codex 8 篇结构：index / quickstart / first-task / 项目规则 / modify-verify-git / capstone / troubleshooting / official-sources）
- `src/data/learning-paths.ts` 新路径：最终产物、里程碑、完成证据、失败恢复四要素齐备
- `scripts/test-<tool>-docs.ts` 契约测试接入 `npm run verify`
- `OFFICIAL-SOURCE-MATRIX` 新条目，与页面 `toolVersion` / `lastVerified` 绑定
- 首页卡片、Pagefind 同义词、Playwright smoke 同步覆盖
- 既有 URL 与进度 localStorage key 保持兼容

### 候选评估

- 候选池来源：社区 Discussions 反馈与生态观察（如 Gemini CLI、DeepSeek 等），不预先承诺任何工具。
- 每次评估留下书面结论（通过 / 不通过 + 依据），不通过的进入观察名单，待条件变化后重评。

### 完成标准

- [ ] 准入门槛评估至少执行 1 次并留下书面结论
- [ ] 若有工具达标：以 3.0 发布其完整路径，交付物与接入模板一致
- [ ] 若无工具达标：在本文件追加评估记录，3.0 顺延，不为扩张而降低门槛

---

## 5. 阶段 3 — 远期：平台与架构演进

| 方向             | 内容                                                                                                                                                      | 触发条件                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 响应头与 CSP     | 迁移到支持自定义响应头的 CDN 后，按 `SECURITY-BOUNDARY.md` 预留在真实 HTTP 响应中设置 CSP、`X-Content-Type-Options`、Referrer-Policy，并用 `curl -I` 验证 | GitHub Pages 的响应头限制实际影响安全目标，或需要自定义域名/边缘能力 |
| sidebar 路径过滤 | 跟踪 Starlight 上游对按学习路径过滤 sidebar 的支持（D-004 / D-005 框架限制）                                                                              | 上游提供可行 API 后重估「有意保留」决策                              |
| 社区反馈闭环     | Discussions 卡点 → 复现 → 修正文或恢复指导 → 回写指标快照 `decisions` 字段，使内容改进可追溯                                                              | 阶段 1 指标体系稳定运行后常态化                                      |

---

## 6. 不变量（所有阶段共同遵守）

| #   | 不变量                                                                      | 出处                                          |
| --- | --------------------------------------------------------------------------- | --------------------------------------------- |
| 1   | 只引用官方一手资料，教程 frontmatter 与来源矩阵绑定                         | `OFFICIAL-SOURCE-MATRIX.md`                   |
| 2   | 零第三方追踪脚本，只保留 Search Console 所有权验证 meta                     | `METRICS-BASELINE.md`、`SECURITY-BOUNDARY.md` |
| 3   | 自动门禁全绿才发版：`npm run verify` + `audit:official-links` + `npm audit` | `RELEASE-CHECKLIST.md`                        |
| 4   | 人工证据可延期，但必须保持未验证声明，不伪造「已验证」                      | `RELEASE-CHECKLIST.md` 发布决策               |
| 5   | 新教程必须进入学习路径、搜索同义词或参考索引，不为页数制造孤儿页            | `METRICS-BASELINE.md` backlog 决策            |
| 6   | 既有 URL、slug 与进度 localStorage key 保持兼容                             | CHANGELOG 2.0.0                               |
| 7   | 治理文档只追加当前状态，不改写历史结论                                      | `AUDIT-RECONCILIATION.md`                     |

---

## 7. 与治理文档的分工

本文件只回答「接下来做什么、按什么顺序」。执行细节归属既有文档：发布门禁与人工停止点见 `RELEASE-CHECKLIST.md`；指标口径与 backlog 规则见 `METRICS-BASELINE.md`；来源验证口径见 `OFFICIAL-SOURCE-MATRIX.md`；安全边界见 `SECURITY-BOUNDARY.md`；历史缺陷与取舍见 `PROJECT-DEFICIENCIES.md`。阶段完成时在本文件对应章节追加「更新（日期）」标注，不删除原文。
