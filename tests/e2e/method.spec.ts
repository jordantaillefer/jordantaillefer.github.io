import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

test('8 tuiles', async ({ page }) => {
  await expect(page.locator('#methode [data-step]')).toHaveCount(8);
});

test('la citation est présente', async ({ page }) => {
  await expect(page.locator('#methode')).toContainText('Les humains décident');
});
