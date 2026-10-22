import { expect, test } from '@playwright/test';
import snapshot from '../../src/data/snapshot.json' with { type: 'json' };

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

const visibleChart = '#pilote svg[data-chart]:visible';

test('desktop : une barre par mois ; mobile : les 12 derniers, sans défilement', async ({ page }) => {
  const mobile = test.info().project.name === 'mobile';
  const expected = mobile ? 12 : snapshot.pilote.series.length;
  await expect(page.locator(`${visibleChart} rect[data-month]`)).toHaveCount(expected);
  const reference = snapshot.pilote.series.filter((point) => !point.partial).at(-1)!;
  await expect(page.locator(`${visibleChart} rect[data-month="${reference.month}"]`)).toHaveCount(1);
  const scrolls = await page.locator('#pilote .chart').evaluate((chart) => chart.scrollWidth > chart.clientWidth + 1);
  expect(scrolls).toBe(false);
});

test('le mois en cours est marqué partiel', async ({ page }) => {
  const partial = page.locator(`${visibleChart} rect[data-partial]`);
  await expect(partial).toHaveCount(1);
  await expect(partial).toHaveAttribute('data-month', snapshot.pilote.series.at(-1)!.month);
});

test('les deux études de cas', async ({ page }) => {
  await expect(page.locator('#pilote [data-case="dsfr"]')).toBeVisible();
  await expect(page.locator('#pilote [data-case="emotion"]')).toBeVisible();
  await expect(page.locator('#pilote [data-case="dsfr"]')).toContainText('240');
});

test('graphique accessible', async ({ page }) => {
  const label = await page.locator(visibleChart).getAttribute('aria-label');
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
  const heights = await page.locator(`${visibleChart} .axis, ${visibleChart} .peak, ${visibleChart} .baseline-label`).evaluateAll((labels) =>
    labels.map((label) => label.getBoundingClientRect().height),
  );
  expect(heights.length).toBeGreaterThan(0);
  expect(Math.min(...heights)).toBeGreaterThanOrEqual(10);
});
