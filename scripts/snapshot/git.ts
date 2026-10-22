import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function assertExists(path: string): void {
  if (!existsSync(path)) throw new Error(`Introuvable : ${path}. Le snapshot se lance sur la machine qui héberge les dépôts.`);
}

function git(repo: string, args: string[]): string {
  assertExists(repo);
  return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

export type Commit = { date: string; subject: string; category?: string };

const SQUASH = /\(#\d+\)\s*$/;

/**
 * Les commits de travail de l'auteur, sans doublons : `--all` voit aussi les commits
 * squash des PR (« … (#123) ») et les copies rebasées d'un même commit. Un lecteur
 * qui recompte sur le dépôt public doit retrouver un ordre de grandeur honnête.
 */
export function readAuthorCommits(repo: string, authorPattern: string): Commit[] {
  const seen = new Set<string>();
  const commits: Commit[] = [];
  const log = git(repo, ['log', '--all', `--author=${authorPattern}`, '--format=%x1e%aI%x1f%s%x1f%b']);
  for (const record of log.split('\x1e')) {
    if (!record.trim()) continue;
    const [date, subject, body = ''] = record.split('\x1f');
    if (SQUASH.test(subject)) continue;
    const key = `${date.slice(0, 10)} ${subject}`;
    if (seen.has(key)) continue;
    seen.add(key);
    commits.push({ date, subject, category: /^Category:\s*(\S+)/m.exec(body)?.[1] });
  }
  return commits;
}

export function readCommitCount(repo: string): number {
  return git(repo, ['log', '--all', '--format=%h']).split('\n').filter(Boolean).length;
}

export function countFiles(dir: string, pattern: RegExp): number {
  assertExists(dir);
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) count += countFiles(path, pattern);
    else if (pattern.test(entry.name)) count += 1;
  }
  return count;
}
