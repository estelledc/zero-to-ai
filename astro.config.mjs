import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { starlightBasePath } from 'starlight-base-path';

export default defineConfig({
  site: 'https://estelledc.github.io',
  base: '/zero-to-ai/',
  trailingSlash: 'always',

  integrations: [
    starlight({
      plugins: [starlightBasePath()],
      title: 'Zero to AI',
      description: '面向零基础学习者的中文 AI 编程学习系统：从第一条命令到公开交付。',
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },

      sidebar: [
        {
          label: '学习路径',
          link: '/paths/',
        },
        {
          label: 'Claude Code',
          items: [
            { slug: 'claude-code' },
            { slug: 'claude-code/preflight' },
            { slug: 'claude-code/quickstart' },
            { slug: 'claude-code/cost' },
            { slug: 'claude-code/agnes-free-vibe-coding' },
            { slug: 'claude-code/first-page' },
            { slug: 'claude-code/config' },
            { slug: 'claude-code/context' },
            { slug: 'claude-code/verify' },
            { slug: 'claude-code/skills' },
            { slug: 'claude-code/memory' },
            { slug: 'claude-code/project-guide' },
            { slug: 'claude-code/hooks' },
            { slug: 'claude-code/daily-rhythm' },
            { slug: 'claude-code/mcp' },
            { slug: 'claude-code/subagents' },
            { slug: 'claude-code/dotfiles' },
          ],
        },
        {
          label: 'Codex',
          items: [
            { slug: 'codex' },
            { slug: 'codex/quickstart' },
            { slug: 'codex/first-task' },
            { slug: 'codex/agents-md' },
            { slug: 'codex/modify-verify-git' },
            { slug: 'codex/capstone' },
            { slug: 'codex/troubleshooting' },
            { slug: 'codex/official-sources' },
          ],
        },
        {
          label: '方法论',
          items: [
            { slug: 'methodology' },
            { slug: 'methodology/basics' },
            { slug: 'methodology/claude-md-philosophy' },
            { slug: 'methodology/memory-system-design' },
            { slug: 'methodology/workflow-design' },
            { slug: 'methodology/learning-management' },
            { slug: 'methodology/skill-pack' },
            { slug: 'methodology/prompt-anatomy' },
            { slug: 'methodology/skill-engineering' },
          ],
        },
        {
          label: 'AI 技术实践',
          items: [
            { slug: 'ai-tech-practice' },
            {
              label: 'Agent、Context 与 Harness',
              collapsed: true,
              items: [
                { slug: 'ai-tech-practice/harness-engineering-codex' },
                { slug: 'ai-tech-practice/context-engineering-agents' },
                { slug: 'ai-tech-practice/cursor-agent-harness' },
                { slug: 'ai-tech-practice/long-running-app-harness' },
                { slug: 'ai-tech-practice/managed-agents-runtime' },
                { slug: 'ai-tech-practice/dynamic-context-discovery' },
                { slug: 'ai-tech-practice/scaling-autonomous-coding' },
                { slug: 'ai-tech-practice/cloud-agent-environment' },
                { slug: 'ai-tech-practice/windows-agent-sandbox' },
                { slug: 'ai-tech-practice/in-house-data-agent' },
                { slug: 'ai-tech-practice/codex-agent-loop' },
                { slug: 'ai-tech-practice/parallel-claude-c-compiler' },
                { slug: 'ai-tech-practice/multi-agent-research-system' },
                { slug: 'ai-tech-practice/effective-agent-tools' },
                { slug: 'ai-tech-practice/cursor-codex-model-harness' },
                { slug: 'ai-tech-practice/cursor-semantic-search' },
              ],
            },
            {
              label: 'Evals、可靠性与安全',
              collapsed: true,
              items: [
                { slug: 'ai-tech-practice/arc-agi-harness-settings' },
                { slug: 'ai-tech-practice/agent-evals' },
                { slug: 'ai-tech-practice/coding-eval-signal-noise' },
                { slug: 'ai-tech-practice/claude-containment' },
                { slug: 'ai-tech-practice/agentic-eval-infrastructure-noise' },
                { slug: 'ai-tech-practice/reward-hacking-coding-benchmarks' },
                { slug: 'ai-tech-practice/gpt-red-self-improving-red-team' },
                { slug: 'ai-tech-practice/agentrx-debugging' },
                { slug: 'ai-tech-practice/hugging-face-incident' },
                { slug: 'ai-tech-practice/monitor-coding-agents' },
                { slug: 'ai-tech-practice/cot-monitorability' },
                { slug: 'ai-tech-practice/browsecomp-browsing-agents' },
                { slug: 'ai-tech-practice/browsecomp-eval-awareness' },
                { slug: 'ai-tech-practice/ai-resistant-evaluations' },
                { slug: 'ai-tech-practice/double-blind-ai-evals' },
                { slug: 'ai-tech-practice/ai-control-roadmap' },
                { slug: 'ai-tech-practice/gaia2-agent-evaluation' },
              ],
            },
            {
              label: '模型、推理与基础设施',
              collapsed: true,
              items: [
                { slug: 'ai-tech-practice/gpt-5-6-efficiency' },
                { slug: 'ai-tech-practice/llm-overthinking-structure' },
                { slug: 'ai-tech-practice/open-models-summer-2026' },
                { slug: 'ai-tech-practice/fara-1-5-computer-use' },
                { slug: 'ai-tech-practice/socialrl-negotiators' },
                { slug: 'ai-tech-practice/nvidia-dynamo-inference' },
                { slug: 'ai-tech-practice/dflash-speculative-decoding' },
                { slug: 'ai-tech-practice/composer-2-training' },
                { slug: 'ai-tech-practice/real-time-rl-composer' },
                { slug: 'ai-tech-practice/agent-distillation-flywheel' },
                { slug: 'ai-tech-practice/speculative-cascades' },
              ],
            },
            {
              label: '多模态、机器人与 AI for Science',
              collapsed: true,
              items: [
                { slug: 'ai-tech-practice/gemini-robotics-2' },
                { slug: 'ai-tech-practice/co-scientist' },
                { slug: 'ai-tech-practice/scientific-computing-agentic-ai' },
                { slug: 'ai-tech-practice/plugmem-agent-memory' },
                { slug: 'ai-tech-practice/argos-multimodal-verifier' },
                { slug: 'ai-tech-practice/alphagenome' },
                { slug: 'ai-tech-practice/v-jepa-2-world-model' },
              ],
            },
          ],
        },
        {
          label: '实战项目',
          items: [
            { slug: 'projects' },
            { slug: 'projects/publish-first-site' },
            { slug: 'projects/learn-journal' },
            { slug: 'projects/learn-journal/quickstart' },
            { slug: 'projects/learn-journal/how-it-works' },
            { slug: 'projects/learn-journal/design-philosophy' },
          ],
        },
        {
          label: '附录',
          items: [
            { slug: 'appendix' },
            { slug: 'appendix/git-basics' },
            { slug: 'appendix/troubleshooting' },
            { slug: 'glossary' },
          ],
        },
      ],

      lastUpdated: true,

      editLink: {
        baseUrl: 'https://github.com/estelledc/zero-to-ai/edit/main/',
      },

      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/estelledc/zero-to-ai' },
      ],

      head: [
        // Open Graph
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://estelledc.github.io/zero-to-ai/og-default.png',
          },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:width', content: '1200' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:height', content: '630' },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:alt',
            content: 'Zero to AI — 从第一条命令到公开交付的中文 AI 编程学习系统',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: 'https://estelledc.github.io/zero-to-ai/og-default.png',
          },
        },
      ],

      expressiveCode: {
        defaultProps: { showLineNumbers: true },
        themes: ['github-dark', 'github-light'],
      },

      components: {
        PageTitle: './src/components/overrides/PageTitle.astro',
        Head: './src/components/overrides/Head.astro',
        Header: './src/components/overrides/Header.astro',
        SiteTitle: './src/components/overrides/SiteTitle.astro',
        MobileMenuFooter: './src/components/overrides/MobileMenuFooter.astro',
        Hero: './src/components/overrides/Hero.astro',
        Footer: './src/components/overrides/Footer.astro',
      },

      customCss: ['./src/styles/jason-ds.css', './src/styles/custom.css'],

      // Pagefind 搜索（Starlight 内置，确保启用）
      pagefind: true,

      // 404 页面：使用自定义中文 404
      disable404Route: true,
    }),
  ],
});
