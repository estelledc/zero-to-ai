/**
 * validate-cross-refs.ts
 * Validates frontmatter cross-references and learning path consistency.
 * Uses gray-matter for robust YAML parsing instead of fragile regex.
 * Directly imports learning-paths.ts for type-safe access to path data.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import matter from 'gray-matter';
import { learningPaths } from '../src/data/learning-paths';

const DOCS_DIR = 'src/content/docs';

// --- Helpers ---

/** Recursively collect all valid doc slugs from markdown/mdx files */
function collectSlugs(dir: string, base: string = ''): Set<string> {
  const slugs = new Set<string>();
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return slugs;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const slug of collectSlugs(fullPath, base ? `${base}/${entry.name}` : entry.name)) {
        slugs.add(slug);
      }
    } else if (extname(entry.name) === '.md' || extname(entry.name) === '.mdx') {
      const name = entry.name.replace(/\.(md|mdx)$/, '');
      const slug = base ? `${base}/${name}` : name;
      slugs.add(slug);
    }
  }

  return slugs;
}

/** Build path tutorials map from imported learning paths data */
function buildPathTutorialsMap(): Map<string, string[]> {
  const paths = new Map<string, string[]>();
  for (const path of learningPaths) {
    paths.set(path.slug, path.tutorials);
  }
  return paths;
}

// --- Main ---

function main() {
  const fullDocsDir = join(process.cwd(), DOCS_DIR);
  const allSlugs = collectSlugs(fullDocsDir);

  // Load learning path data (directly imported, type-safe)
  const pathTutorials = buildPathTutorialsMap();

  let fileCount = 0;
  let errorCount = 0;
  let warnCount = 0;

  function error(slug: string, msg: string) {
    console.error(`ERROR [${slug}] ${msg}`);
    errorCount++;
  }

  function warn(slug: string, msg: string) {
    console.warn(`WARN  [${slug}] ${msg}`);
    warnCount++;
  }

  // Validate each markdown file
  function validateDir(dir: string, base: string = '') {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        validateDir(fullPath, base ? `${base}/${entry.name}` : entry.name);
      } else if (extname(entry.name) === '.md' || extname(entry.name) === '.mdx') {
        fileCount++;
        const name = entry.name.replace(/\.(md|mdx)$/, '');
        const slug = base ? `${base}/${name}` : name;
        const raw = readFileSync(fullPath, 'utf-8');

        // Parse frontmatter with gray-matter
        let data: Record<string, unknown>;
        try {
          ({ data } = matter(raw));
        } catch (e) {
          error(slug, `frontmatter 解析失败: ${(e as Error).message}`);
          continue;
        }

        // Validate prerequisites (should reference existing doc slugs)
        const prerequisites = (data.prerequisites as string[]) || [];
        for (const ref of prerequisites) {
          if (!allSlugs.has(ref)) {
            error(slug, `prerequisites 引用不存在: ${ref}`);
          }
        }

        // Validate relatedContent slugs
        const relatedContent = (data.relatedContent as { slug: string; label: string }[]) || [];
        for (const { slug: ref } of relatedContent) {
          if (!allSlugs.has(ref)) {
            error(slug, `relatedContent 引用不存在: ${ref}`);
          }
        }
      }
    }
  }

  validateDir(fullDocsDir);

  // Validate learning path tutorial slugs exist in docs
  for (const [pathSlug, tutorials] of pathTutorials) {
    for (const tSlug of tutorials) {
      if (!allSlugs.has(tSlug)) {
        error(`learning-path:${pathSlug}`, `教程引用不存在: ${tSlug}`);
      }
    }
  }

  // Summary
  console.log('');
  if (errorCount > 0) {
    console.error(
      `交叉引用校验失败: ${errorCount} 个错误, ${warnCount} 个警告 (已检查 ${fileCount} 个文件)`,
    );
    process.exit(1);
  }

  if (warnCount > 0) {
    console.warn(`交叉引用校验通过 (有 ${warnCount} 个警告，已检查 ${fileCount} 个文件)`);
  } else {
    console.log(`交叉引用校验通过 (已检查 ${fileCount} 个文件)`);
  }
}

main();
