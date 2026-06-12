// scripts/validate-cross-refs.ts
// Validate frontmatter slug references in markdown files.
// Standalone Node.js script — no Astro build dependency.
import { readdirSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const DOCS_DIR = 'src/content/docs';
const DATA_DIR = 'src/data';

// Collect all valid slugs from markdown files (skipping .gitkeep)
function collectSlugs(dir: string, base: string = ''): Set<string> {
  const slugs = new Set<string>();
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return slugs;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
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

// Parse frontmatter array of strings (e.g., prerequisites: \n  - a\n  - b)
function parseFrontmatterArray(content: string, key: string): string[] {
  const regex = new RegExp(`${key}:\\s*\\n((?:\\s+-\\s+.+\\n?)*)`, 'm');
  const match = content.match(regex);
  if (!match) return [];
  return (match[1].match(/- (.+)/g) || []).map((s) => s.replace('- ', '').trim());
}

// Parse relatedContent (array of objects with slug + label)
function parseFrontmatterRelatedContent(content: string): { slug: string; label: string }[] {
  const result: { slug: string; label: string }[] = [];
  const section = content.match(/relatedContent:\s*\n((?:\s+- \{.+\}\n?)*)/m);
  if (!section) return result;
  const items = section[1].match(/\{slug: ["'](.+?)["'], label: ["'](.+?)["']\}/g);
  if (!items) return result;
  for (const item of items) {
    const slugMatch = item.match(/slug: ["'](.+?)["']/);
    const labelMatch = item.match(/label: ["'](.+?)["']/);
    if (slugMatch && labelMatch) {
      result.push({ slug: slugMatch[1], label: labelMatch[1] });
    }
  }
  return result;
}

// Parse tutorial slugs from learning-paths.ts source (no dynamic import needed)
function parseLearningPathTutorials(source: string): Map<string, string[]> {
  const paths = new Map<string, string[]>();
  // Match each path block: slug: '...', then tutorials: [ ... ]
  const pathRegex = /slug:\s*['"](.+?)['"][\s\S]*?tutorials:\s*\[([\s\S]*?)\]/g;
  let match;
  while ((match = pathRegex.exec(source)) !== null) {
    const pathSlug = match[1];
    const tutorialsBlock = match[2];
    const tutorialSlugs: string[] = [];
    const tutorialRegex = /['"](.+?)['"]/g;
    let tMatch;
    while ((tMatch = tutorialRegex.exec(tutorialsBlock)) !== null) {
      tutorialSlugs.push(tMatch[1]);
    }
    paths.set(pathSlug, tutorialSlugs);
  }
  return paths;
}

// --- Main ---
function main() {
  const fullDocsDir = join(process.cwd(), DOCS_DIR);
  const allSlugs = collectSlugs(fullDocsDir);

  // Load learning path slugs for validating learningPaths frontmatter
  const learningPathsSource = readFileSync(
    join(process.cwd(), DATA_DIR, 'learning-paths.ts'),
    'utf-8',
  );
  const pathTutorials = parseLearningPathTutorials(learningPathsSource);
  const pathSlugs = new Set(pathTutorials.keys());

  let fileCount = 0;
  let hasError = false;

  // Validate each markdown file's frontmatter references
  function validateDir(dir: string, base: string = '') {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        validateDir(fullPath, base ? `${base}/${entry.name}` : entry.name);
      } else if (extname(entry.name) === '.md' || extname(entry.name) === '.mdx') {
        fileCount++;
        const name = entry.name.replace(/\.(md|mdx)$/, '');
        const slug = base ? `${base}/${name}` : name;
        const content = readFileSync(fullPath, 'utf-8');

        const prerequisites = parseFrontmatterArray(content, 'prerequisites');
        const learningPathRefs = parseFrontmatterArray(content, 'learningPaths');
        const relatedContent = parseFrontmatterRelatedContent(content);

        // prerequisites reference doc slugs
        for (const ref of prerequisites) {
          if (!allSlugs.has(ref)) {
            console.error(`[${slug}] prerequisites 引用不存在: ${ref}`);
            hasError = true;
          }
        }
        // learningPaths reference learning path slugs (not doc slugs)
        for (const ref of learningPathRefs) {
          if (!pathSlugs.has(ref)) {
            console.error(`[${slug}] learningPaths 引用不存在: ${ref}`);
            hasError = true;
          }
        }
        // relatedContent slugs reference doc slugs
        for (const { slug: ref } of relatedContent) {
          if (!allSlugs.has(ref)) {
            console.error(`[${slug}] relatedContent 引用不存在: ${ref}`);
            hasError = true;
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
        console.error(`[learning-path:${pathSlug}] 教程引用不存在: ${tSlug}`);
        hasError = true;
      }
    }
  }

  if (hasError) {
    console.error(
      `\n交叉引用校验失败 (已检查 ${fileCount} 个文件)，请修正以上引用后重新构建。`,
    );
    process.exit(1);
  }

  console.log(`交叉引用校验通过 (已检查 ${fileCount} 个文件)。`);
}

main();
