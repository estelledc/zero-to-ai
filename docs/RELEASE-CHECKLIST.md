# 1.1 发布检查表

## 自动门禁

- [ ] `npm ci`
- [ ] `npm run verify`
- [ ] `npm run audit:official-links`
- [ ] `npm audit` 为 0 high/critical，当前目标为 0 advisory
- [ ] `git diff --check`
- [ ] PR workflow 上传 `dist` 构建工件，Pages deploy job 未在 PR 运行

## 内容与迁移

- [ ] `package.json` 与 lockfile 版本为 `1.1.0-rc.1`
- [ ] Changelog 记录进度 key 迁移、第三方 provider 边界和依赖升级
- [ ] `OFFICIAL-SOURCE-MATRIX.json` 与页面 `toolVersion` / `lastVerified` 一致
- [ ] 历史审计只追加当前状态，没有改写旧结论
- [ ] skill-pack ZIP 由追踪源码确定性生成并通过 smoke

## 人工停止点

- [ ] 在真实 Claude Code 账户运行 `/status`、`/permissions`、`/agents`，只记录脱敏结果
- [ ] 在 GitHub Pages 发布后复查首页、三条路径、Pagefind、RSS、sitemap、404、主题和移动端
- [ ] Search Console URL-prefix property 完成人工登录与 HTML/meta 验证；未完成不阻塞 1.1 RC

## 发布决策

草稿 PR 只能由明确 review 转为 ready；不自动合并。正式 `1.1.0` 标签只在 RC 人工验收后创建。
