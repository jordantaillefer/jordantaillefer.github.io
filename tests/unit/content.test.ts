import { describe, expect, it } from 'vitest';
import { cases } from '../../src/content/cases';
import { method } from '../../src/content/method';
import { projects } from '../../src/content/projects';
import { site } from '../../src/content/site';
import { workstation } from '../../src/content/workstation';

describe('contenus', () => {
  it('8 étapes numérotées 1..8, la dernière est humaine', () => {
    expect(method.map((step) => step.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(method.at(-1)!.title).toMatch(/review/i);
  });

  it("plus de GIF de démo : les tests se font sur des protos live", () => {
    expect(JSON.stringify(method)).not.toMatch(/gif/i);
  });

  it("le gestionnaire de tickets n'est pas réduit à Jira", () => {
    const ticketSteps = method.filter((step) => /ticket/i.test(step.title + step.tool));
    expect(ticketSteps.length).toBeGreaterThan(0);
    expect(JSON.stringify(method)).toMatch(/Notion/);
  });

  it('le portfolio lui-même figure dans les projets', () => {
    expect(projects.some((project) => project.id === 'portfolio')).toBe(true);
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

  it("aucune affirmation sans source sur l'historique du chantier DSFR", () => {
    const dsfr = cases.find((study) => study.id === 'dsfr')!;
    expect(JSON.stringify(dsfr)).not.toMatch(/depuis des années/);
  });
});
