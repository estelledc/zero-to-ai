import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../..', import.meta.url));
const archive = 'public/downloads/skill-pack.zip';

test('local verify owns the complete published skill-pack contract', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')) as {
    scripts: Record<string, string>;
  };
  const script = packageJson.scripts['verify:skill-pack'];

  assert.ok(script, 'package.json must define verify:skill-pack');

  const rebuildAndSmoke = script.indexOf('npm run test:skill-pack');
  const trackedCheck = script.indexOf(`git ls-files --error-unmatch ${archive}`);
  const freshnessCheck = script.indexOf(`git diff --exit-code -- ${archive}`);

  assert.ok(rebuildAndSmoke >= 0, 'verify:skill-pack must rebuild and smoke test');
  assert.ok(trackedCheck > rebuildAndSmoke, 'tracked check must follow the rebuild');
  assert.ok(freshnessCheck > trackedCheck, 'freshness check must follow the tracked check');
  assert.match(packageJson.scripts.verify, /(?:^|&& )npm run verify:skill-pack(?: &&|$)/);
  assert.doesNotMatch(packageJson.scripts.verify, /npm run test:skill-pack/);
});

test('deploy validate reuses the local skill-pack contract before build', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'deploy.yml'), 'utf8');
  const validateStart = workflow.indexOf('\n  validate:\n');
  const buildStart = workflow.indexOf('\n  build:\n');
  const deployStart = workflow.indexOf('\n  deploy:\n');

  assert.ok(
    validateStart >= 0 && buildStart > validateStart && deployStart > buildStart,
    'validate, build, and deploy jobs must stay in order',
  );

  const validateJob = workflow.slice(validateStart, buildStart);
  const buildJob = workflow.slice(buildStart, deployStart);

  assert.match(validateJob, /run: npm run verify:skill-pack/);
  assert.doesNotMatch(validateJob, /run: npm run test:skill-pack/);
  assert.doesNotMatch(validateJob, /git diff --exit-code -- public\/downloads\/skill-pack\.zip/);
  assert.match(buildJob, /needs: validate/);
});
