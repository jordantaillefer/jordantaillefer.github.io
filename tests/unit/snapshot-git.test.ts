import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { readAuthorCommitDates } from '../../scripts/snapshot/git';
import { buildSnapshot } from '../../scripts/snapshot/run';

describe('lecture des dépôts', () => {
  it('dépôt absent → erreur explicite', () => {
    expect(() => readAuthorCommitDates('/nope', 'x')).toThrow(/\/nope/);
  });

  it("auteur sans commit → buildSnapshot refuse d'écrire", () => {
    const repo = mkdtempSync(join(tmpdir(), 'snapshot-'));
    const git = (...args: string[]) => execFileSync('git', args, { cwd: repo });
    git('init', '-q');
    writeFileSync(join(repo, 'a.txt'), 'a');
    git('add', '.');
    git('-c', 'user.name=Quelqu’un', '-c', 'user.email=autre@example.com', 'commit', '-qm', 'init');
    expect(() => buildSnapshot({ pilote: repo, kauri: repo }, new Date('2026-10-22'))).toThrow(/aucun commit/i);
  });
});
