# Portfolio 2026 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** construire le portfolio one-page de Jordan Taillefer (« product developer augmenté par l'IA, pas vibe codeur »), sa page `/cv` et son PDF, prêts à déployer sur Cloudflare Pages.

**Architecture :** site Astro statique. Le contenu est dans des modules TypeScript typés (`src/content/*.ts`). Les chiffres des dépôts locaux sont figés dans `src/data/snapshot.json` par un script local (`pnpm snapshot`), qui génère aussi le PDF du CV et l'image OG. Cloudflare fait un build Astro pur. Le monogramme plume est calculé au build en SVG statique. Le JS client se limite à l'écran de lancement.

**Tech Stack :** Astro (dernière stable ≥ 5), TypeScript strict, Zod, Vitest, Playwright (+ `@axe-core/playwright`), `@fontsource/sora` et `@fontsource/manrope` 5.3.0, `@fontsource/jetbrains-mono`, pnpm 12, Node 24.

**Spec :** `docs/superpowers/specs/2026-10-22-portfolio-design.md`. Maquette de référence : `docs/superpowers/specs/assets/maquette-direction-kauri-v2.html`. Sources : `docs/sources/`.

## Global Constraints

- Français uniquement. Le ton est celui de Jordan : direct, sobre, tutoiement possible dans les accroches.
- **Aucun chiffre ni fait inventé.** Chaque nombre affiché vient de la spec, de `docs/sources/` ou de `snapshot.json`. En cas de doute, on n'affiche rien.
- **Pas de timeline de carrière.** Le passé tient en une ligne de crédibilité : 9 ans, dont 4 chez OCTO Technology, pour l'État et le privé.
- Tokens recopiés de Kauri (spec, section « Direction visuelle ») : `bg #14161B`, `surface #1D2029`, `raise #262A35`, `line #2F3542`, `field #171A22`, `fg #E9ECF2`, `fg-2 #A8AFBE`, `fg-dim #6F7787`, accent `#6EE7B7 → #58C9E8`, encre `#0C231D`, secondaires `#F5B851 #FF9E7D #8AB4FF #AD8DFD`. Rayons 11/14/18/22. Ombre carte `0 1px 0 rgba(255,255,255,.045) inset, 0 14px 30px rgba(0,0,0,.28)`, flottant `0 22px 50px rgba(0,0,0,.42)`, lueur `0 8px 22px rgba(110,231,183,.20)`.
- Typo : Sora pour titres et chiffres (tracking −0.03em / −0.04em), Manrope pour le corps (15 px / 1.55), JetBrains Mono pour les extraits.
- Animations : `rise` 520 ms `cubic-bezier(.33,1,.68,1)`, `grow` 420 ms, `fade` 700 ms. Tout est coupé sous `prefers-reduced-motion: reduce`.
- **Un seul bouton à dégradé par écran.**
- Le téléphone `06 49 71 41 52` n'apparaît **que** dans `/cv` et le PDF, jamais sur `/` ni dans les meta.
- Contact : `consulting@jordantaillefer.com`, `https://www.linkedin.com/in/jordan-taillefer/`, `https://github.com/jordantaillefer`.
- Société : EURL JORDAN TAILLEFER, SIREN 994876902.
- Pas de dépendance au paquet de tokens de Kauri. Pas de CMS. Pas de formulaire avec backend.
- Aucune donnée de Pilote au-delà de chiffres agrégés : pas de code ni de captures de données réelles.
- Largeur mobile de référence 375 px, gouttière de 16 px, **jamais de scroll horizontal**.

## Review Focus

1. **Le JS ne s'exécute pas, ou `sessionStorage` lève une exception** (navigation privée, bloqueur). L'écran de lancement ne doit jamais masquer le contenu durablement : il n'est inséré que par le JS et tout accès au stockage est sous `try/catch`. Tests : Task 3.
2. **Retour sur `/` dans la même session**, ou aller-retour vers `/cv`. Le lancement ne se rejoue pas. Test : Task 3.
3. **Mobile 375 px avec les blocs larges** (courbe de commits, maquette iTerm, frise Méthode). Pas de scroll horizontal, et les blocs larges défilent dans leur propre conteneur ou se réorganisent. Test : Task 11 (balayage de toutes les pages).
4. **`pnpm snapshot` lancé sur une machine où un dépôt manque**, ou avec un auteur sans commit. Le script échoue bruyamment et n'écrit jamais de zéros dans `snapshot.json`. Tests : Task 4.
5. **Le PDF commité est périmé** par rapport au contenu du CV. Un test compare l'empreinte du contenu du CV à celle enregistrée lors de la génération du PDF. Test : Task 10.

---

## File Structure

```
astro.config.mjs · package.json · tsconfig.json · vitest.config.ts · playwright.config.ts
src/
  styles/tokens.css          variables CSS (tokens Kauri)
  styles/global.css          reset, typo, keyframes, utilitaires .rise, reduced-motion
  lib/pen/nib.ts             moteur plume : parse, échantillonnage, encre (pur, testé)
  lib/pen/monogram.ts        lignes centrales et timing du JT
  lib/stats.ts               courbe mensuelle, multiplicateur (pur, testé)
  data/snapshot.schema.ts    schéma Zod de snapshot.json
  data/snapshot.json         généré par `pnpm snapshot`, commité
  content/site.ts            identité, contact public, crédibilité, statut « En ce moment »
  content/cv.ts              données propres au CV (téléphone, stack détaillée)
  content/cases.ts           études de cas DSFR et Emotion
  content/method.ts          pipeline en 9 étapes
  content/workstation.ts     iTerm, Stream Deck, skills, outils
  content/projects.ts        projets perso
  components/Monogram.astro · Launch.astro · Header.astro · Footer.astro
  components/sections/Hero.astro · Pilote.astro · Method.astro · Workstation.astro · Projects.astro · Contact.astro
  components/CommitChart.astro · CaseStudy.astro · ItermMock.astro
  scripts/launch.ts          logique client du lancement
  layouts/Base.astro         <head>, meta OG, polices, favicon
  pages/index.astro · cv.astro · mentions-legales.astro · og.astro · favicon.svg.ts
scripts/snapshot/git.ts      lecture des dépôts (I/O)
scripts/snapshot/run.ts      CLI : snapshot.json, PDF, og.png
public/cv/jordan-taillefer-cv.pdf · public/og.png   générés, commités
tests/unit/*.test.ts · tests/e2e/*.spec.ts
```

---

### Task 1 : socle Astro, tokens et outillage de test

**Files :**
- Create : `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`, `src/styles/tokens.css`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/pages/index.astro` (squelette)
- Test : `tests/e2e/smoke.spec.ts`

**Interfaces :**
- Produces : `Base.astro` props `{ title: string; description: string; ogImage?: string; noindex?: boolean }`. Variables CSS `--color-*`, `--radius-*`, `--shadow-*`, `--font-display|body|mono`. Classe `.rise` qui lit `--d` (délai) et `--base` (décalage global, `0ms` par défaut). Scripts `dev`, `build`, `preview`, `test` (vitest), `test:e2e` (playwright), `snapshot`.

- [ ] **Step 1 : initialiser le projet.** `pnpm create astro` (template minimal, TypeScript strict) dans le dépôt existant. Ajouter vitest, playwright, @axe-core/playwright, zod et les trois @fontsource. Playwright lance `pnpm build && pnpm preview` sur le port 4321, avec deux projets : `desktop` (1440×900) et `mobile` (375×812).
- [ ] **Step 2 : écrire le test qui échoue** `smoke.spec.ts › la page d'accueil a le fond et les polices du thème`. Il vérifie que la couleur de fond calculée de `body` vaut `rgb(20, 22, 27)`, que `document.documentElement.lang` vaut `"fr"`, et que `document.documentElement.scrollWidth <= window.innerWidth`.
- [ ] **Step 3 : lancer** `pnpm test:e2e smoke` → FAIL.
- [ ] **Step 4 : implémenter** `tokens.css` (valeurs des Global Constraints), `global.css` (keyframes `rise`, `grow`, `fade`, utilitaire `.rise { animation: rise 520ms cubic-bezier(.33,1,.68,1) calc(var(--base,0ms) + var(--d,0ms)) both }`, bloc `prefers-reduced-motion` qui met `animation: none` sur `.rise` et `[data-anim]`) et `Base.astro` (lang fr, imports @fontsource poids 400/500/600 pour Manrope et 600/700 pour Sora).
- [ ] **Step 5 : lancer** `pnpm test:e2e smoke` → PASS.
- [ ] **Step 6 : commit** `chore: socle Astro, tokens Kauri et outillage de test`.

### Task 2 : moteur plume et monogramme statique

**Files :**
- Create : `src/lib/pen/nib.ts`, `src/lib/pen/monogram.ts`, `src/components/Monogram.astro`, `src/pages/favicon.svg.ts`
- Test : `tests/unit/nib.test.ts`

**Interfaces :**
- Produces :
  - `type Point = [number, number]`
  - `parsePath(d: string): Point[][]` : segments cubiques. Seules les commandes `M` et `C` absolues sont acceptées, sinon une erreur est levée.
  - `samplePath(d: string, stepsPerSegment = 70): { points: Point[]; lengths: number[] }`
  - `inkPath(d: string, opts?: { nib?: number; angleDeg?: number }): string`, avec `nib = 4.3` et `angleDeg = -35` par défaut
  - `MONOGRAM: { viewBox: '0 0 140 110'; strokes: { id: 'j' | 'tBar' | 'tStem'; d: string; durMs: number; delayMs: number }[] }`
  - `Monogram.astro` props `{ size: number; animated?: boolean; idPrefix?: string; label?: string }`, qui rend l'encre précalculée, le filet de 0,9 et le dégradé `#6EE7B7 → #58C9E8` (userSpaceOnUse 10,20 → 130,95). Avec `animated`, il rend aussi un `<mask>` par trait avec `pathLength=1`, `stroke-width=13`, et un `data-anim` qui porte `--dur` et `--delay`.

Lignes centrales et timing, à recopier depuis la maquette :
```
j     M 20 31 C 27 21 42 17 53 23 C 55 40 53 62 48 77 C 44 91 32 98 24 91 C 18 85 23 75 35 77 C 46 79 54 85 64 81   700 ms / 80 ms
tBar  M 68 31 C 77 22 90 22 101 26 C 113 31 123 28 133 19                                                         460 ms / 820 ms
tStem M 101 27 C 99 44 97 61 95 73 C 93 83 97 89 104 87 C 110 85 114 80 117 75                                    420 ms / 1300 ms
```
L'algorithme d'encre est celui du `<script>` de la maquette (quads balayés par la plume, orientation forcée positive, affinage `0.22 + 0.78 · min(1, l/7, (L−l)/11)`). On le porte tel quel en TypeScript.

- [ ] **Step 1 : écrire les tests qui échouent** dans `nib.test.ts` :
  - `parsePath rejette les commandes relatives` : `expect(() => parsePath('m 0 0 c 1 1 2 2 3 3')).toThrow()`.
  - `samplePath produit des longueurs croissantes` : `lengths[0] === 0`, `lengths` strictement croissant.
  - `inkPath est déterministe` : deux appels donnent la même chaîne.
  - `chaque quad est orienté positivement` : on parse les sous-chemins `M…Z` et l'aire signée est ≥ 0.
  - `la plume s'affine aux extrémités` : la demi-largeur au premier point vaut environ `4.3 * 0.22` (à 1e-6).
  - `toute l'encre tient dans le viewBox` : tous les sommets ont x dans [0,140] et y dans [0,110].
  - `anti-π : la barre du T ne passe pas au-dessus du J` : le plus petit x des points échantillonnés de `tBar` est strictement supérieur au plus grand x des points de `j` dont y < 40. La barre commence donc à droite du chapeau du J.
- [ ] **Step 2 : lancer** `pnpm test nib` → FAIL.
- [ ] **Step 3 : implémenter** `nib.ts`, `monogram.ts`, `Monogram.astro`, puis `favicon.svg.ts`, qui sert le monogramme statique sur fond `#14161B` arrondi. Déclarer la favicon dans `Base.astro`.
- [ ] **Step 4 : lancer** `pnpm test nib` → PASS. Vérifier visuellement avec `pnpm dev` : le monogramme doit se lire « JT », comme dans la maquette.
- [ ] **Step 5 : commit** `feat: monogramme JT écrit à la plume, calculé au build`.

### Task 3 : écran de lancement

**Files :**
- Create : `src/components/Launch.astro`, `src/scripts/launch.ts`
- Modify : `src/pages/index.astro`
- Test : `tests/e2e/launch.spec.ts`

**Interfaces :**
- Consumes : `Monogram.astro` (`animated`, `idPrefix="launch"`).
- Produces : `launch.ts` exporte `shouldPlay(storage: Pick<Storage,'getItem'> | null, reducedMotion: boolean): boolean` et `markPlayed(storage): void`. Les deux sont sous try/catch, et la clé est `jt-launch-played`. Pendant le lancement, `<html>` porte l'attribut `data-launch="playing"`, qui pose `--base: 2250ms` pour la cascade `.rise`. Sinon, `--base: 0ms`.

Comportement : `Launch.astro` fournit un `<template>`. Le script inline l'insère **seulement si** `shouldPlay` renvoie vrai. Le monogramme s'écrit, « JORDAN TAILLEFER » s'allume à 1350 ms, et l'écran s'efface à 2000 ms (fondu de 260 ms) puis est retiré du DOM. Un clic, `Échap`, `Entrée` ou `Espace` le passe immédiatement (la cascade démarre alors à 0). Sans JS, il n'y a pas de lancement et le contenu s'affiche directement.

- [ ] **Step 1 : écrire les tests qui échouent** :
  - `joue à la première visite puis disparaît` : `#launch` est visible tout de suite, détaché après 3 s, et `h1` est visible.
  - `ne rejoue pas dans la même session` : on recharge `/`, on va sur `/cv`, on revient sur `/` → `#launch` n'existe jamais.
  - `se passe au clavier` : on presse `Escape` → `#launch` est détaché en moins de 500 ms.
  - `reduced motion` : avec `page.emulateMedia({ reducedMotion: 'reduce' })`, `#launch` n'existe pas et `h1` est visible immédiatement.
  - `sans JS` : avec `javaScriptEnabled: false`, `h1` est visible et aucun overlay ne couvre le viewport.
  - `storage qui lève` : on injecte via `addInitScript` un `sessionStorage` dont `getItem` lève une exception → la page est utilisable et `h1` est visible en moins de 3 s.
- [ ] **Step 2 : lancer** `pnpm test:e2e launch` → FAIL.
- [ ] **Step 3 : implémenter** `launch.ts`, `Launch.astro` et l'intégration dans `index.astro`.
- [ ] **Step 4 : lancer** `pnpm test:e2e launch` → PASS.
- [ ] **Step 5 : commit** `feat: écran de lancement, une fois par session et passable`.

### Task 4 : snapshot des chiffres

**Files :**
- Create : `src/lib/stats.ts`, `src/data/snapshot.schema.ts`, `scripts/snapshot/git.ts`, `scripts/snapshot/run.ts`, `src/data/snapshot.json`
- Test : `tests/unit/stats.test.ts`, `tests/unit/snapshot-git.test.ts`

**Interfaces :**
- Produces :
  - `type MonthPoint = { month: string /* YYYY-MM */; commits: number; partial: boolean }`
  - `monthlySeries(dates: string[] /* ISO */, from: string /* YYYY-MM */, now: Date): MonthPoint[]`. Tous les mois de `from` à celui de `now` y figurent, y compris ceux à 0. Le mois de `now` a `partial: true`.
  - `multiplier(series: MonthPoint[], baselineYear: number): { ratio: number; baselineAvg: number; peak: MonthPoint }`. Le pic est le plus haut **mois complet**, et un mois partiel n'entre jamais dans le calcul. L'affichage utilise `Math.floor(ratio)` (on arrondit toujours à la baisse).
  - `snapshotSchema` (Zod) : `{ measuredAt: string; pilote: { series: MonthPoint[]; totalCommits: number; categories: { refactor: number; feature: number; bugfix: number }; }; kauri: { commits: number; specs: number; plans: number; testFiles: number } }`
  - `git.ts` : `readAuthorCommitDates(repo: string, authorPattern: string): string[]`, `readCategoryCounts(repo, authorPattern): Record<string, number>` (lignes `Category:` du corps des commits), `countFiles(dir: string, pattern: RegExp): number`. Chaque fonction lève une erreur si `repo` ou `dir` n'existe pas.
  - Constantes de `run.ts` : `PILOTE = ~/Documents/Missions/Projets/pilote-2`, `KAURI = ~/Documents/Projets/Kauri-v3`, `AUTHOR = 'aillefer'`, `FROM = '2025-01'`. Les tests Kauri comptent les `*.test.ts(x)` hors `node_modules`. Les specs et plans comptent `docs/superpowers/{specs,plans}/*.md`.
  - `pnpm snapshot` écrit `snapshot.json`, puis enchaîne les étapes PDF et OG (branchées à la Task 10).
- [ ] **Step 1 : écrire les tests qui échouent** dans `stats.test.ts` :
  - `inclut les mois vides` : avec des dates en 2025-01 et 2025-03, la série a 2025-02 à 0.
  - `marque le mois courant comme partiel` : `now = 2026-10-22` → le dernier point vaut `{ month: '2026-10', partial: true }`.
  - `le multiplicateur ignore le mois partiel` : avec 2025 à 40/mois, septembre 2026 à 458 (complet) et octobre 2026 à 900 (partiel) → `peak.month === '2026-09'` et `Math.floor(ratio) === 11`.
- [ ] **Step 2 : écrire les tests qui échouent** dans `snapshot-git.test.ts` :
  - `dépôt absent → erreur explicite` : `readAuthorCommitDates('/nope', 'x')` lève une erreur dont le message contient `/nope`.
  - `auteur sans commit → erreur` : sur un dépôt temporaire créé dans le test (`git init` + un commit d'un autre auteur), `run` refuse d'écrire. On exporte `buildSnapshot(paths, now)` depuis `run.ts`, et il lève une erreur si `totalCommits === 0`.
- [ ] **Step 3 : lancer** `pnpm test stats snapshot-git` → FAIL.
- [ ] **Step 4 : implémenter.** `snapshot.json` est validé par `snapshotSchema` à l'écriture et au build (import + `parse`).
- [ ] **Step 5 : lancer** les tests → PASS. Puis lancer `pnpm snapshot` (étape JSON seule à ce stade) et vérifier que `pilote.categories.refactor === 667` et `feature === 413`, ou plus si de nouveaux commits sont arrivés : jamais moins.
- [ ] **Step 6 : commit** `feat: snapshot local des chiffres des dépôts`.

### Task 5 : contenus typés

**Files :**
- Create : `src/content/site.ts`, `cv.ts`, `cases.ts`, `method.ts`, `workstation.ts`, `projects.ts`
- Test : `tests/unit/content.test.ts`

**Interfaces :**
- Produces :
  - `site` : `{ name; role: 'Product developer'; location: 'Limoges'; status: 'Freelance'; credibility: string; now: { text: string; since: string /* YYYY-MM-DD */ }; contact: { email; linkedin; github } }`
  - `cv` : `{ phone: '06 49 71 41 52'; company: { name: 'EURL JORDAN TAILLEFER'; siren: '994876902' }; stack: string[] }`
  - `cases: CaseStudy[]` avec `CaseStudy = { id: 'dsfr' | 'emotion'; title; period: string; summary; metrics: { label; before?: string; after: string; note?: string }[]; controls: string[]; lesson: string }`
  - `method: MethodStep[]` avec `MethodStep = { n: number; title; body; tool: string; visual: { kind: 'file'|'checklist'|'terminal'|'diff'|'note'; lines: string[] } }`
  - `workstation` : `{ iterm: { left: TabState[]; right: TabState[] }; tools: Tool[]; skills: { name: string; what: string }[] }` avec `TabState = { label: string; state: 'done'|'working'|'waiting'|'idle'|'error' }` et `Tool = { name; what; url?: string; note?: string }`
  - `projects: Project[]` avec `Project = { id; name; pitch; stack: string[]; facts: string[]; url?: string; repo?: string; featured?: boolean }`

Les valeurs viennent **toutes** de la spec et de `docs/sources/linkedin-2026-10-22.md`. Points imposés :
  - `cases.dsfr` reprend les chiffres de la spec (69 PR, 90 commits, 3 908 fichiers, −30 319/+28 363, 127 Mo, 2 710 → 0, 240 vues, 16 → 62, 1 172 → 457, contrôles 1 160/980/60/5/117), période « 29 sept. → 14 oct. 2026 ».
  - `cases.emotion` : +1 423/−6 087, 256 fichiers, 1 journée, zéro régression avant la MEP.
  - `method` reprend les 9 étapes de la spec. La 9ᵉ est la review humaine, et la citation « L'IA prépare le terrain. Les humains décident. » y est attachée.
  - `projects` : Kauri (`featured`, `url: 'https://kauri-fit.ai'`, sans dépôt), Roue des noms (`url: 'https://whell-name.vercel.app'`, `repo: 'https://github.com/jordantaillefer/whell-name'`), Billable (sans lien).
  - `workstation.tools` : Claude × Stream Deck (`https://github.com/jordantaillefer/claude-stream-deck`), Studio Display Volume (`https://github.com/jordantaillefer/studio-display-volume`), AI Usage Widget (sans lien), statusLine. `note` du Stream Deck : la nuance assumée du vibe coding.
  - `site.now.text` : « Génération PDF du rapport détaillé de Pilote, dans un worker_thread », avec `since: '2026-10-22'`.
- [ ] **Step 1 : écrire les tests qui échouent** dans `content.test.ts` :
  - `9 étapes numérotées 1..9, la dernière est humaine` : `method.map(s=>s.n)` vaut `[1..9]`, et `method[8].title` correspond à `/review/i`.
  - `pas de téléphone hors du CV` : `JSON.stringify({site, cases, method, workstation, projects})` ne contient pas `06 49` ni `0649`.
  - `My Flow Time est exclu` : aucun projet ne correspond à `/flow time/i`.
  - `les liens sont en https` : toute `url` ou `repo` commence par `https://`.
  - `chaque étude de cas a au moins 3 métriques et une leçon`.
- [ ] **Step 2 : lancer** `pnpm test content` → FAIL.
- [ ] **Step 3 : rédiger les modules.** Le texte est rédigé dans le ton de Jordan, et chaque chiffre est tracé jusqu'à une source.
- [ ] **Step 4 : lancer** `pnpm test content` → PASS.
- [ ] **Step 5 : commit** `feat: contenus typés du portfolio`.

### Task 6 : header, hero et carte de chiffres

**Files :**
- Create : `src/components/Header.astro`, `src/components/sections/Hero.astro`
- Modify : `src/pages/index.astro`
- Test : `tests/e2e/hero.spec.ts`

**Interfaces :**
- Consumes : `site`, `cases`, `snapshot` (`multiplier` de `stats.ts`), `Monogram` (statique, 38×30).
- Produces : ancres de section `#pilote`, `#methode`, `#poste`, `#projets`, `#contact`, utilisées par la nav.

Contenu : le label « Product developer · Freelance · Limoges », le titre « Je pense le produit. » / « L'IA accélère le reste. » (seconde ligne en dégradé), un sous-titre avec `site.credibility`, une ligne « En ce moment » (`site.now`), les boutons « Voir le travail » (le seul dégradé, vers `#pilote`) et « Me contacter », et un lien « CV (PDF) » dans le header. Carte de chiffres : `×{floor(ratio)}` commits par mois (2025 → pic), −30 319 lignes (DSFR), 240 vues comparées au pixel (DSFR), 256 fichiers en 1 jour (Emotion), et une ligne « mesuré le {measuredAt} ».

- [ ] **Step 1 : écrire les tests qui échouent** :
  - `le hero porte le positionnement` : le `h1` contient « Je pense le produit » et « L'IA accélère le reste ».
  - `un seul bouton à dégradé dans le hero` : exactement 1 élément `[data-variant="primary"]` dans `#hero`.
  - `lien CV vers le PDF` : un `a[href="/cv/jordan-taillefer-cv.pdf"]` est visible dans le header.
  - `pas de téléphone sur l'accueil` : `page.content()` ne correspond pas à `/06\s?49/`.
  - `date de mesure affichée` : le texte « mesuré le » est présent dans `#hero`.
- [ ] **Step 2 : lancer** → FAIL.
- [ ] **Step 3 : implémenter** en suivant la maquette (grille 1.25fr/1fr sur desktop, empilée sur mobile, lueur radiale, `.rise` avec des `--d` croissants).
- [ ] **Step 4 : lancer** → PASS.
- [ ] **Step 5 : commit** `feat: hero et carte de chiffres`.

### Task 7 : section Pilote (courbe et études de cas)

**Files :**
- Create : `src/components/CommitChart.astro`, `src/components/CaseStudy.astro`, `src/components/sections/Pilote.astro`
- Test : `tests/e2e/pilote.spec.ts`

**Interfaces :**
- Consumes : `snapshot.pilote`, `cases`, `multiplier`.
- Produces : `CommitChart.astro` props `{ series: MonthPoint[]; measuredAt: string }`, qui rend un SVG de barres (une `<rect data-month>` par mois, `data-partial` sur le mois partiel en style hachuré ou atténué), des étiquettes de trimestre, la valeur du pic et un `<title>`/`aria-label` textuel. `CaseStudy.astro` props `{ study: CaseStudy }` rend les avant → après.

Contenu : contexte DITP / PPG en 2 ou 3 lignes (« depuis déc. 2022, d'abord avec OCTO, en freelance depuis sept. 2023 »), la courbe, un encart « ce qui rend la courbe crédible » (même découpage, 667 refactors pour 413 features, revue), les deux études de cas, et une mention de l'assistant IA (Albert) dans le produit. Sur mobile, le graphique tient dans la largeur (barres fines) ou défile dans son propre conteneur `overflow-x: auto`.

- [ ] **Step 1 : écrire les tests qui échouent** :
  - `une barre par mois` : le nombre de `#pilote rect[data-month]` est égal à `snapshot.pilote.series.length`.
  - `le mois en cours est marqué partiel` : exactement 1 `rect[data-partial]`, et c'est le dernier.
  - `les deux études de cas` : `#pilote [data-case="dsfr"]` et `[data-case="emotion"]` sont visibles, et le DSFR contient « 240 ».
  - `graphique accessible` : le SVG a un `aria-label` non vide.
- [ ] **Step 2 : lancer** → FAIL.
- [ ] **Step 3 : implémenter.** Les barres utilisent `grow` (origine en bas, décalage par index) et s'animent à l'entrée dans le viewport via `IntersectionObserver` (classe ajoutée). Sans JS ou en reduced motion, elles sont pleines directement.
- [ ] **Step 4 : lancer** → PASS.
- [ ] **Step 5 : commit** `feat: section Pilote, courbe de commits et études de cas`.

### Task 8 : section Méthode

**Files :**
- Create : `src/components/sections/Method.astro`
- Test : `tests/e2e/method.spec.ts`

**Interfaces :**
- Consumes : `method`.

Contenu : titre « Augmenté, pas automatisé. » et une frise de 9 tuiles inspirées de la maquette (numéro coloré, outil en pastille, titre, corps, mini-visuel selon `visual.kind`, trait de couleur qui pousse). Grille de 3 colonnes sur desktop, 1 colonne sur mobile. La 9ᵉ tuile est mise en valeur (pleine largeur ou accent) avec la citation. Une phrase de clôture : « Pendant que l'agent avance, je travaille sur une autre feature dans un autre worktree. »

- [ ] **Step 1 : écrire les tests qui échouent** : `9 tuiles` (`#methode [data-step]` → 9) et `la citation est présente` (`#methode` contient « Les humains décident »).
- [ ] **Step 2 : lancer** → FAIL.
- [ ] **Step 3 : implémenter.**
- [ ] **Step 4 : lancer** → PASS.
- [ ] **Step 5 : commit** `feat: section Méthode, pipeline en 9 étapes`.

### Task 9 : Mon poste, Projets, Contact, Footer et mentions légales

**Files :**
- Create : `src/components/ItermMock.astro`, `src/components/sections/Workstation.astro`, `Projects.astro`, `Contact.astro`, `src/components/Footer.astro`, `src/pages/mentions-legales.astro`
- Test : `tests/e2e/sections.spec.ts`

**Interfaces :**
- Consumes : `workstation`, `projects`, `site`, `cv.company`.
- Produces : `ItermMock.astro` props `{ left: TabState[]; right: TabState[] }`, qui reproduit le setup (cf. `docs/sources/linkedin-2026-10-22.md`) : deux panneaux, des onglets colorés selon l'état (vert done, bleu working, jaune waiting, rouge error, gris idle), des sous-onglets Chat/Diff/Code Review et une statusLine. Les états changent en boucle par CSS uniquement (keyframes décalées), et sont figés sous reduced motion.

Contenu :
- Mon poste : ItermMock, légende des couleurs, Stream Deck (12 touches qui reflètent les mêmes états), skills, outils avec liens, et la nuance « je sais quand vibe coder ».
- Projets : Kauri en carte large (pitch, stack, 927 commits / 24 specs / 36 plans / 472 fichiers de tests depuis `snapshot.kauri`, schéma d'archi monorepo en SVG, lien `kauri-fit.ai`), puis Roue des noms et Billable.
- Contact : email, LinkedIn, GitHub, lien CV.
- Footer : © année, lien vers les mentions légales.
- Mentions légales (`noindex`) : éditeur EURL JORDAN TAILLEFER, SIREN 994876902, siège et dirigeant **recopiés** depuis la page annuaire-entreprises de la spec, hébergeur Cloudflare, Inc.
- [ ] **Step 1 : écrire les tests qui échouent** :
  - `le mock iTerm a 3 onglets à gauche et 3 à droite`.
  - `reduced motion fige les états` : sous `reducedMotion: 'reduce'`, `getAnimations()` est vide sur `#poste [data-tab]`.
  - `Kauri en tête avec lien` : le premier `#projets [data-project]` a `data-project="kauri"` et contient `a[href="https://kauri-fit.ai"]`.
  - `contact` : `a[href="mailto:consulting@jordantaillefer.com"]` est présent.
  - `mentions légales` : `/mentions-legales` contient « 994876902 » et « Cloudflare ».
- [ ] **Step 2 : lancer** → FAIL.
- [ ] **Step 3 : implémenter.**
- [ ] **Step 4 : lancer** → PASS.
- [ ] **Step 5 : commit** `feat: sections Mon poste, Projets, Contact et mentions légales`.

### Task 10 : CV, PDF et image OG

**Files :**
- Create : `src/pages/cv.astro`, `src/pages/og.astro`, `scripts/snapshot/print.ts`, `public/cv/jordan-taillefer-cv.pdf`, `public/cv/.fingerprint`, `public/og.png`
- Modify : `scripts/snapshot/run.ts`, `src/layouts/Base.astro` (meta OG)
- Test : `tests/e2e/cv.spec.ts`, `tests/unit/cv-fingerprint.test.ts`

**Interfaces :**
- Consumes : tous les modules de contenu, `snapshot`, `Monogram`.
- Produces :
  - `cvFingerprint(): string`, exporté depuis `scripts/snapshot/print.ts` : un sha256 du JSON des données qu'affiche `/cv` (site, cv, cases, method, projects, snapshot).
  - `print.ts` lance `astro preview`, imprime `/cv` en A4 (`printBackground: true`, marges 12 mm) vers `public/cv/jordan-taillefer-cv.pdf`, écrit l'empreinte dans `public/cv/.fingerprint`, puis capture `/og` en 1200×630 vers `public/og.png`. `pnpm snapshot` l'appelle après le JSON (il faut donc un `pnpm build` intermédiaire dans `run.ts`).

`/cv` : version claire pour l'impression (fond blanc, mêmes polices, accent menthe foncé lisible), **2 pages A4 au maximum**. Contenu : identité, positionnement, contact **avec téléphone**, « En ce moment », Pilote et ses deux études de cas en chiffres, la méthode en 9 lignes, l'outillage, les projets, la stack (`cv.stack`), et en pied la ligne de crédibilité et la société. À l'écran, `/cv` est consultable (`noindex`). `/og` : monogramme, nom et titre du hero sur fond `bg` (`noindex`).

- [ ] **Step 1 : écrire les tests qui échouent** :
  - `cv-fingerprint › le PDF commité correspond au contenu` : `readFileSync('public/cv/.fingerprint','utf8').trim() === cvFingerprint()`. Message en cas d'échec : « relancer pnpm snapshot ».
  - `cv.spec › le CV porte le téléphone` : `/cv` contient « 06 49 71 41 52 » et « 994876902 ».
  - `cv.spec › 2 pages max` : `page.pdf()` sur `/cv` puis comptage des `/Type /Page` dans le buffer ≤ 2.
  - `cv.spec › le PDF est servi` : `GET /cv/jordan-taillefer-cv.pdf` → 200 et `content-type` = `application/pdf`.
  - `cv.spec › meta OG` : sur `/`, `meta[property="og:image"]` se termine par `/og.png`, et `og:title` et `og:description` sont non vides.
- [ ] **Step 2 : lancer** → FAIL.
- [ ] **Step 3 : implémenter**, puis lancer `pnpm snapshot` pour générer et commiter le PDF, l'empreinte et `og.png`.
- [ ] **Step 4 : lancer** `pnpm test && pnpm test:e2e cv` → PASS. Ouvrir le PDF et vérifier la lisibilité.
- [ ] **Step 5 : commit** `feat: page CV, PDF et image de partage générés par pnpm snapshot`.

### Task 11 : qualité transverse et déploiement

**Files :**
- Create : `tests/e2e/quality.spec.ts`, `docs/deploiement.md`, `public/robots.txt`, `public/_headers`
- Modify : `astro.config.mjs` (`site: 'https://jordantaillefer.com'`, sitemap)

**Interfaces :** aucune nouvelle.

- [ ] **Step 1 : écrire les tests qui échouent** dans `quality.spec.ts`. Ils tournent sur les projets `desktop` et `mobile`, pour les pages `/`, `/cv` et `/mentions-legales` :
  - `pas de scroll horizontal` : `scrollWidth <= innerWidth` après un défilement jusqu'en bas de page.
  - `axe sans violation sérieuse` : `AxeBuilder` ne remonte aucune violation `serious` ou `critical`.
  - `un seul h1 par page`.
  - `poids raisonnable` : la somme des réponses JS de `/` fait moins de 30 Ko (seul le script de lancement est attendu).
- [ ] **Step 2 : lancer** → corriger jusqu'à PASS.
- [ ] **Step 3 : rédiger `docs/deploiement.md`** : création du projet Cloudflare Pages (build `pnpm build`, sortie `dist`, Node 24), ajout du domaine personnalisé, enregistrements DNS à créer chez Google Domains / Squarespace (apex + `www` en CNAME), vérification HTTPS, et rappel de faire `pnpm snapshot` puis commit avant chaque déploiement de contenu. **La bascule DNS est faite par Jordan**, pas par l'agent.
- [ ] **Step 4 : lancer** `pnpm build && pnpm test && pnpm test:e2e` → tout est vert.
- [ ] **Step 5 : commit** `chore: qualité transverse et guide de déploiement`.

### Task 12 (optionnelle) : « Comment ce site a été construit »

Seulement si Jordan le demande après la Task 11. Un encart dans le footer ou une page `/coulisses` qui montre la spec, le plan, le nombre de tâches et de commits, la maquette et le logo plume, en lien avec ce dépôt. À planifier à ce moment-là.
