export type MonthPoint = { month: string; commits: number; partial: boolean };

function monthOf(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function nextMonth(month: string): string {
  const [y, m] = month.split('-').map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
}

/** Commits par mois, de `from` au mois de `now` inclus ; le mois en cours est partiel. */
export function monthlySeries(dates: string[], from: string, now: Date): MonthPoint[] {
  const counts = new Map<string, number>();
  // Le mois est celui de la date ISO telle qu'écrite : l'heure locale de l'auteur.
  for (const date of dates) counts.set(date.slice(0, 7), (counts.get(date.slice(0, 7)) ?? 0) + 1);
  const current = monthOf(now);
  const series: MonthPoint[] = [];
  for (let month = from; month <= current; month = nextMonth(month)) {
    series.push({ month, commits: counts.get(month) ?? 0, partial: month === current });
  }
  return series;
}

/** Pic des mois complets rapporté à la moyenne mensuelle de l'année de référence. */
export function multiplier(series: MonthPoint[], baselineYear: number): { ratio: number; baselineAvg: number; peak: MonthPoint } {
  const complete = series.filter((point) => !point.partial);
  const baseline = complete.filter((point) => point.month.startsWith(`${baselineYear}-`));
  if (baseline.length === 0) throw new Error(`Aucun mois complet en ${baselineYear}`);
  const baselineAvg = baseline.reduce((sum, point) => sum + point.commits, 0) / baseline.length;
  const peak = complete.reduce((best, point) => (point.commits > best.commits ? point : best));
  return { ratio: peak.commits / baselineAvg, baselineAvg, peak };
}
