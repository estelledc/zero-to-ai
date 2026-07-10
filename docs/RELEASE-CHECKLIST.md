# 正式发布检查表

## 1.1.0

本地复核日期：2026-07-10。PR workflow 的最终状态以 GitHub 对待合并 HEAD 的检查为准。

### 自动门禁

- [x] `npm ci`
- [x] `npm run verify`
- [x] `npm run audit:official-links`
- [x] `npm audit --audit-level=moderate` 为 0 vulnerability
- [x] `git diff --check`
- [x] PR workflow 上传 `dist` 构建工件，Pages deploy job 在 PR 上按设计跳过

### 内容与迁移

- [x] `package.json` 与 lockfile 版本为 `1.1.0`
- [x] Changelog 记录进度 key 迁移、第三方 provider 边界、依赖升级和验证边界
- [x] `OFFICIAL-SOURCE-MATRIX.json` 与页面 `toolVersion` / `lastVerified` 一致
- [x] 历史审计只追加当前状态，没有改写旧结论
- [x] skill-pack ZIP 由追踪源码确定性生成并通过 smoke

### 人工停止点

- [ ] **DEFERRED**：在真实 Claude Code 账户运行 `/status`、`/permissions`、`/agents`，只记录脱敏结果
- [x] ~~DEFERRED~~ **已完成（2026-07-10）**：对线上站点（`https://estelledc.github.io/zero-to-ai/`）运行完整 Playwright 套件（`PLAYWRIGHT_BASE_URL` 指向生产），桌面 + 移动两 profile 共 27 通过 / 3 按设计跳过 / 0 失败；覆盖首页与路径 base path、路径上下文、显式进度与旧 key 兼容、Pagefind、主题切换、404、RSS、sitemap、axe WCAG A/AA、键盘触控与 reduced-motion
- [ ] **DEFERRED**：Search Console URL-prefix property 完成人工登录与 HTML/meta 验证；未完成不阻塞 1.1.0
- [ ] **DEFERRED**：在 macOS、Windows 和 Linux/WSL 的真实环境补充可迁移性证据

### 发布决策

PR 必须保持 ready、自动门禁全绿并取得明确 merge 授权。采用“合并即正式发布”策略：merge commit 创建后立即创建不可移动的 `v1.1.0` annotated tag；上述延期人工项必须保持未验证声明，发现问题时通过 patch 版本修复。

## 2.0.0

本地复核日期：2026-07-10。PR workflow 的最终状态以 GitHub 对待合并 HEAD 的检查为准。

### 自动门禁

- [x] `npm ci`
- [x] `npm run verify`
- [x] `npm run audit:official-links`
- [x] `npm audit --audit-level=moderate` 为 0 vulnerability
- [x] `git diff --check`
- [x] PR workflow 上传 `dist` 构建工件，Pages deploy job 在 PR 上按设计跳过

### 内容与兼容性

- [x] `package.json` 与 lockfile 版本为 `2.0.0`
- [x] `/claude-code/` 保持稳定，`/codex/` 提供 8 篇完整零基础教程
- [x] `codex-zero` 路径包含最终产物、里程碑、完成证据和失败恢复
- [x] 旧路径 slug、frontmatter 和进度 localStorage key 保持兼容
- [x] Codex 页面与 `OFFICIAL-SOURCE-MATRIX.json` 的版本和复核日期一致
- [x] Codex CLI 文档契约、Pagefind、Playwright 和 axe 覆盖通过

### 人工停止点

- [ ] **DEFERRED**：在真实 Codex 账户验证登录、方案额度和组织权限，只记录脱敏结果
- [x] ~~DEFERRED~~ **已完成（2026-07-10）**：对线上站点运行完整 Playwright 套件（同 1.1.0 条目的那次运行），`/codex/` 首页进入与路径上下文、`codex/quickstart` axe WCAG A/AA、Pagefind 检索 Codex 安装教程、桌面/移动 profile 均通过
- [ ] **DEFERRED**：Search Console URL-prefix property 完成人工登录与 HTML/meta 验证；未完成不阻塞 2.0.0
- [ ] **DEFERRED**：在 macOS、Windows 和 Linux/WSL 的真实环境补充可迁移性证据

### 发布决策

PR 必须保持 ready、自动门禁全绿、base 为 `main` 并取得明确 merge 授权。采用“合并即正式发布”策略：merge commit 创建后立即创建不可移动的 `v2.0.0` annotated tag；上述延期人工项必须保持未验证声明，发现问题时通过 patch 版本修复。
