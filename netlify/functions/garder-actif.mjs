// Une petite lecture par jour dans Supabase : l'offre gratuite met en pause
// les projets sans activité pendant une semaine (le site ne s'afficherait plus).
// Netlify lance cette fonction automatiquement chaque jour (aucun réglage à faire).
import { createClient } from '@supabase/supabase-js';

export default async () => {
	const url = process.env.SUPABASE_URL;
	const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !cle) return new Response('Supabase non configuré', { status: 200 });
	const { error } = await createClient(url, cle, { auth: { persistSession: false } }).from('reglages').select('id').limit(1);
	console.log('Supabase garde actif :', error ? error.message : 'ok');
	return new Response(error ? 'erreur' : 'ok', { status: 200 });
};

export const config = { schedule: '@daily' };
