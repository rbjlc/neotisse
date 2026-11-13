// Comptes du back-office et niveaux d'accès.
//
// Deux rôles :
// - « Fondatrice » : accès complet (messages, réglages, comptes…).
// - « Équipe » : gère les contenus du site, mais n'accède pas aux parties réservées ci-dessous.
//
// Les comptes créés directement dans Supabase par l'agence (sans fiche dans « comptes ») sont des fondatrices.
// Pour changer ce qu'une personne de l'équipe peut voir, modifier la liste RESERVE_FONDATRICES.
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { lister, ecrire, supprimer, modeSupabase, supabase } from './donnees.js';
import { DEMO } from './auth.js';
import { urlSite } from './site.js';

export const ROLES = {
	fondatrice: { nom: 'Fondatrice', resume: 'Accès complet : messages et demandes de devis, réglages, comptes.' },
	equipe: { nom: 'Équipe', resume: 'Gère les contenus (calendrier, actualités, ateliers, photos, textes…). Pas d’accès aux messages, aux réglages ni aux comptes.' },
};

/** Parties du back-office réservées aux fondatrices (début d'adresse). */
export const RESERVE_FONDATRICES = ['/admin/messages', '/admin/reglages', '/admin/comptes'];

export const estReserve = (chemin) => RESERVE_FONDATRICES.some((r) => chemin === r || chemin.startsWith(r + '/'));

const norm = (e) => String(e || '').trim().toLowerCase();

export async function fiches() {
	return (await lister('comptes')).map((c) => ({ ...c, email: norm(c.email) }));
}

/** Rôle d'une personne connectée. null = compte inconnu (accès refusé). */
export async function roleDe(email, demo) {
	email = norm(email);
	if (demo && email === norm(DEMO.email())) return 'fondatrice';
	const f = (await fiches()).find((c) => c.email === email);
	if (f) return ROLES[f.role] ? f.role : 'equipe';
	return demo ? null : 'fondatrice';
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
	const parEmail = new Map(liste.map((c) => [c.email, { ...c }]));
	if (modeSupabase()) {
		const { data, error } = await supabase().auth.admin.listUsers({ perPage: 200 });
		if (error) throw new Error('Lecture des comptes : ' + error.message);
		for (const u of data.users) {
			const e = norm(u.email);
			const f = parEmail.get(e) || { email: e, role: 'fondatrice' };
			parEmail.set(e, { ...f, auth_id: u.id, invitation: !u.last_sign_in_at });
		}
		// Fiches sans compte Supabase (compte supprimé ailleurs) : on ne les montre pas.
		for (const [e, c] of parEmail) if (!c.auth_id) parEmail.delete(e);
	} else {
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
		const { error } = await supabase().auth.admin.inviteUserByEmail(email, { redirectTo: urlSite() + '/admin/nouveau-mot-de-passe/' });
		if (error) return { erreur: 'L’invitation n’a pas pu partir : ' + error.message };
		await ecrire('comptes', null, { nom: String(nom || '').trim(), email, role });
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
	if (c.role === 'fondatrice' && role !== 'fondatrice' && fondatrices(liste) <= 1) return { erreur: 'Il faut garder au moins une fondatrice.' };
	const { auth_id, invitation, ...fiche } = c;
	await ecrire('comptes', c.id || null, { ...fiche, role });
	return { ok: `${c.nom || email} : ${ROLES[role].nom.toLowerCase()}.` };
}

export async function retirerCompte(email, moi) {
	email = norm(email);
	if (email === norm(moi)) return { erreur: 'Vous ne pouvez pas retirer votre propre accès.' };
	const liste = await listeComptes();
	const c = liste.find((x) => x.email === email);
	if (!c || c.fixe) return { erreur: 'Ce compte ne peut pas être retiré.' };
	if (c.role === 'fondatrice' && fondatrices(liste) <= 1) return { erreur: 'Il faut garder au moins une fondatrice.' };
	if (modeSupabase() && c.auth_id) {
		const { error } = await supabase().auth.admin.deleteUser(c.auth_id);
		if (error) return { erreur: 'Impossible de retirer ce compte : ' + error.message };
	}
	if (c.id) await supprimer('comptes', c.id);
	return { ok: `Accès retiré pour ${c.nom || email}.` };
}
