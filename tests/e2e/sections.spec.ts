import { expect, test } from '@playwright/test';

test.describe('accueil', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
  });

  test('le mock iTerm a 3 onglets à gauche et 3 à droite', async ({ page }) => {
    await expect(page.locator('#poste [data-pane="left"] [data-tab]')).toHaveCount(3);
    await expect(page.locator('#poste [data-pane="right"] [data-tab]')).toHaveCount(3);
  });

  test('reduced motion fige les états', async ({ page }) => {
    const running = await page.locator('#poste [data-tab]').evaluateAll((tabs) =>
      tabs.flatMap((tab) => tab.getAnimations({ subtree: true })).length,
    );
    expect(running).toBe(0);
  });

  test('Kauri en tête avec lien', async ({ page }) => {
    const first = page.locator('#projets [data-project]').first();
    await expect(first).toHaveAttribute('data-project', 'kauri');
    await expect(first.locator('a[href="https://kauri-fit.ai"]')).toBeAttached();
  });

  test('contact', async ({ page }) => {
    await expect(page.locator('a[href="mailto:consulting@jordantaillefer.com"]').first()).toBeAttached();
  });
});

test('mentions légales', async ({ page }) => {
  await page.goto('/mentions-legales');
  await expect(page.locator('main')).toContainText('994876902');
  await expect(page.locator('main')).toContainText('Cloudflare');
});
