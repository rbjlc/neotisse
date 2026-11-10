// Configuration du site : rendu à la demande sur Netlify (le contenu vient du back-office).
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import { loadEnv } from 'vite';

// Charge le fichier .env (Supabase, mot de passe démo…) pour le serveur.
for (const [k, v] of Object.entries(loadEnv(process.env.NODE_ENV || 'development', process.cwd(), ''))) process.env[k] ??= v;

export default defineConfig({
	output: 'server',
	// En local, on n'émule pas les Edge Functions de Netlify : le site n'en utilise pas,
	// et leur serveur de développement (Deno) ne démarre pas sur tous les ordinateurs Windows.
	adapter: netlify({ devFeatures: { edgeFunctions: false } }),
	trailingSlash: 'ignore',
	security: { checkOrigin: true },
	devToolbar: { enabled: false },
});
