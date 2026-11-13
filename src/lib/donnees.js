// Accès aux données du site.
//
// Deux modes, choisis automatiquement :
// - Supabase (production) : quand SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont renseignées.
// - Démo (sur ton ordinateur) : sans Supabase, les données sont gardées dans le fichier
//   .donnees/base.json et les photos dans public/envois/. Pratique pour tester.
//
// Chaque « table » contient des fiches { id, ...champs, cree_le }.

import { createClient } from '@supabase/supabase-js';
import { AsyncLocalStorage } from 'node:async_hooks';
import depart from '../data/depart.mjs';

const env = (k) => (typeof process !== 'undefined' && process.env[k]) || import.meta.env[k] || '';

export const TABLES = ['reglages', 'pages', 'ateliers', 'evenements', 'actualites', 'partenaires', 'temoignages', 'messages', 'medias', 'comptes', 'journal'];

export const modeSupabase = () => !!(env('SUPABASE_URL') && env('SUPABASE_SERVICE_ROLE_KEY'));

let client;
export function supabase() {
	if (!client) {
		client = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
			auth: { persistSession: false, autoRefreshToken: false },
		});
	}
	return client;
}

const nouvelId = () => (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36));
const maintenant = () => new Date().toISOString();
const verifier = (table) => { if (!TABLES.includes(table)) throw new Error('Table inconnue : ' + table); };

/* ------------------------------------------------------------------ */
/* Mode Supabase : une table SQL par type, colonnes id / data / cree_le */
/* ------------------------------------------------------------------ */
const sb = {
	async lister(table) {
		const { data, error } = await supabase().from(table).select('id, data, cree_le').order('cree_le', { ascending: true });
		if (error) throw new Error(`Lecture ${table} : ${error.message}`);
		return data.map((l) => ({ ...l.data, id: l.id, cree_le: l.cree_le }));
	},
	async lire(table, id) {
		const { data, error } = await supabase().from(table).select('id, data, cree_le').eq('id', id).maybeSingle();
		if (error) throw new Error(`Lecture ${table} : ${error.message}`);
		return data ? { ...data.data, id: data.id, cree_le: data.cree_le } : null;
	},
	async ecrire(table, id, champs) {
		const { id: _i, cree_le: _c, ...data } = champs;
		const ligne = { id: id || nouvelId(), data };
		const { error } = await supabase().from(table).upsert(ligne, { onConflict: 'id' });
		if (error) throw new Error(`Enregistrement ${table} : ${error.message}`);
		return ligne.id;
	},
	async supprimer(table, id) {
		const { error } = await supabase().from(table).delete().eq('id', id);
		if (error) throw new Error(`Suppression ${table} : ${error.message}`);
	},
	async purger(table, avant) {
		const { error } = await supabase().from(table).delete().lt('cree_le', avant);
		if (error) throw new Error(`Purge ${table} : ${error.message}`);
	},
	async envoyerFichier(nom, contenu, type) {
		const chemin = `${new Date().toISOString().slice(0, 7)}/${Date.now()}-${nom}`;
		const { error } = await supabase().storage.from('photos').upload(chemin, contenu, { contentType: type, upsert: false });
		if (error) throw new Error('Envoi de la photo : ' + error.message);
		return supabase().storage.from('photos').getPublicUrl(chemin).data.publicUrl;
	},
	async supprimerFichier(url) {
		const repere = '/storage/v1/object/public/photos/';
		const i = url.indexOf(repere);
		if (i < 0) return; // photo d'origine du site : on ne la supprime pas
		await supabase().storage.from('photos').remove([decodeURIComponent(url.slice(i + repere.length))]);
	},
};

/* ------------------------------------------------------------------ */
/* Mode démo : un fichier JSON sur l'ordinateur                         */
/* ------------------------------------------------------------------ */
let memoire = null;
let fs = null, path = null;
async function outils() {
	if (!fs) {
		fs = await import('node:fs/promises');
		path = await import('node:path');
	}
}
const fichierBase = () => path.join(process.cwd(), '.donnees', 'base.json');

function baseDeDepart() {
	const date = '2026-11-03T10:00:00.000Z';
	const base = {};
	for (const t of TABLES) base[t] = [];
	base.reglages = [{ ...depart.reglages, id: 'site', cree_le: date }];
	base.pages = Object.entries(depart.pages).map(([id, p]) => ({ ...p, id, cree_le: date }));
	for (const t of ['ateliers', 'evenements', 'actualites', 'partenaires', 'temoignages', 'messages', 'medias']) {
		base[t] = (depart[t] || []).map((f) => ({ cree_le: date, ...f }));
	}
	return structuredClone(base);
}

async function chargerDemo() {
	if (memoire) return memoire;
	await outils();
	try {
		memoire = JSON.parse(await fs.readFile(fichierBase(), 'utf8'));
		for (const t of TABLES) memoire[t] ||= [];
	} catch {
		memoire = baseDeDepart();
		await sauverDemo();
	}
	return memoire;
}
async function sauverDemo() {
	try {
		await fs.mkdir(path.dirname(fichierBase()), { recursive: true });
		await fs.writeFile(fichierBase(), JSON.stringify(memoire, null, 2));
	} catch {
		// Serveur en lecture seule (ex. Netlify sans Supabase) : les changements restent en mémoire.
	}
}

const demo = {
	async lister(table) { return structuredClone((await chargerDemo())[table]); },
	async lire(table, id) { return structuredClone((await chargerDemo())[table].find((f) => f.id === id) || null); },
	async ecrire(table, id, champs) {
		const base = await chargerDemo();
		const { id: _i, cree_le: _c, ...data } = structuredClone(champs);
		const existant = id && base[table].find((f) => f.id === id);
		if (existant) Object.assign(existant, data);
		else base[table].push({ ...data, id: id || nouvelId(), cree_le: maintenant() });
		await sauverDemo();
		return existant ? id : base[table][base[table].length - 1].id;
	},
	async supprimer(table, id) {
		const base = await chargerDemo();
		base[table] = base[table].filter((f) => f.id !== id);
		await sauverDemo();
	},
	async purger(table, avant) {
		const base = await chargerDemo();
		base[table] = base[table].filter((f) => !f.cree_le || f.cree_le >= avant);
		await sauverDemo();
	},
	async envoyerFichier(nom, contenu) {
		await outils();
		const dossier = path.join(process.cwd(), 'public', 'envois');
		await fs.mkdir(dossier, { recursive: true });
		const fichier = `${Date.now()}-${nom}`;
		await fs.writeFile(path.join(dossier, fichier), Buffer.from(contenu));
		return '/envois/' + fichier;
	},
	async supprimerFichier(url) {
		if (!url.startsWith('/envois/')) return;
		await outils();
		await fs.rm(path.join(process.cwd(), 'public', url), { force: true });
	},
};

const pilote = () => (modeSupabase() ? sb : demo);

export const lister = (t) => { verifier(t); return pilote().lister(t); };
export const lire = (t, id) => { verifier(t); return pilote().lire(t, id); };

/* ------------------------------------------------------------------ */
/* Journal : qui a créé, modifié ou supprimé quoi dans le back-office   */
/* ------------------------------------------------------------------ */
// Le middleware range ici la personne connectée pendant le traitement de sa page.
// Les formulaires publics (contact, témoignage) n'ont pas de personne connectée : rien n'est noté.
export const contexteAdmin = new AsyncLocalStorage();
const IGNORES = ['id', 'cree_le', 'mdp_hache'];
const titreDe = (t, f = {}) => (t === 'comptes' ? f.email : f.titre || f.nom || f.question || f.alt || f.email || '') || '';

async function noter(action, t, id, champs, avant) {
	const qui = contexteAdmin.getStore()?.utilisateur;
	if (!qui || t === 'journal') return;
	const apres = champs || {};
	let modifies = [];
	if (action === 'modification') {
		modifies = [...new Set([...Object.keys(apres), ...Object.keys(avant || {})])]
			.filter((k) => !IGNORES.includes(k) && k in apres && JSON.stringify(apres[k]) !== JSON.stringify(avant?.[k]));
		if (!modifies.length || modifies.every((k) => k === 'lu')) return; // ouvrir un message n'est pas une modification
	}
	const ligne = { qui: qui.email, action, table: t, cible: id, titre: String(titreDe(t, action === 'suppression' ? avant : { ...avant, ...apres })).slice(0, 140), champs: modifies.slice(0, 12) };
	if (modifies.includes('statut')) ligne.statut = apres.statut;
	if (modifies.includes('role')) ligne.role = apres.role;
	await pilote().ecrire('journal', null, ligne);
}

export async function ecrire(t, id, champs) {
	verifier(t);
	const suivi = contexteAdmin.getStore() && t !== 'journal';
	const avant = suivi && id ? await pilote().lire(t, id) : null;
	const nid = await pilote().ecrire(t, id, champs);
	if (suivi) await noter(avant ? 'modification' : 'creation', t, nid, champs, avant).catch((e) => console.error('Journal :', e.message));
	return nid;
}
export async function supprimer(t, id) {
	verifier(t);
	const suivi = contexteAdmin.getStore() && t !== 'journal';
	const avant = suivi ? await pilote().lire(t, id) : null;
	await pilote().supprimer(t, id);
	if (suivi && avant) await noter('suppression', t, id, null, avant).catch((e) => console.error('Journal :', e.message));
}
export const envoyerFichier = (nom, contenu, type) => pilote().envoyerFichier(nom, contenu, type);
export const supprimerFichier = (url) => pilote().supprimerFichier(url || '');

/** Supprime les messages et témoignages de plus de 3 ans, et le journal de plus d'un an (RGPD). */
export async function purgerVieillesDonnees() {
	const avant = new Date();
	avant.setFullYear(avant.getFullYear() - 3);
	const iso = avant.toISOString();
	await pilote().purger('messages', iso);
	await pilote().purger('temoignages', iso);
	const unAn = new Date();
	unAn.setFullYear(unAn.getFullYear() - 1);
	await pilote().purger('journal', unAn.toISOString());
}
