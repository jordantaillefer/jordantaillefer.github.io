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

test('la phrase de la courbe cite le dernier mois complet, pas un mois écrit en dur', async ({ page }) => {
  const reference = snapshot.pilote.series.filter((point) => !point.partial).at(-1)!;
  const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const [year, m] = reference.month.split('-').map(Number);
  const sentence = page.locator('#pilote .growth-sub');
  await expect(sentence).toContainText(`${reference.commits} en ${months[m - 1]} ${year}`);
});

test('les étiquettes de la courbe restent lisibles, même sur mobile', async ({ page }) => {
  const heights = await page.locator('#pilote .axis, #pilote .peak, #pilote .baseline-label').evaluateAll((labels) =>
    labels.map((label) => label.getBoundingClientRect().height),
  );
  expect(heights.length).toBeGreaterThan(0);
  expect(Math.min(...heights)).toBeGreaterThanOrEqual(10);
});
