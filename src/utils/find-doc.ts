import type { CollectionEntry } from 'astro:content';
import { slugMatches } from './slug';

/**
 * Match a tutorial slug to a Content Collection entry.
 * Astro 6 Content Layer may normalise "section/index" to just "section",
 * so we try both forms.
 */
export function findDoc(
  allDocs: CollectionEntry<'docs'>[],
  slug: string,
): CollectionEntry<'docs'> | undefined {
  return allDocs.find((doc) => slugMatches(doc.id, slug));
}
