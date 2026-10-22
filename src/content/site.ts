// Identité et contact public. Le téléphone n'est jamais ici : il vit dans cv.ts.
export const site = {
  name: 'Jordan Taillefer',
  role: 'Product developer',
  location: 'Limoges',
  status: 'Freelance',
  headline: ['Je pense le produit.', "L'IA accélère le reste."],
  intro:
    "Fullstack TypeScript. Je remonte au vrai problème, je pose l'architecture, et j'utilise l'IA pour livrer vite, sans lâcher la main sur la qualité.",
  credibility: "9 ans de développement, dont 4 chez OCTO Technology, pour l'État et le privé.",
  now: {
    text: 'Génération PDF du rapport détaillé de Pilote, dans un worker_thread',
    since: '2026-10-22',
  },
  contact: {
    email: 'consulting@jordantaillefer.com',
    linkedin: 'https://www.linkedin.com/in/jordan-taillefer/',
    github: 'https://github.com/jordantaillefer',
  },
  pilote: {
    context:
      "Pilote est l'outil de pilotage territorial des Politiques Prioritaires du Gouvernement, pour la DITP (Direction interministérielle de la transformation publique).",
    role: "J'y suis depuis décembre 2022 : d'abord tech lead de l'alimentation des données avec OCTO, puis en freelance depuis septembre 2023.",
    credibleBecause: [
      'Chaque feature suit le même découpage : spec, plan, tests d’abord, revue.',
      'Je nettoie autant que je produis : plus de refactors que de features.',
      "Plusieurs agents relisent en parallèle, puis l'équipe relit avec tout le contexte.",
    ],
    aiInProduct:
      "L'IA est aussi dans le produit : l'assistant Albert répond aux utilisateurs à partir du centre d'aide, avec des accès gérés en base par profil et un usage mesuré dans Matomo.",
  },
} as const;
