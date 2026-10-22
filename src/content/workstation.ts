export type TabState = { label: string; state: 'done' | 'working' | 'waiting' | 'idle' | 'error' };
export type Tool = { name: string; what: string; url?: string; note?: string };

// Le poste tel que sur la capture du 2026-10-22 et les posts LinkedIn.
export const workstation: { iterm: { left: TabState[]; right: TabState[] }; tools: Tool[]; skills: { name: string; what: string }[] } = {
  iterm: {
    left: [
      { label: 'pilote · main', state: 'done' },
      { label: 'pilote · worktree-1', state: 'working' },
      { label: 'pilote · worktree-2', state: 'working' },
    ],
    right: [
      { label: 'kauri', state: 'idle' },
      { label: 'portfolio', state: 'working' },
      { label: 'outillage', state: 'idle' },
    ],
  },
  tools: [
    {
      name: 'Claude × Stream Deck',
      what: "Un serveur Node local reçoit les hooks de Claude Code et pousse l'état de chaque session sur les touches LCD de mon clavier. Un clic bascule sur le bon onglet.",
      url: 'https://github.com/jordantaillefer/claude-stream-deck',
      note: "Celui-là, je l'ai vibe codé, et je l'assume : c'est un outil perso. La prod, elle, passe par la méthode.",
    },
    {
      name: 'Onglets iTerm colorés',
      what: "Les hooks de Claude Code changent la couleur de l'onglet : bleu il travaille, jaune il attend, vert c'est fini, rouge ça a cassé.",
    },
    {
      name: 'statusLine',
      what: 'En bas du terminal : worktree, branche, fichiers modifiés et un point vert si le serveur de dev tourne.',
    },
    {
      name: 'Studio Display Volume',
      what: 'Un CLI Swift CoreAudio et un plugin Stream Deck pour régler le volume de deux écrans Apple agrégés, ce que macOS bloque.',
      url: 'https://github.com/jordantaillefer/studio-display-volume',
    },
    {
      name: 'AI Usage Widget',
      what: "Une app macOS (barre de menu, widgets, CLI) qui suit ma consommation de Claude Code, sans compte ni cloud.",
    },
  ],
  skills: [
    { name: '/daily', what: 'Le git log de toutes mes branches, croisé avec les PR, résumé par ticket en dix secondes.' },
    { name: 'commit-billable', what: 'Des commits avec métadonnées (client, catégorie, stack) pour le reporting d’activité.' },
    { name: 'jira-billable', what: 'Le commentaire Jira enrichi qui va avec, lien de PR compris.' },
    { name: 'monthly', what: 'Le bilan du mois, regroupé par grandes fonctionnalités, prêt pour une slide.' },
    { name: 'handing-off-dev-servers', what: 'Une session Claude coupe ses serveurs pour qu’une autre teste sa branche sur les mêmes ports.' },
  ],
};

export const vibeCodingNuance = 'Je sais quand vibe coder (un outil perso) et quand pas (la prod pour l’État).';
