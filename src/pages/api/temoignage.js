import { estUnRobot, enregistrerTemoignage } from '../../lib/formulaires.js';

export async function POST({ request, redirect }) {
	const f = await request.formData();
	if (estUnRobot(f)) return redirect('/livre-or/?temoignage=merci#temoigner', 303);
	try {
		const r = await enregistrerTemoignage(f);
		if (r.manque) return redirect(`/livre-or/?temoignage=erreur&manque=${r.manque.join(',')}#temoigner`, 303);
		return redirect('/livre-or/?temoignage=merci#temoigner', 303);
	} catch (e) {
		console.error(e);
		return redirect('/livre-or/?temoignage=erreur#temoigner', 303);
	}
}
