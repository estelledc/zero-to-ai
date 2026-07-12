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
  const dotVisual = await dot.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return {
      height: style.height,
      transitionProperty: style.transitionProperty,
      width: style.width,
    };
  });
  expect(dotVisual.width).toBe('12px');
  expect(dotVisual.height).toBe('12px');
  expect(dotVisual.transitionProperty).not.toMatch(/width|height/);
});

test('reduced-motion 禁用位移插值但保留静态进度语义', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('claude-code/quickstart/?path=ai-coding-zero');
  const currentDot = page.locator('.path-progress__dot--current');
  const motion = await currentDot.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return {
      duration: style.transitionDuration,
      property: style.transitionProperty,
      transform: style.transform,
    };
  });
  expect(motion.transform).toMatch(/^matrix\(1\.333/);
  expect(motion.property).toBe('background-color');
  expect(motion.duration).toBe('0.18s');

  await page.getByRole('button', { name: '标记本篇为已完成' }).click();
  await expect(currentDot).toHaveClass(/path-progress__dot--completed/);
  await page.locator('.path-progress__next').click();

  const staticStates = await page.locator('.path-progress').evaluate((nav) => {
    const completed = nav.querySelector(
      '.path-progress__dot--completed:not(.path-progress__dot--current)',
    );
    const current = nav.querySelector('.path-progress__dot--current');
    return {
      completed: completed ? getComputedStyle(completed, '::after').transform : null,
      current: current ? getComputedStyle(current, '::after').transform : null,
    };
  });
  expect(staticStates.completed).toMatch(/^matrix\(1\.166/);
  expect(staticStates.current).toMatch(/^matrix\(1\.333/);
  expect(staticStates.completed).not.toBe(staticStates.current);
  expect(
    await page.locator('html').evaluate((element) => getComputedStyle(element).scrollBehavior),
  ).toBe('auto');

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
  await expect(page.locator('html')).toHaveAttribute('data-route-scroll-behavior', 'instant');
  const feedbackTiming = await page.locator('[data-route-output]').evaluate((element) => {
    const animation = element.getAnimations()[0];
    return animation?.effect?.getTiming().duration ?? 0;
  });
  expect(feedbackTiming).toBe(180);
});

test('不输出伪装成响应头的安全 meta', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('meta[http-equiv="X-Frame-Options"]')).toHaveCount(0);
  await expect(page.locator('meta[http-equiv="X-Content-Type-Options"]')).toHaveCount(0);
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(0);
});
