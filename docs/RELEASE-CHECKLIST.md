# 1.1.0 发布检查表

本地复核日期：2026-07-10。PR workflow 的最终状态以 GitHub 对待合并 HEAD 的检查为准。

## 自动门禁

- [x] `npm ci`
- [x] `npm run verify`
- [x] `npm run audit:official-links`
- [x] `npm audit --audit-level=moderate` 为 0 vulnerability
- [x] `git diff --check`
- [x] PR workflow 上传 `dist` 构建工件，Pages deploy job 在 PR 上按设计跳过

## 内容与迁移

- [x] `package.json` 与 lockfile 版本为 `1.1.0`
- [x] Changelog 记录进度 key 迁移、第三方 provider 边界、依赖升级和验证边界
- [x] `OFFICIAL-SOURCE-MATRIX.json` 与页面 `toolVersion` / `lastVerified` 一致
- [x] 历史审计只追加当前状态，没有改写旧结论
- [x] skill-pack ZIP 由追踪源码确定性生成并通过 smoke

## 人工停止点

- [ ] **DEFERRED**：在真实 Claude Code 账户运行 `/status`、`/permissions`、`/agents`，只记录脱敏结果
- [ ] **DEFERRED**：在 GitHub Pages 发布后复查首页、三条路径、Pagefind、RSS、sitemap、404、主题和移动端
- [ ] **DEFERRED**：Search Console URL-prefix property 完成人工登录与 HTML/meta 验证；未完成不阻塞 1.1.0
- [ ] **DEFERRED**：在 macOS、Windows 和 Linux/WSL 的真实环境补充可迁移性证据

## 发布决策

PR 必须保持 ready、自动门禁全绿并取得明确 merge 授权。采用“合并即正式发布”策略：merge commit 创建后立即创建不可移动的 `v1.1.0` annotated tag；上述延期人工项必须保持未验证声明，发现问题时通过 patch 版本修复。
