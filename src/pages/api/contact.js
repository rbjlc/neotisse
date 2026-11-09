import { estUnRobot, enregistrerDemande } from '../../lib/formulaires.js';

export async function POST({ request, redirect }) {
	const f = await request.formData();
	if (estUnRobot(f)) return redirect('/contact/?devis=merci#formulaire', 303);
	try {
		const r = await enregistrerDemande(f);
		if (r.manque) return redirect(`/contact/?devis=erreur&manque=${r.manque.join(',')}#formulaire`, 303);
		return redirect('/contact/?devis=merci#formulaire', 303);
	} catch (e) {
		console.error(e);
		return redirect('/contact/?devis=probleme#formulaire', 303);
	}
}
