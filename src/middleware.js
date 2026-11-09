// Protège le back-office : toute adresse /admin demande d'être connectée.
import { utilisateur } from './lib/auth.js';

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
	ctx.locals.utilisateur = u;
	const rep = await next();
	rep.headers.set('Cache-Control', 'no-store');
	rep.headers.set('X-Robots-Tag', 'noindex');
	return rep;
}
