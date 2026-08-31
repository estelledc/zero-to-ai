export type PracticeCategory = {
  slug: string;
  title: string;
  description: string;
  outcome: string;
  startSlug: string;
  articles: string[];
};

export type PracticePath = {
  slug: string;
  title: string;
  description: string;
  outcome: string;
  articles: string[];
};

export type PracticeSidebarGroup = {
  label: string;
  collapsed: boolean;
  items: Array<{ slug: string }>;
};

export const categories: PracticeCategory[] = [
  {
    slug: 'operate',
    title: '让 Agent 可运行',
    description: '把上下文、工具、运行环境和接班机制装进一套能持续工作的工程框架。',
    outcome: '得到一份可启动、可恢复、可验证的 Agent 运行契约。',
    startSlug: 'context-engineering-agents',
    articles: [
      'context-engineering-agents',
      'dynamic-context-discovery',
      'effective-agent-tools',
      'harness-engineering-codex',
      'codex-agent-loop',
      'managed-agents-runtime',
      'long-running-app-harness',
      'cloud-agent-environment',
      'cursor-semantic-search',
      'plugmem-agent-memory',
      'fara-1-5-computer-use',
    ],
  },
  {
    slug: 'evaluate',
    title: '测出真相',
    description: '把能力、环境噪声、评测泄漏和验证器误差拆开，避免被一个分数误导。',
    outcome: '能设计有判定器、有失败样本、能解释噪声来源的评测。',
    startSlug: 'agent-evals',
    articles: [
      'agent-evals',
      'arc-agi-harness-settings',
      'coding-eval-signal-noise',
      'agentic-eval-infrastructure-noise',
      'reward-hacking-coding-benchmarks',
      'browsecomp-browsing-agents',
      'browsecomp-eval-awareness',
      'ai-resistant-evaluations',
      'double-blind-ai-evals',
      'gaia2-agent-evaluation',
      'agentrx-debugging',
      'cot-monitorability',
      'argos-multimodal-verifier',
      'llm-overthinking-structure',
    ],
  },
  {
    slug: 'protect',
    title: '守住边界',
    description: '从权限、沙箱、事件响应和持续监控四个方向限制 Agent 的影响面。',
    outcome: '能为高权限 Agent 写出明确的隔离、告警和停止条件。',
    startSlug: 'claude-containment',
    articles: [
      'claude-containment',
      'windows-agent-sandbox',
      'hugging-face-incident',
      'gpt-red-self-improving-red-team',
      'monitor-coding-agents',
      'ai-control-roadmap',
    ],
  },
  {
    slug: 'develop',
    title: '开发与交付',
    description: '把规划、编码、调试、验证、审查、迁移、自动化和发布接成一条可复查的软件工程链路。',
    outcome: '能为同一个代码变更留下从计划到发布判断的完整证据。',
    startSlug: 'anthropic-ai-native-sdlc',
    articles: [
      'anthropic-ai-native-sdlc',
      'cursor-agent-best-practices',
      'cursor-debug-mode',
      'openai-iterative-repair',
      'github-diff-first-code-review',
      'aws-reproducible-migration',
      'github-agentic-workflows',
      'aws-release-readiness',
    ],
  },
  {
    slug: 'improve',
    title: '让能力成长',
    description: '比较扩展自治、多 Agent 协作、蒸馏和在线训练怎样带来真实增益。',
    outcome: '能用固定任务和成本口径判断一次能力升级是否值得。',
    startSlug: 'agent-distillation-flywheel',
    articles: [
      'agent-distillation-flywheel',
      'cursor-agent-harness',
      'cursor-codex-model-harness',
      'scaling-autonomous-coding',
      'parallel-claude-c-compiler',
      'multi-agent-research-system',
      'composer-2-training',
      'real-time-rl-composer',
      'co-scientist',
    ],
  },
  {
    slug: 'inference',
    title: '选型与加速',
    description: '沿着模型选择、请求调度和推测解码，衡量质量、成本与延迟的交换。',
    outcome: '能画出推理链路，并用同一任务选择合适的模型与加速策略。',
    startSlug: 'open-models-summer-2026',
    articles: [
      'open-models-summer-2026',
      'gpt-5-6-efficiency',
      'nvidia-dynamo-inference',
      'dflash-speculative-decoding',
      'speculative-cascades',
    ],
  },
  {
    slug: 'apply',
    title: '放进具体场景',
    description: '把 Agent 和模型放进数据、科学、协商、机器人与生命科学任务中。',
    outcome: '能区分通用机制、领域约束与必须由专家验收的结果。',
    startSlug: 'scientific-computing-agentic-ai',
    articles: [
      'scientific-computing-agentic-ai',
      'in-house-data-agent',
      'socialrl-negotiators',
      'gemini-robotics-2',
      'v-jepa-2-world-model',
      'alphagenome',
    ],
  },
];

export const paths: PracticePath[] = [
  {
    slug: 'reliable-agent',
    title: '搭出可靠 Agent',
    description: '先控制上下文，再补工具和 harness，最后用评测检查真实效果。',
    outcome: '完成一条从上下文设计到可判定验收的最短可靠性链路。',
    articles: [
      'context-engineering-agents',
      'dynamic-context-discovery',
      'effective-agent-tools',
      'harness-engineering-codex',
      'agent-evals',
    ],
  },
  {
    slug: 'coding-repo',
    title: '进入真实代码仓',
    description: '从执行循环进入云端与长任务环境，再补检索和故障诊断。',
    outcome: '能在真实仓库中定位、执行、接班并解释一次失败。',
    articles: [
      'codex-agent-loop',
      'cloud-agent-environment',
      'long-running-app-harness',
      'cursor-semantic-search',
      'agentrx-debugging',
    ],
  },
  {
    slug: 'software-delivery',
    title: '完成一次软件交付',
    description: '从需求与计划进入编码、调试、验证和审查，最后把自动化与发布证据接上。',
    outcome: '能交付一个经过原路径调试、确定性检查、差异审查和发布就绪判断的代码变更。',
    articles: [
      'anthropic-ai-native-sdlc',
      'cursor-agent-best-practices',
      'cursor-debug-mode',
      'openai-iterative-repair',
      'github-diff-first-code-review',
      'github-agentic-workflows',
      'aws-release-readiness',
    ],
  },
  {
    slug: 'eval-safety',
    title: '评测与安全闭环',
    description: '先建立评测信号，再识别投机行为，最后把隔离和监控接上。',
    outcome: '得到一套既测结果、也约束执行过程的 Agent 验收方案。',
    articles: [
      'agent-evals',
      'coding-eval-signal-noise',
      'reward-hacking-coding-benchmarks',
      'claude-containment',
      'monitor-coding-agents',
      'ai-control-roadmap',
    ],
  },
  {
    slug: 'inference-cost',
    title: '推理成本与速度',
    description: '从模型选型出发，逐步进入推测解码、级联策略和服务调度。',
    outcome: '能用质量、延迟和成本三轴比较推理方案。',
    articles: [
      'open-models-summer-2026',
      'gpt-5-6-efficiency',
      'dflash-speculative-decoding',
      'speculative-cascades',
      'nvidia-dynamo-inference',
    ],
  },
  {
    slug: 'multi-agent',
    title: '多 Agent 协作',
    description: '从可交叉验证的并行任务开始，再讨论扩展、harness 和能力回流。',
    outcome: '能判断何时并行有效，以及如何把高质量轨迹沉淀回单体能力。',
    articles: [
      'parallel-claude-c-compiler',
      'multi-agent-research-system',
      'scaling-autonomous-coding',
      'cursor-agent-harness',
      'agent-distillation-flywheel',
    ],
  },
];

export const articleSlugs = categories.flatMap((category) => category.articles);

export const sidebarGroups: PracticeSidebarGroup[] = categories.map((category) => ({
  label: category.title,
  collapsed: true,
  items: category.articles.map((slug) => ({ slug: `ai-tech-practice/${slug}` })),
}));
