// Fonctions utiles aux pages publiques : lire les contenus, formater les dates, la typographie.
import depart from '../data/depart.mjs';
import { lister, lire } from './donnees.js';

/** Fusionne les valeurs enregistrées avec les valeurs de départ (pour les champs jamais remplis). */
export function fusion(base, valeurs) {
	if (valeurs === undefined || valeurs === null) return structuredClone(base);
	if (Array.isArray(base) || Array.isArray(valeurs)) return structuredClone(valeurs);
	if (typeof base !== 'object' || base === null || typeof valeurs !== 'object') return valeurs;
	const r = structuredClone(base);
	for (const [k, v] of Object.entries(valeurs)) r[k] = fusion(base[k], v);
	return r;
}

export async function reglages() {
	return fusion(depart.reglages, await lire('reglages', 'site'));
}

export async function page(cle) {
	return fusion(depart.pages[cle] || {}, await lire('pages', cle));
}

const parOrdre = (a, b) => (Number(a.ordre) || 0) - (Number(b.ordre) || 0);
const aujourdhui = () => new Date().toISOString().slice(0, 10);

export async function ateliers() {
	return (await lister('ateliers')).filter((a) => a.publie !== false).sort(parOrdre);
}

/** Événements publiés, à venir (ou en cours), du plus proche au plus lointain. */
export async function evenements() {
	const auj = aujourdhui();
	return (await lister('evenements'))
		.filter((e) => e.publie !== false && e.date_debut)
		.filter((e) => {
			const fin = e.date_fin || e.date_debut;
			// Une date « à confirmer » reste affichée jusqu'à la fin de son mois.
			return e.a_confirmer ? fin.slice(0, 7) >= auj.slice(0, 7) : fin >= auj;
		})
		.sort((a, b) => a.date_debut.localeCompare(b.date_debut));
}

export async function actualites() {
	return (await lister('actualites'))
		.filter((a) => a.publie !== false)
		.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export async function partenaires() {
	return (await lister('partenaires')).filter((p) => p.publie !== false).sort(parOrdre);
}

export async function temoignages() {
	return (await lister('temoignages'))
		.filter((t) => t.statut === 'publie')
		.sort((a, b) => (b.cree_le || '').localeCompare(a.cree_le || ''));
}

/* ---------- Catégories (couleurs des étiquettes) ---------- */
export function categorie(r, cle) {
	return r.categories.find((c) => c.cle === cle) || { cle: cle || 'autre', nom: cle || '', pluriel: cle || '', couleur: 'olive' };
}
const COULEURS = { gaude: 'var(--gaude)', olive: 'var(--olive)', guede: 'var(--guede)', garance: 'var(--garance)' };
export const couleur = (c) => COULEURS[c] || 'var(--olive)';

/* ---------- Dates en français ---------- */
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MOIS_COURT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const decoupe = (iso) => { const [a, m, j] = iso.slice(0, 10).split('-').map(Number); return { a, m, j, d: new Date(Date.UTC(a, m - 1, j)) }; };

export const dateLongue = (iso) => { if (!iso) return ''; const { a, m, j } = decoupe(iso); return `${j === 1 ? '1er' : j} ${MOIS[m - 1]} ${a}`; };
export const moisAnnee = (iso) => { const { a, m } = decoupe(iso); return `${MOIS[m - 1][0].toUpperCase()}${MOIS[m - 1].slice(1)} ${a}`; };
export const moisCourt = (iso) => MOIS_COURT[decoupe(iso).m - 1];
export const jourSemaine = (iso) => { const { j, m, a, d } = decoupe(iso); return `${JOURS[d.getUTCDay()]} ${j === 1 ? '1er' : j} ${MOIS[m - 1]} ${a}`; };

/** Texte lisible d'une date d'événement : « samedi 16 janvier 2027 », « 9 au 10 octobre 2027 »… */
export function dateEvenement(e) {
	if (e.a_confirmer) return `${MOIS[decoupe(e.date_debut).m - 1]} ${decoupe(e.date_debut).a} (date à confirmer)`;
	if (!e.date_fin || e.date_fin === e.date_debut) return jourSemaine(e.date_debut);
	const d = decoupe(e.date_debut), f = decoupe(e.date_fin);
	if (d.m === f.m && d.a === f.a) return `${d.j} au ${f.j} ${MOIS[f.m - 1]} ${f.a}`;
	return `${d.j} ${MOIS[d.m - 1]} au ${f.j} ${MOIS[f.m - 1]} ${f.a}`;
}
export function jourCourt(e) {
	if (e.a_confirmer) return '—';
	const d = decoupe(e.date_debut);
	if (!e.date_fin || e.date_fin === e.date_debut) return String(d.j);
	const f = decoupe(e.date_fin);
	return d.m === f.m ? `${d.j}-${f.j}` : `${d.j}`;
}

/** « Nouveau » pendant 30 jours après la date de publication. */
export const estNouveau = (iso) => !!iso && Date.now() - decoupe(iso).d.getTime() < 30 * 864e5;

/* ---------- Typographie française ---------- */
// Espace insécable avant : ; ! ? » et après «, pour éviter qu'un signe se retrouve seul à la ligne.
export function typo(texte) {
	if (!texte) return '';
	return String(texte)
		.replace(/ ([:;!?»])/g, ' $1')
		.replace(/« /g, '« ')
		.replace(/(\d) (€|%)/g, '$1 $2');
}
/** Même chose dans du HTML, sans toucher aux balises. */
export function typoHtml(html) {
	if (!html) return '';
	return String(html).split(/(<[^>]+>)/g).map((m) => (m.startsWith('<') ? m : typo(m))).join('');
}
/** « savoir-faire » ne se coupe jamais en fin de ligne. */
export const insecables = (html) => String(html || '').replace(/savoir-faire/g, '<span class="insecable">savoir-faire</span>');

export const ancre = (texte) => String(texte || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const urlSite = () => (process.env.URL || process.env.SITE_URL || import.meta.env.SITE || 'http://localhost:4321').replace(/\/$/, '');
