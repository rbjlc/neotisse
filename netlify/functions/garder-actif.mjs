// Une petite lecture par jour dans Supabase : l'offre gratuite met en pause
// les projets sans activité pendant une semaine (le site ne s'afficherait plus).
// Netlify lance cette fonction automatiquement chaque jour (aucun réglage à faire).
export default async () => {
	const url = process.env.SUPABASE_URL;
	const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!url || !cle) return new Response('Supabase non configuré', { status: 200 });
	const r = await fetch(`${url}/rest/v1/reglages?select=id&limit=1`, { headers: { apikey: cle, Authorization: `Bearer ${cle}` } });
	console.log('Supabase garde actif :', r.status);
	return new Response('ok', { status: 200 });
};

export const config = { schedule: '@daily' };
