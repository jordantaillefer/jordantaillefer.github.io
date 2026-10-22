import { expect, test } from '@playwright/test';

test('le CV porte le téléphone', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.locator('body')).toContainText('06 49 71 41 52');
  await expect(page.locator('body')).toContainText('994876902');
});

test('2 pages max', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'page.pdf est propre à Chromium');
  await page.goto('/cv');
  const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
  const pages = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? [];
  expect(pages.length).toBeGreaterThan(0);
  expect(pages.length).toBeLessThanOrEqual(2);
});

test('le PDF est servi', async ({ request }) => {
  const response = await request.get('/cv/jordan-taillefer-cv.pdf');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/pdf');
});

test('meta OG', async ({ page }) => {
  await page.goto('/');
  expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toMatch(/\/og\.png$/);
  expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toBeTruthy();
  expect(await page.locator('meta[property="og:description"]').getAttribute('content')).toBeTruthy();
});

test('deux feuilles, et rien ne déborde', async ({ page }) => {
  await page.goto('/cv');
  const sheets = page.locator('.sheet');
  await expect(sheets).toHaveCount(2);
  const overflows = await sheets.evaluateAll((all) =>
    all.flatMap((sheet, i) =>
      [...sheet.querySelectorAll('.sheet-main, .sheet-side')]
        .filter((col) => col.scrollHeight > col.clientHeight + 1)
        .map((col) => `feuille ${i + 1} : ${col.className}`),
    ),
  );
  expect(overflows).toEqual([]);
});

test('le parcours complet est présent', async ({ page }) => {
  await page.goto('/cv');
  for (const name of ['Pilote', 'OCTO Technology', 'DGFiP', 'Invivo', 'Excilys']) {
    await expect(page.locator('body')).toContainText(name);
  }
});
