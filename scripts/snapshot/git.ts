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

export function readAuthorCommitDates(repo: string, authorPattern: string): string[] {
  return git(repo, ['log', '--all', `--author=${authorPattern}`, '--format=%aI']).split('\n').filter(Boolean);
}

export function readCommitCount(repo: string): number {
  return git(repo, ['log', '--all', '--format=%h']).split('\n').filter(Boolean).length;
}

/** Les lignes `Category:` que commit-billable écrit dans le corps des commits. */
export function readCategoryCounts(repo: string, authorPattern: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const line of git(repo, ['log', '--all', `--author=${authorPattern}`, '--format=%b']).split('\n')) {
    const match = /^Category:\s*(\S+)/.exec(line.trim());
    if (match) counts[match[1]] = (counts[match[1]] ?? 0) + 1;
  }
  return counts;
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
