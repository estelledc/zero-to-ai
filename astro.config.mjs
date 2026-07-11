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
