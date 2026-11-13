// Connexion au back-office.
// - Avec Supabase : comptes créés dans Supabase (Authentication → Users), mot de passe oubliable.
// - En mode démo : identifiants du fichier .env (ADMIN_EMAIL / ADMIN_MOT_DE_PASSE).
import { createClient } from '@supabase/supabase-js';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { modeSupabase, supabase } from './donnees.js';

const env = (k, d = '') => process.env[k] || import.meta.env[k] || d;
const SECURE = () => env('NODE_ENV') === 'production' || !!env('NETLIFY');
/** Le mode démo (identifiants du fichier .env) ne fonctionne jamais sur le site en ligne. */
const demoInterdit = () => !!(env('NETLIFY') || env('CONTEXT') || env('URL')) && !modeSupabase();
const opts = (maxAge) => ({ path: '/', httpOnly: true, sameSite: 'lax', secure: SECURE(), maxAge });

export const DEMO = { email: () => env('ADMIN_EMAIL', 'demo@neotisse.fr'), mdp: () => env('ADMIN_MOT_DE_PASSE', 'neotisse-demo') };

const clientNeuf = () => createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } });
const signe = (v) => createHmac('sha256', env('SESSION_SECRET', 'neotisse-demo-secret')).update(v).digest('hex');

function poserSession(cookies, session) {
	cookies.set('neo_at', session.access_token, opts(60 * 60));
	cookies.set('neo_rt', session.refresh_token, opts(60 * 60 * 24 * 30));
}

export async function connecter(cookies, email, mdp) {
	email = String(email || '').trim().toLowerCase();
	if (!email || !mdp) return { erreur: 'Indiquez votre e-mail et votre mot de passe.' };
	if (modeSupabase()) {
		const { data, error } = await clientNeuf().auth.signInWithPassword({ email, password: mdp });
		if (error || !data.session) return { erreur: 'E-mail ou mot de passe incorrect.' };
		poserSession(cookies, data.session);
		return { ok: true };
	}
	if (demoInterdit()) return { erreur: 'Le site en ligne n’est pas encore relié à Supabase : la connexion est désactivée.' };
	const a = Buffer.from(email + '|' + mdp), b = Buffer.from(DEMO.email().toLowerCase() + '|' + DEMO.mdp());
	const okDemo = a.length === b.length && timingSafeEqual(a, b);
	if (!okDemo && !(await (await import('./comptes.js')).connexionDemo(email, mdp))) return { erreur: 'E-mail ou mot de passe incorrect.' };
	const v = Buffer.from(email).toString('base64url');
	cookies.set('neo_demo', `${v}.${signe(v)}`, opts(60 * 60 * 24 * 7));
	return { ok: true };
}

/** Renvoie { email } si la personne est connectée, sinon null. Rafraîchit la session si besoin. */
export async function utilisateur(cookies) {
	if (modeSupabase()) {
		const at = cookies.get('neo_at')?.value;
		if (at) {
			const { data } = await supabase().auth.getUser(at);
			if (data?.user) return { email: data.user.email, id: data.user.id };
		}
		const rt = cookies.get('neo_rt')?.value;
		if (!rt) return null;
		const { data, error } = await clientNeuf().auth.refreshSession({ refresh_token: rt });
		if (error || !data.session) return null;
		poserSession(cookies, data.session);
		return { email: data.user.email, id: data.user.id };
	}
	if (demoInterdit()) return null;
	const c = cookies.get('neo_demo')?.value || '';
	const [v, s] = c.split('.');
	if (!v || !s || signe(v) !== s) return null;
	return { email: Buffer.from(v, 'base64url').toString(), demo: true };
}

export function deconnecter(cookies) {
	for (const n of ['neo_at', 'neo_rt', 'neo_demo']) cookies.delete(n, { path: '/' });
}

export async function envoyerLienMotDePasse(email, urlRetour) {
	if (!modeSupabase()) return;
	await clientNeuf().auth.resetPasswordForEmail(String(email).trim().toLowerCase(), { redirectTo: urlRetour });
}

/** Nouveau mot de passe à partir du lien reçu par e-mail (invitation ou oubli). */
export async function changerMotDePasse(cookies, jeton, mdp) {
	if (!modeSupabase()) return { erreur: 'Disponible seulement une fois le site relié à Supabase.' };
	if (String(mdp).length < 10) return { erreur: 'Choisissez un mot de passe d’au moins 10 caractères.' };
	const { data } = await supabase().auth.getUser(jeton);
	if (!data?.user) return { erreur: 'Le lien a expiré. Redemandez un e-mail depuis « Mot de passe oublié ».' };
	const { error } = await supabase().auth.admin.updateUserById(data.user.id, { password: mdp });
	if (error) return { erreur: 'Impossible d’enregistrer ce mot de passe : ' + error.message };
	return connecter(cookies, data.user.email, mdp);
}

/** Changer son propre mot de passe depuis « Mon compte » (l'ancien est demandé). */
export async function changerMonMotDePasse(cookies, email, ancien, nouveau) {
	email = String(email || '').trim().toLowerCase();
	if (String(nouveau).length < 10) return { erreur: 'Choisissez un mot de passe d’au moins 10 caractères.' };
	if (nouveau === ancien) return { erreur: 'Le nouveau mot de passe doit être différent de l’ancien.' };
	if (modeSupabase()) {
		const { data, error } = await clientNeuf().auth.signInWithPassword({ email, password: ancien });
		if (error || !data.user) return { erreur: 'Le mot de passe actuel n’est pas le bon.' };
		const { error: e2 } = await supabase().auth.admin.updateUserById(data.user.id, { password: nouveau });
		if (e2) return { erreur: 'Impossible d’enregistrer ce mot de passe : ' + e2.message };
		const { data: d3 } = await clientNeuf().auth.signInWithPassword({ email, password: nouveau });
		if (d3?.session) poserSession(cookies, d3.session);
		return { ok: true };
	}
	if (email === DEMO.email().toLowerCase()) return { erreur: 'Le compte de démonstration ne peut pas changer de mot de passe (il est fixé dans le fichier .env).' };
	const { fiches, verifier, hacher } = await import('./comptes.js');
	const f = (await fiches()).find((c) => c.email === email);
	if (!f || !verifier(ancien, f.mdp_hache)) return { erreur: 'Le mot de passe actuel n’est pas le bon.' };
	const { ecrire } = await import('./donnees.js');
	await ecrire('comptes', f.id, { ...f, mdp_hache: hacher(nouveau) });
	return { ok: true };
}

/** Changer sa propre adresse e-mail depuis « Mon compte » (le mot de passe est demandé). Le niveau d'accès suit l'adresse. */
export async function changerMonEmail(cookies, email, mdp, nouvel) {
	email = String(email || '').trim().toLowerCase();
	nouvel = String(nouvel || '').trim().toLowerCase();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nouvel)) return { erreur: 'Cette nouvelle adresse e-mail n’est pas valide.' };
	if (nouvel === email) return { erreur: 'C’est déjà votre adresse.' };
	const { fiches, listeComptes } = await import('./comptes.js');
	const { ecrire } = await import('./donnees.js');
	if ((await listeComptes()).some((c) => c.email === nouvel)) return { erreur: 'Un compte utilise déjà cette adresse.' };
	if (modeSupabase()) {
		const { data, error } = await clientNeuf().auth.signInWithPassword({ email, password: mdp });
		if (error || !data.user) return { erreur: 'Le mot de passe n’est pas le bon.' };
		const { error: e2 } = await supabase().auth.admin.updateUserById(data.user.id, { email: nouvel, email_confirm: true });
		if (e2) return { erreur: 'Impossible de changer l’adresse : ' + e2.message };
		// Le niveau d'accès est rattaché à l'identifiant du compte : seule l'adresse affichée est mise à jour.
		const { lire } = await import('./donnees.js');
		const fiche = await lire('comptes', data.user.id);
		if (fiche) await ecrire('comptes', data.user.id, { ...fiche, email: nouvel });
		const { data: d3 } = await clientNeuf().auth.signInWithPassword({ email: nouvel, password: mdp });
		if (d3?.session) poserSession(cookies, d3.session);
		return { ok: true };
	}
	if (email === DEMO.email().toLowerCase()) return { erreur: 'Le compte de démonstration ne peut pas changer d’adresse (elle est fixée dans le fichier .env).' };
	const { verifier } = await import('./comptes.js');
	const fiche = (await fiches()).find((c) => c.email === email);
	if (!fiche || !verifier(mdp, fiche.mdp_hache)) return { erreur: 'Le mot de passe n’est pas le bon.' };
	await ecrire('comptes', fiche.id, { ...fiche, email: nouvel });
	const v = Buffer.from(nouvel).toString('base64url');
	cookies.set('neo_demo', `${v}.${signe(v)}`, opts(60 * 60 * 24 * 7));
	return { ok: true };
}
