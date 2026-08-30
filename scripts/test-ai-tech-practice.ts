import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

type SourceInfo = {
  title: string;
  publisher: string;
  url: string;
  published: string;
};

type MatrixRow = {
  page: string;
  sourceTitle?: string;
  toolVersion: string;
  lastReviewed: string;
  result: 'PASS' | 'PARTIAL' | 'FAIL';
  sources: string[];
};

const root = process.cwd();
const practiceRoot = path.join(root, 'src/content/docs/ai-tech-practice');
const indexPath = path.join(practiceRoot, 'index.mdx');
const matrixPath = path.join(root, 'docs/OFFICIAL-SOURCE-MATRIX.json');
const astroConfigPath = path.join(root, 'astro.config.mjs');
const expectedArticleCount = 51;
const errors: string[] = [];

const publisherDomains: Record<string, string> = {
  Anthropic: 'anthropic.com',
  Cursor: 'cursor.com',
  'Google DeepMind': 'deepmind.google',
  'Google Research': 'research.google',
  'Hugging Face': 'huggingface.co',
  'Meta AI': 'meta.com',
  'Microsoft Research': 'microsoft.com',
  'NVIDIA Technical Blog': 'nvidia.com',
  OpenAI: 'openai.com',
};

function fail(owner: string, message: string): void {
  errors.push(`${owner}: ${message}`);
}

function isoDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

const articleFiles = fs
  .readdirSync(practiceRoot)
  .filter((file) => file.endsWith('.md'))
  .sort();

if (articleFiles.length !== expectedArticleCount) {
  fail(
    'ai-tech-practice',
    `expected ${expectedArticleCount} articles, found ${articleFiles.length}`,
  );
}

const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8')) as { pages: MatrixRow[] };
const practiceRows = matrix.pages.filter((row) =>
  row.page.startsWith('src/content/docs/ai-tech-practice/'),
);
const rowsByPage = new Map<string, MatrixRow>();
for (const row of practiceRows) {
  if (rowsByPage.has(row.page)) fail(row.page, 'duplicate official-source matrix row');
  rowsByPage.set(row.page, row);
}

const indexBody = fs.readFileSync(indexPath, 'utf8');
const astroConfig = fs.readFileSync(astroConfigPath, 'utf8');
const sourceUrls = new Set<string>();
const articlePaths = new Set<string>();

for (const file of articleFiles) {
  const owner = `ai-tech-practice/${file}`;
  const absolute = path.join(practiceRoot, file);
  const relative = path.relative(root, absolute).replaceAll(path.sep, '/');
  const parsed = matter(fs.readFileSync(absolute, 'utf8'));
  const data = parsed.data;
  const body = parsed.content;
  const source = data.source as SourceInfo | undefined;
  const slug = file.replace(/\.md$/, '');
  articlePaths.add(relative);

  if (!Array.isArray(data.tags) || !data.tags.includes('ai-tech-practice')) {
    fail(owner, 'tags must include ai-tech-practice');
  }
  if (!['beginner', 'intermediate', 'advanced'].includes(String(data.difficulty))) {
    fail(owner, 'difficulty must be beginner, intermediate or advanced');
  }
  if (!isoDate(data.lastVerified)) fail(owner, 'lastVerified must use YYYY-MM-DD');

  if (
    !source ||
    !source.title?.trim() ||
    !source.publisher?.trim() ||
    !source.url?.trim() ||
    !isoDate(source.published)
  ) {
    fail(owner, 'source needs title, publisher, url and ISO published date');
    continue;
  }

  let hostname = '';
  try {
    const url = new URL(source.url);
    hostname = url.hostname;
    if (url.protocol !== 'https:') fail(owner, 'source URL must use HTTPS');
  } catch {
    fail(owner, 'source URL is invalid');
  }
  const expectedDomain = publisherDomains[source.publisher];
  if (!expectedDomain) {
    fail(owner, `unsupported publisher: ${source.publisher}`);
  } else if (hostname !== expectedDomain && !hostname.endsWith(`.${expectedDomain}`)) {
    fail(owner, `publisher ${source.publisher} does not match source host ${hostname}`);
  }

  if (sourceUrls.has(source.url)) fail(owner, 'source URL is duplicated');
  sourceUrls.add(source.url);
  if (isoDate(data.lastVerified) && source.published > data.lastVerified) {
    fail(owner, 'source publication date is later than lastVerified');
  }

  if (!/^## .*实验/m.test(body)) fail(owner, 'missing experiment section');
  if (!body.includes('**成功证据：**')) fail(owner, 'missing explicit success evidence');
  if (!body.includes('**停止线：**')) fail(owner, 'missing explicit stop line');
  if (!/^## .*误区/m.test(body)) fail(owner, 'missing misconceptions section');
  if (!/^## 原文与证据边界/m.test(body)) fail(owner, 'missing source boundary section');
  if (!body.includes('原创中文实践解读')) fail(owner, 'missing original-practice disclosure');
  if (!/不是逐句(?:翻译|译文)/.test(body)) fail(owner, 'missing non-translation disclosure');
  if (!body.includes(`](${source.url})`)) fail(owner, 'body must link to frontmatter source URL');
  if (/^>\s/m.test(body)) fail(owner, 'block quotes are not allowed in the practice library');

  const matrixRow = rowsByPage.get(relative);
  if (!matrixRow) {
    fail(owner, 'missing official-source matrix row');
  } else {
    if (matrixRow.sourceTitle !== source.title) {
      fail(owner, 'matrix sourceTitle does not match frontmatter source title');
    }
    if (matrixRow.toolVersion !== `Article published ${source.published}`) {
      fail(owner, 'matrix publication date does not match source metadata');
    }
    if (matrixRow.lastReviewed !== data.lastVerified) {
      fail(owner, 'matrix review date does not match lastVerified');
    }
    if (!matrixRow.sources.includes(source.url)) {
      fail(owner, 'matrix does not contain frontmatter source URL');
    }
    if (matrixRow.result === 'FAIL') fail(owner, 'matrix result must not be FAIL');
  }

  const href = `/ai-tech-practice/${slug}/`;
  const indexOccurrences = indexBody.split(href).length - 1;
  if (indexOccurrences !== 1) {
    fail(owner, `index must link to ${href} exactly once (found ${indexOccurrences})`);
  }

  const sidebarNeedle = `{ slug: 'ai-tech-practice/${slug}' }`;
  const sidebarOccurrences = astroConfig.split(sidebarNeedle).length - 1;
  if (sidebarOccurrences !== 1) {
    fail(owner, `sidebar must contain ${sidebarNeedle} exactly once (found ${sidebarOccurrences})`);
  }
}

for (const row of practiceRows) {
  if (!articlePaths.has(row.page)) fail(row.page, 'orphan official-source matrix row');
}
if (practiceRows.length !== expectedArticleCount) {
  fail(
    'official-source matrix',
    `expected ${expectedArticleCount} rows, found ${practiceRows.length}`,
  );
}

const articleSlugs = new Set(articleFiles.map((file) => file.replace(/\.md$/, '')));
const sidebarSlugs = [...astroConfig.matchAll(/\{ slug: 'ai-tech-practice\/([^']+)' \}/g)].map(
  (match) => match[1],
);
for (const slug of sidebarSlugs) {
  if (!articleSlugs.has(slug)) fail('astro.config.mjs', `orphan practice sidebar slug: ${slug}`);
}
if (sidebarSlugs.length !== expectedArticleCount) {
  fail(
    'astro.config.mjs',
    `expected ${expectedArticleCount} practice article slugs, found ${sidebarSlugs.length}`,
  );
}

for (const error of errors) console.error(`ERROR ${error}`);
if (errors.length > 0) process.exit(1);

console.log(
  `AI tech practice contract passed (${articleFiles.length} articles, ${sourceUrls.size} unique sources).`,
);
