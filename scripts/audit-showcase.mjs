import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = fileURLToPath(new URL('../dist/', import.meta.url));

async function collectHtml(directory) {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectHtml(path)));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }

  return files;
}

const failures = [];
const htmlFiles = await collectHtml(dist);

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const displayPath = relative(root, file);

  if (/:::(?:note|tip|caution|danger|success|warning|info|important)\b/.test(html)) {
    failures.push(`${displayPath}: contains an unrendered callout directive`);
  }

  if (/github\.com\/estelledc\/intern-journal/i.test(html)) {
    failures.push(`${displayPath}: exposes a private source repository URL`);
  }
}

const home = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
for (const [label, pattern] of [
  ['canonical URL', /<link rel="canonical" href="https:\/\/estelledc\.github\.io\/zero-to-ai\/"/],
  [
    'Open Graph image',
    /<meta property="og:image" content="https:\/\/estelledc\.github\.io\/zero-to-ai\/og-default\.png"/,
  ],
  ['LearningResource JSON-LD', /"@type":"LearningResource"/],
]) {
  if (!pattern.test(home)) failures.push(`dist/index.html: missing ${label}`);
}

if (failures.length > 0) {
  console.error(`Showcase audit failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Showcase audit passed (${htmlFiles.length} HTML files)`);
}
