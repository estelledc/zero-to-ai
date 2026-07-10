/** Canonical content-route helpers shared by components, feeds and validators. */
export function canonicalSlug(slug: string): string {
  const normalized = slug.replace(/^\/+|\/+$/g, '');
  if (normalized === 'index') return '';
  return normalized.replace(/\/index$/, '');
}

export function slugVariants(slug: string): string[] {
  const canonical = canonicalSlug(slug);
  return canonical ? [canonical, `${canonical}/index`] : ['', 'index'];
}

export function slugMatches(a: string, b: string): boolean {
  return canonicalSlug(a) === canonicalSlug(b);
}

export function resolveCanonicalSlug(pageId: string, candidates: string[]): string {
  return candidates.find((candidate) => slugMatches(candidate, pageId)) ?? canonicalSlug(pageId);
}
