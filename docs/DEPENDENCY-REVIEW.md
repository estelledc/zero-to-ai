# 1.1 依赖兼容与风险复核

复核日期：2026-07-10。

## 结果

- Astro 从 6 升到 7，Starlight 升到 0.41；`astro check` 0 error/warning/hint，生产构建与 Pagefind 完成。
- 已移除旧 markdown 配置弃用提示。
- `npm audit` 当前 0 advisory，没有使用 `npm audit fix --force`。
- Playwright 在桌面 Chromium 和 Pixel 7 profile 验证 base path、进度、搜索、404、主题、feed 与无障碍。

## Reachability 判断

升级前 advisory 位于构建/Markdown 工具链的传递依赖，未证明能从静态产物运行时触达。尽管如此，本次通过兼容升级和 lockfile 重建消除，而不是把开发依赖告警描述成线上漏洞。

## 后续更新规则

Dependabot 每周只提交 npm 和 GitHub Actions 更新。大版本升级单独 PR，必须运行 `npm run verify`；网络或 advisory 服务故障只在 scheduled maintenance 生成报告，不阻断普通内容 PR。
