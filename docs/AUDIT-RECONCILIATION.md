# 1.1 审计状态叠加

旧 IA、UX、学习审计是 2026-06-24 的历史快照；本文件只记录 1.1 的状态变化，不把旧失败改成“从未发生”。机器可读映射见 `audit-reconciliation.json`。

| 范围             | 历史问题                     | 1.1 状态                                 | 验证                  |
| ---------------- | ---------------------------- | ---------------------------------------- | --------------------- |
| 安装/认证/成本   | npm 前置、固定月均、认证混用 | 已纠正                                   | 官方矩阵 + link audit |
| 第三方 provider  | Agnes 是主路径且承诺免费     | 已移出主路径，保留风险/恢复页            | path 数据 + cross-ref |
| Hook/Skill/Agent | 事件名、目录和上下文契约错误 | 已纠正；真实账户调用为人工停止点         | fixture + 官方矩阵    |
| 进度             | 访问即完成、reset 越界       | visited/completed 分离，项目命名空间迁移 | unit + Playwright     |
| 发布门禁         | 无浏览器/a11y 回归           | PR 构建工件、Playwright/axe              | `npm run verify`      |
| 依赖             | moderate advisory、弃用提示  | 兼容升级后 0 advisory                    | dependency review     |

未实施项：D-031 多工具正文仍不属于 1.1；Codex 在独立 2.0 分支启动。
