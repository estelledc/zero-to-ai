# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-07-10

### Added

- 新增 `/codex/` 独立零基础路径：环境与成本、第一次只读任务、`AGENTS.md`、修改/验证/Git、公开作品 capstone、故障排查和官方资料索引。
- 新增 `codex-zero` 学习路径，交付物包含公开 Pages URL、Git 历史、验收截图和项目规则。
- 新增 `npm run test:codex-docs`，静态校验完整路径和官方来源；本机安装 Codex 时同时验证 0.144.x CLI 的 `--version`、`--help`、登录与非交互命令契约。
- Pagefind 同义词和 Playwright smoke 覆盖 Codex 首页、路径上下文与安装搜索。

### Changed

- 首页与侧边栏从 Claude Code 单工具站升级为 Claude Code + Codex 双工具站；现有 `/claude-code/` URL、三条旧路径和进度 key 保持兼容。
- 版本更新为 `2.0.0`，Claude Code 与 Codex 两条独立路线进入正式发布状态。

### Verification

- OpenAI 官方资料复核于 2026-07-10；本地命令契约使用 `codex-cli 0.144.0-alpha.4`，不调用模型、不消耗账户额度。
- 自动门禁、官方链接检查和依赖审计已通过；正式标签采用合并后立即创建的发布策略。
- 真实 Codex 登录、方案额度、组织权限、合并后 GitHub Pages、Search Console 和跨平台可迁移性仍是延期人工证据，不在本版本中标记为已验证。

## [1.1.0] - 2026-07-10

### Corrected

- 按 Anthropic 官方资料修正原生安装、订阅/API 认证优先级、成本口径、Hook 事件与 JSON/退出码协议、Skill 目录结构和 checkpoint `/rewind` 行为。
- 移除 GitHub Pages 上无法通过 HTML meta 生效的伪响应头，新增静态站安全边界说明。
- 脱敏公开教程中的本机路径和会话标识示例；时效性页面绑定官方资料验证矩阵。

### Added

- `npm run audit:content-freshness`：具体 `toolVersion`、ISO `lastVerified`、未来日期、90 天维护报告和一手来源矩阵。
- `npm run test:e2e` 与 `npm run verify`：覆盖桌面/移动端首页、路径、显式进度、Pagefind、404、主题、base path、RSS、sitemap、axe、键盘、触控和 reduced-motion。
- Claude settings、Hook、只读子 Agent fixture 与 unit test；正文引用校验扩展到 Markdown 路由和锚点。
- PR 构建产物上传与每周维护报告；网络故障不阻断普通内容 PR。
- 第二个零成本 capstone：从本地个人页面到 Git、GitHub Pages、线上验证和故障恢复。
- Search Console URL-prefix meta 验证支持与双周脱敏指标快照模板；不加入第三方追踪脚本。

### Changed

- 学习进度从“访问即完成”改为“访问/显式完成”双状态；迁移到 `zero-to-ai:progress:v1:` 项目命名空间，旧 `path:*` 合法记录迁移为 visited，重置不再删除其他应用的 key。
- 三条学习路径明确最终产物、里程碑、完成证据和失败恢复。
- 升级到 Astro 7.0.7、Starlight 0.41.3 和 starlight-base-path 0.2.0；弃用提示消失，`npm audit` 为 0 advisory。

### Migration

- 本地贡献者重新运行 `npm install`，并执行 `npx playwright install chromium`。
- Search Console 所有者在构建环境设置 `PUBLIC_GOOGLE_SITE_VERIFICATION` 后人工完成 Verify。
- 旧学习进度会在首次读取时迁移到项目命名空间，但不自动计为“完成”；学习者需在教程页显式确认。

### Verification boundaries

- 自动门禁、官方链接检查和依赖审计已通过；正式标签采用合并后立即创建的发布策略。
- 真实 Claude 账户权限、合并后 GitHub Pages、Search Console 和跨平台可迁移性仍是延期人工证据，不在本版本中标记为已验证。

## [1.0.0] - 2026-07-05

### 站点范围

Zero to AI 1.0.0 是一个面向编程零基础用户的中文 Claude Code 实战教程站，包含：

- **16 篇** Claude Code 教程（含 first-page、project-guide 两个 capstone）
- **8 篇** 工具无关方法论
- **4 篇** Learn Journal 方法论实验报告
- **2 篇** 附录（Git 速成、常见问题排查）
- **3 条** 结构化学习路径（零基础 / 日常效率 / 高级定制）

### Added

- 学习路径页 `/paths/` 加入 sidebar 入口
- 多路径共享教程的 PathProgress 上下文切换（`?path=` + localStorage）
- 教程页展示 `lastVerified` / `toolVersion` 信任信号
- RSS autodiscovery（`<link rel="alternate">`）
- 404 页增加学习路径与排错指南链接
- 搜索同义词覆盖 methodology / projects 板块
- paths 页「重置全部学习进度」入口
- `CHANGELOG.md`

### Fixed

- 移除 Footer 中 Starlight Pagination，消除与 PathProgress 的双导航冲突
- RSS channel 链接补全 `/zero-to-ai/` base path
- slug 规范化匹配（Astro 6 `section/index` ↔ `section`）
- Pagefind 暗色样式跟随 Starlight `data-theme`
- DifficultyBadge / 标题色改用语义 token，修复亮色主题对比度

### Changed

- `claude-code/index` 更新为 16 篇，教程地图补入 first-page / project-guide
- `projects/index` 措辞对齐 Learn Journal 实验报告定位
- README 移除已废弃的 `learningPaths` frontmatter 字段说明

### Known limitations at 1.0.0

- 多工具教程（Codex / DeepSeek 等）仍在筹备
- Learn Journal skill 包可迁移性尚未验证
- sidebar 无法按学习路径动态过滤（Starlight 框架限制）
- 无 PR 预览部署、无 e2e 测试

[2.0.0]: https://github.com/estelledc/zero-to-ai/releases/tag/v2.0.0
[1.1.0]: https://github.com/estelledc/zero-to-ai/releases/tag/v1.1.0
[1.0.0]: https://github.com/estelledc/zero-to-ai/releases/tag/v1.0.0
