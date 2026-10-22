import { describe, expect, it } from 'vitest';
import { monthlySeries, multiplier } from '../../src/lib/stats';

function datesFor(month: string, count: number): string[] {
  return Array.from({ length: count }, () => `${month}-15T10:00:00+02:00`);
}

describe('courbe mensuelle', () => {
  it('inclut les mois vides', () => {
    const series = monthlySeries([...datesFor('2025-01', 2), ...datesFor('2025-03', 1)], '2025-01', new Date('2025-03-20'));
    expect(series.map((p) => [p.month, p.commits])).toEqual([
      ['2025-01', 2],
      ['2025-02', 0],
      ['2025-03', 1],
    ]);
  });

  it('marque le mois courant comme partiel', () => {
    const series = monthlySeries(datesFor('2026-10', 3), '2026-09', new Date('2026-10-22T12:00:00'));
    expect(series.at(-1)).toEqual({ month: '2026-10', commits: 3, partial: true });
    expect(series[0].partial).toBe(false);
  });

  it('le multiplicateur ignore le mois partiel', () => {
    const dates = [
      ...Array.from({ length: 12 }, (_, i) => datesFor(`2025-${String(i + 1).padStart(2, '0')}`, 40)).flat(),
      ...datesFor('2026-09', 458),
      ...datesFor('2026-10', 900),
    ];
    const series = monthlySeries(dates, '2025-01', new Date('2026-10-22T12:00:00'));
    const result = multiplier(series, 2025);
    expect(result.peak.month).toBe('2026-09');
    expect(result.baselineAvg).toBe(40);
    expect(Math.floor(result.ratio)).toBe(11);
  });
});
