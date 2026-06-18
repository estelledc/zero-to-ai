export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  targetAudience: string;
  timeRange: string;
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
    tutorials: [
      'appendix/git-basics',
      'claude-code/preflight',
      'methodology/basics',
      'claude-code/index',
      'claude-code/quickstart',
      'claude-code/cost',
      'claude-code/config',
      'claude-code/context',
      'claude-code/verify',
      'claude-code/skills',
      'claude-code/memory',
      'claude-code/daily-rhythm',
      'claude-code/agnes-free-vibe-coding',
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
      'projects/learn-journal/design-philosophy',
    ],
  },
];
