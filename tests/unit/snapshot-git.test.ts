import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readAuthorCommits } from '../../scripts/snapshot/git';
import { buildSnapshot } from '../../scripts/snapshot/run';

describe('lecture des dépôts', () => {
  it('dépôt absent → erreur explicite', () => {
    expect(() => readAuthorCommits('/nope', 'x')).toThrow(/\/nope/);
  });

  it('ne compte ni les commits squash de PR ni les copies rebasées', () => {
    const repo = mkdtempSync(join(tmpdir(), 'snapshot-'));
    const git = (...args: string[]) => execFileSync('git', args, { cwd: repo });
    const commit = (message: string, date: string) =>
      git('-c', 'user.name=Jordan Taillefer', '-c', 'user.email=j@example.com', 'commit', '-q', '--allow-empty', '-m', message, '--date', date);
    git('init', '-q');
    commit('feat: écran A\n\nCategory: feature', '2026-09-10T10:00:00+02:00');
    git('checkout', '-q', '-b', 'copie');
    commit('feat: écran A\n\nCategory: feature', '2026-09-10T15:00:00+02:00');
    commit('feat: écran A (#12)\n\nCategory: feature', '2026-09-11T10:00:00+02:00');
    commit('refactor: écran B\n\nCategory: refactor', '2026-09-12T10:00:00+02:00');
    const commits = readAuthorCommits(repo, 'Taillefer');
    expect(commits.map((c) => c.subject).sort()).toEqual(['feat: écran A', 'refactor: écran B']);
    expect(commits.find((c) => c.subject === 'feat: écran A')?.category).toBe('feature');
  });

  it("aucune catégorie trouvée → buildSnapshot refuse d'écrire des zéros", () => {
    const repo = mkdtempSync(join(tmpdir(), 'snapshot-'));
    const git = (...args: string[]) => execFileSync('git', args, { cwd: repo });
    git('init', '-q');
    git('-c', 'user.name=Jordan Taillefer', '-c', 'user.email=j@example.com', 'commit', '-q', '--allow-empty', '-m', 'feat: sans métadonnées', '--date', '2025-03-01T10:00:00+01:00');
    expect(() => buildSnapshot({ pilote: repo, kauri: repo, roots: [] }, new Date('2026-10-22'))).toThrow(/Category/);
  });

  it("auteur sans commit → buildSnapshot refuse d'écrire", () => {
    const repo = mkdtempSync(join(tmpdir(), 'snapshot-'));
    const git = (...args: string[]) => execFileSync('git', args, { cwd: repo });
    git('init', '-q');
    writeFileSync(join(repo, 'a.txt'), 'a');
    git('add', '.');
    git('-c', 'user.name=Quelqu’un', '-c', 'user.email=autre@example.com', 'commit', '-qm', 'init');
    expect(() => buildSnapshot({ pilote: repo, kauri: repo, roots: [] }, new Date('2026-10-22'))).toThrow(/aucun commit/i);
  });

  it('compte aussi tous les dépôts perso trouvés sous les dossiers racines', () => {
    const root = mkdtempSync(join(tmpdir(), 'racine-'));
    const commitIn = (name: string, messages: string[]) => {
      const repo = join(root, name);
      execFileSync('mkdir', ['-p', repo]);
      const git = (...args: string[]) => execFileSync('git', args, { cwd: repo });
      git('init', '-q');
      for (const message of messages) {
        git('-c', 'user.name=Jordan Taillefer', '-c', 'user.email=j@example.com', 'commit', '-q', '--allow-empty', '-m', message, '--date', '2025-03-01T10:00:00+01:00');
      }
      return repo;
    };
    const pilote = commitIn('pilote', ['feat: a\n\nCategory: feature', 'refactor: b\n\nCategory: refactor']);
    commitIn('perso', ['feat: c', 'feat: d', 'feat: e']);
    execFileSync('mkdir', ['-p', join(pilote, 'docs/superpowers/specs'), join(pilote, 'docs/superpowers/plans')]);
    execFileSync('mkdir', ['-p', join(root, 'pas-un-depot')]);
    const snapshot = buildSnapshot({ pilote, kauri: pilote, roots: [root] }, new Date('2026-10-22'));
    expect(snapshot.allProjects.repos).toBe(2);
    expect(snapshot.allProjects.totalCommits).toBe(5);
  });
});
