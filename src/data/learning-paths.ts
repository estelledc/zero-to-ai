export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  targetAudience: string;
  timeRange: string;
  outcome: string;
  milestones: string[];
  completionEvidence: string[];
  recoveryGuidance: string[];
  tutorials: string[]; // ordered tutorial slugs
}

export const learningPaths: LearningPath[] = [
  {
    slug: 'ai-coding-zero',
    title: 'AI 编程零基础入门',
    description:
      '从不会写代码到能用 AI 工具独立完成小页面。覆盖成本认知、Claude Code 上手、配置、上下文管理、验证方法论、记忆系统和日常节奏。',
    targetAudience: '编程零基础，想用 AI 写自己的第一个页面',
    timeRange: '6-8 小时',
    outcome: '一个有公开 URL、Git 提交历史和验收截图的个人小站',
    milestones: [
      '本地页面可打开',
      '能解释并验证 AI 改动',
      '推送到 GitHub',
      'GitHub Pages 发布成功',
    ],
    completionEvidence: ['公开 Pages URL', '包含至少两次原子提交的仓库', '桌面与移动端验收截图'],
    recoveryGuidance: [
      '发布失败时回到本地验证',
      '用 git diff/restore 撤销错误改动',
      '按 troubleshooting 保存报错证据',
    ],
    tutorials: [
      'claude-code/preflight',
      'methodology/basics',
      'appendix/git-basics',
      'claude-code/index',
      'claude-code/quickstart',
      'claude-code/first-page',
      'projects/publish-first-site',
      'claude-code/cost',
      'claude-code/config',
      'claude-code/context',
      'claude-code/verify',
      'claude-code/skills',
      'claude-code/memory',
      'claude-code/project-guide',
      'claude-code/daily-rhythm',
      'glossary',
    ],
  },
  {
    slug: 'daily-efficiency',
    title: '日常效率提升',
    description:
      '已经会用基础功能？学习成本控制、记忆系统、日常节奏、知识管理和工作流编排，把 AI 编程效率提升一个量级。',
    targetAudience: '有基础使用经验，想从"偶尔用"升级到"日常高效用"',
    timeRange: '4-6 小时',
    outcome: '一套能重复执行、能留下验证记录的个人 AI 工作节奏',
    milestones: ['建立成本基线', '把知识写入可复用结构', '完成一次 Learn Journal 日循环'],
    completionEvidence: ['5 天用量记录', '一篇带来源的学习笔记', '一次完整日循环记录'],
    recoveryGuidance: [
      '用 /status 区分认证入口',
      '上下文跑偏时先持久化结论再 /clear',
      '流程中断后从最近一次验证记录恢复',
    ],
    tutorials: [
      'claude-code/cost',
      'claude-code/memory',
      'claude-code/daily-rhythm',
      'methodology/memory-system-design',
      'methodology/workflow-design',
      'methodology/learning-management',
      'methodology/skill-pack',
      'projects/learn-journal/index',
      'projects/learn-journal/quickstart',
      'projects/learn-journal/how-it-works',
    ],
  },
  {
    slug: 'advanced-custom',
    title: '高级定制与自动化',
    description:
      '深入 Claude Code 底层：Hook 自动触发、MCP 集成、子 Agent 并行、配置即代码、记忆系统设计、工作流编排和学习管理。',
    targetAudience: '深度用户，想定制自己的 AI 工具链',
    timeRange: '7-10 小时',
    outcome: '一个经过安全测试的 Skill + Hook 自动化组合',
    milestones: ['创建可调用 Skill', '增加确定性 Hook', '在测试仓库验证允许与拒绝路径'],
    completionEvidence: ['Skill 目录与 SKILL.md', 'Hook 输入/输出测试记录', '失败恢复演示'],
    recoveryGuidance: [
      '先在无敏感数据 fixture 验证',
      'Hook 失败时移除注册并保留 stderr',
      'MCP/Agent 权限不明时回到只读最小配置',
    ],
    tutorials: [
      'claude-code/cost',
      'claude-code/config',
      'claude-code/skills',
      'claude-code/verify',
      'claude-code/hooks',
      'claude-code/mcp',
      'claude-code/subagents',
      'claude-code/dotfiles',
      'claude-code/memory',
      'methodology/claude-md-philosophy',
      'methodology/memory-system-design',
      'methodology/workflow-design',
      'methodology/learning-management',
      'methodology/skill-pack',
      'methodology/prompt-anatomy',
      'methodology/skill-engineering',
      'projects/learn-journal/design-philosophy',
    ],
  },
];
