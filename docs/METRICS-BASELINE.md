# 内容与自然搜索基线

目标是判断哪些学习问题值得继续投入，不用流量反向牺牲教程准确性。本站不加入第三方追踪脚本。

## Search Console 人工停止点

1. 在 Google Search Console 新建 URL-prefix property：`https://estelledc.github.io/zero-to-ai/`，包含协议、路径和末尾 `/`。
2. 选择 HTML meta tag 验证，复制 `content` 值。
3. 在 GitHub Pages 的构建环境设置 `PUBLIC_GOOGLE_SITE_VERIFICATION`，重新部署。
4. 查看线上首页源代码，确认 `<head>` 中存在 `google-site-verification`，再回 Search Console 点 Verify。

代码只在变量存在时输出验证 meta，不加载 Google Analytics、Tag Manager 或其他统计脚本。登录、复制 token 和最终 Verify 必须由站点所有者完成。

官方依据：[URL-prefix property](https://support.google.com/webmasters/answer/10432366)、[验证站点所有权](https://support.google.com/webmasters/answer/9008080)。

## 每两周快照

在完整日期结束后，保存一个 `metrics/snapshots/YYYY-MM-DD.json`：

- GitHub Traffic：views、unique visitors、clones、unique cloners。
- Search Console：clicks、impressions、CTR、indexed pages。
- 主要查询只保留与教程规划有关的脱敏文本，不记录账号、用户或内部项目词。
- 内容质量：新增/更新且通过验证的教程数、过期页面、断链、失败 CI。

不要直接比较 Search Console property 聚合和 page 聚合的 CTR；两者计数口径不同。当天和前一天的数据可能仍是 preliminary。

## backlog 决策

1. 有展现但低 CTR：先检查标题和 description 是否准确表达学习产物。
2. 有查询但无对应页面：进入候选池，先确认能否用一手资料和 90 天复核周期维护。
3. Discussions/Issues 报告卡点：优先复现，再修正文或恢复指导。
4. 新教程必须进入学习路径、搜索同义词或明确参考索引，不能为了页数增长制造孤儿页。

官方依据：[Performance report 数据口径](https://support.google.com/webmasters/answer/17011364)、[低 CTR 页面分析](https://support.google.com/webmasters/answer/17010961)。
