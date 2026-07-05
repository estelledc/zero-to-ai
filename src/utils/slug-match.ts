/**
 * Slug matching utilities for Astro 6 Content Layer normalization.
 * Astro may store "section/index" as "section" — these helpers compare both forms.
 */

/** Return all equivalent slug forms for lookup. */
export function slugVariants(slug: string): string[] {
  const variants = new Set<string>([slug]);
  if (slug.endsWith('/index')) {
    variants.add(slug.replace(/\/index$/, ''));
  } else {
    variants.add(`${slug}/index`);
  }
  return [...variants];
}

/** Check whether two slugs refer to the same document. */
export function slugMatches(a: string, b: string): boolean {
  const aVariants = slugVariants(a);
  return slugVariants(b).some((vb) => aVariants.includes(vb));
}

/** Resolve a page id to the canonical form used in learning-paths.ts, if present. */
export function resolveCanonicalSlug(pageId: string, candidates: string[]): string {
  const match = candidates.find((c) => slugMatches(c, pageId));
  return match ?? pageId;
}
