# Déploiement

Le site est statique (Astro) et hébergé sur **Cloudflare Pages**. Cloudflare ne fait qu'un `pnpm build` : tout ce qui dépend de ta machine (chiffres des dépôts, CV PDF, image OG) est généré en local et commité.

## Mettre à jour le contenu

1. Modifier les textes dans `src/content/*.ts`. Pour le statut « En ce moment », c'est `site.now`.
2. Lancer `pnpm snapshot`. Il relit `pilote-2` et `Kauri-v3`, réécrit `src/data/snapshot.json`, rebuild, puis régénère `public/cv/jordan-taillefer-cv.pdf`, son empreinte et `public/og.png`.
3. Lancer `pnpm test && pnpm test:e2e`. Le test `cv-fingerprint` échoue si le PDF n'a pas été régénéré après une modification du contenu.
4. Commit et push : Cloudflare redéploie tout seul.

## Créer le projet Cloudflare Pages (une seule fois)

1. Pousser le dépôt sur GitHub.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git, puis choisir le dépôt.
3. Réglages de build :
   - Framework preset : Astro
   - Build command : `pnpm build`
   - Build output directory : `dist`
   - Variable d'environnement : `NODE_VERSION = 24`
4. Vérifier l'URL `*.pages.dev`.

## Brancher `jordantaillefer.com` (c'est toi qui fais la bascule)

Aujourd'hui (2026-10-22), le domaine sert une page Squarespace « Prochainement disponible » et le DNS est chez Google Domains / Squarespace.

1. Dans le projet Pages → Custom domains → ajouter `jordantaillefer.com`, puis `www.jordantaillefer.com`.
2. Cloudflare affiche les enregistrements à créer. Le registrar n'étant pas Cloudflare :
   - `www` : CNAME vers `<projet>.pages.dev` ;
   - apex `jordantaillefer.com` : Squarespace n'accepte pas de CNAME à l'apex. Deux options :
     - **recommandé** : déplacer le DNS chez Cloudflare (changer les serveurs de noms chez Squarespace), ce qui permet le CNAME flattening à l'apex ;
     - ou rediriger l'apex vers `www` depuis Squarespace.
3. **Avant de toucher au DNS**, relever les enregistrements MX existants. L'adresse `consulting@jordantaillefer.com` en dépend, et ils doivent être recopiés à l'identique si le DNS passe chez Cloudflare.
4. Attendre la propagation, puis vérifier le HTTPS sur les deux noms.
5. Supprimer la page Squarespace une fois le site servi par Cloudflare.
