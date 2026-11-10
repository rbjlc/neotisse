// Ce que le back-office permet de modifier, page par page.
// Chaque champ : cle, type, label, aide (phrase d'explication affichée sous le champ).
//
// Types : texte, long (plusieurs lignes), riche (gras, liens, listes), image, bouton (texte + lien),
// liste (éléments qu'on peut ajouter / retirer / déplacer), date, case (oui / non), choix (menu),
// multiple (plusieurs cases), nombre, lignes (une valeur par ligne), cache (invisible).

const t = (cle, label, aide, plus = {}) => ({ cle, type: 'texte', label, aide, ...plus });
const long = (cle, label, aide, plus = {}) => ({ cle, type: 'long', label, aide, ...plus });
const riche = (cle, label, aide, plus = {}) => ({ cle, type: 'riche', label, aide, ...plus });
const image = (cle, label, aide, plus = {}) => ({ cle, type: 'image', label, aide, ...plus });
const bouton = (cle, label, aide) => ({ cle, type: 'bouton', label, aide });
const liste = (cle, label, champs, plus = {}) => ({ cle, type: 'liste', label, champs, ...plus });

const SEO = {
	titre: 'Google et partage sur les réseaux',
	aide: 'Ce texte n’apparaît pas sur la page : c’est ce que Google affiche dans ses résultats.',
	champs: [
		t('seo_titre', 'Titre dans Google', '60 caractères maximum. « | Neotisse » est ajouté automatiquement.', { max: 60 }),
		long('seo_description', 'Description dans Google', 'Une ou deux phrases, 155 caractères maximum, qui donnent envie de cliquer.', { max: 155 }),
	],
};
const CTA = {
	cle: 'cta', titre: 'Bandeau de fin de page', aide: 'Le bandeau avec le petit logo, juste avant le pied de page.',
	champs: [t('titre', 'Titre'), riche('texte', 'Texte'), bouton('bouton', 'Bouton')],
};
const FAQ = (photo = false) => ({
	cle: 'faq', ancre: 'faq', titre: 'Questions fréquentes', aide: 'Chaque question se déplie au clic. Google peut aussi les afficher dans ses résultats.',
	champs: [
		...(photo ? [image('photo', 'Photo à côté des questions')] : []),
		t('titre', 'Titre de la section'),
		liste('questions', 'Questions', [t('question', 'Question'), riche('reponse', 'Réponse')], { ajout: 'Ajouter une question', resume: 'question' }),
	],
});
const ENTETE = { cle: 'entete', titre: 'Haut de page', aide: 'Le grand titre, sa phrase d’introduction et la photo à côté. Sans photo, le titre s’affiche seul, centré.', champs: [t('titre', 'Grand titre'), long('texte', 'Texte d’introduction'), image('photo', 'Photo à côté du titre (facultative)')] };

export const PAGES = {
	accueil: {
		nom: 'Accueil', url: '/',
		sections: [
			{
				cle: 'entree', titre: 'Grande photo du haut',
				aide: 'La première chose que voient les visiteurs. Choisissez une photo horizontale, lumineuse, où l’on voit bien les laines.',
				champs: [
					image('image', 'Photo de fond'),
					long('titre', 'Grand titre', 'Allez à la ligne pour choisir où le titre se coupe (3 lignes conseillées).'),
					t('mot_couleur', 'Mot en couleur', 'Recopiez exactement un mot ou un groupe de mots du titre : il s’affichera en jaune.'),
					long('texte', 'Texte à droite'),
					bouton('bouton', 'Bouton'),
				],
			},
			{
				cle: 'manifeste', titre: 'Grande phrase de présentation',
				aide: 'La phrase se colore mot à mot quand on fait défiler la page.',
				champs: [long('texte', 'Phrase'), t('suite', 'Fin de phrase en italique', 'Facultatif.')],
			},
			{
				cle: 'principes', titre: 'Nos principes (trois colonnes)',
				champs: [liste('liste', 'Principes', [t('titre', 'Titre'), long('texte', 'Texte')], { ajout: 'Ajouter un principe', resume: 'titre', aide: 'Trois principes conseillés.' })],
			},

			{
				cle: 'ateliers_bloc', titre: 'Bloc « Nos ateliers »',
				aide: 'Les cartes se remplissent toutes seules à partir du menu Ateliers (photo, étiquette, phrase courte).',
				champs: [t('titre', 'Titre')],
			},
			{
				cle: 'citation', titre: 'Grande photo avec citation',
				champs: [image('image', 'Photo'), long('texte', 'Citation', 'Les guillemets « » sont ajoutés automatiquement.'), t('source', 'Petite ligne sous la citation')],
			},
			{
				cle: 'fondatrices', titre: 'L’équipe',
				champs: [
					t('titre', 'Titre'), long('texte', 'Texte'),
					image('photo1', 'Grande photo'), image('photo2', 'Petite photo'),
					liste('membres', 'Fondatrices', [t('nom', 'Nom'), t('role', 'Rôle')], { ajout: 'Ajouter une personne', resume: 'nom' }),
					bouton('bouton', 'Lien'),
				],
			},
			{
				cle: 'agenda', titre: 'Prochaines dates',
				aide: 'Les trois prochaines dates viennent toutes seules du menu Calendrier.',
				champs: [t('titre', 'Titre'), bouton('lien', 'Lien vers le calendrier'), t('vide', 'Message s’il n’y a aucune date')],
			},
			{
				cle: 'appel', titre: 'Bandeau de fin « Un atelier sur mesure ? »',
				aide: 'Les noms des partenaires qui défilent juste au-dessus viennent du menu Partenaires.',
				champs: [
					t('titre', 'Titre'),
					t('mot_couleur', 'Mot en couleur', 'Recopiez exactement un mot du titre : il s’affichera en jaune.'),
					long('texte', 'Texte'), bouton('bouton', 'Bouton'),
				],
			},
		],
	},
	'qui-sommes-nous': {
		nom: 'Qui sommes-nous ?', url: '/qui-sommes-nous/',
		sections: [
			ENTETE,
			{ cle: 'patrimoine', titre: 'Deux photos et texte', champs: [image('photo1', 'Grande photo'), image('photo2', 'Petite photo'), t('titre', 'Titre'), riche('texte', 'Texte')] },
			{ cle: 'origine', titre: 'Bandeau « À l’origine »', champs: [t('surtitre', 'Petit titre'), long('texte', 'Texte'), long('citation', 'Citation', 'Les guillemets « » sont ajoutés automatiquement.')] },
			{ cle: 'principes', titre: 'Principes', champs: [t('titre', 'Titre'), liste('liste', 'Principes', [t('titre', 'Titre'), long('texte', 'Texte')], { ajout: 'Ajouter un principe', resume: 'titre', aide: 'Les numéros 01, 02, 03 s’ajoutent tout seuls.' })] },
			{
				cle: 'equipe', titre: 'L’équipe',
				champs: [
					t('titre', 'Titre'),
					liste('membres', 'Membres', [
						t('nom', 'Nom'), t('role', 'Rôle', 'Ex. : Co-créatrice'), image('photo', 'Portrait', 'Sans photo, un cadre « Portrait à venir » s’affiche.'),
						riche('parcours', 'Diplôme ou poste (en gras)'), long('texte', 'Présentation'),
					], { ajout: 'Ajouter une personne', resume: 'nom' }),
				],
			},
			CTA,
		],
	},
	ateliers: {
		nom: 'Ateliers', url: '/ateliers/',
		note: 'Les ateliers eux-mêmes (photos, descriptions, infos pratiques) se modifient dans le menu « Ateliers ».',
		sections: [
			ENTETE,
			{ cle: 'deroulement', titre: 'Bandeau vert « Déroulement »', champs: [t('titre', 'Titre'), long('texte', 'Texte'), liste('liste', 'Étapes', [t('titre', 'Titre'), long('texte', 'Texte')], { ajout: 'Ajouter une étape', resume: 'titre' })] },
			FAQ(true),
			CTA,
		],
	},
	calendrier: {
		nom: 'Calendrier', url: '/calendrier/',
		note: 'Les dates se gèrent dans le menu « Calendrier ». Les dates passées disparaissent toutes seules.',
		sections: [
			ENTETE,
			{ cle: '', titre: 'Quand il n’y a aucune date', champs: [long('vide', 'Message affiché')] },
			{ cle: 'accueillir', titre: 'Bandeau vert avec photo', champs: [image('photo', 'Photo'), t('titre', 'Titre'), long('texte', 'Texte'), bouton('bouton', 'Bouton')] },
			FAQ(),
		],
	},
	actualites: {
		nom: 'Actualités', url: '/actualites/',
		note: 'Les articles se gèrent dans le menu « Actualités ».',
		sections: [
			ENTETE,
			{ cle: '', titre: 'Liste des articles', champs: [t('liste_titre', 'Titre au-dessus de la liste'), t('suivre', 'Phrase avant les réseaux sociaux')] },
			{ ...CTA, champs: [...CTA.champs, bouton('bouton2', 'Second bouton')] },
		],
	},
	'livre-or': {
		nom: 'Témoignages', url: '/livre-or/',
		note: 'Les témoignages reçus se valident dans le menu « Témoignages ». Les avis des partenaires se saisissent dans le menu « Partenaires ».',
		sections: [
			{ ...ENTETE, titre: 'Haut de page (bandeau vert avec les partenaires)' },
			{ cle: 'avis_partenaires', titre: 'Avis des partenaires', champs: [t('titre', 'Titre'), t('vide', 'Message s’il n’y a encore aucun avis')] },
			{ cle: 'temoignages', titre: 'Témoignages des visiteurs', champs: [t('titre', 'Titre'), t('vide', 'Message s’il n’y a encore aucun témoignage')] },
			{ cle: 'formulaire', titre: 'Formulaire « Laisser un témoignage »', champs: [t('titre', 'Titre'), long('note', 'Texte au-dessus'), long('merci', 'Message après l’envoi')] },
			FAQ(),
		],
	},
	contact: {
		nom: 'Contact', url: '/contact/',
		note: 'Les choix proposés dans le formulaire (type de projet, public, budget) se modifient dans « Réglages ».',
		sections: [
			ENTETE,
			{ cle: 'formulaire', titre: 'Formulaire de devis', champs: [t('titre', 'Titre'), t('note', 'Petite phrase au-dessus'), t('bouton', 'Texte du bouton d’envoi'), long('merci', 'Message après l’envoi')] },
			{
				cle: 'aside', titre: 'Colonne de droite',
				aide: 'L’adresse e-mail et les réseaux sociaux se modifient dans « Réglages ».',
				champs: [t('surtitre', 'Titre du cadre vert'), t('etapes_titre', 'Titre des étapes'), liste('etapes', 'Étapes', [long('texte', 'Étape')], { ajout: 'Ajouter une étape', resume: 'texte' }), image('photo', 'Photo')],
			},
			FAQ(),
		],
	},
	'mentions-legales': {
		nom: 'Mentions légales', url: '/mentions-legales/', legal: true,
		sections: [{ cle: '', titre: 'Contenu', champs: [t('titre', 'Titre'), riche('contenu', 'Texte', 'Utilisez « Titre » pour les intertitres.', { grand: true })] }],
	},
	'politique-de-confidentialite': {
		nom: 'Politique de confidentialité', url: '/politique-de-confidentialite/', legal: true,
		sections: [{ cle: '', titre: 'Contenu', champs: [t('titre', 'Titre'), long('intro', 'Phrase d’introduction'), riche('contenu', 'Texte', 'Pensez à mettre à jour la date en haut du texte après chaque changement.', { grand: true })] }],
	},
	'politique-cookies': {
		nom: 'Politique de cookies', url: '/politique-cookies/', legal: true,
		sections: [{ cle: '', titre: 'Contenu', champs: [t('titre', 'Titre'), long('intro', 'Phrase d’introduction'), riche('contenu', 'Texte', 'Écrivez [bouton-cookies] seul sur une ligne pour afficher le bouton « Gérer mes cookies ».', { grand: true })] }],
	},
};
for (const p of Object.values(PAGES)) p.sections.unshift(SEO);

const PUBLIE = { cle: 'publie', type: 'case', label: 'Visible sur le site', aide: 'Décochez pour cacher sans supprimer (brouillon).', defaut: true };

export const COLLECTIONS = {
	ateliers: {
		nom: 'Ateliers', unNom: 'un atelier', nouveau: 'Nouvel atelier', icone: '🧶',
		aide: 'Chaque atelier apparaît sur la page Ateliers et dans les cartes de l’accueil. Utilisez « Ordre » pour choisir la position.',
		colonnes: ['titre', 'nom_court'], ordre: 'ordre', url: (f) => `/ateliers/${f.slug}/`,
		champs: [
			t('titre', 'Nom de l’atelier', '', { requis: true }),
			t('surtitre', 'Ligne sous le titre', 'Ex. : Atelier participatif · Tous publics'),
			image('image', 'Photo'),
			riche('description', 'Description'),
			t('repart', 'Ce que l’on emporte', 'Ex. : Chaque participant repart avec son galon. (facultatif)'),
			{ groupe: 'Infos pratiques', aide: 'Les lignes laissées vides ne s’affichent pas.' },
			t('format', 'Format'), t('public', 'Public'), t('duree', 'Durée'), t('participants', 'Participants'), t('materiel', 'Matériel'),
			{ groupe: 'Sur l’accueil' },
			t('etiquette', 'Étiquette sur la photo', 'Ex. : Tous publics, Jeune public, Chercheurs'),
			t('nom_court', 'Nom court', 'Ex. : Jeune public (utilisé dans les listes).'),
			t('resume', 'Phrase courte', 'Une ligne sous le titre de la carte.'),
			{ groupe: 'Réglages' },
			{ cle: 'ordre', type: 'nombre', label: 'Ordre', aide: '1 = en premier.' },
			t('slug', 'Adresse de la page', 'Se remplit toute seule à partir du nom. À ne changer que si nécessaire.'),
			long('seo_description', 'Description dans Google', '155 caractères maximum.', { max: 155 }),
			PUBLIE,
		],
	},
	evenements: {
		nom: 'Calendrier', unNom: 'une date', nouveau: 'Nouvelle date', icone: '📅',
		aide: 'Les dates passées disparaissent toutes seules du site (elles restent ici).',
		colonnes: ['date_debut', 'titre', 'lieu'], ordre: 'date_debut', url: () => '/calendrier/',
		champs: [
			t('titre', 'Titre', 'Ex. : Café week-end : initiation au filage', { requis: true }),
			{ cle: 'categorie', type: 'choix', label: 'Type', source: 'categories', aide: 'Donne la couleur de l’étiquette. Les types se modifient dans « Réglages ».' },
			{ cle: 'date_debut', type: 'date', label: 'Date', requis: true },
			{ cle: 'date_fin', type: 'date', label: 'Date de fin', aide: 'Seulement si l’événement dure plusieurs jours.' },
			{ cle: 'a_confirmer', type: 'case', label: 'Le jour exact n’est pas encore connu', aide: 'Seul le mois s’affiche, avec « À confirmer ».' },
			t('lieu', 'Lieu', 'Ex. : Muséum de Toulouse'),
			t('ville', 'Ville', 'Aide Google à afficher l’événement.'),
			t('lien_lieu', 'Site internet du lieu', 'Facultatif. Le nom du lieu devient cliquable. Copiez l’adresse depuis le navigateur (https://…).', { lien: true, suggestions: 'partenaires' }),
			{ cle: 'reperes', type: 'multiple', label: 'Repères d’accessibilité', source: 'reperes' },
			long('description', 'Petite précision', 'Facultatif. Ex. : horaires, inscription auprès du musée…'),
			PUBLIE,
		],
	},
	actualites: {
		nom: 'Actualités', unNom: 'une actualité', nouveau: 'Nouvelle actualité', icone: '📰',
		aide: 'L’actualité cochée « À la une » apparaît en grand sur l’accueil et en haut de la page Actualités.',
		colonnes: ['date', 'titre'], ordre: '-date', url: (f) => `/actualites/${f.slug}/`,
		champs: [
			t('titre', 'Titre', '', { requis: true }),
			{ cle: 'categorie', type: 'choix', label: 'Catégorie', source: 'categories' },
			{ cle: 'date', type: 'date', label: 'Date de publication', aide: 'Le badge « Nouveau » s’affiche pendant 30 jours.', defaut: 'aujourdhui' },
			{ cle: 'a_la_une', type: 'case', label: 'À la une', aide: 'Une seule actualité à la une : cocher ici la retire des autres.' },
			image('image', 'Photo'),
			long('extrait', 'Résumé', 'Une ou deux phrases. Affiché dans la liste et dans Google.', { max: 200 }),
			riche('contenu', 'Article', '', { grand: true }),
			{ groupe: 'Réglages' },
			t('slug', 'Adresse de la page', 'Se remplit toute seule à partir du titre.'),
			PUBLIE,
		],
	},
	partenaires: {
		nom: 'Partenaires', unNom: 'un partenaire', nouveau: 'Nouveau partenaire', icone: '🤝',
		aide: 'Les partenaires apparaissent sur l’accueil (bloc jaune) et en haut de la page Témoignages.',
		colonnes: ['nom', 'lien'], ordre: 'ordre', url: () => '/livre-or/#partenaires',
		champs: [
			t('nom', 'Nom', '', { requis: true }),
			t('lien', 'Site internet', 'Facultatif (https://…).', { lien: true }),
			image('logo', 'Logo', 'Facultatif. Sans logo, le nom s’affiche. Un fichier PNG à fond transparent est idéal.'),
			{ groupe: 'Avis du partenaire', aide: 'Facultatif : affiché dans « Témoignages de nos partenaires ».' },
			long('avis', 'Avis', 'Sans guillemets, ils sont ajoutés automatiquement.'),
			t('auteur_avis', 'Qui le dit', 'Ex. : Marie Dupont, responsable des publics'),
			{ groupe: 'Réglages' },
			{ cle: 'ordre', type: 'nombre', label: 'Ordre', aide: '1 = en premier.' },
			PUBLIE,
		],
	},
};

export const REGLAGES = [
	{
		titre: 'Coordonnées', aide: 'Affichées dans le pied de page et sur la page Contact.',
		champs: [
			t('nom', 'Nom de l’association'), t('email', 'Adresse e-mail'),
			t('zone', 'Zone d’intervention', 'Sous l’e-mail, page Contact.'),
			long('description_pied', 'Présentation dans le pied de page'),
			t('adresse', 'Adresse du siège'), t('rna', 'Numéro RNA'), t('siren', 'SIREN'),
		],
	},
	{ titre: 'Réseaux sociaux', aide: 'Laissez vide pour cacher un réseau.', champs: [t('facebook', 'Page Facebook', '', { lien: true }), t('instagram', 'Compte Instagram', '', { lien: true })] },
	{
		titre: 'Objectif du tableau de bord', aide: 'Le tableau de bord compte les messages reçus des catégories choisies et les compare à votre objectif.',
		champs: [
			{ cle: 'objectif.nombre', type: 'nombre', label: 'Nombre visé' },
			{ cle: 'objectif.periode', type: 'choix', label: 'Par', options: [['semaine', 'semaine'], ['mois', 'mois'], ['trimestre', 'trimestre'], ['annee', 'année']] },
			{ cle: 'objectif.categories', type: 'multiple', label: 'Messages qui comptent', source: 'categories_messages' },
		],
	},
	{
		titre: 'Catégories des messages', aide: 'Pour ranger les messages reçus (devis, information…). Le formulaire du site classe ses demandes dans la première catégorie.',
		champs: [liste('categories_messages', 'Catégories', [t('nom', 'Nom'), { cle: 'cle', type: 'cache' }], { ajout: 'Ajouter une catégorie', resume: 'nom' })],
	},
	{
		titre: 'Types d’événements et d’actualités', aide: 'Les pastilles de couleur du calendrier et des actualités.',
		champs: [liste('categories', 'Types', [
			t('nom', 'Nom'), t('pluriel', 'Au pluriel', 'Pour les filtres. Ex. : Festivals'),
			{ cle: 'couleur', type: 'choix', label: 'Couleur', options: [['garance', 'Rouge garance'], ['gaude', 'Jaune gaude'], ['guede', 'Bleu guède'], ['olive', 'Vert olive']] },
			{ cle: 'cle', type: 'cache' },
		], { ajout: 'Ajouter un type', resume: 'nom' })],
	},
	{
		titre: 'Repères d’accessibilité', aide: 'Proposés pour chaque date du calendrier, et expliqués sous le calendrier.',
		champs: [liste('reperes', 'Repères', [t('nom', 'Nom'), t('texte', 'Explication'), { cle: 'cle', type: 'cache' }], { ajout: 'Ajouter un repère', resume: 'nom' })],
	},
	{
		titre: 'Formulaire de devis (page Contact)', aide: 'Une proposition par ligne. Laissez vide pour retirer la question du formulaire.',
		champs: [
			{ cle: 'choix_projets', type: 'lignes', label: 'Types de projet (cases à cocher)' },
			{ cle: 'choix_publics', type: 'lignes', label: 'Publics (menu déroulant)' },
			{ cle: 'choix_budgets', type: 'lignes', label: 'Budgets (menu déroulant)' },
		],
	},
	{
		titre: 'Statistiques et cookies',
		champs: [
			t('ga_id', 'Identifiant Google Analytics', 'Commence par G- (Google Analytics → Administration → Flux de données). Laissez vide si vous n’utilisez pas Google Analytics.'),
			{ cle: 'bandeau_cookies', type: 'case', label: 'Afficher le bandeau cookies', aide: 'À laisser coché si Google Analytics est utilisé (obligatoire en France).' },
		],
	},
	{ titre: 'Partage sur les réseaux', champs: [image('image_partage', 'Image par défaut', 'Affichée quand on partage une page du site sur Facebook, WhatsApp… (format horizontal).')] },
];
