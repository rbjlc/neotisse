// Nettoyage du texte mis en forme (gras, liens, listes) saisi dans le back-office.
import sanitizeHtml from 'sanitize-html';
import { typoHtml, insecables } from './site.js';

const REGLES = {
	allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'a', 'ul', 'ol', 'li', 'h2', 'h3', 'blockquote'],
	allowedAttributes: { a: ['href'] },
	allowedSchemes: ['http', 'https', 'mailto', 'tel'],
	transformTags: { b: 'strong', i: 'em', div: 'p' },
	exclusiveFilter: (f) => f.tag === 'p' && !f.text.trim() && !f.mediaChildren?.length,
};

/** À l'enregistrement : ne garde que la mise en forme autorisée. */
export const propre = (html) => sanitizeHtml(String(html || ''), REGLES).trim();

/** À l'affichage : liens externes dans un nouvel onglet, typographie française. */
export function affiche(html, { savoirFaire = false } = {}) {
	let h = propre(html).replace(/<a href="(https?:\/\/[^"]+)">/g, (m, href) =>
		`<a href="${href}" target="_blank" rel="noopener">`);
	h = typoHtml(h);
	return savoirFaire ? insecables(h) : h;
}

/** Texte brut sans balises (pour les descriptions et les aperçus). */
export const brut = (html) => sanitizeHtml(String(html || ''), { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();

/** Échappe un texte simple pour l'insérer dans du HTML. */
export const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
