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
  'claude-code/index': ['教程总览', '目录', 'claude code'],
  'claude-code/preflight': ['准备', '开始之前', '需要什么'],
  'claude-code/quickstart': ['安装', '怎么装', '下载', '装不上', 'install', '上手'],
  'claude-code/cost': ['多少钱', '价格', '收费', '贵不贵', '省钱'],
  'claude-code/agnes-free-vibe-coding': ['第三方', '兼容网关', 'Agnes', '认证恢复', 'provider'],
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
  'codex/index': ['openai codex', 'codex 教程', 'codex cli', '教程总览'],
  'codex/quickstart': ['codex 安装', 'codex 登录', 'codex 价格', 'api key', '上手'],
  'codex/first-task': ['第一次任务', '只读任务', 'tell me about this project'],
  'codex/agents-md': ['AGENTS.md', '项目规则', '工作区指令', 'override'],
  'codex/modify-verify-git': ['codex 修改', 'codex review', 'diff', '回退'],
  'codex/capstone': ['codex 项目', '阅读清单', '公开作品', 'github pages'],
  'codex/troubleshooting': ['codex 报错', 'codex 卡住', 'codex command not found', '排错'],
  'codex/official-sources': ['codex 官方文档', 'codex reference', '官方资料'],
  'methodology/index': ['方法论', '通用', '工具无关'],
  'methodology/basics': ['终端', '命令行', 'PATH', '包管理器', '环境变量'],
  'methodology/claude-md-philosophy': ['CLAUDE.md', '项目指令', '哲学'],
  'methodology/memory-system-design': ['记忆设计', '长期记忆', '知识库'],
  'methodology/workflow-design': ['工作流', '流程', '编排'],
  'methodology/learning-management': ['学习管理', '笔记', '复习'],
  'methodology/skill-pack': ['skill pack', '技能包', '下载', '部署'],
  'methodology/prompt-anatomy': ['prompt', '提示词', '怎么写'],
  'methodology/skill-engineering': ['skill 工程', '技能开发', '自动化'],
  'projects/index': ['实战', '项目', '案例'],
  'projects/publish-first-site': ['发布网站', '上线', 'github pages', '公开网址', '部署'],
  'projects/learn-journal/index': ['learn journal', '学习日志', '笔记系统'],
  'projects/learn-journal/quickstart': ['部署', '安装', '上手', 'skill pack'],
  'projects/learn-journal/how-it-works': ['原理', '架构', '怎么运作'],
  'projects/learn-journal/design-philosophy': ['设计', '哲学', '实验'],
  'appendix/index': ['附录', '参考'],
  'appendix/git-basics': ['git', '版本控制', '提交', 'commit'],
  'appendix/troubleshooting': ['报错', '出错', '错误', 'bug', '排错', 'error', '问题', '卡住了'],
  glossary: ['术语', '名词', '词汇', '翻译', '什么意思'],
};
