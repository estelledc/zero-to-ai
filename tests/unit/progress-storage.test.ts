import assert from 'node:assert/strict';
import test from 'node:test';
import {
  legacyProgressKey,
  ownedProgressKeys,
  parseProgressEntry,
  progressKey,
  readProgress,
} from '../../src/utils/progress-storage';

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
}

test('legacy v1 entries migrate as visited, never completed', () => {
  const storage = new MemoryStorage();
  const legacy = legacyProgressKey('path-a', 'tutorial-a');
  storage.setItem(legacy, JSON.stringify({ v: 1 }));

  assert.equal(readProgress(storage, 'path-a', 'tutorial-a')?.status, 'visited');
  assert.equal(storage.getItem(legacy), null);
  assert.match(storage.getItem(progressKey('path-a', 'tutorial-a')) ?? '', /"visited"/);
});

test('unknown versions and malformed JSON are rejected', () => {
  assert.equal(parseProgressEntry('{"v":2,"status":"completed"}'), null);
  assert.equal(parseProgressEntry('not-json'), null);
});

test('reset inventory contains only declared current and legacy keys', () => {
  const keys = ownedProgressKeys([{ slug: 'path-a', tutorials: ['one', 'two'] }]);
  assert.deepEqual(keys, [
    progressKey('path-a', 'one'),
    legacyProgressKey('path-a', 'one'),
    progressKey('path-a', 'two'),
    legacyProgressKey('path-a', 'two'),
  ]);
  assert.equal(keys.includes('path:someone-else:data'), false);
});
