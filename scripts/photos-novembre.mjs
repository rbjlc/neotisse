// Ajoute les photos reçues en novembre 2026 dans Supabase : portraits des fondatrices, quelques nouvelles
// photos dans les pages, et toutes les nouvelles photos dans la médiathèque du back-office.
// Usage : npm run photos
// Une photo n'est remplacée que si la page montre encore la photo d'origine : un choix fait depuis le
// back-office n'est jamais écrasé. On peut relancer le script sans risque.
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { CHANGEMENTS, NOUVEAUX_MEDIAS } from '../src/data/photos-novembre.mjs';

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
	const pages = new Map();
	for (const c of CHANGEMENTS) {
		if (!pages.has(c.page)) {
			const { data, error } = await sb.from('pages').select('data').eq('id', c.page).single();
			if (error) throw new Error(`page ${c.page} : ${error.message}`);
			pages.set(c.page, { data: data.data, modifiee: false });
		}
		const p = pages.get(c.page);
		const cles = c.chemin.split('.');
		let o = p.data;
		for (const k of cles.slice(0, -1)) o = o?.[k];
		const fin = cles.at(-1);
		if (!o) { console.log(`• ${c.page} › ${c.chemin} : section introuvable, on n’y touche pas`); continue; }
		const actuelle = o[fin]?.src || '';
		if (actuelle === c.image.src) { console.log(`• ${c.page} › ${c.chemin} : déjà à jour`); continue; }
		if (actuelle !== c.avant) { console.log(`• ${c.page} › ${c.chemin} : photo changée depuis le back-office, on la garde`); continue; }
		o[fin] = c.image;
		p.modifiee = true;
		console.log(`✓ ${c.page} › ${c.chemin} : ${c.image.src}`);
	}
	for (const [id, p] of pages) {
		if (!p.modifiee) continue;
		const { error } = await sb.from('pages').update({ data: p.data }).eq('id', id);
		if (error) throw new Error(`page ${id} : ${error.message}`);
	}
	const { data: existants, error: e1 } = await sb.from('medias').select('id, data');
	if (e1) throw new Error('médiathèque : ' + e1.message);
	const deja = new Set(existants.map((m) => m.data?.url));
	const aAjouter = NOUVEAUX_MEDIAS.filter((m) => !deja.has(m.url));
	if (aAjouter.length) {
		const { error } = await sb.from('medias').upsert(aAjouter.map(({ id, ...data }) => ({ id, data })), { onConflict: 'id' });
		if (error) throw new Error('médiathèque : ' + error.message);
	}
	console.log(`✓ médiathèque : ${aAjouter.length} photo(s) ajoutée(s)`);
	console.log('\nTerminé ! Rechargez le site.');
} catch (e) {
	console.error('✗ ' + e.message);
	process.exit(1);
}
