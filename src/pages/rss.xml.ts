import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { slugToHref } from '../utils/base-url';

export async function GET(context: APIContext) {
  const docs = await getCollection('docs');

  return rss({
    title: 'Zero to AI',
    description: '从零开始用 AI 编程工具 — 实战教程集合',
    site: new URL(import.meta.env.BASE_URL, context.site).href,
    items: docs
      .filter((doc) => doc.data.title && doc.id !== 'index')
      .map((doc) => {
        const pubDate = doc.data.lastUpdated instanceof Date ? doc.data.lastUpdated : undefined;
        return {
          title: doc.data.title,
          description: doc.data.description || '',
          link: slugToHref(doc.id),
          ...(pubDate ? { pubDate } : {}),
        };
      }),
    customData: '<language>zh-CN</language>',
  });
}
