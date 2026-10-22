import { describe, expect, it } from 'vitest';
import { cv } from '../../src/content/cv';

describe('contenu du CV', () => {
  it('raconte un vrai parcours, du plus récent au plus ancien', () => {
    expect(cv.experiences.map((e) => e.company)).toEqual(['Freelance', 'OCTO Technology', 'Excilys']);
  });

  it('détaille les missions OCTO avec leurs réalisations', () => {
    const octo = cv.experiences.find((e) => e.company === 'OCTO Technology')!;
    expect(octo.missions.map((m) => m.client)).toEqual(['DITP', 'Maison de luxe', 'DGFiP', 'DGAC', 'Invivo']);
    for (const mission of octo.missions) {
      expect(mission.context.length).toBeGreaterThan(20);
      expect(mission.highlights.length).toBeGreaterThanOrEqual(2);
      expect(mission.stack.length).toBeGreaterThan(0);
    }
  });

  it('la mission actuelle porte au moins 5 réalisations', () => {
    const freelance = cv.experiences[0];
    expect(freelance.missions[0].client).toBe('Pilote · DITP');
    expect(freelance.missions[0].highlights.length).toBeGreaterThanOrEqual(5);
  });

  it('pnpm et Turborepo sont deux tags distincts', () => {
    expect(cv.stack).toContain('pnpm');
    expect(cv.stack).toContain('Turborepo');
  });

  it("plus de GIF dans les réalisations", () => {
    expect(JSON.stringify(cv.experiences)).not.toMatch(/gif/i);
  });
});
