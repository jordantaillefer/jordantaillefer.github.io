import { describe, expect, it } from 'vitest';
import { inkPath, parsePath, samplePath, type Point } from '../../src/lib/pen/nib';
import { MONOGRAM } from '../../src/lib/pen/monogram';

const J = MONOGRAM.strokes.find((s) => s.id === 'j')!;
const T_BAR = MONOGRAM.strokes.find((s) => s.id === 'tBar')!;

function quads(ink: string): Point[][] {
  return ink
    .split('Z')
    .filter((part) => part.trim())
    .map((part) => {
      const n = part.replace('M', '').split('L').map((pair) => pair.trim().split(/\s+/).map(Number));
      return n as Point[];
    });
}

function signedArea(q: Point[]): number {
  let area = 0;
  for (let i = 0; i < q.length; i++) {
    const [x1, y1] = q[i];
    const [x2, y2] = q[(i + 1) % q.length];
    area += x1 * y2 - x2 * y1;
  }
  return area;
}

describe('moteur plume', () => {
  it('parsePath rejette les commandes relatives', () => {
    expect(() => parsePath('m 0 0 c 1 1 2 2 3 3')).toThrow();
  });

  it('samplePath produit des longueurs croissantes', () => {
    const { lengths } = samplePath(J.d);
    expect(lengths[0]).toBe(0);
    for (let i = 1; i < lengths.length; i++) expect(lengths[i]).toBeGreaterThan(lengths[i - 1]);
  });

  it('inkPath est déterministe', () => {
    expect(inkPath(J.d)).toBe(inkPath(J.d));
  });

  it('chaque quad est orienté positivement', () => {
    for (const q of quads(inkPath(J.d))) expect(signedArea(q)).toBeGreaterThanOrEqual(0);
  });

  it("la plume s'affine aux extrémités", () => {
    const [first] = quads(inkPath(J.d));
    const [a, , , d] = first;
    const halfWidth = Math.hypot(a[0] - d[0], a[1] - d[1]) / 2;
    // Les coordonnées sortent arrondies au centième : on tolère cet arrondi.
    expect(Math.abs(halfWidth - 4.3 * 0.22)).toBeLessThan(0.02);
  });

  it("toute l'encre tient dans le viewBox", () => {
    for (const stroke of MONOGRAM.strokes) {
      for (const q of quads(inkPath(stroke.d))) {
        for (const [x, y] of q) {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(140);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(110);
        }
      }
    }
  });

  it('anti-π : la barre du T ne passe pas au-dessus du J', () => {
    const jCapMaxX = Math.max(...samplePath(J.d).points.filter(([, y]) => y < 40).map(([x]) => x));
    const barMinX = Math.min(...samplePath(T_BAR.d).points.map(([x]) => x));
    expect(barMinX).toBeGreaterThan(jCapMaxX);
  });
});
