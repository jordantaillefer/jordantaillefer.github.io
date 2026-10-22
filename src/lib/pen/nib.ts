// Une plume biseautée simulée : chaque pas de la ligne centrale balaie le segment
// incliné de la plume. Pleins et déliés viennent seuls de l'angle, comme à la main.

export type Point = [number, number];

const DEFAULT_NIB = 4.3;
const DEFAULT_ANGLE_DEG = -35;

/** Segments cubiques d'un chemin `M x y C …` absolu. */
export function parsePath(d: string): Point[][] {
  if (/[^MC\d\s.,-]/.test(d)) throw new Error(`Seules les commandes M et C absolues sont acceptées : ${d}`);
  const n = (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  const segments: Point[][] = [];
  let start: Point = [n[0], n[1]];
  for (let i = 2; i + 5 < n.length; i += 6) {
    const segment: Point[] = [start, [n[i], n[i + 1]], [n[i + 2], n[i + 3]], [n[i + 4], n[i + 5]]];
    segments.push(segment);
    start = segment[3];
  }
  return segments;
}

function bezier([p0, p1, p2, p3]: Point[], t: number): Point {
  const m = 1 - t;
  const a = m * m * m, b = 3 * m * m * t, c = 3 * m * t * t, e = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + e * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + e * p3[1]];
}

export function samplePath(d: string, stepsPerSegment = 70): { points: Point[]; lengths: number[] } {
  const points: Point[] = [];
  parsePath(d).forEach((segment, k) => {
    for (let i = k ? 1 : 0; i <= stepsPerSegment; i++) points.push(bezier(segment, i / stepsPerSegment));
  });
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  }
  return { points, lengths };
}

/** La forme de l'encre : une suite de quads orientés positivement, pour que nonzero les remplisse tous. */
export function inkPath(d: string, opts: { nib?: number; angleDeg?: number } = {}): string {
  const nib = opts.nib ?? DEFAULT_NIB;
  const angle = ((opts.angleDeg ?? DEFAULT_ANGLE_DEG) * Math.PI) / 180;
  const u: Point = [Math.cos(angle), Math.sin(angle)];
  const { points, lengths } = samplePath(d);
  const total = lengths[lengths.length - 1];
  // La plume se pose puis se lève : attaque et sortie s'affinent.
  const half = (i: number) => nib * (0.22 + 0.78 * Math.max(0, Math.min(1, lengths[i] / 7, (total - lengths[i]) / 11)));

  let out = '';
  for (let i = 0; i < points.length - 1; i++) {
    const [a, b] = [points[i], points[i + 1]];
    const [ha, hb] = [half(i), half(i + 1)];
    const quad: Point[] = [
      [a[0] + u[0] * ha, a[1] + u[1] * ha],
      [b[0] + u[0] * hb, b[1] + u[1] * hb],
      [b[0] - u[0] * hb, b[1] - u[1] * hb],
      [a[0] - u[0] * ha, a[1] - u[1] * ha],
    ];
    let area = 0;
    for (let j = 0; j < 4; j++) area += quad[j][0] * quad[(j + 1) % 4][1] - quad[(j + 1) % 4][0] * quad[j][1];
    if (area < 0) quad.reverse();
    out += 'M' + quad.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L') + 'Z';
  }
  return out;
}
