// Contenu de départ du site (repris du site WordPress au 9 novembre 2026).
// Il sert à remplir la base de données la première fois (npm run remplir)
// et au « mode démo » quand aucune base Supabase n'est branchée.
// Après la mise en ligne, tout se modifie dans le back-office : ce fichier ne sert plus.

const img = (src, alt) => ({ src, alt });
const btn = (texte, lien) => ({ texte, lien });
const cta = {
	titre: 'Un atelier sur mesure ?',
	texte: '<p>Chaque intervention s’adapte à votre public, à la durée souhaitée et à vos contraintes. Nous la concevons avec vous.</p>',
	bouton: btn('Parlez-nous de votre projet', '/contact/'),
};

export const reglages = {
	nom: 'Neotisse',
	email: 'asso.neotisse@gmail.com',
	description_pied: 'Association loi 1901 de médiation scientifique autour des savoir-faire textiles anciens. Montpellier.',
	zone: 'Basées à Montpellier, nous intervenons partout en France.',
	adresse: '115 impasse Valteline, 34090 Montpellier',
	rna: 'W343032312',
	siren: '941 094 872',
	facebook: 'https://www.facebook.com/p/Neotisse-61558744726575/',
	instagram: 'https://www.instagram.com/neotisse.asso/',
	ga_id: '',
	image_partage: img('/images/partage-neotisse.jpg', 'Table de démonstration avec fuseaux, écheveaux teints et outils de tissage'),
	objectif: { nombre: 2, periode: 'mois', categories: ['devis'] },
	categories_messages: [
		{ cle: 'devis', nom: 'Demande de devis' },
		{ cle: 'info', nom: 'Demande d’information' },
		{ cle: 'partenaire', nom: 'Partenariat' },
		{ cle: 'autre', nom: 'Autre' },
	],
	categories: [
		{ cle: 'atelier', nom: 'Atelier', pluriel: 'Ateliers', couleur: 'gaude' },
		{ cle: 'cafe', nom: 'Café week-end', pluriel: 'Café week-end', couleur: 'olive' },
		{ cle: 'colloque', nom: 'Colloque', pluriel: 'Colloques', couleur: 'guede' },
		{ cle: 'festival', nom: 'Festival', pluriel: 'Festivals', couleur: 'garance' },
	],
	reperes: [
		{ cle: 'tactile', nom: 'Atelier tactile', texte: 'On peut toucher et manipuler les matières.' },
		{ cle: 'calme', nom: 'Calme', texte: 'Groupe réduit, sans bruit fort.' },
		{ cle: 'pmr', nom: 'Accessible PMR', texte: 'Lieu de plain-pied ou équipé.' },
	],
	choix_projets: ['Atelier démonstratif', 'Tissage aux tablettes', 'Jeune public', 'Conférence', 'Expérimentation', 'Sur mesure'],
	choix_publics: ['Tous publics', 'Familles', 'Scolaires', 'Étudiants et chercheurs', 'Public en situation de handicap'],
	choix_budgets: ['Je ne sais pas encore', 'Moins de 500 €', '500 à 1 500 €', 'Plus de 1 500 €'],
	bandeau_cookies: true,
};

export const pages = {
	accueil: {
		seo_titre: 'Ateliers textiles anciens à Montpellier',
		seo_description: 'Ateliers textiles anciens et activités culturelles : filage, tissage et teinture végétale par des archéologues de Montpellier, pour musées et écoles.',
		entree: {
			image: img('/images/table-demonstration-outils.webp', 'Ateliers textiles anciens : table de démonstration avec fuseaux, écheveaux teints et outils de tissage'),
			titre: 'Faire vivre\nles savoir-faire\ndu passé',
			mot_couleur: 'savoir-faire',
			texte: 'Filage, tissage et teinture végétale, du Néolithique au Moyen Âge : des ateliers d’archéologues pour les musées, les sites et les écoles.',
			bouton: btn('Découvrir les ateliers', '/ateliers/'),
		},
		manifeste: {
			libelle: 'L’association',
			texte: 'Les textiles sont partout dans les sociétés anciennes, et presque invisibles dans les musées. Neotisse les fait',
			suite: 'comprendre par le geste.',
		},
		principes: {
			liste: [
				{ titre: 'L’originalité', texte: 'Le filage, le tissage et la teinture végétale au premier plan, là où la médiation parle surtout de poterie ou de feu.' },
				{ titre: 'La rigueur scientifique', texte: 'Chaque atelier s’appuie sur la recherche archéologique. L’expérimentation complète les connaissances, sans s’y substituer.' },
				{ titre: 'La flexibilité', texte: 'Chaque intervention est pensée pour son lieu, son public et ses contraintes.' },
			],
		},
		ateliers_bloc: {
			libelle: 'Nos ateliers',
			titre: 'Des gestes à vivre, du fil à l’étoffe',
		},
		citation: {
			image: img('/images/atelier-plein-air.webp', 'Atelier de tissage en plein air avec le public'),
			texte: 'Les savoir-faire textiles se comprennent pleinement quand on les met en pratique.',
			source: 'La conviction à l’origine de Neotisse',
		},
		fondatrices: {
			libelle: 'L’équipe',
			titre: 'Entre recherche archéologique et pratique du geste',
			texte: 'Deux archéologues formées au tissage et à la teinture auprès de l’association La Couenne, qui ont fondé Neotisse à Montpellier en mai 2024.',
			photo1: img('/images/bain-teinture-vegetale.webp', 'Bain de teinture végétale'),
			photo2: img('/images/metier-a-tisser-vertical.webp', 'Métier à tisser vertical à poids'),
			membres: [
				{ nom: 'Émilie Roma Sert', role: 'Doctorante en archéologie, systèmes de tissage' },
				{ nom: 'Marie-Salomé Perrichon', role: 'Égyptologue, vocabulaire textile' },
			],
			bouton: btn('Rencontrer l’équipe', '/qui-sommes-nous/'),
		},
		agenda: {
			libelle: 'Prochaines dates',
			titre: 'Où nous retrouver',
			lien: btn('Tout le calendrier', '/calendrier/'),
			vide: 'De nouvelles dates arrivent bientôt.',
		},
		appel: {
			libelle: 'Musées, sites, écoles',
			titre: 'Un atelier sur mesure ?',
			mot_couleur: 'sur mesure',
			texte: 'Chaque intervention s’adapte à votre public, à la durée souhaitée et à vos contraintes. Nous la concevons avec vous.',
			bouton: btn('Parlez-nous de votre projet', '/contact/'),
		},
	},
	'qui-sommes-nous': {
		seo_titre: 'Savoir-faire textiles anciens : l’équipe Neotisse',
		seo_description: 'Savoir-faire textiles anciens : association loi 1901 fondée à Montpellier en 2024 par deux archéologues, entre recherche, expérimentation et médiation.',
		entete: {
			titre: 'Une équipe d’archéologues au service des savoir-faire textiles anciens',
			photo: img('/images/atelier-groupe.webp', 'Atelier textile Neotisse avec un groupe de participants'),
			texte: 'Fondée en mai 2024 et basée à Montpellier, Neotisse est une association loi 1901 dédiée à la médiation scientifique autour des savoir-faire textiles anciens, du Néolithique au Moyen Âge.',
		},
		patrimoine: {
			photo1: img('/images/bain-teinture-vegetale.webp', 'Bain de teinture végétale, l’un des savoir-faire textiles anciens'),
			photo2: img('/images/tissage-tablettes.webp', 'Tissage aux tablettes en cours'),
			titre: 'Rendre visible un patrimoine fragile',
			texte: '<p>Les textiles sont omniprésents dans les sociétés, mais ils restent souvent invisibles dans les récits archéologiques. Fragiles et rarement conservés, leurs vestiges demandent un regard particulier pour être compris et transmis.</p><p>Pourtant, le textile occupe une place essentielle dans l’organisation économique, sociale et culturelle des sociétés anciennes. C’est de ce constat qu’est née Neotisse.</p>',
		},
		origine: {
			surtitre: 'À l’origine',
			texte: 'Lors d’un atelier de tissage sur un site archéologique, la curiosité et l’engagement du public ont révélé toute la force de l’expérimentation. Une conviction est née :',
			citation: 'Les savoir-faire textiles anciens se comprennent pleinement lorsqu’ils sont mis en pratique, manipulés et expérimentés.',
		},
		principes: {
			titre: 'Trois principes fondamentaux',
			liste: [
				{ titre: 'L’originalité', texte: 'Là où la médiation archéologique aborde surtout la poterie, le feu ou la parure, nous mettons le filage, le tissage et la teinture végétale au premier plan.' },
				{ titre: 'La rigueur scientifique', texte: 'Nos ateliers s’appuient sur la recherche archéologique. L’expérimentation complète les connaissances scientifiques, sans jamais s’y substituer.' },
				{ titre: 'La flexibilité', texte: 'Chaque intervention est pensée selon son contexte, ses publics et ses contraintes logistiques et budgétaires.' },
			],
		},
		equipe: {
			titre: 'Entre recherche archéologique et pratique du geste',
			membres: [
				{
					role: 'Co-créatrice',
					nom: 'Émilie Roma Sert',
					photo: img('', ''),
					parcours: '<p><strong>Doctorante en archéologie, laboratoire ASM, Université Paul-Valéry Montpellier 3</strong></p>',
					texte: 'Spécialiste des systèmes de tissage, elle s’est formée au tissage sur métiers verticaux, au filage et à la teinture végétale auprès de l’association La Couenne. Son expérience de médiation sur un site archéologique nourrit les ateliers de Neotisse.',
				},
				{
					role: 'Co-créatrice',
					nom: 'Marie-Salomé Perrichon',
					photo: img('', ''),
					parcours: '<p><strong>Master en égyptologie</strong></p>',
					texte: 'Spécialiste des termes de l’égyptien ancien traduits par « tisserand », elle étudie les métiers et savoir-faire textiles de l’Égypte ancienne. Formée au tissage vertical et à la teinture auprès de La Couenne, elle a aussi une expérience en médiation archéologique.',
				},
			],
		},
		cta,
	},

	ateliers: {
		seo_titre: 'Ateliers textiles : filage, tissage, teinture',
		seo_description: 'Ateliers textiles et activités culturelles pour tous : démonstrations, tissage aux tablettes, jeune public et conférences, pour musées et écoles.',
		entete: {
			titre: 'Les gestes, les matières et les techniques du textile',
			photo: img('/images/echeveaux-teints.webp', 'Écheveaux de laine teints aux plantes'),
			texte: 'Démonstration, expérimentation et pratique : des ateliers textiles et des activités culturelles pour les musées, les sites archéologiques et les structures culturelles, adaptés à vos publics et à vos contraintes.',
		},
		deroulement: {
			titre: 'Des ateliers textiles adaptés à votre projet',
			texte: 'Public, durée, période historique, nombre de participants : nous construisons l’intervention avec vous. Chaque prestation suit trois étapes.',
			liste: [
				{ titre: 'Introduction contextuelle', texte: 'Présentation de Neotisse, de son approche et du cadre archéologique de l’atelier selon la période.' },
				{ titre: 'Démonstration pratique', texte: 'Reconstitution rigoureuse des gestes anciens, avec des outils reproduits à partir de résultats de fouilles.' },
				{ titre: 'Atelier participatif (optionnel)', texte: 'Les participants s’initient aux techniques, guidés par les médiatrices.' },
			],
		},
		faq: {
			photo: img('/images/atelier-groupe.webp', 'Ateliers textiles : atelier en salle avec un groupe de participants'),
			titre: 'Questions fréquentes sur nos ateliers textiles',
			questions: [
				{ question: 'À quel public s’adressent vos ateliers textiles ?', reponse: '<p>À tous les publics : familles, scolaires, étudiants et chercheurs, ainsi que les publics en situation de handicap. Le contenu de chaque activité, le vocabulaire et le rythme sont adaptés à l’âge et aux attentes des participants.</p>' },
				{ question: 'Quelles techniques et quelles périodes abordez-vous ?', reponse: '<p>Le filage, le tissage (dont le tissage aux tablettes et, pour le jeune public, le tissage sur carton) et la teinture végétale, du <a href="https://fr.wikipedia.org/wiki/N%C3%A9olithique">Néolithique</a> au <a href="https://fr.wikipedia.org/wiki/Moyen_%C3%82ge">Moyen Âge</a>. Chaque atelier s’appuie sur la recherche archéologique.</p>' },
				{ question: 'Où intervenez-vous ?', reponse: '<p>Basées à Montpellier, nous intervenons partout en France : musées, sites archéologiques, médiathèques, festivals et établissements scolaires.</p>' },
				{ question: 'Combien de temps dure un atelier ?', reponse: '<p>La durée s’adapte à votre programmation et à votre public. Nous la fixons ensemble au moment de la <a href="/contact/">demande de devis</a>.</p>' },
				{ question: 'Faut-il prévoir du matériel ?', reponse: '<p>Nous apportons les outils et les matières nécessaires à la démonstration. Les besoins d’espace sont précisés pour chaque atelier et vérifiés avec vous avant l’intervention.</p>' },
			],
		},
		cta,
	},

	calendrier: {
		seo_titre: 'Démonstrations textiles : calendrier des ateliers',
		seo_description: 'Démonstrations textiles et activités culturelles ouvertes au public : où retrouver Neotisse dans les musées, festivals et sites archéologiques.',
		entete: { titre: 'Où nous retrouver', texte: '', photo: img('/images/atelier-plein-air.webp', 'Atelier de tissage en plein air avec le public') },
		vide: 'Aucune date n’est annoncée pour le moment. Revenez bientôt ou suivez-nous sur les réseaux sociaux.',
		accueillir: {
			photo: img('/images/atelier-plein-air.webp', 'Démonstrations textiles : atelier de tissage en plein air avec le public'),
			titre: 'Accueillir des démonstrations textiles dans votre lieu ?',
			texte: 'Journées du Patrimoine, Fête de la Science, exposition temporaire : nous construisons l’intervention avec vous.',
			bouton: btn('Demander un devis', '/contact/'),
		},
		faq: {
			titre: 'Questions sur nos démonstrations textiles',
			questions: [
				{ question: 'Comment assister à une démonstration textile ?', reponse: '<p>Nos démonstrations textiles ont lieu chez nos partenaires : musées, sites archéologiques et festivals. Pour l’accès, les horaires et les tarifs, renseignez-vous auprès du lieu qui nous accueille.</p>' },
				{ question: 'Comment savoir si un événement est accessible ?', reponse: '<p>Chaque date indique des repères d’accessibilité quand le lieu nous les a communiqués. En cas de doute, contactez le lieu ou <a href="/contact/">écrivez-nous</a>.</p>' },
				{ question: 'Peut-on ajouter une date à son agenda ?', reponse: '<p>Oui : chaque événement du calendrier peut être ajouté à votre agenda (téléphone ou ordinateur) en un clic.</p>' },
				{ question: 'Pouvez-vous venir lors d’un événement national ?', reponse: '<p>Oui, par exemple pour les <a href="https://www.culture.gouv.fr/evenements-nationaux/journees-europeennes-du-patrimoine">Journées européennes du patrimoine</a> ou la <a href="https://www.fetedelascience.fr/">Fête de la science</a>. Découvrez nos <a href="/ateliers/">ateliers</a> et parlons de votre projet.</p>' },
			],
		},
	},

	actualites: {
		seo_titre: 'Actualités : festivals et archéologie expérimentale',
		seo_description: 'Festivals, nouveaux ateliers, projets de recherche : suivez les actualités de Neotisse et de l’archéologie expérimentale autour du textile.',
		entete: {
			titre: 'Les nouvelles de Neotisse',
			photo: img('/images/conference.webp', 'Conférence de Neotisse sur les textiles anciens'),
			texte: 'Festivals d’archéologie expérimentale, nouveaux ateliers textiles, colloques et projets de recherche : les temps forts de Neotisse, au fil des saisons.',
		},
		liste_titre: 'Toutes les actualités',
		suivre: 'Pour ne rien manquer, suivez Neotisse sur les réseaux sociaux.',
		cta: {
			titre: 'Venir voir les gestes de près',
			texte: '<p>Filage, tissage et teinture végétale : retrouvez nos démonstrations dans les musées, les festivals et les sites archéologiques grâce au <a href="/calendrier/">calendrier</a>. Vous souhaitez accueillir Neotisse ? Découvrez <a href="/ateliers/">nos ateliers textiles</a>.</p>',
			bouton: btn('Voir le calendrier', '/calendrier/'),
			bouton2: btn('Demander un devis', '/contact/'),
		},
	},

	'livre-or': {
		seo_titre: 'Témoignages de nos partenaires et visiteurs',
		seo_description: 'Témoignages de musées, sites, familles et visiteurs : ils racontent leur atelier Neotisse de filage, tissage et teinture végétale.',
		entete: {
			titre: 'Partenaires et témoignages',
			photo: img('/images/panier-echeveaux.webp', 'Panier d’écheveaux de laine teints aux plantes'),
			texte: 'Partenaires, familles, visiteurs : leurs témoignages racontent leur rencontre avec les savoir-faire textiles anciens.',
		},
		partenaires: { titre: 'Ils nous ont accueillies' },
		avis_partenaires: { titre: 'Témoignages de nos partenaires', vide: 'Les avis de nos partenaires arrivent bientôt.' },
		temoignages: { titre: 'Ce qu’ils ont vécu', vide: 'Les premiers témoignages arrivent bientôt. Vous avez participé à un atelier ? Racontez-nous !' },
		formulaire: {
			titre: 'Laisser un témoignage',
			note: 'Votre message est relu par l’équipe avant publication. Seuls votre nom et l’atelier ou l’événement indiqué apparaîtront avec votre message.',
			merci: 'Merci ! Votre témoignage a bien été envoyé. Il apparaîtra ici dès que l’équipe l’aura relu.',
		},
		faq: {
			titre: 'Questions sur les témoignages',
			questions: [
				{ question: 'Comment laisser un témoignage ?', reponse: '<p>Remplissez le <a href="#temoigner">formulaire de cette page</a>. Seuls votre nom et l’atelier ou l’événement indiqué apparaîtront avec votre message.</p>' },
				{ question: 'Pourquoi mon témoignage n’apparaît-il pas tout de suite ?', reponse: '<p>Chaque message est relu par l’équipe avant publication. Il apparaît sur cette page dès qu’il est validé.</p>' },
				{ question: 'Vous êtes un musée, un site ou un festival partenaire ?', reponse: '<p>Votre avis compte beaucoup pour nous. Envoyez-le nous depuis la <a href="/contact/">page contact</a>, avec votre logo si vous le souhaitez.</p>' },
				{ question: 'Où nous retrouver pour vivre un atelier ?', reponse: '<p>Consultez le <a href="/calendrier/">calendrier</a> de nos prochaines dates ouvertes au public.</p>' },
			],
		},
	},

	contact: {
		seo_titre: 'Demande de devis pour un atelier textile',
		seo_description: 'Demande de devis : musée, site, médiathèque ou école, recevez une proposition d’atelier sur les textiles anciens adaptée à votre public et à vos dates.',
		entete: {
			titre: 'Parlons de votre projet',
			photo: img('/images/metier-a-tisser-vertical.webp', 'Métier à tisser vertical à poids'),
			texte: 'Vous souhaitez proposer un atelier autour des techniques textiles anciennes ? Faites votre demande de devis : nous concevons avec vous une intervention adaptée à votre projet, à vos publics et à vos besoins.',
		},
		formulaire: {
			titre: 'Votre demande',
			note: 'Les champs marqués d’un * sont obligatoires.',
			bouton: 'Envoyer ma demande',
			merci: 'Merci ! Votre demande a bien été envoyée. Nous vous recontactons rapidement pour préciser votre projet.',
		},
		aside: {
			surtitre: 'Nous écrire directement',
			etapes_titre: 'Après votre demande',
			etapes: [
				{ texte: 'Nous vous recontactons pour préciser le projet.' },
				{ texte: 'Nous vous envoyons une proposition et un devis.' },
				{ texte: 'Nous préparons l’atelier ensemble.' },
			],
			photo: img('/images/metier-a-tisser-vertical.webp', 'Métier à tisser vertical à poids, l’un des ateliers à réserver sur demande de devis'),
		},
		faq: {
			titre: 'Questions sur la demande de devis',
			questions: [
				{ question: 'Combien coûte un atelier ?', reponse: '<p>Le prix dépend du public, de la durée, du nombre de participants et du déplacement. Dans le formulaire, vous pouvez indiquer une fourchette de budget, ou « Je ne sais pas encore ».</p>' },
				{ question: 'Intervenez-vous en dehors de Montpellier ?', reponse: '<p>Oui, nous intervenons partout en France. Précisez le lieu dans votre demande de devis.</p>' },
				{ question: 'Que faut-il préciser dans la demande ?', reponse: '<p>Votre public, les dates souhaitées et votre projet. Nous vous recontactons ensuite pour construire l’intervention avec vous.</p>' },
			],
		},
	},

	'mentions-legales': {
		seo_titre: 'Mentions légales',
		seo_description: 'Éditeur, hébergeur et informations légales du site de l’association Neotisse.',
		titre: 'Mentions légales',
		intro: '',
		contenu: '<p>Dernière mise à jour : 9 novembre 2026</p><h2>Éditeur du site</h2><p>Ce site est édité par Racha Bouajila, élève à HETIC, sous l’agence BELLADONNA, dans le cadre d’un projet pédagogique réalisé pour l’association Neotisse.</p><h2>Directrice de la publication</h2><p>Racha Bouajila, agence BELLADONNA.</p><h2>Association présentée sur ce site</h2><p>Association Neotisse, association loi 1901, Montpellier.<br>Siège : 115 impasse Valteline, 34090 Montpellier<br>Numéro RNA : W343032312<br>SIREN : 941 094 872<br>E-mail : <a href="mailto:asso.neotisse@gmail.com">asso.neotisse@gmail.com</a></p><h2>Hébergement</h2><p>Site : Netlify, Inc., 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis (<a href="https://www.netlify.com/">netlify.com</a>).<br>Base de données et photos : Supabase, Inc., 970 Toa Payoh North #07-04, Singapour 318992 (<a href="https://supabase.com/">supabase.com</a>), serveurs situés dans l’Union européenne.<br>[À vérifier au moment de la mise en ligne : adresses indiquées dans les conditions de chaque service]</p><h2>Propriété intellectuelle</h2><p>Les textes, photographies et éléments graphiques de ce site appartiennent à l’association Neotisse ou sont utilisés avec l’accord de leurs auteurs. Toute reproduction sans autorisation est interdite. Les logos des partenaires restent la propriété de leurs structures.</p><h2>Données personnelles</h2><p>Les informations envoyées par les formulaires (demande de devis, témoignages) servent uniquement à répondre à votre demande ou à publier votre témoignage. Tout est expliqué dans la <a href="/politique-de-confidentialite/">politique de confidentialité</a>, avec vos droits et la manière de les exercer.</p><h2>Cookies</h2><p>Ce site ne dépose aucun cookie publicitaire. Les polices sont hébergées sur le site : aucune donnée n’est envoyée à un service externe pour les afficher. Pour le détail et pour changer vos choix : <a href="/politique-cookies/">politique de cookies</a>.</p><h2>Crédits</h2><p>Conception et réalisation : agence BELLADONNA (Racha Bouajila, HETIC). Photographies : Neotisse.</p>',
	},

	'politique-de-confidentialite': {
		seo_titre: 'Politique de confidentialité',
		seo_description: 'Quelles informations Neotisse recueille, pourquoi, combien de temps, et comment exercer vos droits.',
		titre: 'Politique de confidentialité',
		intro: 'Quelles informations nous recueillons, pourquoi, et comment exercer vos droits.',
		contenu: '<p>Dernière mise à jour : 9 novembre 2026</p><p>L’association Neotisse respecte votre vie privée. Cette page explique quelles informations le site recueille, pourquoi, combien de temps elles sont gardées, et comment exercer vos droits, conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.</p><h2>Qui est responsable de vos données ?</h2><p>Association Neotisse, association loi 1901, Montpellier.<br>Siège : 115 impasse Valteline, 34090 Montpellier<br>Contact pour toute question sur vos données : <a href="mailto:asso.neotisse@gmail.com">asso.neotisse@gmail.com</a></p><h2>Les informations que nous recueillons</h2><h3>Quand vous demandez un devis</h3><p>Le formulaire de la page <a href="/contact/">Contact</a> recueille : votre nom, votre institution, votre e-mail professionnel, le type de projet, le public visé, les dates et le budget envisagés, et la description de votre projet.</p><ul><li><strong>Pourquoi :</strong> répondre à votre demande et préparer une proposition d’atelier.</li><li><strong>Base légale :</strong> les mesures précontractuelles prises à votre demande, et votre accord donné en cochant la case du formulaire.</li><li><strong>Durée de conservation :</strong> 3 ans maximum après la réception de votre demande, puis suppression automatique.</li><li><strong>Champs obligatoires :</strong> les champs marqués d’un astérisque (*) sont nécessaires pour vous répondre. Sans eux, nous ne pouvons pas traiter votre demande.</li></ul><h3>Quand vous laissez un témoignage</h3><p>Le formulaire de la page <a href="/livre-or/">Témoignages</a> recueille : votre nom (le prénom suffit), l’atelier ou l’événement auquel vous avez participé (facultatif) et votre message. Aucune adresse e-mail n’est demandée et votre adresse IP n’est pas enregistrée.</p><ul><li><strong>Pourquoi :</strong> publier votre témoignage sur le site, après relecture par l’équipe.</li><li><strong>Base légale :</strong> votre accord, donné en cochant la case de publication.</li><li><strong>Durée de conservation :</strong> 3 ans maximum après l’envoi, puis suppression automatique. Vous pouvez demander à tout moment qu’il soit retiré plus tôt.</li></ul><p><strong>Moins de 15 ans :</strong> si vous avez moins de 15 ans, laissez votre témoignage avec un parent ou un adulte responsable : son accord est nécessaire.</p><h3>Quand vous visitez le site</h3><p>Avec votre accord seulement, le site utilise Google Analytics pour mesurer sa fréquentation : pages consultées, provenance des visiteurs, type d’appareil. Ces statistiques ne servent pas à vous identifier par votre nom ni à faire de la publicité. Si vous refusez, rien n’est mesuré. Tout est détaillé dans la <a href="/politique-cookies/">politique de cookies</a>, où vous pouvez aussi changer vos choix.</p><h2>Qui peut voir vos données ?</h2><ul><li>Les membres de l’équipe Neotisse qui traitent les demandes et relisent les témoignages.</li><li>Les hébergeurs du site et de sa base de données, qui stockent techniquement les données (voir les <a href="/mentions-legales/">mentions légales</a>).</li><li>La messagerie de l’association (Gmail, service de Google), qui reçoit une copie de chaque demande de devis.</li><li>Google Analytics (Google), pour les statistiques de visite, uniquement si vous l’avez accepté.</li></ul><p>Vos données ne sont jamais vendues ni transmises à d’autres organismes, et ne servent à aucune publicité.</p><h2>Données envoyées hors de l’Union européenne</h2><p>La messagerie Gmail, Google Analytics et l’hébergeur du site (Netlify) peuvent traiter des données sur des serveurs situés hors de l’Union européenne, notamment aux États-Unis. Ces services déclarent encadrer ces transferts par les garanties prévues par le RGPD. Si vous préférez éviter ce transfert, vous pouvez nous contacter par un autre moyen.</p><h2>Vos droits</h2><p>Vous pouvez à tout moment :</p><ul><li>consulter les données vous concernant ;</li><li>les faire corriger ou supprimer ;</li><li>retirer votre accord (par exemple, faire retirer un témoignage) ;</li><li>vous opposer à leur utilisation ou en demander la limitation ;</li><li>les récupérer dans un format lisible ;</li><li>indiquer ce que deviennent vos données après votre décès.</li></ul><p>Pour cela, écrivez à <a href="mailto:asso.neotisse@gmail.com">asso.neotisse@gmail.com</a>. Nous vous répondons dans un délai d’un mois. Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (<a href="https://www.cnil.fr/fr/plaintes">cnil.fr</a>).</p><p>L’association n’a pas désigné de délégué à la protection des données (DPO), ce qui n’est pas obligatoire pour elle.</p><p>Vos données ne font l’objet d’aucun profilage ni d’aucune décision automatisée : chaque demande et chaque témoignage sont lus par une personne de l’équipe.</p><h2>Sécurité</h2><p>Le site est protégé par une connexion sécurisée (HTTPS). L’accès à l’administration est réservé à l’équipe Neotisse.</p>',
	},

	'politique-cookies': {
		seo_titre: 'Politique de cookies',
		seo_description: 'Quels cookies ce site utilise, pourquoi, et comment changer vos choix.',
		titre: 'Politique de cookies',
		intro: 'Quels cookies ce site utilise, pourquoi, et comment changer vos choix.',
		contenu: '<p>Dernière mise à jour : 9 novembre 2026</p><h2>Qu’est-ce qu’un cookie ?</h2><p>Un cookie est un petit fichier déposé sur votre ordinateur, votre tablette ou votre téléphone quand vous visitez un site. Il permet au site de se souvenir de certaines informations, par exemple vos choix.</p><h2>Les cookies utilisés sur ce site</h2><ul><li><strong>neo_consent</strong> : mémorise vos choix de cookies. Durée : 6 mois. Indispensable, il ne demande pas votre accord.</li><li><strong>Google Analytics (_ga, _ga_*)</strong> : compte les visites et les pages consultées pour améliorer le site. Durée : 13 mois maximum. Déposé seulement si vous l’acceptez.</li><li><strong>Connexion à l’administration</strong> : réservé à l’équipe Neotisse. Durée : le temps de la connexion. Indispensable.</li></ul><h2>Ce que ce site ne fait pas</h2><ul><li>Aucun cookie publicitaire.</li><li>Aucune vidéo ou carte intégrée depuis un autre site (YouTube, Google Maps…).</li><li>Les polices de caractères sont hébergées sur ce site : aucune donnée n’est envoyée à Google pour les afficher.</li><li>Les liens vers Facebook et Instagram sont de simples liens : ces réseaux ne déposent rien tant que vous ne cliquez pas.</li></ul><h2>Changer vos choix</h2><p>Vous pouvez accepter ou refuser les cookies de mesure d’audience à tout moment avec le bouton ci-dessous. Refuser ne change rien à votre visite : tout le site reste accessible.</p><p>[bouton-cookies]</p><p>Vous pouvez aussi supprimer les cookies depuis les réglages de votre navigateur (Chrome, Firefox, Safari, Edge…).</p><h2>Vos droits</h2><p>Pour toute question sur vos données, écrivez à l’association Neotisse : <a href="mailto:asso.neotisse@gmail.com">asso.neotisse@gmail.com</a>. Vous pouvez aussi contacter la CNIL (<a href="https://www.cnil.fr/">cnil.fr</a>).</p>',
	},
};

export const ateliers = [
	{
		id: 'a1', ordre: 1, publie: true,
		titre: 'Filage, tissage et teinture végétale', slug: 'filage-tissage-et-teinture-vegetale', etiquette: 'Tous publics',
		nom_court: 'Démonstratifs', resume: 'Filage, tissage et teinture végétale, en trois pôles modulables.',
		surtitre: 'Atelier démonstratif · Tous publics',
		image: img('/images/echeveaux-teints.webp', 'Écheveaux de laine teints aux plantes'),
		description: '<p>De la transformation des fibres à la réalisation d’étoffes, en passant par la coloration des fils. Chaque pôle replace les techniques dans leur contexte historique et archéologique.</p><ul><li><strong>Le filage</strong> : transformer les fibres en fil, comprendre les gestes et les outils.</li><li><strong>Le tissage</strong> : explorer l’entrecroisement des fils et la formation d’une trame.</li><li><strong>La teinture végétale</strong> : colorer les fibres avec la garance, la gaude ou la guède.</li></ul><p>Les trois pôles peuvent être associés pour une découverte complète, ou proposés séparément.</p>',
		repart: '',
		format: 'Démonstration ; atelier participatif en option', public: 'Tous publics', duree: 'Adaptée à votre programmation', participants: 'Selon votre lieu et votre public', materiel: 'Outils reproduits d’après des découvertes archéologiques',
		seo_description: 'Filage, tissage et teinture végétale : un atelier démonstratif en trois pôles modulables, pour tous les publics.',
	},
	{
		id: 'a2', ordre: 2, publie: true,
		titre: 'Tissage aux tablettes', slug: 'tissage-aux-tablettes', etiquette: 'Participatif',
		nom_court: 'Tissage aux tablettes', resume: 'Un atelier participatif : chacun repart avec son galon.',
		surtitre: 'Atelier participatif',
		image: img('/images/tissage-tablettes.webp', 'Tissage aux tablettes en cours'),
		description: '<p>Cette technique ancienne produit des bandes textiles étroites grâce à de petites tablettes percées qui organisent les fils. Accompagnés pas à pas, les participants comprennent l’entrecroisement des fils et voient leur création prendre forme.</p>',
		repart: 'Chaque participant repart avec son galon.',
		format: 'Atelier participatif', public: 'Tous publics', duree: 'Adaptée à votre programmation', participants: 'Selon votre lieu et votre public', materiel: '',
		seo_description: 'Un atelier participatif : chacun repart avec son galon.',
	},
	{
		id: 'a3', ordre: 3, publie: true,
		titre: 'Découvrir le textile en expérimentant', slug: 'decouvrir-le-textile-en-experimentant', etiquette: 'Jeune public',
		nom_court: 'Jeune public', resume: 'Tissage sur carton et teinture végétale.',
		surtitre: 'Jeune public',
		image: img('/images/enfant-tissage-carton.webp', 'Enfant tissant sur un carton'),
		description: '<p><strong>Le tissage sur carton</strong> : en passant le fil au-dessus et au-dessous des fils tendus, les enfants découvrent comment se construit une surface textile. Motricité fine, concentration, observation.</p><p><strong>La teinture végétale</strong> : comment obtenir de la couleur à partir des plantes ? Ingrédients, observation des couleurs, étapes de la teinture.</p>',
		repart: 'Chaque enfant repart avec son tissage ou son écheveau teint.',
		format: 'Atelier participatif et tactile', public: 'Enfants et familles', duree: 'Adaptée à votre programmation', participants: 'Selon votre lieu et votre public', materiel: '',
		seo_description: 'Tissage sur carton et teinture végétale : un atelier tactile pour les enfants et les familles.',
	},
	{
		id: 'a4', ordre: 4, publie: true,
		titre: 'Expérimentation et conférences', slug: 'experimentation-et-conferences', etiquette: 'Chercheurs',
		nom_court: 'Recherche et conférences', resume: 'Pour les chercheurs, les étudiants et le grand public.',
		surtitre: 'Chercheurs, institutions, étudiants',
		image: img('/images/conference.webp', 'Conférence sur l’archéologie des textiles'),
		description: '<p>À partir des données archéologiques, iconographiques et documentaires, nous explorons gestes, outils et procédés pour mettre à l’épreuve des hypothèses. Une première expérimentation a porté sur des ceintures à chevrons inspirées des statues-menhirs.</p><p>Nos conférences présentent l’archéologie des textiles : fibres, filage, tissage, teinture, outils et usages.</p>',
		repart: '',
		format: 'Conférence ou expérimentation', public: 'Institutions, chercheurs, étudiants, grand public', duree: 'Adaptée à votre programmation', participants: 'Selon votre lieu et votre public', materiel: '',
		seo_description: 'Expérimentation et conférences sur l’archéologie des textiles, pour les chercheurs, les étudiants et le grand public.',
	},
];

export const evenements = [
	{ id: 'e1', publie: true, titre: 'Colloque professionnel', categorie: 'colloque', date_debut: '2026-12-01', date_fin: '', a_confirmer: true, lieu: 'Lieu à confirmer', ville: '', lien_lieu: '', reperes: [], description: '' },
	{ id: 'e2', publie: true, titre: 'Café week-end : initiation au filage', categorie: 'cafe', date_debut: '2027-01-16', date_fin: '', a_confirmer: false, lieu: 'Café associatif, Montpellier', ville: 'Montpellier', lien_lieu: '', reperes: ['tactile', 'calme'], description: '' },
	{ id: 'e3', publie: true, titre: 'Tissage aux tablettes', categorie: 'atelier', date_debut: '2027-01-24', date_fin: '', a_confirmer: false, lieu: 'Muséum de Toulouse', ville: 'Toulouse', lien_lieu: 'https://museum.toulouse-metropole.fr/', reperes: ['tactile', 'pmr'], description: '' },
	{ id: 'e4', publie: true, titre: 'Café week-end : teinture à la garance', categorie: 'cafe', date_debut: '2027-02-13', date_fin: '', a_confirmer: false, lieu: 'Café associatif, Montpellier', ville: 'Montpellier', lien_lieu: '', reperes: ['tactile'], description: '' },
	{ id: 'e5', publie: true, titre: 'Jeune public : tissage sur carton', categorie: 'atelier', date_debut: '2027-02-21', date_fin: '', a_confirmer: false, lieu: 'Musée de Tautavel', ville: 'Tautavel', lien_lieu: '', reperes: ['tactile', 'calme', 'pmr'], description: '' },
	{ id: 'e6', publie: true, titre: 'Festival d’Archéologie Expérimentale d’Occitanie', categorie: 'festival', date_debut: '2027-10-09', date_fin: '2027-10-10', a_confirmer: false, lieu: 'Musée de l’Aurignacien', ville: 'Aurignac', lien_lieu: 'https://musee-aurignacien.com/', reperes: ['pmr'], description: '' },
];

export const actualites = [
	{
		id: 'n1', publie: true, a_la_une: true,
		titre: 'Le premier Festival d’Archéologie Expérimentale d’Occitanie', slug: 'le-premier-festival-darcheologie-experimentale-doccitanie',
		categorie: 'festival', date: '2026-11-03',
		image: img('/images/atelier-groupe.webp', 'Atelier en salle avec un groupe de participants'),
		extrait: 'Neotisse et le musée de l’Aurignacien s’associent pour faire découvrir l’archéologie expérimentale, les 9 et 10 octobre 2027.',
		contenu: '<p>Neotisse et le musée de l’Aurignacien s’associent pour vous faire découvrir la richesse de l’archéologie expérimentale à l’occasion du tout premier Festival d’Archéologie Expérimentale d’Occitanie, les 9 et 10 octobre 2027.</p><p>Pendant deux jours, venez à la rencontre d’étudiants, de chercheurs et d’artisans passionnés qui vous feront découvrir cette discipline essentielle à la compréhension des sociétés du passé.</p><p>Démonstrations, expérimentations et échanges vous permettront d’explorer les techniques et les savoir-faire anciens, et de comprendre les gestes de nos ancêtres.</p>',
	},
	{
		id: 'n2', publie: true, a_la_une: false,
		titre: 'Le café week-end arrive', slug: 'le-cafe-week-end-arrive',
		categorie: 'cafe', date: '2026-11-03',
		image: img('/images/panier-echeveaux.webp', 'Panier d’écheveaux teints'),
		extrait: 'Un nouveau rendez-vous convivial pour les particuliers : un café, une technique textile, un moment à partager.',
		contenu: '<p>Un nouveau rendez-vous convivial pour les particuliers : un café, une technique textile, un moment à partager. Les premières dates sont dans le <a href="/calendrier/">calendrier</a>.</p>',
	},
	{
		id: 'n3', publie: true, a_la_une: false,
		titre: 'Neotisse au colloque de décembre', slug: 'neotisse-au-colloque-de-decembre',
		categorie: 'colloque', date: '2026-11-03',
		image: img('/images/conference.webp', 'Conférence sur l’archéologie des textiles'),
		extrait: 'Présentation de nos travaux aux professionnels du patrimoine. Lieu et programme à venir.',
		contenu: '<p>En décembre, Neotisse présentera ses travaux aux professionnels du patrimoine lors d’un colloque. Le lieu et le programme seront annoncés ici.</p>',
	},
];

export const partenaires = [
	{ id: 'p1', ordre: 1, publie: true, nom: 'Muséum de Toulouse', lien: 'https://museum.toulouse-metropole.fr/', logo: img('', ''), avis: '', auteur_avis: '' },
	{ id: 'p2', ordre: 2, publie: true, nom: 'Musée de Tautavel', lien: '', logo: img('', ''), avis: '', auteur_avis: '' },
	{ id: 'p3', ordre: 3, publie: true, nom: 'Musée de Gergovie', lien: 'https://musee-gergovie.fr/', logo: img('', ''), avis: '', auteur_avis: '' },
	{ id: 'p4', ordre: 4, publie: true, nom: 'Musée de l’Aurignacien', lien: 'https://musee-aurignacien.com/', logo: img('', ''), avis: '', auteur_avis: '' },
];

export const temoignages = [];
export const messages = [];

export const medias = [
	['table-demonstration-outils.webp', 'Table de démonstration avec fuseaux, écheveaux teints et outils de tissage', 1400, 1050],
	['table-demonstration.webp', 'Table de démonstration des outils textiles', 1400, 1050],
	['bain-teinture-vegetale.webp', 'Bain de teinture végétale', 1050, 1400],
	['echeveaux-teints.webp', 'Écheveaux de laine teints aux plantes', 768, 1024],
	['enfant-tissage-carton.webp', 'Enfant tissant sur un carton', 700, 1050],
	['atelier-plein-air.webp', 'Atelier de tissage en plein air avec le public', 1050, 1400],
	['panier-echeveaux.webp', 'Panier d’écheveaux teints', 922, 1229],
	['tissage-tablettes.webp', 'Tissage aux tablettes en cours', 394, 487],
	['metier-a-tisser-vertical.webp', 'Métier à tisser vertical à poids', 964, 1286],
	['atelier-groupe.webp', 'Atelier en salle avec un groupe de participants', 1050, 1400],
	['conference.webp', 'Conférence sur l’archéologie des textiles', 1400, 933],
].map(([f, alt, largeur, hauteur], i) => ({ id: 'm' + (i + 1), url: '/images/' + f, alt, largeur, hauteur, date: '2026-11-03T10:00:00Z' }));

export default { reglages, pages, ateliers, evenements, actualites, partenaires, temoignages, messages, medias };
