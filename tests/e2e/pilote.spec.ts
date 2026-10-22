import { expect, test } from '@playwright/test';
import snapshot from '../../src/data/snapshot.json' with { type: 'json' };

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

test('une barre par mois', async ({ page }) => {
  await expect(page.locator('#pilote rect[data-month]')).toHaveCount(snapshot.pilote.series.length);
});

test('le mois en cours est marqué partiel', async ({ page }) => {
  const partial = page.locator('#pilote rect[data-partial]');
  await expect(partial).toHaveCount(1);
  await expect(partial).toHaveAttribute('data-month', snapshot.pilote.series.at(-1)!.month);
});

test('les deux études de cas', async ({ page }) => {
  await expect(page.locator('#pilote [data-case="dsfr"]')).toBeVisible();
  await expect(page.locator('#pilote [data-case="emotion"]')).toBeVisible();
  await expect(page.locator('#pilote [data-case="dsfr"]')).toContainText('240');
});

test('graphique accessible', async ({ page }) => {
  const label = await page.locator('#pilote svg[data-chart]').getAttribute('aria-label');
  expect(label?.length ?? 0).toBeGreaterThan(0);
});
