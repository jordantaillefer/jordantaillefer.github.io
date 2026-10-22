import { expect, test } from '@playwright/test';

test.describe('écran de lancement', () => {
  test('joue à la première visite puis disparaît', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#launch')).toBeVisible();
    await expect(page.locator('#launch')).toHaveCount(0, { timeout: 3000 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('ne rejoue pas dans la même session', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#launch')).toHaveCount(0, { timeout: 3000 });
    await page.reload();
    await expect(page.locator('#launch')).toHaveCount(0);
    await page.goto('/cv');
    await page.goto('/');
    await expect(page.locator('#launch')).toHaveCount(0);
  });

  test('se passe au clavier', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#launch')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#launch')).toHaveCount(0, { timeout: 500 });
  });

  test('ne joue pas sous reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('#launch')).toHaveCount(0);
    await expect(page.locator('h1')).toBeVisible();
  });

  test.describe('sans JS', () => {
    test.use({ javaScriptEnabled: false });
    test('le contenu est visible sans overlay', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#launch')).toHaveCount(0);
    });
  });

  test('un sessionStorage qui lève ne bloque pas la page', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'sessionStorage', {
        get() {
          throw new Error('stockage bloqué');
        },
      });
    });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#launch')).toHaveCount(0, { timeout: 3000 });
  });
});
