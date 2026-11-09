// Remplit la base Supabase avec le contenu actuel du site (à lancer une seule fois).
// Usage : npm run remplir
// Les photos d'origine restent dans le dossier public/images du site.
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import depart from '../src/data/depart.mjs';

// Lit le fichier .env
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
const ecraser = process.argv.includes('--ecraser');

async function remplir(table, lignes) {
	const { count, error: e1 } = await sb.from(table).select('id', { count: 'exact', head: true });
	if (e1) throw new Error(`${table} : ${e1.message} (avez-vous lancé supabase/schema.sql ?)`);
	if (count && !ecraser) { console.log(`• ${table} : déjà rempli (${count}), on n’y touche pas`); return; }
	if (!lignes.length) { console.log(`• ${table} : rien à ajouter`); return; }
	const { error } = await sb.from(table).upsert(lignes.map(({ id, ...data }) => ({ id, data })), { onConflict: 'id' });
	if (error) throw new Error(`${table} : ${error.message}`);
	console.log(`✓ ${table} : ${lignes.length} ajouté(s)`);
}

try {
	await remplir('reglages', [{ id: 'site', ...depart.reglages }]);
	await remplir('pages', Object.entries(depart.pages).map(([id, p]) => ({ id, ...p })));
	for (const t of ['ateliers', 'evenements', 'actualites', 'partenaires', 'medias']) await remplir(t, depart[t]);
	console.log('\nTerminé ! Le site affiche maintenant le contenu de Supabase.');
} catch (e) {
	console.error('✗ ' + e.message);
	process.exit(1);
}
