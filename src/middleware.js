// Protège le back-office : toute adresse /admin demande d'être connectée.
import { utilisateur, deconnecter } from './lib/auth.js';
import { roleDe, estReserve } from './lib/comptes.js';
import { contexteAdmin } from './lib/donnees.js';

const LIBRES = ['/admin/connexion', '/admin/mot-de-passe-oublie', '/admin/nouveau-mot-de-passe'];

export async function onRequest(ctx, next) {
	const chemin = ctx.url.pathname;
	if (!chemin.startsWith('/admin')) return next();
	if (LIBRES.some((l) => chemin.startsWith(l))) return next();
	const u = await utilisateur(ctx.cookies);
	if (!u) {
		if (chemin.startsWith('/admin/api/')) return new Response(JSON.stringify({ erreur: 'Session expirée : reconnectez-vous.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
		return ctx.redirect('/admin/connexion/?retour=' + encodeURIComponent(chemin + ctx.url.search));
	}
	u.role = await roleDe(u.email, u.demo);
	if (!u.role) {
		deconnecter(ctx.cookies);
		return ctx.redirect('/admin/connexion/?erreur=' + encodeURIComponent('Ce compte n’a plus accès à l’espace Neotisse.'));
	}
	if (u.role !== 'fondatrice' && estReserve(chemin)) {
		if (chemin.startsWith('/admin/api/')) return new Response(JSON.stringify({ erreur: 'Réservé aux fondatrices.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
		return ctx.redirect('/admin/?erreur=' + encodeURIComponent('Cette partie est réservée aux fondatrices.'));
	}
	ctx.locals.utilisateur = u;
	const rep = await contexteAdmin.run({ utilisateur: u }, () => next());
	rep.headers.set('Cache-Control', 'no-store');
	rep.headers.set('X-Robots-Tag', 'noindex');
	return rep;
}
