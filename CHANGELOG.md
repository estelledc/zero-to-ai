# Changelog

All notable changes to this project will be documented in this file.

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

### Known limitations (1.1+)

- 多工具教程（Codex / DeepSeek 等）仍在筹备
- Learn Journal skill 包可迁移性尚未验证
- sidebar 无法按学习路径动态过滤（Starlight 框架限制）
- 无 PR 预览部署、无 e2e 测试

[1.0.0]: https://github.com/estelledc/zero-to-ai/releases/tag/v1.0.0
