export type CaseStudy = {
  id: 'dsfr' | 'emotion';
  title: string;
  period: string;
  summary: string;
  metrics: { label: string; before?: string; after: string; note?: string }[];
  controls: string[];
  lesson: string;
};

// Chiffres du bilan PIL-1822 (artifact claude.ai) et du post LinkedIn sur Emotion.
export const cases: CaseStudy[] = [
  {
    id: 'dsfr',
    title: 'Le DSFR, sans la bibliothèque DSFR',
    period: '29 sept. → 14 oct. 2026 · 16 jours',
    summary:
      "Pilote suit toujours le Système de design de l'État, mais ne dépend plus du paquet @gouvfr/dsfr : ses règles vivent dans nos propres composants, avec un rendu identique vérifié au pixel.",
    metrics: [
      { label: 'Classes fr-* dans le code', before: '2 710', after: '0' },
      { label: 'Lignes supprimées', after: '−30 319', note: 'pour 28 363 ajoutées, sur 3 908 fichiers' },
      { label: 'Vues comparées au pixel', after: '240', note: 'mobile, tablette, bureau, impression' },
      { label: 'Composants partagés', before: '16', after: '62' },
      { label: 'Surcharges forcées (!)', before: '1 172', after: '457' },
      { label: 'Dépendance retirée', after: '127 Mo' },
    ],
    controls: ['69 PR mergées', '1 160 tests unitaires', '980 tests d’intégration', '60 E2E', '5 revues en parallèle', '117 points de recette'],
    lesson: "Un chantier qu'on repoussait depuis des années, mené en 16 jours parce que chaque lot était vérifié avant le suivant.",
  },
  {
    id: 'emotion',
    title: 'Emotion, supprimée en une journée',
    period: '26 → 27 mars 2026',
    summary:
      "Trois librairies de style cohabitaient ; Emotion était la legacy. Le chantier aurait été chiffré XL au poker planning. L'agent a parcouru le code en respectant les conventions, des revues IA ont vérifié la cohérence, puis l'équipe a relu.",
    metrics: [
      { label: 'Fichiers modifiés', after: '256' },
      { label: 'Lignes supprimées', after: '−6 087', note: 'pour 1 423 ajoutées' },
      { label: 'Durée', before: 'plusieurs semaines estimées', after: '1 journée' },
      { label: 'Régressions avant la MEP', after: '0' },
    ],
    controls: ['Revues IA en parallèle', 'Revue humaine', 'E2E restés verts'],
    lesson: 'Les E2E testent ce que fait l’utilisateur, pas les classes CSS : supprimer Emotion n’a rien changé pour lui.',
  },
];
