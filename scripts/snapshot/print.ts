import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';
import { cases } from '../../src/content/cases';
import { cv } from '../../src/content/cv';
import { method } from '../../src/content/method';
import { projects } from '../../src/content/projects';
import { site } from '../../src/content/site';
import { workstation } from '../../src/content/workstation';

const ROOT = join(import.meta.dirname, '../..');
const PORT = 4398;
export const CV_PDF = join(ROOT, 'public/cv/jordan-taillefer-cv.pdf');
export const CV_FINGERPRINT = join(ROOT, 'public/cv/.fingerprint');
export const OG_PNG = join(ROOT, 'public/og.png');

/** Les fichiers dont dépend le rendu de /cv, en plus des modules de contenu. */
export const CV_SOURCES = [
  'src/pages/cv.astro',
  'src/layouts/Base.astro',
  'src/components/Monogram.astro',
  'src/lib/pen/render.ts',
  'src/styles/tokens.css',
  'src/styles/global.css',
  'src/data/snapshot.ts',
  'src/data/snapshot.json',
];

/** Empreinte de ce que montre /cv (données et mise en page) : si elle change, le PDF commité est périmé. */
export function cvFingerprint(): string {
  const hash = createHash('sha256').update(JSON.stringify({ site, cv, cases, method, projects, workstation }));
  for (const file of CV_SOURCES) hash.update(readFileSync(join(ROOT, file)));
  return hash.digest('hex');
}

async function waitFor(url: string, timeoutMs = 20_000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // le serveur démarre encore
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Le preview ne répond pas sur ${url}`);
}

/** Imprime /cv en PDF et capture /og ; suppose un `astro build` à jour. */
export async function printAssets(): Promise<void> {
  const server = spawn('pnpm', ['exec', 'astro', 'preview', '--port', String(PORT), '--ignore-lock'], { cwd: ROOT, stdio: 'ignore', detached: true });
  const base = `http://localhost:${PORT}`;
  try {
    await waitFor(`${base}/cv`);
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`${base}/cv`);
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: CV_PDF, format: 'A4', printBackground: true, preferCSSPageSize: true });

    const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await og.goto(`${base}/og`);
    await og.evaluate(() => document.fonts.ready);
    await og.screenshot({ path: OG_PNG });
    await browser.close();
    writeFileSync(CV_FINGERPRINT, cvFingerprint() + '\n');
  } finally {
    process.kill(-server.pid!, 'SIGTERM');
  }
}
