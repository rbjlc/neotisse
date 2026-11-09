// Configuration du site : rendu à la demande sur Netlify (le contenu vient du back-office).
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import { loadEnv } from 'vite';

// Charge le fichier .env (Supabase, mot de passe démo…) pour le serveur.
for (const [k, v] of Object.entries(loadEnv(process.env.NODE_ENV || 'development', process.cwd(), ''))) process.env[k] ??= v;

export default defineConfig({
	output: 'server',
	adapter: netlify(),
	trailingSlash: 'ignore',
	security: { checkOrigin: true },
	devToolbar: { enabled: false },
});
