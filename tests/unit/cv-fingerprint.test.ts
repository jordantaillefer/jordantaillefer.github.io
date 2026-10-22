import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { cvFingerprint } from '../../scripts/snapshot/print';

describe('CV PDF', () => {
  it('le PDF commité correspond au contenu', () => {
    const recorded = readFileSync('public/cv/.fingerprint', 'utf8').trim();
    expect(recorded, 'Le CV a changé depuis la génération du PDF : relancer pnpm snapshot').toBe(cvFingerprint());
  });
});
