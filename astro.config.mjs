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
      description: '从零开始用 AI 编程工具 — 实战教程集合',
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },

      sidebar: [
        {
          label: 'Claude Code',
          items: [
            { slug: 'claude-code' },
            { slug: 'claude-code/preflight' },
            { slug: 'claude-code/quickstart' },
            { slug: 'claude-code/cost' },
            { slug: 'claude-code/agnes-free-vibe-coding' },
            { slug: 'claude-code/config' },
            { slug: 'claude-code/context' },
            { slug: 'claude-code/verify' },
            { slug: 'claude-code/skills' },
            { slug: 'claude-code/memory' },
            { slug: 'claude-code/hooks' },
            { slug: 'claude-code/daily-rhythm' },
            { slug: 'claude-code/mcp' },
            { slug: 'claude-code/subagents' },
            { slug: 'claude-code/dotfiles' },
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
          ],
        },
        {
          label: '附录',
          items: [
            { slug: 'appendix' },
            { slug: 'appendix/git-basics' },
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
          attrs: { property: 'og:image', content: 'https://estelledc.github.io/zero-to-ai/og-default.png' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:type', content: 'website' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:locale', content: 'zh_CN' },
        },
        // Twitter Card
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        // 站点验证（预留）
        // { tag: 'meta', attrs: { name: 'google-site-verification', content: '...' } },
      ],

      expressiveCode: {
        defaultProps: { showLineNumbers: true },
        themes: ['github-dark', 'github-light'],
      },

      components: {
        PageTitle: './src/components/overrides/PageTitle.astro',
      },

      customCss: ['./src/styles/custom.css'],

      // Pagefind 搜索（Starlight 内置，确保启用）
      pagefind: true,

      // 404 页面
      disable404Route: false,
    }),
  ],
});
