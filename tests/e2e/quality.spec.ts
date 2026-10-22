import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = ['/', '/cv', '/mentions-legales'];

for (const path of PAGES) {
  test.describe(path, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
    });

    test('pas de scroll horizontal', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });

    test('axe sans violation sérieuse', async ({ page }) => {
      const { violations } = await new AxeBuilder({ page }).analyze();
      const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });

    test('un seul h1', async ({ page }) => {
      await expect(page.locator('h1')).toHaveCount(1);
    });
  });
}

test('poids raisonnable', async ({ page }) => {
  let jsBytes = 0;
  page.on('response', async (response) => {
    if (response.request().resourceType() === 'script') jsBytes += (await response.body()).length;
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(jsBytes).toBeLessThan(30 * 1024);
});
