export type Project = {
  id: string;
  name: string;
  pitch: string;
  stack: string[];
  facts: string[];
  url?: string;
  repo?: string;
  featured?: boolean;
};

// Sélection validée dans la spec (« Sélection des projets »). Les chiffres de Kauri viennent du snapshot.
export const projects: Project[] = [
  {
    id: 'kauri',
    name: 'Kauri',
    pitch: 'Séances, programmes et analyse multisport, sur le web comme sur le téléphone. Les activités arrivent de Strava et de Garmin ; Kauri planifie, rapproche et analyse.',
    stack: ['Turborepo', 'Hono · CQRS', 'Prisma', 'React', 'Expo', 'Zod partagé', 'Design tokens'],
    facts: [
      'Un monorepo, trois clients (API, web, mobile) qui partagent schémas et jetons de design.',
      'Les jetons sont la source unique du web et du mobile ; un test rend toute dérive impossible.',
    ],
    url: 'https://kauri-fit.ai',
    featured: true,
  },
  {
    id: 'portfolio',
    name: 'Ce portfolio',
    pitch: 'Ce site et son CV : un monogramme écrit à la plume calculé au build, et des chiffres tirés de mes dépôts plutôt qu’écrits à la main.',
    stack: ['Astro', 'TypeScript', 'Playwright', 'Claude Code'],
    facts: [
      'Construit avec Claude Code : spec, plan, TDD, puis une revue finale par un agent neuf.',
      'Le CV PDF sort des mêmes données ; un test signale s’il n’est plus à jour.',
    ],
    repo: 'https://github.com/jordantaillefer/jordantaillefer.github.io',
  },
  {
    id: 'roue-noms',
    name: 'Roue des noms',
    pitch: "Le tirage au sort des rituels d'équipe (daily, tour de table), pensé pour les services de l'État.",
    stack: ['Next.js 15', 'React 19', 'Tailwind', 'shadcn/ui'],
    facts: ['Le style du DSFR sans la bibliothèque DSFR : la même idée que sur Pilote, en petit.'],
    url: 'https://whell-name.vercel.app',
    repo: 'https://github.com/jordantaillefer/whell-name',
  },
  {
    id: 'billable',
    name: 'Billable',
    pitch: 'Le suivi du temps et de la facturation pour freelances : clients, projets, modèles de tarification.',
    stack: ['TypeScript', 'SaaS'],
    facts: ['La suite produit de mes skills de reporting (commit-billable, jira-billable).'],
  },
];
