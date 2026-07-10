# 官方资料验证矩阵

本文件说明验证口径；机器可读记录见 `OFFICIAL-SOURCE-MATRIX.json`。

- 只记录页面、适用版本、操作系统范围、官方来源、复核日期和结果，不复制官方正文。
- `PASS` 表示该页所有时效性操作已按对应版本复核；`PARTIAL` 表示核心命令有依据，但仍含经验值、第三方能力或人工账户步骤；`FAIL` 会阻断 `npm run audit:content-freshness`。
- 教程 frontmatter 的 `toolVersion`、`lastVerified` 必须和矩阵一致。
- 超过 90 天的页面进入维护警告；警告目前不阻断普通内容 PR。

| 页面范围               | 操作系统                | 主要一手来源                                  | 当前结果 |
| ---------------------- | ----------------------- | --------------------------------------------- | -------- |
| 安装、认证、上手       | macOS / Windows / Linux | Claude Code installation、authentication      | PASS     |
| Settings / 权限        | macOS / Windows / Linux | Claude Code settings、permissions             | PASS     |
| Hook                   | macOS / Windows / Linux | Claude Code hooks reference、hooks guide      | PASS     |
| Skill                  | macOS / Windows / Linux | Claude Code skills                            | PASS     |
| Subagent               | macOS / Windows / Linux | Claude Code sub-agents                        | PASS     |
| 上下文与回退           | macOS / Windows / Linux | Claude Code checkpointing、interactive mode   | PASS     |
| 成本                   | macOS / Windows / Linux | Anthropic pricing、Claude Code costs          | PASS     |
| Claude Code 分区总览   | macOS / Windows / Linux | Claude Code overview                          | PASS     |
| 第三方兼容实验边界     | macOS / Windows / Linux | Claude Code authentication、provider 当前页面 | PARTIAL  |
| Codex 安装、认证与成本 | macOS / Windows / Linux | Codex CLI、Authentication、Pricing、WSL       | PARTIAL  |
| Codex 项目规则与权限   | macOS / Windows / Linux | AGENTS.md、Agent approvals & security         | PASS     |
| Codex 修改、验证与 Git | macOS / Windows / Linux | Codex CLI、Agent approvals & security         | PASS     |
| Codex capstone 与排错  | macOS / Windows / Linux | Codex CLI、Troubleshooting、GitHub Pages      | PARTIAL  |

## PARTIAL 收敛路径

### 2026-07-10 定级（历史）

首轮推进将当时 12 页 PARTIAL 分为 A（官方复核候选）/ B（需真实账户）/ C（经验值长期 PARTIAL）。本节保留该分类作为执行依据。

### 2026-07-10 执行结果

对照官方一手资料完成 A/C 类收敛后，`OFFICIAL-SOURCE-MATRIX.json` 现为 **11 页 PARTIAL**（较 12 页基线下降 1）：

| 原分类 | 页面                                                     | 结果                   | 依据                                                                                                  |
| ------ | -------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------- |
| A      | `claude-code/index.md`                                   | **升 PASS**            | 总览与教程地图无无法一手核验的时效性操作；产品定义与官方 overview 一致                                |
| A      | `claude-code/memory.md`                                  | **改归 C，仍 PARTIAL** | 已按官方 memory 文档修正 `/memory` 与 auto memory 口径；§1-§5 三层 `MEMORY-*.md` 自建索引仍为经验方案 |
| A      | `claude-code/first-page.md`                              | **改归 C，仍 PARTIAL** | 登录/启动与官方 quickstart 一致；个人介绍页 capstone 教学流程为经验值                                 |
| B      | `codex/quickstart.md` 等 4 页                            | 仍 PARTIAL             | 等待所有者真实账户证据，本轮未改                                                                      |
| C      | agnes / daily-rhythm / dotfiles / project-guide / verify | 仍 PARTIAL             | 复核口径仍准确；`lastVerified` 刷新为 2026-07-10                                                      |

**B 类 — 需真实账户或线上证据**（所有者人工停止点，对应 `RELEASE-CHECKLIST.md` DEFERRED 项）：

| 页面                       | 缺失证据                               |
| -------------------------- | -------------------------------------- |
| `codex/quickstart.md`      | 真实登录、方案额度、组织权限的脱敏记录 |
| `codex/first-task.md`      | 真实账户会话中的只读任务执行记录       |
| `codex/capstone.md`        | 真实账户完成公开发布的端到端记录       |
| `codex/troubleshooting.md` | 真实故障场景（登录、额度、权限）复现   |

**C 类 — 含经验值或第三方能力，预期长期 PARTIAL**（书面不可收敛原因已固化；每个复核周期确认口径）：

| 页面                                    | 不可收敛原因                                                             |
| --------------------------------------- | ------------------------------------------------------------------------ |
| `claude-code/agnes-free-vibe-coding.md` | 依赖第三方 provider 现状，非 Anthropic 官方承诺                          |
| `claude-code/daily-rhythm.md`           | 日常节奏为实践经验总结，官方仅覆盖 interactive-mode 部分                 |
| `claude-code/dotfiles.md`               | 配置同步策略为实践模式，官方仅覆盖 settings/memory 机制                  |
| `claude-code/project-guide.md`          | CLAUDE.md 写作方法为经验值，官方仅定义 memory / CLAUDE.md 机制           |
| `claude-code/verify.md`                 | 验证方法论为经验总结，官方仅覆盖 common-workflows / best-practices 部分  |
| `claude-code/memory.md`                 | 内置 CLAUDE.md + auto memory 可核；三层 `MEMORY-*.md` 自建索引为经验方案 |
| `claude-code/first-page.md`             | 启动/登录可核；个人介绍页 capstone 教学流程与验收清单为经验值            |

最后维护：2026-07-10。
