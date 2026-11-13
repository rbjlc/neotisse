// Nouveau défi anti-robots pour les formulaires publics (contact, témoignage).
import { creerDefi } from '../../lib/captcha.js';

export async function GET() {
	return new Response(JSON.stringify(await creerDefi()), {
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	});
}
