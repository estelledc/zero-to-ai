/**
 * Slug matching utilities for Astro 6 Content Layer normalization.
 * Astro may store "section/index" as "section" — these helpers compare both forms.
 */

export { canonicalSlug, resolveCanonicalSlug, slugMatches, slugVariants } from './slug';
