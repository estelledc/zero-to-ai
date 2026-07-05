import type { CollectionEntry } from 'astro:content';

/**
 * Match a tutorial slug to a Content Collection entry.
 * Astro 6 Content Layer may normalise "section/index" to just "section",
 * so we try both forms.
 */
export function findDoc(
  allDocs: CollectionEntry<'docs'>[],
  slug: string,
): CollectionEntry<'docs'> | undefined {
  return (
    allDocs.find((d) => d.id === slug) ||
    allDocs.find((d) => d.id === slug.replace(/\/index$/, '')) ||
    allDocs.find((d) => d.id === `${slug}/index`)
  );
}

/** Match content entry ids with learning-path tutorial slugs (handles index pages). */
export function slugMatches(pageId: string, tutorialSlug: string): boolean {
  return (
    pageId === tutorialSlug ||
    pageId === tutorialSlug.replace(/\/index$/, '') ||
    `${pageId}/index` === tutorialSlug
  );
}
