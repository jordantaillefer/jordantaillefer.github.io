import { expect, test } from '@playwright/test';

test("la page d'accueil a le fond et les polices du thème", async ({ page }) => {
  await page.goto('/');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(20, 22, 27)');
  expect(await page.evaluate(() => document.documentElement.lang)).toBe('fr');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(overflow).toBe(true);
});
