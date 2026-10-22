import { execSync } from 'node:child_process';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { snapshotSchema, type Snapshot } from '../../src/data/snapshot.schema';
import { monthlySeries } from '../../src/lib/stats';
import { countFiles, readAuthorCommits, readCommitCount, type Commit } from './git';

export const PILOTE = join(homedir(), 'Documents/Missions/Projets/pilote-2');
export const KAURI = join(homedir(), 'Documents/Projets/Kauri-v3');
export const AUTHOR = 'aillefer';
/** Tous les dépôts git trouvés ici comptent dans le comptage « tous projets ». */
export const ROOTS = [join(homedir(), 'Documents/Projets'), join(homedir(), 'Documents/Missions/Projets')];
export const FROM = '2025-01';
export const SNAPSHOT_PATH = join(import.meta.dirname, '../../src/data/snapshot.json');

function isoDay(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function gitReposUnder(root: string): string[] {
  if (!existsSync(root)) throw new Error(`Introuvable : ${root}`);
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(root, entry.name, '.git')))
    .map((entry) => join(root, entry.name));
}

/** Les commits de l'auteur sur tous les dépôts, dédoublonnés d'un dépôt à l'autre. */
function allProjectsCommits(repos: string[]): Commit[] {
  const seen = new Set<string>();
  return repos.flatMap((repo) => readAuthorCommits(repo, AUTHOR)).filter((commit) => {
    const key = `${commit.date.slice(0, 10)} ${commit.subject}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Lit les dépôts ; échoue plutôt que d'écrire des zéros. */
export function buildSnapshot(paths: { pilote: string; kauri: string; roots: string[] }, now: Date): Snapshot {
  const commits = readAuthorCommits(paths.pilote, AUTHOR);
  if (commits.length === 0) throw new Error(`Aucun commit de « ${AUTHOR} » dans ${paths.pilote}`);
  const count = (category: string) => commits.filter((commit) => commit.category === category).length;
  const categories = { refactor: count('refactor'), feature: count('feature'), bugfix: count('bugfix') };
  if (categories.refactor === 0 || categories.feature === 0) {
    throw new Error(`Aucune ligne « Category: refactor|feature » dans les commits de ${paths.pilote} : format de commit-billable changé ?`);
  }
  const repos = paths.roots.flatMap(gitReposUnder);
  const everyRepo = repos.length ? repos : [paths.pilote];
  const all = allProjectsCommits(everyRepo);
  const docs = join(paths.kauri, 'docs/superpowers');
  return snapshotSchema.parse({
    measuredAt: isoDay(now),
    pilote: {
      series: monthlySeries(commits.map((commit) => commit.date), FROM, now),
      totalCommits: commits.length,
      categories,
    },
    allProjects: {
      repos: everyRepo.filter((repo) => readAuthorCommits(repo, AUTHOR).length > 0).length,
      totalCommits: all.length,
      series: monthlySeries(all.map((commit) => commit.date), FROM, now),
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
  const snapshot = buildSnapshot({ pilote: PILOTE, kauri: KAURI, roots: ROOTS }, now);
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
