// Comptes du back-office et niveaux d'accès.
//
// Deux rôles :
// - « Responsable » (clé interne « fondatrice ») : accès complet (messages, réglages, comptes…).
// - « Équipe » : gère les contenus du site, mais n'accède pas aux parties réservées ci-dessous.
//
// Avec Supabase, la fiche d'un compte porte l'identifiant du compte (qui ne change jamais) : changer d'adresse
// e-mail ne change donc jamais le niveau d'accès. Les comptes créés directement dans Supabase par l'agence
// (sans fiche) sont des fondatrices.
// Pour changer ce qu'une personne de l'équipe peut voir, modifier la liste RESERVE_FONDATRICES.
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { lister, lire, ecrire, supprimer, modeSupabase, supabase } from './donnees.js';
import { DEMO } from './auth.js';
import { urlSite } from './site.js';

export const ROLES = {
	// Seul le nom affiché change si l'organisation évolue : la clé « fondatrice » reste la même dans la base.
	fondatrice: { nom: 'Responsable', resume: 'Accès complet : messages et demandes de devis, réglages, comptes, journal.' },
	equipe: { nom: 'Équipe', resume: 'Gère les contenus (calendrier, actualités, ateliers, photos, textes…). Pas d’accès aux messages, aux réglages ni aux comptes.' },
};

/** Parties du back-office réservées aux fondatrices (début d'adresse). */
export const RESERVE_FONDATRICES = ['/admin/messages', '/admin/reglages', '/admin/comptes', '/admin/journal'];

export const estReserve = (chemin) => RESERVE_FONDATRICES.some((r) => chemin === r || chemin.startsWith(r + '/'));

const norm = (e) => String(e || '').trim().toLowerCase();

export async function fiches() {
	return (await lister('comptes')).map((c) => ({ ...c, email: norm(c.email) }));
}

const roleValide = (f) => (ROLES[f.role] ? f.role : 'equipe');

/** Fiche d'un compte Supabase : par identifiant ; une ancienne fiche rangée par adresse est rattachée à l'identifiant. */
async function ficheSupabase(id, email) {
	const parId = await lire('comptes', id);
	if (parId) return parId;
	const ancienne = (await fiches()).find((c) => c.email === norm(email) && c.id !== id);
	if (!ancienne) return null;
	const { id: _ancien, ...reste } = ancienne;
	await ecrire('comptes', id, { ...reste, email: norm(email) });
	await supprimer('comptes', ancienne.id);
	return { ...reste, id };
}

/** Rôle d'une personne connectée ({ email, id, demo }). null = compte inconnu (accès refusé). */
export async function roleDe(u) {
	const email = norm(u?.email);
	if (u?.demo) {
		if (email === norm(DEMO.email())) return 'fondatrice';
		const f = (await fiches()).find((c) => c.email === email);
		return f ? roleValide(f) : null;
	}
	const f = await ficheSupabase(u.id, email);
	if (f) return roleValide(f);
	// Compte sans fiche (créé directement dans Supabase) : Fondatrice seulement s'il n'y a encore aucune fondatrice
	// (premier compte de l'association). Sinon il arrive en Équipe, et une fondatrice peut le passer Fondatrice.
	const premiere = !(await fiches()).some((c) => c.role === 'fondatrice');
	const role = premiere ? 'fondatrice' : 'equipe';
	await ecrire('comptes', u.id, { email, role });
	return role;
}

/* Mots de passe du mode démo (avec Supabase, c'est Supabase qui les gère). */
export function hacher(mdp) {
	const sel = randomBytes(16).toString('hex');
	return sel + ':' + scryptSync(String(mdp), sel, 32).toString('hex');
}
export function verifier(mdp, hache) {
	const [sel, h] = String(hache || '').split(':');
	if (!sel || !h) return false;
	const a = scryptSync(String(mdp), sel, 32), b = Buffer.from(h, 'hex');
	return a.length === b.length && timingSafeEqual(a, b);
}
export async function connexionDemo(email, mdp) {
	const f = (await fiches()).find((c) => c.email === norm(email));
	return !!(f && verifier(mdp, f.mdp_hache));
}

/** Tous les comptes, pour la page « Comptes ». */
export async function listeComptes() {
	const liste = await fiches();
	if (modeSupabase()) {
		const { data, error } = await supabase().auth.admin.listUsers({ perPage: 200 });
		if (error) throw new Error('Lecture des comptes : ' + error.message);
		// La liste part des comptes Supabase : une fiche sans compte (supprimé ailleurs) n'apparaît pas.
		return data.users.map((u) => {
			const e = norm(u.email);
			const sansFondatrice = !liste.some((c) => c.role === 'fondatrice');
			const f = liste.find((c) => c.id === u.id) || liste.find((c) => c.email === e) || { role: sansFondatrice ? 'fondatrice' : 'equipe' };
			return { ...f, id: u.id, email: e, role: roleValide(f), auth_id: u.id, invitation: !u.last_sign_in_at };
		}).sort((a, b) => (a.role === b.role ? a.email.localeCompare(b.email) : a.role === 'fondatrice' ? -1 : 1));
	}
	const parEmail = new Map(liste.map((c) => [c.email, { ...c }]));
	{
		const e = norm(DEMO.email());
		if (!parEmail.has(e)) parEmail.set(e, { email: e, nom: 'Compte de démonstration', role: 'fondatrice', fixe: true });
	}
	return [...parEmail.values()].sort((a, b) => (a.role === b.role ? a.email.localeCompare(b.email) : a.role === 'fondatrice' ? -1 : 1));
}

export async function ajouterCompte({ nom, email, role, mdp }) {
	email = norm(email);
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { erreur: 'Cette adresse e-mail n’est pas valide.' };
	if (!ROLES[role]) return { erreur: 'Choisissez un niveau d’accès.' };
	if ((await listeComptes()).some((c) => c.email === email)) return { erreur: 'Ce compte existe déjà.' };
	if (modeSupabase()) {
		const { data, error } = await supabase().auth.admin.inviteUserByEmail(email, { redirectTo: urlSite() + '/admin/nouveau-mot-de-passe/' });
		if (error) return { erreur: 'L’invitation n’a pas pu partir : ' + error.message };
		await ecrire('comptes', data.user.id, { nom: String(nom || '').trim(), email, role });
		return { ok: 'Invitation envoyée à ' + email + ' : la personne choisit son mot de passe depuis l’e-mail reçu.' };
	}
	if (String(mdp || '').length < 10) return { erreur: 'Mode démo : choisissez un mot de passe d’au moins 10 caractères pour ce compte.' };
	await ecrire('comptes', null, { nom: String(nom || '').trim(), email, role, mdp_hache: hacher(mdp) });
	return { ok: 'Compte créé pour ' + email + '.' };
}

const fondatrices = (liste) => liste.filter((c) => c.role === 'fondatrice').length;

export async function changerRole(email, role, moi) {
	email = norm(email);
	if (!ROLES[role]) return { erreur: 'Niveau d’accès inconnu.' };
	if (email === norm(moi)) return { erreur: 'Vous ne pouvez pas changer votre propre niveau d’accès.' };
	const liste = await listeComptes();
	const c = liste.find((x) => x.email === email);
	if (!c || c.fixe) return { erreur: 'Ce compte ne peut pas être modifié.' };
	if (c.role === 'fondatrice' && role !== 'fondatrice' && fondatrices(liste) <= 1) return { erreur: 'Il faut garder au moins une personne au niveau Responsable.' };
	const { auth_id, invitation, ...fiche } = c;
	await ecrire('comptes', modeSupabase() ? auth_id : c.id || null, { ...fiche, role });
	return { ok: `${c.nom || email} : ${ROLES[role].nom.toLowerCase()}.` };
}

export async function retirerCompte(email, moi) {
	email = norm(email);
	if (email === norm(moi)) return { erreur: 'Vous ne pouvez pas retirer votre propre accès.' };
	const liste = await listeComptes();
	const c = liste.find((x) => x.email === email);
	if (!c || c.fixe) return { erreur: 'Ce compte ne peut pas être retiré.' };
	if (c.role === 'fondatrice' && fondatrices(liste) <= 1) return { erreur: 'Il faut garder au moins une personne au niveau Responsable.' };
	if (modeSupabase() && c.auth_id) {
		const { error } = await supabase().auth.admin.deleteUser(c.auth_id);
		if (error) return { erreur: 'Impossible de retirer ce compte : ' + error.message };
	}
	for (const f of await fiches()) if (f.id === c.id || f.email === email) await supprimer('comptes', f.id);
	return { ok: `Accès retiré pour ${c.nom || email}.` };
}
