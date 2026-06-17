import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://estelledc.github.io',
  base: '/zero-to-ai/',
  trailingSlash: 'always',

  integrations: [
    starlight({
      title: 'Zero to AI',
      description: '从零开始用 AI 编程工具 — 实战教程集合',
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },

      sidebar: [
        {
          label: 'Claude Code',
          items: [{ autogenerate: { directory: 'claude-code' } }],
        },
        {
          label: '方法论',
          items: [{ autogenerate: { directory: 'methodology' } }],
        },
        {
          label: '附录',
          items: [{ autogenerate: { directory: 'appendix' } }],
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

      customCss: ['./src/styles/custom.css'],

      // Pagefind 搜索（Starlight 内置，确保启用）
      pagefind: true,

      // 404 页面
      disable404Route: false,
    }),
  ],
});
