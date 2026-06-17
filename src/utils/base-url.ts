/**
 * Returns the site's base URL without a trailing slash.
 * Use this in .astro components to build root-relative hrefs.
 *
 * Example: `${base}/paths/` → `/zero-to-ai/paths/`
 */
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Convert a content collection slug (e.g. "claude-code/index") to a proper href.
 * Astro treats `index.md` as the directory root, so the URL should be
 * `/claude-code/` not `/claude-code/index/`.
 */
export function slugToHref(slug: string): string {
  // Strip trailing "index" or standalone "index"
  const cleaned = slug.replace(/(^|\/)?index$/, '$1').replace(/\/$/, '');
  return `${base}/${cleaned}${cleaned ? '/' : ''}`;
}
