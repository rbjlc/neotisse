import { urlSite } from '../lib/site.js';
export function GET() {
	return new Response(`User-agent: *\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${urlSite()}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
