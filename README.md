# Zero to AI

从零开始，用 AI 工具编程。不是百科文档，是经过实战验证的使用策略集合。

**在线阅读** → [estelledc.github.io/zero-to-ai](https://estelledc.github.io/zero-to-ai/)

## 项目定位

面向编程零基础用户的中文 AI 编程工具实战教程站。目前以 Claude Code 为核心覆盖工具，后续扩展 Codex、DeepSeek TUI 等。

每篇教程遵循统一节奏：日常类比 → 技术定义 → 实际操作 → 常见坑 → 自检 → 下一步导航。

## 技术栈

- [Astro](https://astro.build/) v6 + [Starlight](https://starlight.astro.build/) v0.40（文档主题）
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
```

## 目录结构

```
src/
├── content/docs/          # 所有教程内容（Markdown）
│   ├── claude-code/       # Claude Code 教程（16 篇）
│   ├── methodology/       # 工具无关的方法论（5 篇）
│   └── appendix/          # 附录（Git 基础等）
├── components/            # 自定义 Astro 组件
├── data/                  # 学习路径等结构化数据
├── pages/                 # 自定义页面
└── styles/                # 全局样式
scripts/
└── validate-cross-refs.ts # 交叉引用校验（CI 集成）
```

## 内容规范

### Frontmatter 字段

每篇教程的 frontmatter 支持以下扩展字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `difficulty` | `beginner` / `intermediate` / `advanced` | 难度等级 |
| `tags` | `string[]` | 分类标签 |
| `learningPaths` | `string[]` | 所属学习路径 slug |
| `prerequisites` | `string[]` | 前置依赖教程 slug |
| `relatedContent` | `{slug, label}[]` | 相关内容链接 |
| `lastVerified` | `string` | 最后验证日期 |
| `toolVersion` | `string` | 适用工具版本 |

### 交叉引用

教程之间通过 `prerequisites`、`relatedContent`、`learningPaths` 形成有向图。`validate-cross-refs.ts` 在 CI 中自动校验所有引用的合法性，断链会阻止部署。

### 写作风格

- 先日常类比再技术定义
- 结论先行
- 中文正文 + 英文命令/代码保留原文
- 成本预期透明
- 每篇独立可读，但有明确的前后导航

## 贡献

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/your-feature`
3. 本地运行 `npm run validate-refs` 确认引用无误
4. 本地运行 `npm run build` 确认构建通过
5. 提交 PR，描述你的改动

## 许可

ISC
