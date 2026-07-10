import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docsRoot = path.join(root, 'src/content/docs/codex');
const requiredPages = [
  'index.md',
  'quickstart.md',
  'first-task.md',
  'agents-md.md',
  'modify-verify-git.md',
  'capstone.md',
  'troubleshooting.md',
  'official-sources.md',
];

const errors: string[] = [];
const contents = requiredPages.map((name) => {
  const file = path.join(docsRoot, name);
  if (!fs.existsSync(file)) {
    errors.push(`missing Codex path page: ${name}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
});
const allDocs = contents.join('\n');

for (const command of [
  'codex --version',
  'codex login',
  'codex login status',
  'codex logout',
  'codex login --with-api-key',
  '/status',
  '/permissions',
  '/review',
  '/init',
]) {
  if (!allDocs.includes(command)) errors.push(`documented command is missing: ${command}`);
}

for (const source of [
  'https://developers.openai.com/codex/cli',
  'https://developers.openai.com/codex/auth',
  'https://developers.openai.com/codex/pricing',
  'https://developers.openai.com/codex/guides/agents-md',
  'https://learn.chatgpt.com/docs/agent-approvals-security',
]) {
  if (!allDocs.includes(source)) errors.push(`official source is missing: ${source}`);
}

try {
  const version = execFileSync('codex', ['--version'], { encoding: 'utf8' }).trim();
  const help = execFileSync('codex', ['--help'], { encoding: 'utf8' });
  const loginHelp = execFileSync('codex', ['login', '--help'], { encoding: 'utf8' });
  const execHelp = execFileSync('codex', ['exec', '--help'], { encoding: 'utf8' });

  if (!/^codex-cli 0\.144\./.test(version)) {
    errors.push(`local Codex version is outside documented 0.144.x range: ${version}`);
  }
  for (const token of ['exec', 'review', 'login', 'logout', '--sandbox', '--ask-for-approval']) {
    if (!help.includes(token)) errors.push(`codex --help missing expected token: ${token}`);
  }
  for (const token of ['status', '--with-api-key']) {
    if (!loginHelp.includes(token))
      errors.push(`codex login --help missing expected token: ${token}`);
  }
  for (const token of ['--skip-git-repo-check', '--ephemeral', '--json']) {
    if (!execHelp.includes(token))
      errors.push(`codex exec --help missing expected token: ${token}`);
  }
  console.log(`Codex CLI contract: ${version}`);
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
    console.warn(
      'WARN Codex CLI is not installed; static tutorial contract passed, local CLI check skipped.',
    );
  } else {
    throw error;
  }
}

for (const error of errors) console.error(`ERROR ${error}`);
if (errors.length > 0) process.exitCode = 1;
else console.log(`Codex docs: ${requiredPages.length} complete path pages checked.`);
