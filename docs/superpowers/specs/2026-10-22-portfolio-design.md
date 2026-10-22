# Portfolio 2026 : design

Date : 2026-10-22 · Auteur : Jordan Taillefer (avec Claude)

## Intention

Un portfolio personnel sur `jordantaillefer.com`. Il sera partagé prochainement sur LinkedIn auprès d'un public large mais technique : devs, tech leads, CTO, recruteurs tech. La plupart arrivent depuis un post, souvent sur mobile, et restent moins d'une minute si rien ne les accroche.

Le site doit faire passer **un seul message** :

> **Product developer augmenté par l'IA, pas vibe codeur.**

1. **Product developer** : Jordan ne se contente pas de livrer les tickets tels quels. Il remonte au besoin produit, voit les problèmes structurels (design system, monorepo, cadrage) et les règle.
2. **Augmenté par l'IA** : il produit beaucoup plus et beaucoup plus vite grâce à Claude Code (agents en parallèle, worktrees, skills maison), tout en gardant la main sur l'architecture, la qualité et les décisions. La formule de Jordan, tirée de ses posts : *« L'IA prépare le terrain. Les humains décident. »*

Le site doit **montrer** ce second point plutôt que l'affirmer, puisque tout le monde écrit « j'utilise l'IA » en ce moment. Les preuves sont des chiffres réels, des avant/après et son poste de travail.

## Objectifs

- Parler du **travail actuel**, pas de l'historique. C'est la colonne vertébrale du site.
- Rendre le positionnement lisible en moins de 10 secondes sur mobile (hero).
- Fournir des preuves vérifiables : chiffres issus des dépôts et des bilans, études de cas avant/après.
- Montrer l'outillage personnel (skills, Stream Deck, iTerm, widget) comme la preuve d'un usage avancé et réfléchi de l'IA.
- Proposer un **CV PDF** pour qui préfère un CV à un portfolio. C'est le même message en version condensée, généré depuis la même source.
- Un site qui porte la même signature visuelle que Kauri, avec la même qualité d'animation.

## Calendrier

**Pas d'échéance.** Le site est construit en entier avant d'être publié, sans v1 au rabais. Le plan peut quand même avancer par lots qu'on peut vérifier un par un.

**Après la mise en ligne** (hors périmètre du build) : Jordan reprend la publication sur LinkedIn, et la sortie du portfolio peut faire l'objet d'un post. Une page ou un encart « Comment ce site a été construit » (spec → plan → Claude Code → revue, avec le logo plume) servirait à la fois de preuve du positionnement et de matière pour ce post. *Idée de Claude, optionnelle :* elle peut être ajoutée à la fin du plan s'il reste de la marge.

## Non-objectifs

- **Pas de timeline de carrière.** Un recruteur se fiche que Jordan ait été intégrateur il y a 10 ans. Le passé tient en **une ligne de crédibilité** du type « 9 ans d'expérience, dont 4 chez OCTO Technology, pour l'État et le privé » (formulation libre).
- Pas de blog au lancement.
- Pas de version anglaise au lancement (français uniquement).
- Pas de CMS. Le contenu vit dans le dépôt.
- Pas de formulaire de contact avec un backend.

## Anti-objectifs (échec même si ça « marche »)

- Un site qui ressemble à un CV en ligne, avec une liste chronologique de postes.
- Un discours « j'utilise l'IA » sans preuve, ou qui fait vibe codeur (« l'IA code tout pour moi »).
- Des chiffres inventés ou arrondis à l'avantage. **Tout chiffre affiché doit provenir des sources listées plus bas.**
- Une intro animée qui fait attendre ou agace, qui se rejoue à chaque navigation, ou qui ignore `prefers-reduced-motion`.
- Un site lent ou lourd sur mobile.

## Décisions prises

### Stack et hébergement
- **Astro** (site statique), TypeScript, contenu en Markdown/MDX ou en collections typées (Zod).
- **Hébergement : Cloudflare Pages** *(choix de Claude, non discuté en détail)*, domaine `jordantaillefer.com`.
- Dépôt : `~/Documents/Projets/portfolio-2026`. L'ancien `~/Documents/Projets/portfolio` (2023) n'est pas touché.
- **État actuel du domaine** (vérifié le 2026-10-22) : il sert une page Squarespace « Prochainement disponible », et le DNS est chez Google Domains / Squarespace. Aucune URL existante n'est à rediriger. *Choix de Claude :* on garde le registrar et on ajoute le domaine personnalisé Cloudflare Pages par enregistrement DNS (CNAME / apex). La bascule DNS est une étape explicite du plan, à faire **avant** le jour du post LinkedIn.

### Chaîne de build *(choix de Claude)*
- Tout ce qui demande la machine de Jordan tourne **en local** via un script `pnpm snapshot`, et son résultat est **commité** :
  - les chiffres des dépôts (`pilote-2`, `Kauri-v3`) vont dans `src/data/snapshot.json`, avec la date de mesure ;
  - le CV PDF va dans `public/cv/jordan-taillefer-cv.pdf`, imprimé par Playwright depuis `/cv` sur le serveur local.
- Cloudflare Pages fait un build Astro pur depuis Git, sans accès aux dépôts locaux et sans Playwright.
- Un test vérifie que le PDF commité n'est pas plus vieux que le contenu de `/cv`, ou au minimum qu'il existe. Le builder choisit le mécanisme.

### Direction visuelle : l'ADN de Kauri
Jordan aime le design et les animations de Kauri, et le site s'en inspire directement. Source : `~/Documents/Projets/Kauri-v3/packages/tokens/src/tokens.ts` et `apps/web/src/client/styles.css`.

- **Thème sombre « profondeur douce »** : `bg #14161B`, `surface #1D2029`, `raise #262A35`, `line #2F3542`, `field #171A22`, `fg #E9ECF2`, `fg-2 #A8AFBE`, `fg-dim #6F7787`.
- **Accent** : dégradé `#6EE7B7 → #58C9E8`, encre `#0C231D`. **Un seul bouton par écran** porte le dégradé.
- **Couleurs secondaires** (celles des disciplines de Kauri, ici réutilisées comme catégories) : `#F5B851`, `#FF9E7D`, `#8AB4FF`, `#AD8DFD`.
- **Typo** : Sora pour les titres et les chiffres (tracking `-0.03em` à `-0.04em`), Manrope pour le corps, avec l'échelle de `tokens.ts` (corps 15 px, etc.). Mono pour les extraits de code : JetBrains Mono dans la maquette.
- **Rayons** 11 / 14 / 18 / 22. **Trois profondeurs** au maximum (plat, carte, flottant), avec les ombres de Kauri. La lueur radiale menthe se place derrière le hero.
- **Chorégraphie d'entrée** reprise de Kauri : `rise` (520 ms, `cubic-bezier(.33,1,.68,1)`, décalage en cascade), `grow`, `fade`. Tout est coupé sous `prefers-reduced-motion`.
- Les tokens sont **recopiés** dans le portfolio, sans dépendance au paquet de Kauri.

**Maquette de référence validée** : `docs/superpowers/specs/assets/maquette-direction-kauri-v2.html`. Elle fait foi pour l'ambiance, les tokens, le logo et la section Méthode. Le contenu de sa section Méthode est remplacé par le pipeline réel décrit plus bas.

### Le monogramme « JT » écrit à la plume
Jordan a beaucoup aimé cette idée et l'a validée. Le logo est un monogramme JT calligraphié, **comme écrit au stylo plume**.

- Il est rendu par une **plume biseautée simulée** : chaque pas de la ligne centrale balaie un segment incliné à −35° (demi-largeur ≈ 4,3 unités sur un viewBox 140×110). On obtient des pleins sur les fûts et des déliés sur les montées, avec une attaque et une sortie affinées. Un filet de 0,9 sous le trait garantit que les déliés ne disparaissent jamais. Le remplissage est le dégradé d'accent.
- Le tracé s'anime avec un **masque par trait** (`stroke-dasharray` sur `pathLength=1`) dans l'ordre d'écriture : J (700 ms), barre du T (460 ms), puis fût du T (420 ms), avec la courbe `cubic-bezier(.65,0,.35,1)`.
- Les lignes centrales validées, l'algorithme et le timing sont dans la maquette (bloc `<script>`). En production, **l'encre doit être précalculée au build** (SVG statique) plutôt que générée en JS côté client.
- **Écran de lancement** : le monogramme s'écrit au centre, « JORDAN TAILLEFER » s'allume dessous, puis l'écran s'efface et le contenu monte en cascade (environ 2 s au total dans la maquette). Le même monogramme sert de logo statique dans le header et de favicon.
- La maquette a montré qu'une barre commune aux deux lettres se lisait « π ». **La barre ne coiffe que le T.**

### Plan de la page d'accueil (one-page)

1. **Lancement**, puis **Hero**
   - Label : « Product developer · Freelance · Limoges ».
   - Titre de travail : « Je pense le produit. / L'IA accélère le reste. » (la seconde ligne en dégradé).
   - Sous-titre court qui inclut la ligne de crédibilité (9 ans, OCTO, État et privé).
   - Boutons « Voir le travail » (dégradé) et « Me contacter ». Un lien « CV (PDF) » est visible dès le hero ou le header.
   - **Statut « En ce moment »** : une ligne qui dit ce que Jordan fait actuellement, par exemple « génération PDF du rapport détaillé de Pilote, dans un worker_thread ». *Idée de Claude, accueillie sans objection.* Une mise à jour manuelle via un fichier de contenu suffit.
   - Une carte de chiffres clés à côté du titre. *Choix de Claude :* ce sont les chiffres de **Pilote**, puisque c'est le travail actuel (et pas ceux de Kauri comme dans la maquette). Par exemple : ×10 commits par mois (2025 → sept. 2026), −30 319 lignes et 240 vues comparées au pixel (DSFR), 256 fichiers en 1 jour (Emotion). Les chiffres de Kauri vont dans la section Projets perso.

2. **Pilote, mon travail actuel** (la section principale)
   - Contexte en 2 ou 3 lignes. Pilote est l'outil de pilotage territorial des Politiques Prioritaires du Gouvernement, pour la **DITP** (Direction interministérielle de la transformation publique). Jordan y est depuis déc. 2022 : d'abord comme tech lead de l'alimentation des données chez OCTO, puis en freelance depuis sept. 2023. **Nommer le client est autorisé**, Jordan l'a déjà fait publiquement.
   - **La courbe de commits** : environ 40 par mois en 2025, puis 161 en mars 2026, 458 en septembre et 444 en octobre. Il faut la présenter **avec ce qui la rend crédible** (le nombre de commits ne mesure pas la productivité à lui seul) : même découpage spec → plan → TDD → revue, et une forte part de refactors (667 refactors pour 413 features, **sur Pilote seul**, d'après les métadonnées `Category:` des commits de Jordan).
     - *Choix de Claude :* un mois en cours est affiché **comme partiel** (« au 22 oct. »), dans un style distinct, et ne sert jamais au calcul du multiplicateur. Le « ×10 » compare la moyenne mensuelle de 2025 (environ 40) à celle de septembre 2026, le dernier mois complet (458).
   - **Étude de cas 1, PIL-1822 : le DSFR sans la bibliothèque DSFR** (29 sept. → 14 oct. 2026)
     - 69 PR mergées, 90 commits, 3 908 fichiers, −30 319 / +28 363 lignes, 127 Mo de dépendance retirés.
     - 2 710 classes `fr-*` → 0. Rendu identique **vérifié au pixel sur 240 vues**.
     - Composants partagés 16 → 62, surcharges `!` 1 172 → 457.
     - Contrôles : 1 160 tests unitaires, 980 tests d'intégration, 60 E2E, 5 revues de code en parallèle, 117 points de recette.
   - **Étude de cas 2 : la suppression d'Emotion**
     - +1 423 / −6 087 lignes, 256 fichiers, **1 journée** au lieu d'un chantier XL de plusieurs semaines, zéro régression avant la MEP.
     - Les E2E sont restés verts parce qu'ils testent les interactions utilisateur, pas les classes CSS.
   - Format visuel : des avant/après chiffrés, dans l'esprit du bilan PIL-1822 mais avec les tokens du portfolio.
   - Une mention brève de l'**IA dans le produit** : l'assistant IA (Albert) qui répond à partir du centre d'aide, ses accès gérés en base, et la mesure d'usage dans Matomo.

3. **Méthode : « Augmenté, pas automatisé. »**
   - Le **vrai pipeline de Jordan**, tel qu'il le décrit dans son post LinkedIn, en 9 étapes :
     1. Contexte : le ticket Jira lu via MCP, puis une discussion (le seul moment où il réfléchit au « quoi » et au « comment »).
     2. Implémentation en TDD, dans le respect des patterns existants (CQRS, domain-driven).
     3. Couverture e2e : il lit le fichier de couverture et propose de nouveaux cas, qu'il valide.
     4. Tests e2e Playwright (Page Object, seed et cleanup).
     5. GIF de démo généré depuis la vidéo e2e, avec une bannière par step.
     6. Review : lint, revue qualité, corrections.
     7. PR : commit, push, permalien du GIF, review Copilot en parallèle.
     8. Commentaire Jira : PR, GIF, critères d'acceptation.
     9. **La vraie review, humaine.**
   - Une frise de tuiles détaillées (cf. maquette : titre, description, mini-visuel, outil). Les 9 étapes peuvent être regroupées en 4 ou 5 temps visuels si c'est plus lisible, mais le détail doit rester accessible.
   - Pendant que l'agent avance, Jordan travaille sur une autre feature dans un autre worktree.

4. **Mon poste de travail**
   - Une **reproduction animée du setup iTerm**. À gauche, 3 onglets pour Pilote (main, worktree-1, worktree-2), chacun avec un Claude. À droite, les projets perso. Chaque onglet est coloré selon l'état de Claude (vert : terminé, bleu : travaille, jaune : attend, rouge : erreur), via les hooks Claude Code. Le post LinkedIn correspondant est le plus vu de Jordan.
   - **Claude × Stream Deck** : un serveur Node local, les hooks Claude Code, un WebSocket et un plugin Stream Deck. Chaque touche LCD affiche l'état d'une session, et un clic bascule sur l'onglet iTerm.
   - **Skills maison** : `/daily`, `commit-billable`, `jira-billable`, `monthly`, `handing-off-dev-servers`, et le skill ticket → PR en 9 étapes.
   - Autres outils : statusLine personnalisée (avec l'état du serveur de dev), AI Usage Widget (Swift, WidgetKit).
   - **La nuance est assumée** : ces outils perso sont en partie du vibe coding, et Jordan le dit lui-même. Le message est « je sais quand vibe coder (un outil perso) et quand pas (la prod pour l'État) ». *Validé par Jordan.*

5. **Projets perso**
   - **Kauri** en tête : une plateforme d'entraînement multisport (muscu, course, vélo, natation) sur web et mobile, alimentée par Strava et Garmin. Monorepo Turborepo, API Hono + Prisma en CQRS, web Vite/React, mobile Expo, schémas Zod et design tokens partagés. 927 commits, 24 specs, 36 plans, 236 fichiers de tests.
   - Puis Roue des noms (Next.js 15, style DSFR sans bibliothèque) et Billable (SaaS de temps et de facturation pour freelances). Voir « Sélection des projets ».
   - Les dossiers de test (`initial-template`, `poc-gif-playwright`, `template-remix-v2`, etc.) sont exclus.

6. **Contact** : email `consulting@jordantaillefer.com`, LinkedIn `https://www.linkedin.com/in/jordan-taillefer/`, GitHub `https://github.com/jordantaillefer`. Pas de formulaire. **Pas de téléphone sur le site.**

### Coordonnées et société
- Email : `consulting@jordantaillefer.com`.
- Téléphone : **sur le CV PDF uniquement**, fourni par Jordan pour ce seul usage. Le PDF étant public, le numéro l'est aussi : c'est une décision de Jordan, à rappeler au moment de publier.
- Société : EURL **JORDAN TAILLEFER**, SIREN 994876902 (https://annuaire-entreprises.data.gouv.fr/entreprise/jordan-taillefer-994876902). Elle sert pour les **mentions légales**, obligatoires pour un site pro en France (éditeur, SIREN, hébergeur Cloudflare), et en pied de CV. Le builder recopie les infos légales depuis cette page.

### Sélection des projets *(choix de Claude, Jordan lui a délégué)*
Visibilité vérifiée sur GitHub le 2026-10-22 :

| Projet | Où | Lien public | Traitement |
|---|---|---|---|
| Kauri | Projets perso, en tête | dépôt **privé** | Carte riche : captures de l'app, chiffres, architecture. Pas de lien dépôt. Lien vers l'app seulement si elle est en ligne (à vérifier par le builder). |
| Roue des noms | Projets perso | https://whell-name.vercel.app (dépôt public `whell-name`) | Carte avec lien vers la démo. Un bon exemple de « DSFR sans bibliothèque » qui fait écho à PIL-1822. |
| Billable | Projets perso, en court | dépôt **privé** (org Binary-Bros-Studio) | Mention courte, sans lien. |
| Claude × Stream Deck | Mon poste | dépôt public `jordantaillefer/claude-stream-deck` (rendu public le 2026-10-22) | Lien GitHub. |
| Studio Display Volume | Mon poste | dépôt public | Lien GitHub. |
| AI Usage Widget | Mon poste | aucun dépôt distant | Sans lien. |
| My Flow Time | **exclu** | — | Trop proche d'un projet d'apprentissage, et il n'apporte rien de plus que Kauri. |

### Le CV PDF
- C'est le même message que le site, en version condensée, **pour quelqu'un qui préfère un CV à un portfolio**. Ce n'est pas un dossier de compétences d'ESN.
- Une page `/cv` du site avec une feuille de style d'impression. Le PDF est **généré au build** (Playwright imprime `/cv`) et servi en téléchargement.
- Même logique que le site : le travail actuel d'abord, la méthode, les chiffres, les projets, puis la ligne de crédibilité. Les compétences et la stack peuvent y être plus explicites que sur le site.
- Format clair. Une version imprimable claire est acceptable même si le site est sombre.

## Sources de contenu (à relire pendant la rédaction)

| Contenu | Source |
|---|---|
| Titre, résumé, localisation | `docs/sources/linkedin-Profile.csv` (export LinkedIn) |
| Expériences, posts, setup iTerm | `docs/sources/linkedin-2026-10-22.md` (notes de lecture du profil, des posts et de la capture iTerm) |
| Bilan DSFR PIL-1822 | artifact claude.ai `JBVCwNTnp8r5e8y6TYCeEE` |
| Commits Pilote | `~/Documents/Missions/Projets/pilote-2` (`git log --author=aillefer`), avec les métadonnées `Category:` dans le corps des commits |
| Kauri | `~/Documents/Projets/Kauri-v3` (README, `docs/superpowers/{specs,plans}`, tokens) |
| Autres projets perso | `~/Documents/Projets/*` (README / CLAUDE.md) |
| Skills | `~/.claude/skills/*/SKILL.md` |

Les chiffres de commits sont **figés au moment du build** par un script qui interroge les dépôts locaux, ou recopiés à la main avec leur date. Dans les deux cas, la date de mesure est affichée.

## Contraintes

- Rapide sur mobile. Polices auto-hébergées ou Google Fonts avec `display=swap`. Pas de framework JS lourd côté client (îlots Astro si besoin).
- Accessible : contrastes du thème sombre vérifiés, focus visible, `prefers-reduced-motion` respecté, monogramme avec un `aria-label`.
- L'écran de lancement **ne se joue qu'à la première visite de la session**, et doit pouvoir être passé (clic ou touche).
- Meta Open Graph soignées, puisque le site sera partagé sur LinkedIn : une image de partage avec le monogramme et le hero.
- Aucune donnée confidentielle de Pilote au-delà de ce qui est déjà public : chiffres agrégés, pas de code ni de captures de données réelles.

## Laissé au builder

- L'organisation du code Astro et le modèle des collections de contenu.
- La rédaction finale des textes, dans le ton de Jordan : direct, tutoiement possible dans les accroches, emphase sobre. Les textes sont à faire valider.
- Les mini-visuels des tuiles et des études de cas.
- La forme du graphique de la courbe de commits (barres mensuelles probablement).
- La mise en page exacte du CV.
- Le choix de l'image Open Graph.
