/** Versioned, project-owned localStorage contract for learning progress. */
export const PROGRESS_VERSION = 1;
export const PROGRESS_NAMESPACE = 'zero-to-ai:progress:';
export const ACTIVE_PATH_KEY = 'zero-to-ai:active-path';

export type ProgressStatus = 'visited' | 'completed';

export interface ProgressEntry {
  v: typeof PROGRESS_VERSION;
  status: ProgressStatus;
  visitedAt?: string;
  completedAt?: string;
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function progressKey(pathSlug: string, tutorialSlug: string): string {
  return `${PROGRESS_NAMESPACE}v${PROGRESS_VERSION}:${encodeURIComponent(pathSlug)}:${encodeURIComponent(tutorialSlug)}`;
}

/** 1.0 key retained only as a migration source. */
export function legacyProgressKey(pathSlug: string, tutorialSlug: string): string {
  return `path:${pathSlug}:${tutorialSlug}`;
}

export function parseProgressEntry(raw: string | null): ProgressEntry | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object' || !('v' in data) || data.v !== PROGRESS_VERSION) {
      return null;
    }
    const candidate = data as Record<string, unknown>;
    if (candidate.status === 'completed') {
      return {
        v: PROGRESS_VERSION,
        status: 'completed',
        visitedAt: typeof candidate.visitedAt === 'string' ? candidate.visitedAt : undefined,
        completedAt: typeof candidate.completedAt === 'string' ? candidate.completedAt : undefined,
      };
    }
    // Legacy `{ "v": 1 }` means visited, never completed.
    if (candidate.status === undefined || candidate.status === 'visited') {
      return {
        v: PROGRESS_VERSION,
        status: 'visited',
        visitedAt: typeof candidate.visitedAt === 'string' ? candidate.visitedAt : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function safeGet(storage: StorageLike, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(storage: StorageLike, key: string, value: string): boolean {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(storage: StorageLike, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    // Storage may be unavailable in privacy-restricted contexts.
  }
}

/** Read current data and migrate a valid 1.0 key without losing progress. */
export function readProgress(
  storage: StorageLike,
  pathSlug: string,
  tutorialSlug: string,
): ProgressEntry | null {
  const currentKey = progressKey(pathSlug, tutorialSlug);
  const currentRaw = safeGet(storage, currentKey);
  const current = parseProgressEntry(currentRaw);
  if (current) return current;
  if (currentRaw) safeRemove(storage, currentKey);

  const legacyKey = legacyProgressKey(pathSlug, tutorialSlug);
  const legacyRaw = safeGet(storage, legacyKey);
  const legacy = parseProgressEntry(legacyRaw);
  if (!legacy) {
    if (legacyRaw) safeRemove(storage, legacyKey);
    return null;
  }

  if (safeSet(storage, currentKey, JSON.stringify(legacy))) safeRemove(storage, legacyKey);
  return legacy;
}

export function writeProgress(
  storage: StorageLike,
  pathSlug: string,
  tutorialSlug: string,
  entry: ProgressEntry,
): boolean {
  return safeSet(storage, progressKey(pathSlug, tutorialSlug), JSON.stringify(entry));
}

export function ownedProgressKeys(paths: Array<{ slug: string; tutorials: string[] }>): string[] {
  return paths.flatMap((path) =>
    path.tutorials.flatMap((tutorial) => [
      progressKey(path.slug, tutorial),
      legacyProgressKey(path.slug, tutorial),
    ]),
  );
}

export function isValidProgressEntry(raw: string | null): boolean {
  return parseProgressEntry(raw) !== null;
}
