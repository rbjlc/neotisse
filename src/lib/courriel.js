// Envoi des e-mails de notification à l'association.
// Deux possibilités (au choix, dans les variables d'environnement) :
// 1. Gmail (ou toute boîte mail) : SMTP_UTILISATEUR + SMTP_MOT_DE_PASSE (mot de passe d'application).
// 2. Resend (resend.com) : RESEND_API_KEY.
// Sans aucune des deux, les messages restent visibles dans le back-office (Messages reçus).
import { reglages } from './site.js';

const env = (k, d = '') => process.env[k] || d;

export const modeEnvoi = () => (env('SMTP_UTILISATEUR') && env('SMTP_MOT_DE_PASSE') ? 'smtp' : env('RESEND_API_KEY') ? 'resend' : null);

/** Envoie un e-mail texte à l'association. Renvoie true si envoyé. */
export async function prevenirAssociation({ sujet, texte, repondreA }) {
	const mode = modeEnvoi();
	const r = await reglages();
	const destinataire = env('NOTIFICATION_EMAIL', r.email);
	if (!mode) {
		console.log(`[e-mail non configuré] À : ${destinataire}\nSujet : ${sujet}\n${texte}`);
		return false;
	}
	if (mode === 'smtp') {
		const { default: nodemailer } = await import('nodemailer');
		const port = Number(env('SMTP_PORT', '465'));
		const t = nodemailer.createTransport({
			host: env('SMTP_HOTE', 'smtp.gmail.com'), port, secure: port === 465,
			auth: { user: env('SMTP_UTILISATEUR'), pass: env('SMTP_MOT_DE_PASSE').replace(/\s+/g, '') },
		});
		await t.sendMail({
			from: `"Site ${r.nom}" <${env('SMTP_UTILISATEUR')}>`,
			to: destinataire, replyTo: repondreA || undefined, subject: sujet, text: texte,
		});
		return true;
	}
	const rep = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			from: env('NOTIFICATION_EXPEDITEUR', `Site ${r.nom} <onboarding@resend.dev>`),
			to: [destinataire], reply_to: repondreA || undefined, subject: sujet, text: texte,
		}),
	});
	if (!rep.ok) throw new Error(await rep.text());
	return true;
}
