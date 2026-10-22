import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { snapshotSchema, type Snapshot } from '../../src/data/snapshot.schema';
import { monthlySeries } from '../../src/lib/stats';
import { countFiles, readAuthorCommitDates, readCategoryCounts, readCommitCount } from './git';

export const PILOTE = join(homedir(), 'Documents/Missions/Projets/pilote-2');
export const KAURI = join(homedir(), 'Documents/Projets/Kauri-v3');
export const AUTHOR = 'aillefer';
export const FROM = '2025-01';
export const SNAPSHOT_PATH = join(import.meta.dirname, '../../src/data/snapshot.json');

function isoDay(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Lit les dépôts ; échoue plutôt que d'écrire des zéros. */
export function buildSnapshot(paths: { pilote: string; kauri: string }, now: Date): Snapshot {
  const dates = readAuthorCommitDates(paths.pilote, AUTHOR);
  if (dates.length === 0) throw new Error(`Aucun commit de « ${AUTHOR} » dans ${paths.pilote}`);
  const categories = readCategoryCounts(paths.pilote, AUTHOR);
  const docs = join(paths.kauri, 'docs/superpowers');
  return snapshotSchema.parse({
    measuredAt: isoDay(now),
    pilote: {
      series: monthlySeries(dates, FROM, now),
      totalCommits: dates.length,
      categories: { refactor: categories.refactor ?? 0, feature: categories.feature ?? 0, bugfix: categories.bugfix ?? 0 },
    },
    kauri: {
      commits: readCommitCount(paths.kauri),
      specs: countFiles(join(docs, 'specs'), /\.md$/),
      plans: countFiles(join(docs, 'plans'), /\.md$/),
      testFiles: countFiles(paths.kauri, /\.test\.tsx?$/),
    },
  });
}

export function writeSnapshot(now = new Date()): Snapshot {
  const snapshot = buildSnapshot({ pilote: PILOTE, kauri: KAURI }, now);
  writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + '\n');
  return snapshot;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const snapshot = writeSnapshot();
  console.log(`snapshot.json écrit (${snapshot.measuredAt}) : ${snapshot.pilote.totalCommits} commits Pilote, ${snapshot.kauri.commits} commits Kauri`);
  execSync('pnpm build', { cwd: join(import.meta.dirname, '../..'), stdio: 'inherit' });
  // Importé après l'écriture du snapshot, pour que l'empreinte du CV le prenne en compte.
  const { printAssets } = await import('./print');
  await printAssets();
  console.log('CV PDF, empreinte et image OG régénérés.');
}
