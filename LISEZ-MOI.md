# Site Neotisse : version codée (Astro + Supabase)

Cette version du site est indépendante de la version WordPress. Elle a le même design, les mêmes textes et les mêmes photos, et un **back-office** (`/admin`) qui permet aux fondatrices de tout modifier elles-mêmes.

| | |
|---|---|
| **Site** | [Astro](https://astro.build), rendu à la demande sur **Netlify** |
| **Base de données, photos, comptes** | [Supabase](https://supabase.com) (offre gratuite suffisante) |
| **Back-office** | `/admin` : fait sur mesure, en français, pensé pour des non-techniciennes |
| **Design** | même CSS et mêmes polices que le thème WordPress, sans framework |

---

## 1. Lancer le site sur ton ordinateur (mode démo)

1. Installe **Node.js 22 ou plus récent** (version « LTS ») : https://nodejs.org
2. Ouvre le dossier dans VS Code, puis le terminal (**Terminal → Nouveau terminal**) :
   ```
   npm install
   npm run dev
   ```
3. Ouvre http://localhost:4321. Le back-office est sur http://localhost:4321/admin
   - e-mail : `demo@neotisse.fr`
   - mot de passe : `neotisse-demo`

En mode démo, tout ce que tu modifies est enregistré dans le dossier `.donnees/` (et les photos dans `public/envois/`). Pour revenir au contenu de départ, supprime ces deux dossiers et relance `npm run dev`.

---

## 2. Brancher Supabase (base de données en ligne)

1. Crée un compte sur https://supabase.com puis un projet.
   - Nom : `neotisse`
   - Région : **Europe** (Paris ou Francfort), pour le RGPD
2. **SQL Editor → New query** : colle le contenu de `supabase/schema.sql`, puis **Run**.
   - Facultatif : fais de même avec `supabase/purge-automatique.sql`, une sécurité en plus pour la suppression après 3 ans.
3. **Project Settings → API** : copie le **Project URL** et la clé **service_role** (secrète).
4. Dans le dossier du projet, copie `.env.example` en `.env` et remplis `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.
5. Copie le contenu actuel du site dans Supabase :
   ```
   npm run remplir
   ```
6. **Authentication → Sign In / Providers** : désactive « Allow new users to sign up ». Seules les personnes que tu invites pourront se connecter.
7. **Authentication → URL Configuration** :
   - Site URL : l'adresse du site (ex. `https://neotisse.netlify.app`)
   - Redirect URLs : ajoute `https://neotisse.netlify.app/admin/nouveau-mot-de-passe/`
8. **Authentication → Users → Invite user** : invite chaque responsable. La personne reçoit un e-mail, clique sur le lien et choisit son mot de passe. Le **premier** compte qui se connecte devient **Responsable** (accès complet). Les comptes invités ensuite depuis Supabase arrivent avec le niveau **Équipe** : une responsable peut les passer en Responsable dans **Comptes et accès** (par sécurité, aucun compte inconnu ne reçoit tous les droits). Ensuite, les fondatrices ajoutent elles-mêmes les autres personnes depuis le back-office (**Comptes et accès**), avec le niveau **Fondatrice** ou **Équipe** (contenus seulement, sans les messages, les réglages ni les comptes).

> ⚠️ La clé `service_role` donne accès à toute la base : ne la mets jamais sur GitHub (le fichier `.env` est déjà exclu par `.gitignore`).

---

## 3. Mettre en ligne sur Netlify

1. Envoie le projet sur GitHub (voir plus bas).
2. Sur Netlify : **Add new site → Import an existing project → GitHub**, puis choisis le dépôt. Les réglages de build sont lus dans `netlify.toml` : ne change rien.
3. **Site configuration → Environment variables** : ajoute `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` (les mêmes que dans `.env`), puis redéploie.
4. C'est en ligne. Chaque `git push` met le site à jour, et chaque modification faite dans `/admin` est visible tout de suite, sans redéployer.

### Recevoir les demandes de devis dans la boîte mail de Neotisse

Chaque demande arrive dans le back-office et, si c'est configuré, dans la boîte Gmail de l'association (il suffit de cliquer sur « Répondre »). Les nouveaux témoignages à relire sont signalés de la même façon.

1. Sur le compte Google de l'association : **Gérer votre compte → Sécurité → Validation en deux étapes** (à activer si ce n'est pas fait).
2. Toujours dans **Sécurité**, ouvre **Mots de passe des applications**, crée « Site Neotisse » et copie le code de 16 lettres.
3. Sur Netlify, ajoute deux variables : `SMTP_UTILISATEUR` (l'adresse Gmail) et `SMTP_MOT_DE_PASSE` (le code), puis redéploie.
4. Le tableau de bord affiche « ✓ Chaque demande de devis… est aussi envoyée par e-mail » : c'est actif.

Si tu préfères ne pas toucher au compte Google, tu peux utiliser https://resend.com (variable `RESEND_API_KEY`).

### Envoyer sur GitHub depuis VS Code

1. Onglet **Contrôle de source** (icône branche).
2. **Initialiser le dépôt**, écris un message (« Premier envoi »), puis **Valider**.
3. **Publier la branche**.

---

## 4. Ce que les responsables et l’équipe peuvent modifier (`/admin`)

| Menu | Ce qu'on y fait |
|---|---|
| **Tableau de bord** | Objectif de demandes (réglable), messages non lus, témoignages à relire, prochaines dates, photos sans description |
| **Messages reçus** | Demandes de devis du formulaire. On les classe (devis, information…), on répond par e-mail, on ajoute une demande reçue par téléphone |
| **Témoignages** | Publier, refuser ou corriger les témoignages des visiteurs ; ajouter un témoignage reçu sur papier |
| **Textes des pages** | Tous les titres, textes, photos, boutons, questions fréquentes et pages légales, bloc par bloc |
| **Ateliers / Calendrier / Actualités / Partenaires** | Ajouter, modifier, cacher, supprimer (les dates passées disparaissent seules du site) |
| **Photos** | Bibliothèque : envoi par glisser-déposer (réduction automatique), descriptions, suppression |
| **Réglages** | Coordonnées, réseaux sociaux, objectif, catégories, couleurs des types d'événements, repères d'accessibilité, choix du formulaire de devis, Google Analytics, bandeau cookies |
| **Aide** | Mode d'emploi en questions-réponses |

RGPD : les messages et témoignages de plus de 3 ans sont supprimés automatiquement. Le bandeau cookies ne lance Google Analytics qu'après accord.

---

## 5. Organisation du code

```
src/
  pages/            une page = un fichier (index = accueil, admin/ = back-office)
  layouts/          gabarits : Base (site public) et Admin (back-office)
  components/       morceaux réutilisables (FAQ, boutons, cartes…) ; admin/ = champs du back-office
  lib/
    donnees.js      lecture / écriture (Supabase ou mode démo)
    schemas.js      liste de tout ce qui est modifiable dans le back-office ← pour ajouter un champ
    site.js         dates en français, typographie, contenus publiés
    auth.js         connexion
  data/depart.mjs   contenu de départ (repris du site WordPress)
public/
  css/              style.css = design du site, admin.css = back-office
  js/               site.js (filtres, fil animé), cookies.js, admin.js (éditeur, photos…)
  images/, fonts/
supabase/           scripts SQL à lancer une fois
```

Pour **ajouter un champ modifiable** : ajoute-le dans `src/lib/schemas.js` (il apparaît alors dans le back-office), puis affiche-le dans la page concernée de `src/pages/`.

---

*Conception et réalisation : agence BELLADONNA (Racha Bouajila, HETIC), avec développement assisté par IA.*
