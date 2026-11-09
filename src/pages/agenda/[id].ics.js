// « Ajouter à mon agenda » : fichier .ics pour un événement du calendrier.
import { lire } from '../../lib/donnees.js';
import { reglages, urlSite } from '../../lib/site.js';

const esc = (t) => String(t || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
const jour = (iso) => iso.replace(/-/g, '');
const lendemain = (iso) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); };

export async function GET({ params }) {
	const e = await lire('evenements', params.id);
	if (!e || e.publie === false || e.a_confirmer) return new Response('Événement introuvable', { status: 404 });
	const r = await reglages();
	const lignes = [
		'BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${r.nom}//Calendrier//FR`, 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
		`UID:${e.id}@neotisse`,
		`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
		`DTSTART;VALUE=DATE:${jour(e.date_debut)}`,
		`DTEND;VALUE=DATE:${jour(lendemain(e.date_fin || e.date_debut))}`,
		`SUMMARY:${esc(e.titre)}`,
		`LOCATION:${esc([e.lieu, e.ville].filter(Boolean).filter((v, i, a) => i === 0 || !a[0].includes(v)).join(', '))}`,
		`DESCRIPTION:${esc((e.description ? e.description + '\n' : '') + `Avec ${r.nom}. ` + urlSite() + '/calendrier/')}`,
		e.lien_lieu ? `URL:${e.lien_lieu}` : null,
		'END:VEVENT', 'END:VCALENDAR',
	].filter(Boolean);
	return new Response(lignes.join('\r\n') + '\r\n', {
		headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="neotisse-${e.date_debut}.ics"` },
	});
}
