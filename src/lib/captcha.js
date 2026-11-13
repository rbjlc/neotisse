// Anti-robots ALTCHA, hébergé sur le site : aucun service extérieur, aucun cookie.
// Le navigateur du visiteur résout un petit calcul (quelques secondes, invisible pour une personne,
// coûteux pour un robot qui envoie des milliers de messages). Le serveur vérifie la réponse.
import { createHmac } from 'node:crypto';
import { createChallenge, randomInt, verifySolution, CappedMap } from 'altcha-lib';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';

const env = (k) => (typeof process !== 'undefined' && process.env[k]) || '';
// Clé secrète : ALTCHA_HMAC_KEY si elle existe, sinon dérivée (sans la révéler) de la clé Supabase ou du secret de session.
const base = () => env('ALTCHA_HMAC_KEY') || env('SUPABASE_SERVICE_ROLE_KEY') || env('SESSION_SECRET') || 'neotisse-demo-altcha';
const secret = (usage) => createHmac('sha256', base()).update('altcha:' + usage).digest('hex');

// Une réponse ne sert qu'une fois (dans la limite de la mémoire du serveur).
const dejaVus = new CappedMap({ maxSize: 5000 });

export async function creerDefi() {
	return createChallenge({
		algorithm: 'PBKDF2/SHA-256',
		cost: 5000,
		counter: randomInt(5000, 10000),
		deriveKey,
		hmacSignatureSecret: secret('signature'),
		hmacKeySignatureSecret: secret('cle'),
		expiresAt: new Date(Date.now() + 20 * 60 * 1000),
	});
}

/** true si le formulaire contient une réponse valide, jamais utilisée. */
export async function captchaValide(valeur) {
	let p;
	try { p = JSON.parse(Buffer.from(String(valeur || ''), 'base64').toString('utf8')); } catch { return false; }
	if (!p?.challenge || !p?.solution) return false;
	try {
		const r = await verifySolution({ challenge: p.challenge, solution: p.solution, deriveKey, hmacSignatureSecret: secret('signature'), hmacKeySignatureSecret: secret('cle') });
		if (!r.verified) return false;
	} catch { return false; }
	const id = p.challenge?.parameters?.nonce;
	if (!id || dejaVus.get(id)) return false;
	dejaVus.set(id, true);
	return true;
}
