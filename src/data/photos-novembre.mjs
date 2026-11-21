// Photos reçues en novembre 2026 : où elles vont, et leur description (texte alternatif).
// Utilisé par depart.mjs (mode démo) et par scripts/photos-novembre.mjs (Supabase).
const img = (src, alt) => ({ src, alt });

export const CHANGEMENTS = [
	{ page: 'qui-sommes-nous', chemin: 'equipe.membres.0.photo', avant: '', image: img('/images/portrait-emilie.webp', 'Portrait d’Émilie Roma Sert, co-créatrice de Neotisse') },
	{ page: 'qui-sommes-nous', chemin: 'equipe.membres.1.photo', avant: '', image: img('/images/portrait-marie-salome.webp', 'Portrait de Marie-Salomé Perrichon, co-créatrice de Neotisse') },
	{ page: 'qui-sommes-nous', chemin: 'patrimoine.photo1', avant: '/images/bain-teinture-vegetale.webp', image: img('/images/bain-oignon.webp', 'Écheveau de laine sorti d’un bain de teinture à la pelure d’oignon') },
	{ page: 'ateliers', chemin: 'entete.photo', avant: '/images/echeveaux-teints.webp', image: img('/images/echeveaux-garance.webp', 'Écheveaux de laine teints en rouge et en beige') },
	{ page: 'ateliers', chemin: 'faq.photo', avant: '/images/atelier-groupe.webp', image: img('/images/atelier-teinture-enfants.webp', 'Atelier jeune public : des enfants peignent des motifs sur du tissu avec une teinture végétale') },
	{ page: 'calendrier', chemin: 'accueillir.photo', avant: '/images/atelier-plein-air.webp', image: img('/images/metier-plein-air.webp', 'Démonstration de tissage sur un métier vertical en plein air') },
	{ page: 'livre-or', chemin: 'entete.photo', avant: '/images/panier-echeveaux.webp', image: img('/images/realisation-teinture.webp', 'Tissu décoré de motifs à la teinture végétale pendant un atelier') },
	{ page: 'contact', chemin: 'aside.photo', avant: '/images/metier-a-tisser-vertical.webp', image: img('/images/tissage-serge.webp', 'Tissage sergé jaune et brun en cours sur un métier') },
];

const date = '2026-11-21T10:00:00Z';
const media = (id, f, alt, largeur, hauteur) => ({ id, url: '/images/' + f, alt, largeur, hauteur, date });
export const NOUVEAUX_MEDIAS = [
	media('m12', 'portrait-emilie.webp', 'Portrait d’Émilie Roma Sert, co-créatrice de Neotisse', 1100, 825),
	media('m13', 'portrait-marie-salome.webp', 'Portrait de Marie-Salomé Perrichon, co-créatrice de Neotisse', 1365, 1024),
	media('m14', 'bain-oignon.webp', 'Écheveau de laine sorti d’un bain de teinture à la pelure d’oignon', 1050, 1400),
	media('m15', 'echeveaux-garance.webp', 'Écheveaux de laine teints en rouge et en beige', 1050, 1400),
	media('m16', 'atelier-teinture-enfants.webp', 'Atelier jeune public : des enfants peignent des motifs sur du tissu avec une teinture végétale', 1050, 1400),
	media('m17', 'metier-plein-air.webp', 'Démonstration de tissage sur un métier vertical en plein air', 1050, 1400),
	media('m18', 'tissage-serge.webp', 'Tissage sergé jaune et brun en cours sur un métier', 1050, 1400),
	media('m19', 'realisation-teinture.webp', 'Tissu décoré de motifs à la teinture végétale pendant un atelier', 1050, 1400),
	media('m20', 'pots-betteraves.webp', 'Bocaux de betteraves préparés pour une teinture végétale', 1050, 1400),
	media('m21', 'bain-teinture-rouge.webp', 'Fils de laine dans un bain de teinture rouge', 1050, 1400),
	media('m22', 'atelier-tissage-enfants.webp', 'Petits métiers en carton préparés pour un atelier de tissage jeune public', 1050, 1400),
	media('m23', 'stand-musee.webp', 'Stand Neotisse accueillant le public dans un musée', 1200, 900),
	media('m24', 'table-atelier-teinture.webp', 'Table préparée pour un atelier de teinture végétale', 1050, 1400),
];
