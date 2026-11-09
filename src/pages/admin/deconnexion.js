import { deconnecter } from '../../lib/auth.js';
export function POST({ cookies, redirect }) {
	deconnecter(cookies);
	return redirect('/admin/connexion/?ok=' + encodeURIComponent('Vous êtes déconnectée. À bientôt !'), 303);
}
