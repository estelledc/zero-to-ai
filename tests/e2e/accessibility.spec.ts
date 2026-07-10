import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const route of [
  '',
  'paths/',
  'claude-code/quickstart/?path=ai-coding-zero',
  'codex/quickstart/?path=codex-zero',
]) {
  test(`axe WCAG A/AA: ${route || 'home'}`, async ({ page }) => {
    await page.goto(route || './');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('学习路径支持键盘与触控目标', async ({ page }) => {
  await page.goto('claude-code/quickstart/?path=ai-coding-zero');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();

  const completion = page.getByRole('button', { name: '标记本篇为已完成' });
  const box = await completion.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);

  const dot = page.locator('.path-progress__dot').first();
  const dotBox = await dot.boundingBox();
  expect(dotBox?.width ?? 0).toBeGreaterThanOrEqual(44);
  expect(dotBox?.height ?? 0).toBeGreaterThanOrEqual(44);
});

test('reduced-motion 关闭学习路径动画', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('claude-code/quickstart/?path=ai-coding-zero');
  const transition = await page
    .locator('.path-progress__dot')
    .first()
    .evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(transition)).toBe(0);
});

test('不输出伪装成响应头的安全 meta', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('meta[http-equiv="X-Frame-Options"]')).toHaveCount(0);
  await expect(page.locator('meta[http-equiv="X-Content-Type-Options"]')).toHaveCount(0);
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(0);
});
