import fs from 'node:fs/promises';
import path from 'node:path';

type Matrix = { pages: Array<{ page: string; sources: string[] }> };
const strict = process.argv.includes('--strict');
const root = process.cwd();
const matrix = JSON.parse(
  await fs.readFile(path.join(root, 'docs/OFFICIAL-SOURCE-MATRIX.json'), 'utf8'),
) as Matrix;
const urls = [...new Set(matrix.pages.flatMap((row) => row.sources))].sort();

const results = [];
for (const url of urls) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    });
    if (response.status === 405) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal });
    }
    results.push({ url, ok: response.ok, status: response.status, finalUrl: response.url });
  } catch (error) {
    results.push({
      url,
      ok: false,
      status: 0,
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    clearTimeout(timer);
  }
}

const outputDir = path.join(root, 'artifacts/maintenance');
await fs.mkdir(outputDir, { recursive: true });
const outputPath = path.join(outputDir, 'official-link-report.json');
await fs.writeFile(
  outputPath,
  `${JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2)}\n`,
);

const failed = results.filter((result) => !result.ok);
console.log(`Official links: ${results.length - failed.length}/${results.length} reachable.`);
console.log(`Report: ${path.relative(root, outputPath)}`);
if (failed.length > 0) {
  for (const result of failed)
    console.warn(`WARN ${result.url} (${result.status || 'network error'})`);
  if (strict) process.exitCode = 1;
}
