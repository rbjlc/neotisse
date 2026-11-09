// Liste des photos (GET) et envoi d'une nouvelle photo (POST).
import { lister, ecrire, envoyerFichier } from '../../../lib/donnees.js';

const json = (d, status = 200) => new Response(JSON.stringify(d), { status, headers: { 'Content-Type': 'application/json' } });
const TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };

export async function GET() {
	const photos = (await lister('medias')).sort((a, b) => (b.cree_le || '').localeCompare(a.cree_le || ''));
	return json({ photos: photos.map(({ id, url, alt }) => ({ id, url, alt })) });
}

export async function POST({ request }) {
	try {
		const f = await request.formData();
		const fichier = f.get('fichier');
		if (!fichier || typeof fichier === 'string') return json({ erreur: 'Aucun fichier reçu.' }, 400);
		const ext = TYPES[fichier.type];
		if (!ext || ext === 'svg') return json({ erreur: 'Format non accepté : envoyez une photo JPG, PNG ou WebP.' }, 400);
		if (fichier.size > 8e6) return json({ erreur: 'Photo trop lourde, même après réduction (8 Mo maximum).' }, 400);
		const base = (fichier.name || 'photo').replace(/\.[^.]+$/, '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'photo';
		const url = await envoyerFichier(`${base}.${ext}`, await fichier.arrayBuffer(), fichier.type);
		const alt = String(f.get('alt') || '').trim();
		const id = await ecrire('medias', null, { url, alt });
		return json({ photo: { id, url, alt } });
	} catch (e) {
		console.error(e);
		return json({ erreur: 'L’envoi a échoué : ' + e.message }, 500);
	}
}
