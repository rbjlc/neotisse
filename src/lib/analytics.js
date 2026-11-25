// Audience du site : lit les chiffres de Google Analytics 4 côté serveur, pour les afficher dans le back-office.
// Les fondatrices n'ont pas besoin de se connecter à Google : le site lit les chiffres avec un « compte de service »
// (un compte robot Google, en lecture seule). Sa clé reste dans les réglages de Netlify, jamais dans le code.
//
// Variables d'environnement (Netlify > Site configuration > Environment variables) :
//   GA_PROPERTY_ID   numéro de la propriété GA4 (Administration > Paramètres de la propriété), ex. 512345678
//   GA_CLIENT_EMAIL  adresse du compte de service, ex. neotisse-stats@mon-projet.iam.gserviceaccount.com
//   GA_PRIVATE_KEY   la clé privée du fichier JSON (champ private_key), collée telle quelle
import { createSign, createPrivateKey } from 'node:crypto';
import { modeSupabase } from './donnees.js';

const env = (k) => (typeof process !== 'undefined' && process.env[k]) || import.meta.env[k] || '';

export const EVENEMENTS = [
	['generate_lead', 'Demandes envoyées', 'formulaire de contact envoyé avec succès'],
	['click_devis', 'Clics vers le devis', 'boutons « Demander un devis » ou « Contact »'],
	['envoi_temoignage', 'Témoignages envoyés', 'depuis le livre d’or'],
	['ajout_agenda', 'Ajouts au calendrier', 'bouton « Ajouter à mon agenda »'],
	['click_contact', 'Clics e-mail ou téléphone', 'adresse ou numéro de l’association'],
	['ouverture_faq', 'Questions fréquentes ouvertes', 'réponses dépliées'],
];

const CANAUX = {
	'Organic Search': 'Recherche Google', 'Direct': 'Accès direct', 'Organic Social': 'Réseaux sociaux',
	'Referral': 'Sites partenaires', 'Email': 'E-mail et newsletter', 'Paid Search': 'Annonces payantes',
	'Paid Social': 'Publicité sur les réseaux', 'Organic Video': 'Vidéo', 'Display': 'Bannières',
	'Unassigned': 'Provenance inconnue', '(other)': 'Autres',
};

export const PERIODES = {
	mois: 'Ce mois-ci',
	precedent: 'Le mois dernier',
	'28j': 'Les 28 derniers jours',
};

const iso = (d) => d.toISOString().slice(0, 10);
const moisFr = (d) => d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: 'Europe/Paris' });

/** Bornes de la période choisie et de la période de comparaison (même durée juste avant). */
export function bornes(periode, maintenant = new Date()) {
	const auj = new Date(Date.UTC(maintenant.getUTCFullYear(), maintenant.getUTCMonth(), maintenant.getUTCDate()));
	let debut, fin, avantDebut, avantFin, nom;
	if (periode === 'precedent') {
		debut = new Date(Date.UTC(auj.getUTCFullYear(), auj.getUTCMonth() - 1, 1));
		fin = new Date(Date.UTC(auj.getUTCFullYear(), auj.getUTCMonth(), 0));
		avantDebut = new Date(Date.UTC(auj.getUTCFullYear(), auj.getUTCMonth() - 2, 1));
		avantFin = new Date(Date.UTC(auj.getUTCFullYear(), auj.getUTCMonth() - 1, 0));
		nom = moisFr(debut);
	} else if (periode === '28j') {
		fin = auj; debut = new Date(auj); debut.setUTCDate(auj.getUTCDate() - 27);
		avantFin = new Date(debut); avantFin.setUTCDate(debut.getUTCDate() - 1);
		avantDebut = new Date(avantFin); avantDebut.setUTCDate(avantFin.getUTCDate() - 27);
		nom = 'les 28 derniers jours';
	} else {
		debut = new Date(Date.UTC(auj.getUTCFullYear(), auj.getUTCMonth(), 1)); fin = auj;
		const jours = Math.round((fin - debut) / 864e5);
		avantDebut = new Date(Date.UTC(auj.getUTCFullYear(), auj.getUTCMonth() - 1, 1));
		avantFin = new Date(avantDebut); avantFin.setUTCDate(avantDebut.getUTCDate() + jours);
		nom = moisFr(debut);
	}
	return { debut: iso(debut), fin: iso(fin), avantDebut: iso(avantDebut), avantFin: iso(avantFin), nom };
}

export const estRelie = () => !!(env('GA_PROPERTY_ID') && env('GA_CLIENT_EMAIL') && env('GA_PRIVATE_KEY'));

// ---------- Jeton d'accès Google (compte de service, lecture seule) ----------
/**
 * Remet la clé privée en forme, quelle que soit la façon dont elle a été collée dans Netlify :
 * avec ou sans guillemets, avec des « \n » écrits en toutes lettres, sur une seule ligne,
 * ou même le fichier JSON entier du compte de service.
 */
function clePrivee() {
	let brut = String(env('GA_PRIVATE_KEY')).trim();
	if (brut.startsWith('{')) {
		try { brut = JSON.parse(brut).private_key || brut; } catch { /* pas du JSON complet : on continue */ }
	}
	brut = brut.replace(/^["']+|["',]+$/g, '').replace(/\\n/g, '\n').replace(/\r/g, '');
	const corps = brut.replace(/-----(BEGIN|END) [A-Z ]*PRIVATE KEY-----/g, '').replace(/[^A-Za-z0-9+/=]/g, '');
	if (!corps) throw new Error('la clé GA_PRIVATE_KEY est vide dans Netlify');
	const pem = '-----BEGIN PRIVATE KEY-----\n' + corps.match(/.{1,64}/g).join('\n') + '\n-----END PRIVATE KEY-----\n';
	try { return createPrivateKey(pem); } catch {
		throw new Error('la clé GA_PRIVATE_KEY collée dans Netlify est incomplète (il faut tout le texte de private_key, du début à la fin)');
	}
}

let jeton = null;
const b64 = (x) => Buffer.from(typeof x === 'string' ? x : JSON.stringify(x)).toString('base64url');

async function acces() {
	if (jeton && jeton.expire > Date.now() + 60e3) return jeton.valeur;
	const maintenant = Math.floor(Date.now() / 1000);
	const corps = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({
		iss: env('GA_CLIENT_EMAIL'), scope: 'https://www.googleapis.com/auth/analytics.readonly',
		aud: 'https://oauth2.googleapis.com/token', iat: maintenant, exp: maintenant + 3600,
	});
	const signature = createSign('RSA-SHA256').update(corps).sign(clePrivee()).toString('base64url');
	const r = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: corps + '.' + signature }),
		signal: AbortSignal.timeout(8000),
	});
	const j = await r.json().catch(() => ({}));
	if (!r.ok || !j.access_token) throw new Error('connexion refusée par Google (' + (j.error_description || j.error || r.status) + ')');
	jeton = { valeur: j.access_token, expire: Date.now() + (j.expires_in || 3600) * 1000 };
	return jeton.valeur;
}

async function lots(demandes) {
	const id = String(env('GA_PROPERTY_ID')).replace(/\D/g, '');
	const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${id}:batchRunReports`, {
		method: 'POST',
		headers: { Authorization: 'Bearer ' + (await acces()), 'Content-Type': 'application/json' },
		body: JSON.stringify({ requests: demandes }),
		signal: AbortSignal.timeout(10000),
	});
	const j = await r.json().catch(() => ({}));
	if (!r.ok) {
		const m = j.error?.message || String(r.status);
		throw new Error(/permission|PERMISSION/i.test(m) ? 'le compte de service n’a pas accès à la propriété (ajoutez-le en Lecteur dans Google Analytics)' : m);
	}
	return j.reports || [];
}

const nombre = (row, i = 0) => Number(row?.metricValues?.[i]?.value || 0);

// ---------- Lecture des chiffres (gardés 15 minutes en mémoire) ----------
const cache = new Map();

/**
 * Renvoie { etat, ... } :
 *  etat "non-relie" : variables manquantes ; "exemple" : copie locale sans Google (chiffres fictifs) ;
 *  "erreur" : Google n'a pas répondu (message) ; "ok" : chiffres réels.
 */
export async function audience(periode = 'mois') {
	if (!PERIODES[periode]) periode = 'mois';
	const b = bornes(periode);
	if (!estRelie()) return modeSupabase() ? { etat: 'non-relie', b } : { etat: 'exemple', b, ...exemple(b) };
	const cle = periode + b.fin;
	const c = cache.get(cle);
	if (c && c.t > Date.now() - 15 * 60e3) return c.v;
	try {
		const deux = [{ startDate: b.debut, endDate: b.fin, name: 'p' }, { startDate: b.avantDebut, endDate: b.avantFin, name: 'a' }];
		const un = [{ startDate: b.debut, endDate: b.fin }];
		const [tot, evts, sources, pages, jours] = await lots([
			{ dateRanges: deux, metrics: [{ name: 'activeUsers' }, { name: 'newUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }] },
			{ dateRanges: deux, dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }],
				dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: EVENEMENTS.map((e) => e[0]) } } } },
			{ dateRanges: un, dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }],
				orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 6 },
			{ dateRanges: un, dimensions: [{ name: 'pageTitle' }], metrics: [{ name: 'screenPageViews' }],
				orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 6 },
			{ dateRanges: un, dimensions: [{ name: 'date' }], metrics: [{ name: 'activeUsers' }],
				orderBys: [{ dimension: { dimensionName: 'date' } }], keepEmptyRows: true },
		]);
		// Avec deux périodes, GA ajoute une dimension « dateRange » (valeur p ou a) : on la repère par son en-tête.
		const parPeriode = (rapport) => {
			const out = { p: {}, a: {} };
			const noms = (rapport?.dimensionHeaders || []).map((h) => h.name);
			let iPer = noms.indexOf('dateRange');
			for (const row of rapport?.rows || []) {
				const dims = row.dimensionValues.map((d) => d.value);
				if (iPer < 0) iPer = dims.length - 1;
				const per = dims[iPer] === 'a' ? 'a' : 'p';
				const autres = dims.filter((_, i) => i !== iPer);
				out[per][autres.length ? autres[0] : '_'] = row.metricValues.map((m) => Number(m.value || 0));
			}
			return out;
		};
		const t = parPeriode(tot), e = parPeriode(evts);
		const v = {
			etat: 'ok', b,
			totaux: ['activeUsers', 'newUsers', 'sessions', 'screenPageViews'].reduce((o, k, i) => ({ ...o, [k]: [t.p._?.[i] || 0, t.a._?.[i] || 0] }), {}),
			evenements: EVENEMENTS.map(([cle, nom, aide]) => ({ cle, nom, aide, n: e.p[cle]?.[0] || 0, avant: e.a[cle]?.[0] || 0 })),
			sources: (sources?.rows || []).map((r) => ({ nom: CANAUX[r.dimensionValues[0].value] || r.dimensionValues[0].value, n: nombre(r) })),
			pages: (pages?.rows || []).map((r) => ({ nom: r.dimensionValues[0].value.replace(/\s*\|\s*Neotisse$/, ''), n: nombre(r) })),
			jours: (jours?.rows || []).map((r) => ({ date: r.dimensionValues[0].value, n: nombre(r) })),
			lu: new Date().toISOString(),
		};
		cache.set(cle, { t: Date.now(), v });
		return v;
	} catch (err) {
		console.error('Audience GA4 :', err);
		return { etat: 'erreur', b, message: String(err.message || err) };
	}
}

/** Chiffres fictifs pour la copie locale (démo), pour voir à quoi ressemble la page. */
function exemple(b) {
	const jours = [];
	const d = new Date(b.debut + 'T00:00:00Z'), f = new Date(b.fin + 'T00:00:00Z');
	let k = 0;
	while (d <= f) { jours.push({ date: iso(d).replace(/-/g, ''), n: [3, 5, 2, 8, 6, 1, 0, 4, 7, 9, 5, 3, 2, 6][k++ % 14] }); d.setUTCDate(d.getUTCDate() + 1); }
	return {
		totaux: { activeUsers: [184, 148], newUsers: [151, 122], sessions: [236, 190], screenPageViews: [702, 611] },
		evenements: EVENEMENTS.map(([cle, nom, aide], i) => ({ cle, nom, aide, n: [2, 14, 3, 0, 6, 21][i], avant: [1, 9, 1, 2, 4, 17][i] })),
		sources: [{ nom: 'Recherche Google', n: 112 }, { nom: 'Réseaux sociaux', n: 61 }, { nom: 'Accès direct', n: 38 }, { nom: 'Sites partenaires', n: 25 }],
		pages: [{ nom: 'Ateliers textiles anciens à Montpellier', n: 241 }, { nom: 'Ateliers textiles : filage, tissage, teinture', n: 133 }, { nom: 'Démonstrations textiles : calendrier des ateliers', n: 98 }, { nom: 'Demande de devis pour un atelier textile', n: 71 }],
		jours, lu: new Date().toISOString(),
	};
}
