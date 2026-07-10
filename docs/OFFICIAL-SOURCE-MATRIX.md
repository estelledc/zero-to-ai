# 官方资料验证矩阵

本文件说明验证口径；机器可读记录见 `OFFICIAL-SOURCE-MATRIX.json`。

- 只记录页面、适用版本、操作系统范围、官方来源、复核日期和结果，不复制官方正文。
- `PASS` 表示该页所有时效性操作已按对应版本复核；`PARTIAL` 表示核心命令有依据，但仍含经验值、第三方能力或人工账户步骤；`FAIL` 会阻断 `npm run audit:content-freshness`。
- 教程 frontmatter 的 `toolVersion`、`lastVerified` 必须和矩阵一致。
- 超过 90 天的页面进入维护警告；警告目前不阻断普通内容 PR。

| 页面范围           | 操作系统                | 主要一手来源                                  | 当前结果 |
| ------------------ | ----------------------- | --------------------------------------------- | -------- |
| 安装、认证、上手   | macOS / Windows / Linux | Claude Code installation、authentication      | PASS     |
| Settings / 权限    | macOS / Windows / Linux | Claude Code settings、permissions             | PASS     |
| Hook               | macOS / Windows / Linux | Claude Code hooks reference、hooks guide      | PASS     |
| Skill              | macOS / Windows / Linux | Claude Code skills                            | PASS     |
| Subagent           | macOS / Windows / Linux | Claude Code sub-agents                        | PASS     |
| 上下文与回退       | macOS / Windows / Linux | Claude Code checkpointing、interactive mode   | PASS     |
| 成本               | macOS / Windows / Linux | Anthropic pricing、Claude Code costs          | PASS     |
| 第三方兼容实验边界 | macOS / Windows / Linux | Claude Code authentication、provider 当前页面 | PARTIAL  |

最后维护：2026-07-10。
