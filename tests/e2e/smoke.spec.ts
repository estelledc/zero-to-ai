import { expect, test } from '@playwright/test';

const basePath = '/zero-to-ai/';

test('首页和学习路径保留 base path', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle(/Zero to AI/);
  await expect(page.getByRole('heading', { level: 1, name: 'Zero to AI' })).toBeVisible();

  const pathLinks = page.locator(`a[href^="${basePath}paths/"]`);
  expect(await pathLinks.count()).toBeGreaterThan(0);
  await page.goto('paths/');
  await expect(page.getByRole('heading', { level: 1, name: '学习路径' })).toBeVisible();
  await expect(page.locator('#codex-zero')).toContainText('Codex 零基础完整路线');
});

test('首页展示项目证据并接回个人作品集', async ({ page }) => {
  await page.goto('./');

  await expect(page.getByRole('link', { name: '返回 Jason 的作品集' })).toHaveAttribute(
    'href',
    'https://estelledc.github.io/',
  );
  await expect(
    page.getByRole('heading', { level: 2, name: '把零散教程做成一套可验证的学习系统' }),
  ).toBeVisible();
  await expect(page.getByText('Maintained · v2.0')).toBeVisible();
  await expect(page.getByRole('link', { name: '查看学习路径' })).toHaveAttribute(
    'href',
    `${basePath}paths/`,
  );
});

test('首页输出 canonical、分享元信息与结构化数据', async ({ page }) => {
  await page.goto('./');

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://estelledc.github.io/zero-to-ai/',
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://estelledc.github.io/zero-to-ai/og-default.png',
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');

  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  expect(jsonLd).toContain('LearningResource');
  expect(jsonLd).toContain('https://github.com/estelledc');
});

test('移动端首页可直接访问作品集导航', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', '只验证移动端导航');
  await page.goto('./');

  await expect(page.getByRole('link', { name: '几分钟了解是否适合你' })).toBeInViewport();
  const viewport = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth);

  await page.locator('summary[aria-label="打开作品集导航"]').click();
  const showcaseNavigation = page.getByRole('navigation', { name: '作品集快捷导航' });
  await expect(showcaseNavigation).toBeVisible();
  await expect(showcaseNavigation.getByRole('link', { name: '简历', exact: true })).toHaveAttribute(
    'href',
    'https://estelledc.github.io/resume/',
  );
});

test('Codex 路线可从首页进入并保留路径上下文', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'Codex 教程' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Codex 零基础路线' })).toBeVisible();

  await page.goto('paths/');
  await page.locator('#codex-zero .path-card__cta').click();
  await expect(page).toHaveURL(/methodology\/basics\/?\?path=codex-zero$/);
  await expect(page.getByText('Codex 零基础完整路线')).toBeVisible();
});

test('进度必须由学习者显式完成，并兼容旧 key', async ({ page }) => {
  const legacyKey = 'path:ai-coding-zero:claude-code/quickstart';
  const currentKey = 'zero-to-ai:progress:v1:ai-coding-zero:claude-code%2Fquickstart';
  await page.goto('paths/');
  await page.evaluate(
    ({ legacyKey }) => {
      localStorage.setItem(legacyKey, JSON.stringify({ v: 1 }));
      localStorage.setItem('path:someone-else:data', 'keep-me');
    },
    { legacyKey },
  );
  await page.goto('claude-code/quickstart/?path=ai-coding-zero');
  await expect(page.getByRole('button', { name: '标记本篇为已完成' })).toBeVisible();
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), currentKey))
    .toContain('"status":"visited"');
  expect(await page.evaluate((key) => localStorage.getItem(key), legacyKey)).toBeNull();

  await page.getByRole('button', { name: '标记本篇为已完成' }).click();
  await expect(page.getByRole('button', { name: '已完成本篇（点击撤销）' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.goto('paths/');
  await expect(page.locator('[data-path-slug="ai-coding-zero"] [data-completed]')).toHaveCount(1);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: '重置全部学习进度' }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), 'path:someone-else:data')).toBe(
    'keep-me',
  );
});

test('Pagefind 搜索可打开并返回结果', async ({ page }) => {
  await page.goto('./');
  const searchButton = page.getByRole('button', { name: '搜索' });
  await expect(searchButton).toBeEnabled();
  await searchButton.click();
  const searchDialog = page.getByRole('dialog', { name: '搜索' });
  await expect(searchDialog).toBeVisible();
  const searchbox = searchDialog.getByRole('textbox', { name: '搜索' });
  await searchbox.fill('安装 Claude Code');
  await expect(searchDialog.locator('.pagefind-ui__result-link').first()).toBeVisible();
});

test('Pagefind 可检索 Codex 安装教程', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium', '搜索索引只需验证一次');
  await page.goto('./');
  await page.getByRole('button', { name: '搜索' }).click();
  const searchDialog = page.getByRole('dialog', { name: '搜索' });
  await searchDialog.getByRole('textbox', { name: '搜索' }).fill('codex 安装');
  await expect(searchDialog.locator('.pagefind-ui__result-link').first()).toBeVisible();
});

test('桌面主题切换可用', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium', '移动端主题控件收纳在导航中');
  await page.goto('./');
  const themeSelect = page.locator('select:not([name])');
  expect(await themeSelect.count()).toBe(1);
  await themeSelect.selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('首页选择器给出一个可执行的第一项任务', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => {
    Element.prototype.scrollIntoView = function (options) {
      const behavior = typeof options === 'object' ? options.behavior : undefined;
      document.documentElement.dataset.routeScrollBehavior = behavior ?? 'auto';
    };
  });
  await page.locator('select[name="tool"]').selectOption('codex');
  await page.locator('select[name="budget"]').selectOption('evaluate');
  await page.locator('select[name="experience"]').selectOption('new');
  await page.locator('select[name="goal"]').selectOption('safe');
  await page.getByRole('button', { name: '给我第一项任务' }).click();

  const result = page.locator('[data-route-output]');
  await expect(result.locator('[data-route-title]')).toContainText('Codex');
  await expect(result.locator('[data-route-link]')).toHaveAttribute(
    'href',
    '/zero-to-ai/codex/first-task/',
  );
  await expect(page.locator('html')).toHaveAttribute('data-route-scroll-behavior', 'smooth');

  await page.getByRole('button', { name: '给我第一项任务' }).press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-route-scroll-behavior', 'instant');
});

test('自定义 404 可用', async ({ page }) => {
  await page.goto('./');
  const response = await page.goto('this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: '页面未找到' })).toBeVisible();
  await expect(page.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', basePath);
});

test('RSS 和 sitemap 在 base path 下可访问', async ({ request }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium', '静态资源只需请求一次');
  const rss = await request.get('rss.xml');
  expect(rss.ok()).toBeTruthy();
  expect(await rss.text()).toContain('<rss');

  const sitemap = await request.get('sitemap-index.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain('<sitemapindex');
});
