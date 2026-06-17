/**
 * Returns the site's base URL without a trailing slash.
 * Use this in .astro components to build root-relative hrefs.
 *
 * Example: `${base}/paths/` → `/zero-to-ai/paths/`
 */
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
