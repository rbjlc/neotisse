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
	// sanitize-html est un ancien module (CommonJS) qui charge htmlparser2, devenu un module moderne (ESM).
	// On l'intègre au code du site au lieu de le charger à part : sinon la fonction Netlify plante.
	vite: { ssr: { noExternal: ['sanitize-html', 'htmlparser2', 'domhandler', 'domutils', 'dom-serializer', 'domelementtype', 'entities', 'escape-string-regexp', 'is-plain-object', 'launder', 'parse-srcset', 'postcss', 'nanoid', 'picocolors', 'source-map-js', 'dayjs'] } },
});
