import type { LoadEvent } from '@sveltejs/kit';

import { fetchHomepage } from '$util/cms/queries';

function describeLoadError(error: unknown): string {
	if (error instanceof Error) return error.message;
	if (typeof error === 'string') return error;
	try {
		return JSON.stringify(error);
	} catch {
		return String(error);
	}
}

/**
 * Homepage load — fetches the single `slug: '/'` page scoped to the
 * `dolcevita` site. Returns `pages: null` on failure instead of throwing
 * so the route can fall back to the M3 editorial placeholder and the
 * marketing site never 500s on a CMS hiccup.
 */
export async function load({ fetch, setHeaders }: LoadEvent) {
	try {
		const pages = await fetchHomepage(fetch);
		// Short browser-level cache + longer shared cache so Vercel's CDN
		// serves the page hot while content editors still see fresh copy
		// after ~a minute.
		setHeaders({
			'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'
		});
		return { pages };
	} catch (error) {
		console.warn(`Failed to load homepage CMS data: ${describeLoadError(error)}`);
		return { pages: null };
	}
}
