import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { base } from '../utils/base-url';

/** Fallback date for docs without lastUpdated — the initial site launch date. */
const SITE_LAUNCH_DATE = new Date('2026-06-12T00:00:00Z');

export async function GET(context: APIContext) {
  const docs = await getCollection('docs');

  return rss({
    title: 'Zero to AI',
    description: '从零开始用 AI 编程工具 — 实战教程集合',
    site: context.site!.href,
    items: docs
      .filter((doc) => doc.data.title && doc.id !== 'index')
      .map((doc) => ({
        title: doc.data.title,
        description: doc.data.description || '',
        link: `${base}/${doc.id}/`,
        pubDate: doc.data.lastUpdated instanceof Date ? doc.data.lastUpdated : SITE_LAUNCH_DATE,
      })),
    customData: '<language>zh-CN</language>',
  });
}
