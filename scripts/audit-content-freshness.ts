import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

type MatrixRow = {
  page: string;
  sourceTitle?: string;
  toolVersion: string;
  lastReviewed: string;
  result: 'PASS' | 'PARTIAL' | 'FAIL';
  platforms: Array<'macOS' | 'Windows' | 'Linux'>;
  sources: string[];
};

type SourceInfo = {
  title: string;
  publisher: string;
  url: string;
  published: string;
};

const root = process.cwd();
const docsRoot = path.join(root, 'src/content/docs');
const matrixPath = path.join(root, 'docs/OFFICIAL-SOURCE-MATRIX.json');
const todayIso = new Date().toISOString().slice(0, 10);
const today = new Date(`${todayIso}T00:00:00Z`);
const staleAfterDays = 90;

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    return /\.mdx?$/.test(entry.name) ? [absolute] : [];
  });
}

function isoDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8')) as { pages: MatrixRow[] };
const matrixByPage = new Map(matrix.pages.map((row) => [row.page, row]));
const errors: string[] = [];
const warnings: string[] = [];
const report: Array<Record<string, string | number>> = [];

for (const file of walk(docsRoot)) {
  const relative = path.relative(root, file).replaceAll(path.sep, '/');
  const contentSlug = path
    .relative(docsRoot, file)
    .replace(/\.mdx?$/, '')
    .replaceAll(path.sep, '/');
  const { data } = matter(fs.readFileSync(file, 'utf8'));
  const source = data.source as SourceInfo | undefined;
  const timeSensitive =
    contentSlug.startsWith('claude-code/') || Boolean(data.toolVersion) || Boolean(source);
  if (!timeSensitive) {
    if (data.lastVerified !== undefined) {
      if (!isoDate(data.lastVerified)) {
        errors.push(`${relative}: lastVerified must use YYYY-MM-DD`);
      } else if (data.lastVerified > todayIso) {
        errors.push(`${relative}: lastVerified is in the future`);
      }
    }
    continue;
  }

  if (!isoDate(data.lastVerified)) {
    errors.push(`${relative}: time-sensitive content needs ISO lastVerified (YYYY-MM-DD)`);
    continue;
  }
  const verifiedAt = new Date(`${data.lastVerified}T00:00:00Z`);
  if (Number.isNaN(verifiedAt.valueOf())) {
    errors.push(`${relative}: invalid lastVerified ${String(data.lastVerified)}`);
    continue;
  }
  if (data.lastVerified > todayIso) errors.push(`${relative}: lastVerified is in the future`);

  if (source) {
    if (
      typeof source.title !== 'string' ||
      typeof source.publisher !== 'string' ||
      typeof source.url !== 'string' ||
      !source.url.startsWith('https://') ||
      !isoDate(source.published)
    ) {
      errors.push(`${relative}: source needs title, publisher, HTTPS url and ISO published date`);
    }
    if (source.published > todayIso) {
      errors.push(`${relative}: source published date is in the future`);
    }
  } else {
    if (typeof data.toolVersion !== 'string' || !/\d/.test(data.toolVersion)) {
      errors.push(`${relative}: time-sensitive content needs a concrete toolVersion`);
    }
    if (/\b(latest|current|最新版|最新)\b/i.test(String(data.toolVersion))) {
      errors.push(`${relative}: toolVersion must not use a moving “latest/current” label`);
    }
  }

  const row = matrixByPage.get(relative);
  if (!row) {
    errors.push(`${relative}: missing official-source matrix entry`);
  } else {
    if (row.lastReviewed !== data.lastVerified) {
      errors.push(`${relative}: matrix lastReviewed must match lastVerified`);
    }
    if (source) {
      if (row.sourceTitle !== source.title) {
        errors.push(`${relative}: matrix sourceTitle must match frontmatter source title`);
      }
      if (row.toolVersion !== `Article published ${source.published}`) {
        errors.push(`${relative}: matrix article publication date must match frontmatter source`);
      }
      if (!row.sources.includes(source.url)) {
        errors.push(`${relative}: matrix sources must include frontmatter source url`);
      }
    } else if (row.toolVersion !== data.toolVersion) {
      errors.push(`${relative}: matrix toolVersion must match frontmatter`);
    }
    if (row.sources.length === 0 || row.sources.some((url) => !url.startsWith('https://'))) {
      errors.push(`${relative}: matrix needs at least one HTTPS first-party source`);
    }
    if (!Array.isArray(row.platforms) || row.platforms.length === 0) {
      errors.push(`${relative}: matrix needs at least one supported platform`);
    }
    if (row.result === 'FAIL') errors.push(`${relative}: verification matrix result is FAIL`);
  }

  const ageDays = Math.floor((today.valueOf() - verifiedAt.valueOf()) / 86_400_000);
  if (ageDays > staleAfterDays) {
    warnings.push(`${relative}: ${ageDays} days since verification (>${staleAfterDays})`);
  }
  report.push({ page: relative, lastVerified: data.lastVerified, ageDays });
}

console.log(`Content freshness: ${report.length} time-sensitive pages checked.`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);

if (errors.length > 0) process.exitCode = 1;
