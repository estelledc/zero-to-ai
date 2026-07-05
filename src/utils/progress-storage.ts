/**
 * Shared localStorage progress tracking constants and helpers.
 * Used by PathProgress.astro and paths.astro client scripts.
 */
export const PROGRESS_VERSION = 1;
export const ACTIVE_PATH_KEY = 'zero-to-ai:active-path';

export function progressKey(pathSlug: string, tutorialSlug: string): string {
  return `path:${pathSlug}:${tutorialSlug}`;
}

/** Parse a stored progress entry; returns true if valid for current version. */
export function isValidProgressEntry(raw: string | null): boolean {
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    return data.v === PROGRESS_VERSION;
  } catch {
    return false;
  }
}
