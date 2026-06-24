/**
 * 搜索同义词映射表
 *
 * Pagefind 不原生支持同义词，通过 data-pagefind-meta 注入隐藏元数据实现。
 * key = 页面 slug（相对于 docs/），value = 口语化同义词列表。
 *
 * 维护指南：
 * - 只加用户真正会搜但页面正文不包含的词
 * - 页面正文已有的词不需要加（Pagefind 全文索引会自动命中）
 * - 中英文都可以加
 */
export const synonymMap: Record<string, string[]> = {
  'claude-code/preflight': ['准备', '开始之前', '需要什么'],
  'claude-code/quickstart': ['安装', '怎么装', '下载', '装不上', 'install', '上手'],
  'claude-code/cost': ['多少钱', '价格', '收费', '贵不贵', '省钱'],
  'claude-code/agnes-free-vibe-coding': ['免费', '不要钱', '白嫖', '免费模型', 'free'],
  'claude-code/first-page': ['第一个项目', '做个页面', '实战', '练手'],
  'claude-code/project-guide': ['CLAUDE.md', '项目说明', '指令文件', '交接本'],
  'claude-code/config': ['设置', '配置文件', '参数', 'setting'],
  'claude-code/context': ['上下文', '窗口', 'token', '太长了'],
  'claude-code/verify': ['检查', '验证', '测试', '对不对'],
  'claude-code/skills': ['技能', '插件', '扩展', 'skill'],
  'claude-code/memory': ['记忆', '记住', '忘了', '上下文记忆'],
  'claude-code/hooks': ['钩子', '回调', '自动执行', 'hook'],
  'claude-code/mcp': ['工具', '服务器', '外部工具', 'mcp'],
  'claude-code/subagents': ['子任务', '并行', '多个 agent'],
  'claude-code/dotfiles': ['配置同步', '换电脑', '备份'],
  'claude-code/daily-rhythm': ['每天', '日常', '工作流', '习惯'],
  'methodology/basics': ['终端', '命令行', 'PATH', '包管理器', '环境变量'],
  'appendix/git-basics': ['git', '版本控制', '提交', 'commit'],
  'appendix/troubleshooting': ['报错', '出错', '错误', 'bug', '排错', 'error', '问题', '卡住了'],
  glossary: ['术语', '名词', '词汇', '翻译', '什么意思'],
};
