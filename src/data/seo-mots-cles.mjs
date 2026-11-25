// Titres et descriptions Google alignés sur la stratégie de mots-clés (relevé ChatSEO du 25/11/2026).
// Utilisé par « npm run seo » (Supabase) et par le mode démo (depart.mjs).
// avant : textes d'origine. Le script ne remplace un texte que s'il est encore identique à l'original :
// une modification faite depuis le back-office n'est jamais écrasée.
export const SEO_PAGES = {
	accueil: {
		avant: { seo_titre: 'Ateliers textiles anciens à Montpellier' },
		seo_titre: 'Ateliers textiles et médiation archéologique',
		seo_description: 'Neotisse, association d’archéologues à Montpellier : ateliers de filage, tissage et teinture végétale pour musées, écoles et grand public.',
	},
	'qui-sommes-nous': {
		avant: { seo_titre: 'Savoir-faire textiles anciens : l’équipe Neotisse' },
		seo_titre: 'Médiation culturelle en archéologie textile',
		seo_description: 'Deux archéologues spécialistes des textiles anciens, à Montpellier : recherche, archéologie expérimentale et médiation culturelle.',
	},
	ateliers: {
		avant: { seo_titre: 'Ateliers textiles : filage, tissage, teinture' },
		seo_titre: 'Atelier musée et école : textile et archéologie',
		seo_description: 'Atelier musée, atelier archéologie ou préhistoire pour les classes : nos ateliers textiles s’adaptent aux musées, écoles et collectivités.',
	},
	calendrier: {
		avant: { seo_titre: 'Démonstrations textiles : calendrier des ateliers' },
		seo_titre: 'Agenda des ateliers et Journées de l’archéologie',
		seo_description: 'Nos prochaines démonstrations textiles dans les musées, festivals et aux Journées européennes de l’archéologie. Ajoutez-les à votre agenda.',
	},
	contact: {
		avant: { seo_titre: 'Demande de devis pour un atelier textile' },
		seo_titre: 'Atelier pédagogique archéologie : devis',
		seo_description: 'Demandez un devis pour un atelier pédagogique d’archéologie textile : musée, école, médiathèque, collectivité ou festival.',
	},
};

export const SEO_ATELIERS = {
	'filage-tissage-et-teinture-vegetale': {
		avant: 'Filage, tissage et teinture végétale : un atelier démonstratif en trois pôles modulables, pour tous les publics.',
		seo_titre: 'Teinture végétale, filage et tissage',
		seo_description: 'Atelier de teinture végétale sur laine et tissu, filage de la laine au fuseau et tissage : les techniques textiles anciennes en démonstration.',
	},
	'tissage-aux-tablettes': {
		avant: 'Un atelier participatif : chacun repart avec son galon.',
		seo_titre: 'Atelier tissage aux tablettes',
		seo_description: 'Atelier tissage participatif : découvrir le tissage aux tablettes, une technique ancienne. Chacun repart avec son galon.',
	},
	'decouvrir-le-textile-en-experimentant': {
		avant: 'Tissage sur carton et teinture végétale : un atelier tactile pour les enfants et les familles.',
		seo_titre: 'Atelier tissage pour enfants et familles',
		seo_description: 'Atelier tissage sur carton et teinture végétale pour les enfants et les familles : un atelier tactile, chacun repart avec son tissage.',
	},
	'experimentation-et-conferences': {
		avant: 'Expérimentation et conférences sur l’archéologie des textiles, pour les chercheurs, les étudiants et le grand public.',
		seo_titre: 'Archéologie expérimentale des textiles',
		seo_description: 'Archéologie expérimentale des textiles anciens : gestes, outils et procédés mis à l’épreuve, puis partagés en conférences.',
	},
};
