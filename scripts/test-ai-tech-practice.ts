import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { articleSlugs, categories, paths, sidebarGroups } from '../src/data/ai-tech-practice';

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
const componentPath = path.join(root, 'src/components/PracticeLibrary.astro');
const expectedArticleCount = 59;
const expectedCategoryCount = 7;
const expectedPathCount = 6;
const errors: string[] = [];

const publisherDomains: Record<string, string[]> = {
  Anthropic: ['anthropic.com', 'claude.com'],
  AWS: ['aws.amazon.com'],
  Cursor: ['cursor.com'],
  GitHub: ['github.blog'],
  'Google DeepMind': ['deepmind.google'],
  'Google Research': ['research.google'],
  'Hugging Face': ['huggingface.co'],
  'Meta AI': ['meta.com'],
  'Microsoft Research': ['microsoft.com'],
  'NVIDIA Technical Blog': ['nvidia.com'],
  OpenAI: ['openai.com'],
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

const articleFileSlugs = new Set(articleFiles.map((file) => file.replace(/\.md$/, '')));
const catalogSlugs = new Set(articleSlugs);
if (articleSlugs.length !== expectedArticleCount || catalogSlugs.size !== expectedArticleCount) {
  fail(
    'ai-tech-practice catalog',
    `expected ${expectedArticleCount} unique article slugs, found ${articleSlugs.length} entries and ${catalogSlugs.size} unique slugs`,
  );
}
for (const slug of articleFileSlugs) {
  if (!catalogSlugs.has(slug)) fail('ai-tech-practice catalog', `missing article slug: ${slug}`);
}
for (const slug of catalogSlugs) {
  if (!articleFileSlugs.has(slug)) fail('ai-tech-practice catalog', `orphan article slug: ${slug}`);
}

if (categories.length !== expectedCategoryCount) {
  fail(
    'ai-tech-practice categories',
    `expected ${expectedCategoryCount}, found ${categories.length}`,
  );
}
const categoryIds = new Set<string>();
const categoryMembership = new Map<string, number>();
for (const category of categories) {
  if (categoryIds.has(category.slug)) fail(category.slug, 'duplicate category slug');
  categoryIds.add(category.slug);
  if (!category.title.trim() || !category.description.trim() || !category.outcome.trim()) {
    fail(category.slug, 'category needs title, description and outcome');
  }
  if (!category.articles.includes(category.startSlug)) {
    fail(category.slug, `startSlug is not in its category: ${category.startSlug}`);
  }
  for (const slug of category.articles) {
    categoryMembership.set(slug, (categoryMembership.get(slug) ?? 0) + 1);
  }
}
for (const slug of articleFileSlugs) {
  const count = categoryMembership.get(slug) ?? 0;
  if (count !== 1) fail(slug, `must belong to exactly one category (found ${count})`);
}
for (const slug of categoryMembership.keys()) {
  if (!articleFileSlugs.has(slug)) fail(slug, 'category references an unknown article');
}

if (paths.length !== expectedPathCount) {
  fail('ai-tech-practice paths', `expected ${expectedPathCount}, found ${paths.length}`);
}
const pathIds = new Set<string>();
for (const readingPath of paths) {
  if (pathIds.has(readingPath.slug)) fail(readingPath.slug, 'duplicate path slug');
  pathIds.add(readingPath.slug);
  if (!readingPath.title.trim() || !readingPath.description.trim() || !readingPath.outcome.trim()) {
    fail(readingPath.slug, 'path needs title, description and outcome');
  }
  const pathSlugs = new Set(readingPath.articles);
  if (pathSlugs.size !== readingPath.articles.length) {
    fail(readingPath.slug, 'path must not repeat an article');
  }
  for (const slug of readingPath.articles) {
    if (!articleFileSlugs.has(slug)) fail(readingPath.slug, `unknown article slug: ${slug}`);
  }
}

if (sidebarGroups.length !== expectedCategoryCount) {
  fail(
    'ai-tech-practice sidebar',
    `expected ${expectedCategoryCount} groups, found ${sidebarGroups.length}`,
  );
}
for (const [index, group] of sidebarGroups.entries()) {
  const category = categories[index];
  if (!category) continue;
  if (!group.collapsed) fail(category.slug, 'sidebar group must be collapsed');
  if (group.label !== category.title)
    fail(category.slug, 'sidebar label must match category title');
  const expectedItems = category.articles.map((slug) => `ai-tech-practice/${slug}`);
  const actualItems = group.items.map((item) => item.slug);
  if (JSON.stringify(actualItems) !== JSON.stringify(expectedItems)) {
    fail(category.slug, 'sidebar items must be generated from category articles in order');
  }
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
const componentBody = fs.readFileSync(componentPath, 'utf8');
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
  const expectedDomains = publisherDomains[source.publisher];
  if (!expectedDomains) {
    fail(owner, `unsupported publisher: ${source.publisher}`);
  } else if (
    !expectedDomains.some(
      (expectedDomain) => hostname === expectedDomain || hostname.endsWith(`.${expectedDomain}`),
    )
  ) {
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

if (
  !indexBody.includes("import PracticeLibrary from '../../../components/PracticeLibrary.astro';")
) {
  fail('ai-tech-practice/index.mdx', 'must import PracticeLibrary');
}
if (!indexBody.includes('<PracticeLibrary />')) {
  fail('ai-tech-practice/index.mdx', 'must render PracticeLibrary');
}
if (/\/ai-tech-practice\/[^/\s)]+\//.test(indexBody)) {
  fail('ai-tech-practice/index.mdx', 'must not hand-write article URLs');
}

if (!astroConfig.includes("import { sidebarGroups } from './src/data/ai-tech-practice';")) {
  fail('astro.config.mjs', 'must import shared practice sidebar groups');
}
if (!astroConfig.includes("items: [{ slug: 'ai-tech-practice' }, ...sidebarGroups]")) {
  fail('astro.config.mjs', 'must consume shared practice sidebar groups');
}
if (/\{ slug: 'ai-tech-practice\/[^']+' \}/.test(astroConfig)) {
  fail('astro.config.mjs', 'must not hand-write practice article slugs');
}

for (const selector of [
  'data-practice-library',
  'data-practice-path',
  'data-practice-category',
  'data-practice-category-link',
  'data-practice-card',
  'data-practice-article-link',
  'data-practice-source-link',
  'data-practice-start',
]) {
  if (!componentBody.includes(selector)) fail('PracticeLibrary.astro', `missing ${selector}`);
}
if (!componentBody.includes("import { slugToHref } from '../utils/base-url';")) {
  fail('PracticeLibrary.astro', 'must use the shared base-path helper');
}
if (/client:|localStorage|<script/i.test(componentBody)) {
  fail('PracticeLibrary.astro', 'must stay server-rendered without client state');
}
if (
  !componentBody.includes('target="_blank"') ||
  !componentBody.includes('rel="noopener noreferrer"')
) {
  fail('PracticeLibrary.astro', 'external source links need target and rel');
}

for (const error of errors) console.error(`ERROR ${error}`);
if (errors.length > 0) process.exit(1);

console.log(
  `AI tech practice contract passed (${articleFiles.length} articles, ${sourceUrls.size} unique sources).`,
);
