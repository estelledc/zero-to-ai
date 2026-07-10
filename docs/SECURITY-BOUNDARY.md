# GitHub Pages 安全边界

Zero to AI 是无登录、无表单提交、无服务端状态的静态教程站。安全目标是减少误导和供应链风险，不把 HTML `<meta http-equiv>` 误称为完整响应头保护。

## 当前边界

- GitHub Pages 决定 HTTP 响应头；仓库中的 HTML 不能可靠设置 `X-Frame-Options`、`X-Content-Type-Options` 等响应头。
- CSP 的 `frame-ancestors` 不能通过 meta CSP 生效；旧配置已移除，避免形成“已防 clickjacking”的错误信号。
- 若未来切换到支持自定义响应头的 CDN，应在真实 HTTP 响应中设置 CSP、`X-Content-Type-Options`、Referrer-Policy 等，并用浏览器网络面板或 `curl -I` 验证。
- 本站不保存账号、API key 或学习进度到服务端；学习进度只在浏览器 localStorage 中。
- Search Console 只使用所有权验证 meta，不注入统计脚本。

## 依赖策略

- 普通 PR 跑 `npm audit` 相关风险由锁文件和 CI 评估；不使用 `npm audit fix --force`。
- 大版本升级必须把框架与主题作为兼容组合，并通过 check、lint、build 和 Playwright smoke。
- scheduled workflow 的网络失败只产生维护报告，不阻断普通内容 PR。
