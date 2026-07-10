import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import matter from 'gray-matter';

type SettingsFixture = {
  $schema: string;
  permissions: { deny: string[] };
  hooks?: Record<string, Array<{ matcher: string; hooks: Array<{ command: string }> }>>;
};

const settings = JSON.parse(
  readFileSync('tests/fixtures/claude-settings/settings.json', 'utf8'),
) as SettingsFixture;
assert.equal(settings.$schema, 'https://json.schemastore.org/claude-code-settings.json');
assert.ok(settings.permissions.deny.includes('Read(./.env)'));

const hookSettings = JSON.parse(
  readFileSync('tests/fixtures/claude-code/.claude/hooks/settings.json', 'utf8'),
) as SettingsFixture;
const hook = hookSettings.hooks?.PreToolUse[0];
assert.ok(hook);
assert.equal(hook.matcher, 'Read');
assert.match(hook.hooks[0].command, /\$CLAUDE_PROJECT_DIR/);

const guard = 'tests/fixtures/claude-code/.claude/hooks/guard-secret-read.py';
const allowed = spawnSync('python3', [guard], {
  input: JSON.stringify({ tool_input: { file_path: '/tmp/example.txt' } }),
  encoding: 'utf8',
});
assert.equal(allowed.status, 0);
const denied = spawnSync('python3', [guard], {
  input: JSON.stringify({ tool_input: { file_path: '/tmp/project/.env' } }),
  encoding: 'utf8',
});
assert.equal(denied.status, 2);
assert.match(denied.stderr, /Blocked secret-file read/);

const agent = matter(
  readFileSync('tests/fixtures/claude-code/.claude/agents/read-only-reviewer.md', 'utf8'),
);
assert.equal(agent.data.name, 'read-only-reviewer');
assert.equal(agent.data.model, 'inherit');
assert.equal(agent.data.tools, 'Read, Grep, Glob');
assert.doesNotMatch(String(agent.data.tools), /Write|Edit|Bash/);

console.log('Claude settings, Hook and subagent fixtures passed.');
