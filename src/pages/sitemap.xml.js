// Plan du site pour Google (mis à jour automatiquement).
import { ateliers, actualites, urlSite } from '../lib/site.js';

export async function GET() {
	const site = urlSite();
	const fixes = ['/', '/qui-sommes-nous/', '/ateliers/', '/calendrier/', '/actualites/', '/livre-or/', '/contact/', '/mentions-legales/', '/politique-de-confidentialite/'];
	const [a, n] = await Promise.all([ateliers(), actualites()]);
	const urls = [
		...fixes.map((u) => ({ u })),
		...a.map((x) => ({ u: `/ateliers/${x.slug}/` })),
		...n.map((x) => ({ u: `/actualites/${x.slug}/`, d: x.date })),
	];
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
		.map(({ u, d }) => `  <url><loc>${site}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`)
		.join('\n')}\n</urlset>\n`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
