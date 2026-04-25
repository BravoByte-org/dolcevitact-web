import type { RequestHandler } from './$types';

/*
 * Sitemap — single canonical URL today (`/`). Section anchors (`#about`,
 * `#rsvp`, etc.) are NOT separate URLs in Google's view, so they don't
 * belong here. When sibling chapters land (`/cucina`, `/classes`, ...)
 * each gets its own `<url>` block per ADR 0002 (paths-first architecture).
 *
 * The URL is hard-coded to the canonical production hostname to match
 * `<link rel="canonical">` and avoid leaking preview-deploy hosts into
 * search-engine indexing.
 */

const SITE_URL = 'https://dolcevitact.com';

type SitemapEntry = {
	loc: string;
	lastmod?: string;
	changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
	priority?: string;
};

const entries: SitemapEntry[] = [
	{
		loc: `${SITE_URL}/`,
		changefreq: 'monthly',
		priority: '1.0'
	}
];

function renderSitemap(items: SitemapEntry[]): string {
	const urls = items
		.map((entry) => {
			const parts = [`    <loc>${entry.loc}</loc>`];
			if (entry.lastmod) parts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
			if (entry.changefreq) parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
			if (entry.priority) parts.push(`    <priority>${entry.priority}</priority>`);
			return `  <url>\n${parts.join('\n')}\n  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export const GET: RequestHandler = () =>
	new Response(renderSitemap(entries), {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			// Sitemap is static today; revalidate cheaply at the edge once an
			// hour so future content additions land within the SLA Google
			// fetches at, without paying SSR cost on every crawl.
			'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
		}
	});

export const prerender = true;
