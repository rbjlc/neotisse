// Outils du back-office : lecture des formulaires, conversion selon les schémas.
import { propre } from './html.js';
import { ancre } from './site.js';

/** Transforme les champs « a.b.0.c » d'un formulaire en objet { a: { b: [ { c } ] } }. */
export function formulaireEnObjet(formData) {
	const racine = {};
	for (const [nomBrut, valeur] of formData.entries()) {
		if (nomBrut.startsWith('_')) continue;
		const multiple = nomBrut.endsWith('[]');
		const parts = (multiple ? nomBrut.slice(0, -2) : nomBrut).split('.');
		let o = racine;
		parts.forEach((p, i) => {
			const dernier = i === parts.length - 1;
			const suivantNum = !dernier && /^\d+$/.test(parts[i + 1]);
			if (dernier) {
				if (multiple) (o[p] ||= []).push(valeur);
				else o[p] = valeur; // le dernier gagne (case à cocher après son champ caché)
			} else {
				o[p] ||= suivantNum ? [] : {};
				o = o[p];
			}
		});
	}
	return racine;
}

const bool = (v) => v === true || v === '1' || v === 'on' || v === 'true';

/** Applique les types d'une liste de champs à un objet saisi. */
export function convertir(champs, brut = {}) {
	const r = {};
	for (const c of champs) {
		if (!c.cle) continue; // intertitre
		const chemin = c.cle.split('.');
		const v = chemin.reduce((o, k) => (o == null ? undefined : o[k]), brut);
		let val;
		switch (c.type) {
			case 'case': val = bool(v); break;
			case 'nombre': val = v === '' || v == null ? null : Number(String(v).replace(',', '.')); break;
			case 'riche': val = propre(v); break;
			case 'image': val = { src: String(v?.src || '').trim(), alt: String(v?.alt || '').trim() }; break;
			case 'bouton': val = { texte: String(v?.texte || '').trim(), lien: String(v?.lien || '').trim() }; break;
			case 'multiple': val = Array.isArray(v) ? v.filter(Boolean) : v ? [v] : []; break;
			case 'lignes': val = String(v || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean); break;
			case 'liste': {
				const items = Array.isArray(v) ? v.filter(Boolean) : Object.values(v || {});
				val = items.map((it) => convertir(c.champs, it));
				if (c.simple) val = val.map((it) => it[c.simple]).filter((x) => x && (x.src || typeof x !== 'object'));
				// clés techniques des catégories : déduites du nom si vides
				if (c.champs.some((x) => x.cle === 'cle')) {
					const vues = new Set();
					val = val.filter((it) => it.nom).map((it) => {
						let cle = it.cle || ancre(it.nom) || 'cat';
						while (vues.has(cle)) cle += '-2';
						vues.add(cle);
						return { ...it, cle };
					});
				}
				break;
			}
			default: val = String(v ?? '').trim();
		}
		// réécrit au bon endroit (clés « objectif.nombre »)
		let o = r;
		chemin.slice(0, -1).forEach((k) => { o = o[k] ||= {}; });
		o[chemin[chemin.length - 1]] = val;
	}
	return r;
}

/** Valeur d'un champ dans un objet, avec chemin « a.b ». */
export const valeurDe = (obj, cle) => cle.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

/** Adresse de page unique à partir du titre. */
export function adresseUnique(base, existants, id) {
	const pris = new Set(existants.filter((f) => f.id !== id).map((f) => f.slug));
	let s = ancre(base) || 'page';
	let n = 2;
	const depart = s;
	while (pris.has(s)) s = `${depart}-${n++}`;
	return s;
}

/** Début de la période de l'objectif (semaine, mois, trimestre, année). */
export function debutPeriode(periode, d = new Date()) {
	const a = d.getFullYear(), m = d.getMonth();
	if (periode === 'annee') return new Date(a, 0, 1);
	if (periode === 'trimestre') return new Date(a, m - (m % 3), 1);
	if (periode === 'semaine') { const j = (d.getDay() + 6) % 7; return new Date(a, m, d.getDate() - j); }
	return new Date(a, m, 1);
}
export const NOM_PERIODE = { semaine: 'cette semaine', mois: 'ce mois-ci', trimestre: 'ce trimestre', annee: 'cette année' };

/** Listes de choix utilisées par les formulaires (catégories, repères…). */
export async function sourcesAdmin() {
	const { reglages, partenaires } = await import('./site.js');
	const [r, p] = await Promise.all([reglages(), partenaires()]);
	return {
		categories: r.categories.map((c) => [c.cle, c.nom]),
		reperes: r.reperes.map((x) => [x.cle, x.nom]),
		categories_messages: r.categories_messages.map((x) => [x.cle, x.nom]),
		partenaires: p.filter((x) => x.lien).map((x) => [x.lien, x.nom]),
	};
}
