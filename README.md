# Zero to AI

从零开始，用 AI 工具编程。不是百科文档，而是一套把 Claude Code 与 Codex
从第一条命令带到公开交付的中文学习系统。

**在线阅读** → [estelledc.github.io/zero-to-ai](https://estelledc.github.io/zero-to-ai/)

## 项目定位

面向编程零基础用户的中文 AI 编程工具实战教程站。Claude Code 与 Codex 各有独立可完成路径，公共验证、Git 与发布方法放在共享板块。

每篇教程遵循统一节奏：日常类比 → 技术定义 → 实际操作 → 常见坑 → 自检 → 下一步导航。

2.0 之后的阶段规划、新工具准入门槛与项目不变量见 [docs/ROADMAP.md](docs/ROADMAP.md)。

## Showcase 摘要

- **状态**：Maintained · v2.0.0
- **个人职责**：产品决策、内容架构、验证标准与发布维护
- **协作方式**：Jason 负责判断与验收；AI 协助资料整理、内容初稿和前端实现
- **系统规模**：45 个内容页、4 条学习路径、2 套工具闭环
- **验证证据**：交叉引用、内容 freshness、fixture、unit、Playwright/axe 与 GitHub Pages 发布检查
- **公开限制**：部分真实账户和跨平台步骤仍待人工复核；运营指标尚未形成连续样本；Learn Journal 当前是 N=1 验证

## 技术栈

- [Astro](https://astro.build/) v7 + [Starlight](https://starlight.astro.build/) v0.41（文档主题）
- TypeScript 严格模式
- GitHub Pages 部署（GitHub Actions CI/CD）
- Pagefind 全文搜索（构建时自动生成索引）

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/estelledc/zero-to-ai.git
cd zero-to-ai

# 安装依赖
npm install

# 启动开发服务器（默认 localhost:4321）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 校验交叉引用完整性
npm run validate-refs

# 内容时效性与官方来源矩阵
npm run audit:content-freshness

# Claude 配置 fixture、Codex CLI 文档契约与存储/slug unit test
npm run test:fixtures
npm run test:codex-docs
npm run test:unit

# Playwright 桌面/移动端、axe 与交互 smoke
npm run test:e2e

# 提交前统一门禁
npm run verify
```

## 目录结构

```
src/
├── content/docs/          # 所有教程内容（Markdown）
│   ├── claude-code/       # Claude Code 教程（16 篇）
│   ├── codex/             # Codex CLI 完整零基础路径（8 篇）
│   ├── methodology/       # 工具无关的方法论（8 篇）
│   ├── projects/          # 实战项目（Learn Journal 等）
│   └── appendix/          # 附录（Git 基础、常见问题排查等）
├── components/            # 自定义 Astro 组件
├── data/                  # 学习路径等结构化数据
├── pages/                 # 自定义页面
└── styles/                # 全局样式
scripts/                   # 交叉引用、freshness、官方链接维护脚本
tests/e2e/                 # Playwright 发布与无障碍 smoke
tests/unit/                # 进度存储与 slug 合同测试
tests/fixtures/            # Claude settings/Hook/Agent 安全 fixture
metrics/                   # 双周脱敏指标快照模板
```

## 内容规范

### Frontmatter 字段

每篇教程的 frontmatter 支持以下扩展字段：

| 字段             | 类型                                     | 说明              |
| ---------------- | ---------------------------------------- | ----------------- |
| `difficulty`     | `beginner` / `intermediate` / `advanced` | 难度等级          |
| `tags`           | `string[]`                               | 分类标签          |
| `prerequisites`  | `string[]`                               | 前置依赖教程 slug |
| `relatedContent` | `{slug, label}[]`                        | 相关内容链接      |
| `lastVerified`   | `string`                                 | 最后验证日期      |
| `toolVersion`    | `string`                                 | 适用工具版本      |

### 交叉引用

教程之间通过 `prerequisites`、`relatedContent` 以及 `src/data/learning-paths.ts` 中的路径定义形成有向图。`validate-cross-refs.ts` 在 CI 中自动校验所有引用的合法性，断链会阻止部署。

### 写作风格

- 先日常类比再技术定义
- 结论先行
- 中文正文 + 英文命令/代码保留原文
- 成本预期透明
- 每篇独立可读，但有明确的前后导航

## 贡献

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/your-feature`
3. 本地运行 `npm run verify` 完成静态检查、引用、freshness、构建和 smoke
4. 时效性教程同步更新 `docs/OFFICIAL-SOURCE-MATRIX.json`，只引用一手资料
5. 提交 PR，描述你的改动

PR 会上传 `dist` 构建产物供审查，但不会创建临时公开预览；只有 `main` push 才部署 GitHub Pages。安全边界见 `docs/SECURITY-BOUNDARY.md`，Search Console 与双周指标流程见 `docs/METRICS-BASELINE.md`。

## 许可

ISC
