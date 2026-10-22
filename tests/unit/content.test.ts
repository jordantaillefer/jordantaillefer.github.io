import { describe, expect, it } from 'vitest';
import { cases } from '../../src/content/cases';
import { method } from '../../src/content/method';
import { projects } from '../../src/content/projects';
import { site } from '../../src/content/site';
import { workstation } from '../../src/content/workstation';

describe('contenus', () => {
  it('9 étapes numérotées 1..9, la dernière est humaine', () => {
    expect(method.map((step) => step.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(method[8].title).toMatch(/review/i);
  });

  it('pas de téléphone hors du CV', () => {
    const publicContent = JSON.stringify({ site, cases, method, workstation, projects });
    expect(publicContent).not.toMatch(/06\s?49|0649/);
  });

  it('My Flow Time est exclu', () => {
    expect(projects.some((project) => /flow time/i.test(project.name))).toBe(false);
  });

  it('les liens sont en https', () => {
    const links = [
      ...projects.flatMap((project) => [project.url, project.repo]),
      ...workstation.tools.map((tool) => tool.url),
      site.contact.linkedin,
      site.contact.github,
    ].filter(Boolean);
    for (const link of links) expect(link).toMatch(/^https:\/\//);
  });

  it('chaque étude de cas a au moins 3 métriques et une leçon', () => {
    for (const study of cases) {
      expect(study.metrics.length).toBeGreaterThanOrEqual(3);
      expect(study.lesson.length).toBeGreaterThan(0);
    }
  });
});
