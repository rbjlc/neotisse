# TODO : site Neotisse (version codée)

## Mise en place
- [x] Créer le projet (Astro + Supabase, déployé sur Netlify)
- [x] Poser les couleurs et les polices de DESIGN.md
- [x] Ajouter les polices (Fraunces, Atkinson Hyperlegible Next), hébergées sur le site
- [x] Créer l'en-tête
- [x] Créer le pied de page (Contact, Mentions légales, Cookies) + liens Facebook et Instagram
- [x] Mettre tout en français (textes, adresses des pages, noms des photos, back-office)

## Pages
- [x] Créer les pages (Accueil, Qui sommes-nous ?, Ateliers, Calendrier, Témoignages, Contact, Politique des cookies, de confidentialité et les mentions légales)
- [x] Accueil = hero + collage photos + ateliers + fondatrices + actu + partenaires + CTA
- [x] Qui sommes-nous ? = présentation du concept et des fondatrices
- [x] Ateliers = ateliers + sur mesure + FAQ
- [x] Calendrier = les évènements (filtres par type, repères d'accessibilité, « Ajouter à mon agenda »)
- [x] Actualités = blog (article à la une, filtres, une page par article)
- [x] Témoignages = partenaires - avis partenaires - avis visiteurs - formulaire
- [x] Contact (formulaire de devis + FAQ)
- [x] Mentions légales, politique des confidentialités et politique de cookies

## Formulaires
- [x] Formulaire de devis : envoi vers la boîte mail de Neotisse (+ copie dans « Messages reçus » du back-office)
  - [ ] À la mise en ligne : créer le mot de passe d'application Gmail et le renseigner sur Netlify (voir LISEZ-MOI)
- [x] Formulaire de témoignage avec la liste « À quel atelier ou événement ? »
- [x] Modération des témoignages avant publication (back-office → Témoignages)
- [x] Protection anti-spam (champ piège + délai minimum)

## Back-office (`/admin`)
- [x] Connexion sécurisée, mot de passe oublié, invitation des fondatrices
- [x] Tableau de bord : objectif réglable, messages non lus, témoignages à relire, prochaines dates
- [x] Textes et photos de toutes les pages modifiables
- [x] Ateliers, calendrier, actualités, partenaires : ajouter / modifier / cacher / supprimer
- [x] Bibliothèque de photos (réduction automatique, descriptions)
- [x] Page d'aide pour les fondatrices

## SEO
- [x] Un titre et une meta description par page (voir les mots-clés dans BRIEF.md), modifiables dans le back-office
- [x] Event pour le calendrier, FAQPage (+ Organization, BlogPosting, Service)
- [x] URL propres en français
- [x] Plan du site (sitemap.xml) et robots.txt

## Accessibilité et qualité
- [x] Test sur toutes les pages (ordinateur + mobile) : audit automatique axe, 0 problème sur 28 pages
- [x] Vérifier les contrastes de chaque combinaison de couleurs (voir ci-dessous)
- [x] Images optimisées (WebP, version réduite pour mobile, dimensions indiquées)

### Contrastes (norme WCAG AA : 4,5 pour le texte, 3 pour les grands titres)
| Texte | Fond | Contraste | |
|---|---|---|---|
| Encre | Lin | 12,9 | ✅ |
| Fusain | Lin | 7,0 | ✅ |
| Fusain | Laine | 6,2 | ✅ |
| Blanc | Olive | 8,1 | ✅ |
| Blanc | Bleu guède | 7,1 | ✅ |
| Blanc | Rouge garance | 6,7 | ✅ |
| Encre | Jaune gaude | 7,5 | ✅ |
| Garance | Lin | 6,0 | ✅ |
| Olive | Lin | 7,3 | ✅ |
| Gaude | Olive | 4,3 | ⚠️ grands titres seulement |
| Gaude | Guède | 3,7 | ⚠️ grands titres seulement |
| Blanc | Gaude | 1,9 | ❌ à ne jamais utiliser pour du texte |

## RGPD et mise en ligne
- [x] Bandeau cookies, aucun traceur avant consentement
- [x] Suppression automatique des messages et témoignages après 3 ans
- [ ] Créer le projet Supabase et lancer `npm run remplir` (voir LISEZ-MOI)
- [ ] Nom de domaine et mise en ligne
- [ ] Ajouter l'identifiant Google Analytics (back-office → Réglages)

## En attente des clientes
- [ ] Photos définitives (un hero plus lumineux)
- [ ] Logos et avis des partenaires
- [ ] Portraits des fondatrices
- [ ] Vraies dates d'événements
- [ ] Validation de la réponse de FAQ « Faut-il prévoir du matériel ? »

> Tout ce qui attend les clientes se fait directement dans le back-office, sans toucher au code.
