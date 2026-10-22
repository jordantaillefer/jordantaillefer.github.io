# Déploiement

Le site est statique (Astro) et hébergé sur **GitHub Pages** : https://jordantaillefer.github.io/

Le workflow `.github/workflows/deploy.yml` build et déploie à chaque push sur `main`. GitHub ne fait qu'un `astro build` : tout ce qui dépend de ta machine (chiffres des dépôts, CV PDF, image OG) est généré en local et commité.

## Mettre à jour le contenu

1. Modifier les textes dans `src/content/*.ts`. Pour le statut « En ce moment », c'est `site.now`.
2. Lancer `pnpm snapshot`. Il relit `pilote-2` et `Kauri-v3`, réécrit `src/data/snapshot.json`, rebuild, puis régénère `public/cv/jordan-taillefer-cv.pdf`, son empreinte et `public/og.png`.
3. Lancer `pnpm test && pnpm test:e2e`. Le test `cv-fingerprint` échoue si le PDF n'a pas été régénéré après une modification du CV.
4. Commit et push sur `main` : le site se redéploie en une à deux minutes (onglet Actions).

## Réglage GitHub (une seule fois)

Settings → Pages → Source : **GitHub Actions**.

## Plus tard : brancher `jordantaillefer.com` (optionnel)

1. Ajouter `public/CNAME` contenant `jordantaillefer.com` et passer `site` à `https://jordantaillefer.com` dans `astro.config.mjs` (et dans `public/robots.txt`).
2. Chez Squarespace (DNS du domaine) : 4 enregistrements **A** à l'apex vers `185.199.108.153`, `185.199.109.153`, `185.199.110.153` et `185.199.111.153`, plus un **CNAME** `www` vers `jordantaillefer.github.io`. **Ne pas toucher aux MX** : ton email en dépend.
3. Settings → Pages → Custom domain : `jordantaillefer.com`, puis cocher « Enforce HTTPS » une fois le certificat émis.
