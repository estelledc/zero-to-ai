import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://estelledc.github.io',
  base: '/zero-to-ai/',
  trailingSlash: 'always',

  integrations: [
    starlight({
      title: 'Zero to AI',
      defaultLocale: 'root',
      locales: {
        root: { label: '简体中文', lang: 'zh-CN' },
      },

      sidebar: [
        {
          label: 'AI 编程工具',
          items: [
            { label: 'Claude Code', items: [{ autogenerate: { directory: 'claude-code' } }] },
            { label: 'Codex', items: [{ autogenerate: { directory: 'codex' } }] },
            { label: 'DeepSeek TUI', items: [{ autogenerate: { directory: 'deepseek-tui' } }] },
          ],
        },
        {
          label: 'AI 研究工具',
          items: [
            { label: 'lr CLI', items: [{ autogenerate: { directory: 'lr-cli' } }] },
          ],
        },
        {
          label: '方法论',
          items: [{ autogenerate: { directory: 'methodology' } }],
        },
      ],

      lastUpdated: true,

      editLink: {
        baseUrl: 'https://github.com/estelledc/zero-to-ai/edit/main/src/content/docs/',
      },

      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/estelledc/zero-to-ai' },
      ],

      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://estelledc.github.io/zero-to-ai/og-default.png',
          },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
      ],

      expressiveCode: {
        defaultProps: { showLineNumbers: true },
        themes: ['github-dark', 'github-light'],
      },

      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
