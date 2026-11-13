// Réception des formulaires publics (demande de devis, témoignage).
import { ecrire } from './donnees.js';
import { reglages, urlSite } from './site.js';
import { prevenirAssociation } from './courriel.js';

const nettoie = (v, max = 500) => String(v ?? '').replace(/\s+$/g, '').slice(0, max).trim();

/** Refuse les robots : champ piège rempli, ou formulaire envoyé en moins de 3 secondes. */
export function estUnRobot(f) {
	if (nettoie(f.get('site_web'))) return true;
	const t = Number(f.get('t'));
	return t && Date.now() - t < 3000;
}

export async function enregistrerDemande(f) {
	const r = await reglages();
	const choix = nettoie(f.get('categorie'), 40);
	const categorie = r.categories_messages.some((c) => c.cle === choix) ? choix : 'devis';
	const d = {
		categorie,
		nom: nettoie(f.get('nom'), 120),
		institution: nettoie(f.get('institution'), 160),
		email: nettoie(f.get('email'), 160),
		projets: categorie !== 'devis' ? [] : f.getAll('projets').map((x) => nettoie(x, 80)).slice(0, 12),
		public: nettoie(f.get('public'), 120),
		dates: nettoie(f.get('dates'), 160),
		budget: nettoie(f.get('budget'), 80),
		message: nettoie(f.get('message'), 5000),
		lu: false,
	};
	const manque = [];
	if (!d.nom) manque.push('nom');
	if (categorie === 'devis' && !d.institution) manque.push('institution');
	if (categorie !== 'devis') { d.public = ''; d.dates = ''; d.budget = ''; }
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) manque.push('email');
	if (!d.message) manque.push('message');
	if (f.get('accord') !== '1') manque.push('accord');
	if (manque.length) return { manque };
	await ecrire('messages', null, d);
	await prevenir(d).catch((e) => console.error('Notification e-mail :', e.message));
	return { ok: true };
}

export async function enregistrerTemoignage(f) {
	const ou = nettoie(f.get('ou'), 120);
	const t = {
		nom: nettoie(f.get('nom'), 60),
		ou: ou === 'autre' ? nettoie(f.get('lieu'), 80) : ou,
		message: nettoie(f.get('message'), 1500),
		statut: 'attente',
		accord: true,
	};
	const manque = [];
	if (!t.nom) manque.push('nom');
	if (!t.message) manque.push('message');
	if (f.get('accord') !== '1') manque.push('accord');
	if (manque.length) return { manque };
	await ecrire('temoignages', null, t);
	await prevenirAssociation({
		sujet: `Nouveau témoignage à relire (${t.nom})`,
		texte: `${t.nom}${t.ou ? ' · ' + t.ou : ''} a laissé un témoignage :\n\n« ${t.message} »\n\nIl n’est pas encore visible sur le site. Pour le publier : ${urlSite()}/admin/temoignages/`,
	}).catch((e) => console.error('Notification e-mail :', e.message));
	return { ok: true };
}

/** Copie de la demande de devis dans la boîte mail de l'association. */
async function prevenir(d) {
	const r = await reglages();
	const type = r.categories_messages.find((c) => c.cle === d.categorie)?.nom || 'Demande';
	const lignes = [
		`Nouvelle demande sur le site ${r.nom} : ${type.toLowerCase()}.`, '',
		`Nom : ${d.nom}`, d.institution ? `Institution : ${d.institution}` : '', `E-mail : ${d.email}`,
		d.projets.length ? `Type de projet : ${d.projets.join(', ')}` : '', d.public ? `Public : ${d.public}` : '',
		d.dates ? `Dates : ${d.dates}` : '', d.budget ? `Budget : ${d.budget}` : '', '', d.categorie === 'devis' ? 'Projet :' : 'Message :', d.message, '',
		'Pour répondre, utilisez simplement « Répondre » : la réponse part vers l’adresse de la personne.',
		`Toutes les demandes : ${urlSite()}/admin/messages/`,
	].filter((l) => l !== null);
	await prevenirAssociation({ sujet: `${type} : ${d.institution || d.nom}`, texte: lignes.join('\n'), repondreA: d.email });
}
