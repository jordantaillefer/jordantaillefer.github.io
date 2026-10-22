export type MethodStep = {
  n: number;
  title: string;
  body: string;
  tool: string;
  visual: { kind: 'file' | 'checklist' | 'terminal' | 'diff' | 'note'; lines: string[] };
};

// Le pipeline ticket → PR du post LinkedIn « 9 étapes », sans le GIF de démo : les tests se font
// désormais sur des protos live (décision de Jordan du 2026-10-22).
export const method: MethodStep[] = [
  {
    n: 1,
    title: 'Contexte',
    body: "L'agent lit le ticket (Jira chez le client, Notion sur mes projets) et on en discute. C'est le moment où je réfléchis vraiment : est-ce qu'on a bien cerné le problème, est-ce qu'il manque des cas ?",
    tool: 'Tickets · MCP',
    visual: { kind: 'note', lines: ['PIL-1871 · accès à l’assistant IA', '→ qui y a droit ?', '→ et si le profil est inconnu ?'] },
  },
  {
    n: 2,
    title: 'Implémentation en TDD',
    body: "Le comportement attendu s'écrit d'abord en tests. L'agent explore le code et suit les patterns en place (CQRS, domain-driven) sans en inventer.",
    tool: 'Claude Code',
    visual: { kind: 'terminal', lines: ['✗ accès refusé si profil inconnu', '  → implémentation…', '✓ accès refusé si profil inconnu'] },
  },
  {
    n: 3,
    title: 'Couverture e2e',
    body: "Un fichier tient la liste des parcours déjà couverts. L'agent propose les nouveaux cas ; je valide avant qu'il les écrive.",
    tool: 'fichier de couverture',
    visual: { kind: 'checklist', lines: ['✓ publier une météo', '✓ exporter le tableau', '+ accès Albert par profil'] },
  },
  {
    n: 4,
    title: 'Tests e2e',
    body: 'Page Object, seed propre à chaque test, nettoyage derrière lui : les tests se relancent sans jamais se polluer.',
    tool: 'Playwright',
    visual: { kind: 'terminal', lines: ['seed · test · cleanup', '✓ 60 E2E'] },
  },
  {
    n: 5,
    title: 'Revue qualité',
    body: "Lint, revue de code par l'agent, corrections. Rien ne part avec un avertissement.",
    tool: 'code-review',
    visual: { kind: 'diff', lines: ['- if (profil) {', '+ if (!regleAcces(profil)) return refus'] },
  },
  {
    n: 6,
    title: 'Pull request',
    body: 'Commit, push, PR rédigée avec le lien du ticket et les tests documentés. Une revue automatique part en parallèle.',
    tool: 'GitHub',
    visual: { kind: 'file', lines: ['feature(PIL-1871): accès Albert lu en base'] },
  },
  {
    n: 7,
    title: 'Ticket à jour',
    body: 'Le ticket reçoit la PR et les critères d’acceptation, dans le gestionnaire du projet : Jira, Notion… Personne n’a à demander « c’est quoi le comportement attendu ? ».',
    tool: 'Tickets · MCP',
    visual: { kind: 'note', lines: ['PR · critères d’acceptation ✓'] },
  },
  {
    n: 8,
    title: 'La vraie review',
    body: 'Mes collègues arrivent sur une PR avec tout le contexte déjà là. Ils se concentrent sur ce qui mérite vraiment leur attention.',
    tool: 'humains',
    visual: { kind: 'note', lines: ["L'IA prépare le terrain.", 'Les humains décident.'] },
  },
];

export const methodQuote = "L'IA prépare le terrain. Les humains décident.";
export const methodClosing = "Pendant que l'agent avance, je travaille sur une autre feature dans un autre worktree.";
