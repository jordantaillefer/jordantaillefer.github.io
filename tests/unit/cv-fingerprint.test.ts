import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cvFingerprint } from '../../scripts/snapshot/print';

describe('CV PDF', () => {
  it('le PDF commité correspond au contenu', () => {
    const recorded = readFileSync('public/cv/.fingerprint', 'utf8').trim();
    expect(recorded, 'Le CV a changé depuis la génération du PDF : relancer pnpm snapshot').toBe(cvFingerprint());
  });
});

describe('empreinte du CV', () => {
  it('couvre aussi la mise en page, pas seulement les données', async () => {
    const { CV_SOURCES } = await import('../../scripts/snapshot/print');
    for (const file of ['src/pages/cv.astro', 'src/layouts/Base.astro', 'src/components/Monogram.astro', 'src/styles/tokens.css', 'src/styles/global.css', 'src/data/snapshot.ts', 'src/data/snapshot.json']) {
      expect(CV_SOURCES).toContain(file);
    }
  });
});
