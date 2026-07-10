/** Validate frontmatter references, Markdown links/anchors, learning paths and search synonyms. */
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, posix, relative } from 'node:path';
import matter from 'gray-matter';
import { learningPaths } from '../src/data/learning-paths';
import { synonymMap } from '../src/data/search-synonyms';
import { canonicalSlug } from '../src/utils/slug';

const DOCS_DIR = join(process.cwd(), 'src/content/docs');
const GENERATED_ROUTES = new Set(['paths', '404', 'rss.xml', 'sitemap-index.xml']);

type DocumentInfo = {
  slug: string;
  file: string;
  linkBase: string;
  body: string;
  headings: Set<string>;
};

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) return [];
    const absolute = join(dir, entry.name);
    if (entry.isDirectory()) return walk(absolute);
    return ['.md', '.mdx'].includes(extname(entry.name)) ? [absolute] : [];
  });
}

function headingId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function headingsFor(body: string): Set<string> {
  const headings = new Set<string>();
  const counts = new Map<string, number>();
  for (const match of body.matchAll(/^#{1,6}\s+(.+?)\s*#*$/gm)) {
    const base = headingId(match[1]);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    headings.add(count === 0 ? base : `${base}-${count}`);
  }
  return headings;
}

function resolveLink(
  currentSlug: string,
  linkBase: string,
  rawTarget: string,
): { slug: string; anchor: string } | null {
  const target = rawTarget.trim().replace(/^<|>$/g, '');
  if (/^(https?:|mailto:|tel:|javascript:)/i.test(target)) return null;
  const [withoutFragment, fragment = ''] = target.split('#', 2);
  const pathname = withoutFragment.split('?', 1)[0];
  if (!pathname) return { slug: currentSlug, anchor: decodeURIComponent(fragment) };

  let resolved: string;
  if (pathname.startsWith('/')) {
    resolved = pathname.replace(/^\/zero-to-ai\/?/, '').replace(/^\//, '');
  } else {
    resolved = posix.normalize(posix.join(linkBase, pathname));
  }
  resolved = resolved.replace(/\.(md|mdx|html)$/, '').replace(/\/$/, '');
  return { slug: canonicalSlug(resolved), anchor: decodeURIComponent(fragment) };
}

const documents = new Map<string, DocumentInfo>();
for (const file of walk(DOCS_DIR)) {
  const relativePath = relative(DOCS_DIR, file).replaceAll('\\', '/');
  const slug = canonicalSlug(relativePath.replace(/\.(md|mdx)$/, ''));
  const linkBase = posix.dirname(relativePath.replace(/\.(md|mdx)$/, ''));
  const parsed = matter(readFileSync(file, 'utf8'));
  documents.set(slug, {
    slug,
    file,
    linkBase: linkBase === '.' ? '' : linkBase,
    body: parsed.content,
    headings: headingsFor(parsed.content),
  });
}

let errors = 0;
function fail(owner: string, message: string): void {
  console.error(`ERROR [${owner || 'index'}] ${message}`);
  errors++;
}

for (const document of documents.values()) {
  const parsed = matter(readFileSync(document.file, 'utf8'));
  for (const reference of (parsed.data.prerequisites as string[] | undefined) ?? []) {
    if (!documents.has(canonicalSlug(reference)))
      fail(document.slug, `prerequisites 引用不存在: ${reference}`);
  }
  for (const related of (parsed.data.relatedContent as
    Array<{ slug: string; label: string }> | undefined) ?? []) {
    if (!documents.has(canonicalSlug(related.slug))) {
      fail(document.slug, `relatedContent 引用不存在: ${related.slug}`);
    }
  }

  const withoutCode = document.body.replace(/```[\s\S]*?```/g, '');
  for (const match of withoutCode.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const resolved = resolveLink(document.slug, document.linkBase, match[1]);
    if (!resolved) continue;
    const target = documents.get(resolved.slug);
    if (!target) {
      if (!GENERATED_ROUTES.has(resolved.slug) && !resolved.slug.startsWith('downloads/')) {
        fail(document.slug, `正文链接不存在: ${match[1]}`);
      }
      continue;
    }
    if (resolved.anchor && !target.headings.has(headingId(resolved.anchor))) {
      fail(document.slug, `正文锚点不存在: ${match[1]}`);
    }
  }
}

for (const path of learningPaths) {
  if (new Set(path.tutorials).size !== path.tutorials.length) {
    fail(`learning-path:${path.slug}`, '教程列表包含重复项');
  }
  for (const tutorial of path.tutorials) {
    if (!documents.has(canonicalSlug(tutorial))) {
      fail(`learning-path:${path.slug}`, `教程引用不存在: ${tutorial}`);
    }
  }
}

for (const key of Object.keys(synonymMap)) {
  if (!documents.has(canonicalSlug(key))) fail(`search-synonyms:${key}`, '同义词映射 key 不存在');
}

if (errors > 0) {
  console.error(`\n交叉引用校验失败: ${errors} 个错误 (已检查 ${documents.size} 个文件)`);
  process.exit(1);
}
console.log(`\n交叉引用校验通过 (已检查 ${documents.size} 个文件，含正文链接与锚点)`);
