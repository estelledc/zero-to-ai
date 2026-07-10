import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalSlug, slugMatches, slugVariants } from '../../src/utils/slug';

test('index forms share one canonical slug', () => {
  assert.equal(canonicalSlug('claude-code/index'), 'claude-code');
  assert.equal(canonicalSlug('/claude-code/'), 'claude-code');
  assert.equal(slugMatches('claude-code/index', 'claude-code'), true);
  assert.deepEqual(slugVariants('claude-code/index'), ['claude-code', 'claude-code/index']);
});
