// Met à jour les titres et descriptions Google dans Supabase, d'après la stratégie de mots-clés.
// Usage : npm run seo
// Un texte n'est remplacé que s'il est encore celui d'origine : une modification faite depuis le
// back-office n'est jamais écrasée. On peut relancer le script sans risque.
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { SEO_PAGES, SEO_ATELIERS } from '../src/data/seo-mots-cles.mjs';

if (existsSync('.env')) {
	for (const l of readFileSync('.env', 'utf8').split(/\r?\n/)) {
		const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
		if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
	}
}
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
	console.error('✗ Renseignez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans le fichier .env');
	process.exit(1);
}
const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

try {
	for (const [id, v] of Object.entries(SEO_PAGES)) {
		const { data, error } = await sb.from('pages').select('data').eq('id', id).single();
		if (error) throw new Error(`page ${id} : ${error.message}`);
		const d = data.data;
		if (d.seo_titre === v.seo_titre) { console.log(`• ${id} : déjà à jour`); continue; }
		if ((d.seo_titre || '') !== v.avant.seo_titre) { console.log(`• ${id} : titre changé depuis le back-office, on le garde`); continue; }
		d.seo_titre = v.seo_titre;
		d.seo_description = v.seo_description;
		const { error: e } = await sb.from('pages').update({ data: d }).eq('id', id);
		if (e) throw new Error(`page ${id} : ${e.message}`);
		console.log(`✓ ${id} : « ${v.seo_titre} »`);
	}
	const { data: lignes, error } = await sb.from('ateliers').select('id, data');
	if (error) throw new Error('ateliers : ' + error.message);
	for (const l of lignes) {
		const v = SEO_ATELIERS[l.data?.slug];
		if (!v) continue;
		const d = l.data;
		if (d.seo_titre === v.seo_titre) { console.log(`• atelier ${d.slug} : déjà à jour`); continue; }
		if (d.seo_titre || (d.seo_description || '') !== v.avant) { console.log(`• atelier ${d.slug} : texte changé depuis le back-office, on le garde`); continue; }
		d.seo_titre = v.seo_titre;
		d.seo_description = v.seo_description;
		const { error: e } = await sb.from('ateliers').update({ data: d }).eq('id', l.id);
		if (e) throw new Error(`atelier ${d.slug} : ${e.message}`);
		console.log(`✓ atelier ${d.slug} : « ${v.seo_titre} »`);
	}
	console.log('\nTerminé ! Les nouveaux titres sont en ligne (Google les prendra en compte à son prochain passage).');
} catch (e) {
	console.error('✗ ' + e.message);
	process.exit(1);
}
