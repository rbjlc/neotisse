import { estUnRobot, enregistrerDemande } from '../../lib/formulaires.js';
import { captchaValide } from '../../lib/captcha.js';

export async function POST({ request, redirect }) {
	const f = await request.formData();
	if (estUnRobot(f)) return redirect('/contact/?devis=merci#formulaire', 303);
	if (!(await captchaValide(f.get('altcha')))) return redirect('/contact/?devis=robot#formulaire', 303);
	try {
		const r = await enregistrerDemande(f);
		if (r.manque) return redirect(`/contact/?devis=erreur&manque=${r.manque.join(',')}#formulaire`, 303);
		return redirect('/contact/?devis=merci#formulaire', 303);
	} catch (e) {
		console.error(e);
		return redirect('/contact/?devis=probleme#formulaire', 303);
	}
}
