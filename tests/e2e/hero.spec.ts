import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

test('le hero porte le positionnement', async ({ page }) => {
  const h1 = page.locator('h1');
  await expect(h1).toContainText('Je pense le produit');
  await expect(h1).toContainText("L'IA accélère le reste");
});

test('un seul bouton à dégradé dans le hero', async ({ page }) => {
  await expect(page.locator('#hero [data-variant="primary"]')).toHaveCount(1);
});

test('lien CV vers le PDF', async ({ page }) => {
  await expect(page.locator('header a[href="/cv/jordan-taillefer-cv.pdf"]').first()).toBeAttached();
});

test("pas de téléphone sur l'accueil", async ({ page }) => {
  expect(await page.content()).not.toMatch(/06\s?49/);
});

test('date de mesure affichée', async ({ page }) => {
  await expect(page.locator('#hero')).toContainText('mesuré le');
});
