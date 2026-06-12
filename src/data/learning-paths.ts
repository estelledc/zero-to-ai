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
      '从不会写代码到能用 AI 工具独立完成一个小页面。覆盖终端基础、Claude Code 上手、第一行 prompt、本地预览、部署上线。',
    targetAudience: '编程零基础，想用 AI 写自己的第一个页面',
    timeRange: '4-6 小时',
    tutorials: [
      'methodology/basics',
      'claude-code/index',
      'claude-code/quickstart',
      'claude-code/config',
      'claude-code/skills',
    ],
  },
  {
    slug: 'daily-efficiency',
    title: '日常效率提升',
    description:
      '已经会用基础功能？学习用记忆系统、Hook、Skill 协作把 AI 编程效率提升一个量级。',
    targetAudience: '有基础使用经验，想从"偶尔用"升级到"日常高效用"',
    timeRange: '3-5 小时',
    tutorials: [
      'claude-code/memory',
      'methodology/memory-system-design',
      'methodology/workflow-design',
    ],
  },
  {
    slug: 'advanced-custom',
    title: '高级定制与自动化',
    description:
      '深入 Claude Code 底层：写自定义 Skill、配置 Hook 系统、搭建多工具协同工作流。',
    targetAudience: '深度用户，想定制自己的 AI 工具链',
    timeRange: '5-8 小时',
    tutorials: [
      'claude-code/config',
      'claude-code/memory',
      'methodology/claude-md-philosophy',
      'methodology/workflow-design',
    ],
  },
];
