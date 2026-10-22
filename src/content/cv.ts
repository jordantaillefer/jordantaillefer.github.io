// Données propres au CV PDF. Seul endroit où figure le téléphone.
// Le parcours reprend l'expérience LinkedIn (docs/sources/linkedin-2026-10-22.md),
// enrichie pour Pilote de ce que montrent les commits et le bilan PIL-1822.

export type Mission = {
  client: string;
  period: string;
  context: string;
  role?: string;
  highlights: string[];
  stack: string[];
};

export type Experience = {
  company: string;
  title: string;
  period: string;
  location: string;
  missions: Mission[];
};

export const cv = {
  phone: '06 49 71 41 52',
  company: { name: 'EURL JORDAN TAILLEFER', siren: '994876902' },
  stack: ['TypeScript', 'React', 'Next.js', 'Remix', 'Node.js', 'Hono', 'tRPC', 'Prisma', 'PostgreSQL', 'Expo', 'Tailwind', 'Vitest', 'Playwright', 'pnpm', 'Turborepo'],
  ai: ['Claude Code', 'Agents en parallèle', 'Git worktrees', 'Skills · hooks · MCP', 'Revues IA'],
  experiences: [
    {
      company: 'Freelance',
      title: 'Développeur fullstack senior',
      period: 'Depuis sept. 2023',
      location: 'Limoges',
      missions: [
        {
          client: 'Pilote · DITP',
          period: 'déc. 2022 → aujourd’hui',
          context:
            "L'outil de pilotage territorial des Politiques Prioritaires du Gouvernement : l'application historique Next.js et la nouvelle plateforme (API, webapp, back-office) dans un même monorepo.",
          role: 'Mission commencée avec OCTO, poursuivie en freelance.',
          highlights: [
            'Bibliothèque DSFR retirée en 16 jours : 69 PR, 2 710 classes fr-* → 0, rendu identique vérifié au pixel sur 240 vues, composants partagés 16 → 62.',
            'Emotion supprimée en une journée : 256 fichiers, zéro régression avant la MEP grâce à des E2E qui testent les parcours, pas le CSS.',
            "Assistant IA Albert : réponses à partir du centre d'aide, accès gérés en base par profil, usage mesuré dans Matomo.",
            'Génération du rapport détaillé en PDF sortie du thread principal (worker_thread, file d’attente) : un export lourd ne bloque plus le serveur.',
            'Payload d’une page Next divisé par près de deux (8,31 Mo → 4,47 Mo) avec un pattern Presenter, sous filet de tests snapshot.',
            'Workflow ticket → PR industrialisé avec Claude Code : TDD, couverture E2E Playwright, revues IA puis humaines.',
          ],
          stack: ['Next.js', 'React', 'TypeScript', 'tRPC', 'Prisma', 'Keycloak', 'Playwright', 'Matomo'],
        },
      ],
    },
    {
      company: 'OCTO Technology',
      title: 'Consultant → Consultant senior',
      period: 'juin 2019 – sept. 2023',
      location: 'Paris',
      missions: [
        {
          client: 'DITP',
          period: 'déc. 2022 – sept. 2023',
          context: 'Visualisation des chantiers des ministères sur des cartographies alimentées par des tableurs ; deux équipes, visualisation et alimentation des données.',
          role: "Tech lead de l'alimentation des données.",
          highlights: [
            "Équipe constituée et périmètre des fonctionnalités défini.",
            'Code écrit de zéro en TDD, binôme développeur formé.',
            'Direction adaptée aux évolutions demandées, en Lean.',
          ],
          stack: ['Next.js', 'React', 'TypeScript', 'Jest', 'Prisma', 'Scalingo'],
        },
        {
          client: 'Maison de luxe',
          period: '2023',
          context: 'Remplacement complet du site marchand.',
          highlights: [
            "Plan d'amélioration du front et du back défini.",
            'User stories affinées avec le client, en lien avec des équipes hors de France.',
            'Premières briques livrées pour démontrer les améliorations.',
          ],
          stack: ['Next.js', 'NestJS', 'Prisma', 'GitLab CI'],
        },
        {
          client: 'DGFiP',
          period: 'févr. – déc. 2022',
          context: 'Télédéclaration de la taxe de séjour par les plateformes d’hébergement (type Airbnb, Abritel).',
          role: 'Envoyé en expert, avec le CTO à mi-temps.',
          highlights: [
            'Application réalisée entièrement en moins de 2 mois, dans un esprit software craftsmanship.',
            'Besoin affiné avec le client ; déploiement sur Scalingo.',
          ],
          stack: ['Vue 2', 'Java · Spring Boot', 'GitLab CI'],
        },
        {
          client: 'DGAC',
          period: 'déc. 2021 – févr. 2022',
          context: 'Transmission des informations des contrôleurs aériens vers les aérodromes ; application à documenter avant la mise en production.',
          highlights: [
            "Communication rétablie dans une équipe en difficulté.",
            'Documentation reliant les exigences logicielles aux tests du front.',
            'Rituels agiles douloureux analysés et remaniés ; formation technique de l’équipe.',
          ],
          stack: ['React', 'Node.js', 'TypeScript'],
        },
        {
          client: 'Invivo',
          period: 'juin 2019 – déc. 2021',
          context: "Plateforme d'achat des agriculteurs affiliés aux coopératives ; dispositif de 6 équipes.",
          role: "Tech lead d'une équipe de 6.",
          highlights: [
            "La majorité des fonctionnalités après l'ajout au panier.",
            'Design system Storybook et monorepo Lerna mis en place.',
            'Migration Vue 2 → Vue 3, architecture et design de l’API.',
          ],
          stack: ['Vue 2 → 3', 'Node · Hapi', 'Sequelize', 'TypeScript', 'Storybook'],
        },
      ],
    },
    {
      company: 'Excilys',
      title: 'Consultant',
      period: 'mars 2017 – juin 2019',
      location: 'Paris',
      missions: [
        {
          client: 'AFPA · Saint-Gobain',
          period: '2017 – 2019',
          context: 'Front-end Angular from scratch pour l’AFPA (maquettes Adobe XD, démos aux directeurs d’agence), puis lead intégrateur chez Saint-Gobain.',
          highlights: ['Seul développeur front sur l’application AFPA (Angular 7).', 'Lead des intégrateurs Saint-Gobain : tâches, formation, satisfaction.'],
          stack: ['Angular', 'TypeScript'],
        },
      ],
    },
  ] satisfies Experience[],
};
