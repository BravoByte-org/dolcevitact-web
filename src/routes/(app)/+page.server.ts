import type { Actions, LoadEvent, RequestEvent } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

import { fetchHomepage } from '$util/cms/queries';
import {
	rsvpFormSchema,
	createRsvpSubmission,
	resolveSiteId,
	type RsvpFieldErrors
} from '$lib/server/rsvp';
import { sendRsvpNotification } from '$lib/server/email';

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

/**
 * Shape of the `form` prop surfaced back to the page after a `?/rsvp`
 * submit. `ok: true` → render the Directus success_title/success_body.
 * `ok: false` → re-render the form with inline field errors (from Zod)
 * or a generic error banner for server-side failures.
 */
export type RsvpActionResult = {
	rsvp: {
		ok: boolean;
		fieldErrors?: RsvpFieldErrors;
		error?: 'server_error';
		values?: {
			name: string;
			email: string;
			phone: string;
			baby_age: string;
			message: string;
		};
	};
};

const SITE_SOURCE = env.PUBLIC_SITE_URL ? `${env.PUBLIC_SITE_URL}/#rsvp` : 'dolcevitact.com/#rsvp';

function rawString(raw: Record<string, unknown>, key: string): string {
	const v = raw[key];
	return typeof v === 'string' ? v : '';
}

export const actions: Actions = {
	/**
	 * RSVP intake — validate with Zod, write to Directus via the App
	 * Service token, fire a Resend notification. Email failure is
	 * non-fatal; a successful Directus write is the contract with the
	 * user. Honeypot hits are silently "accepted" to not tip off bots.
	 */
	rsvp: async ({ request, fetch }: RequestEvent) => {
		const raw = Object.fromEntries(await request.formData());
		const parsed = rsvpFormSchema.safeParse(raw);

		if (!parsed.success) {
			const fieldErrors = parsed.error.flatten().fieldErrors as RsvpFieldErrors;
			return fail(400, {
				rsvp: {
					ok: false,
					fieldErrors,
					values: {
						name: rawString(raw, 'name'),
						email: rawString(raw, 'email'),
						phone: rawString(raw, 'phone'),
						baby_age: rawString(raw, 'baby_age'),
						message: rawString(raw, 'message')
					}
				}
			} satisfies RsvpActionResult);
		}

		if (parsed.data._hp) {
			console.warn('[rsvp] Honeypot triggered — silently dropping submission.');
			return { rsvp: { ok: true } } satisfies RsvpActionResult;
		}

		try {
			const siteId = await resolveSiteId(fetch);
			if (!siteId) {
				console.error('[rsvp] Could not resolve site UUID — check DIRECTUS_SITE_KEY.');
				return fail(500, {
					rsvp: { ok: false, error: 'server_error' }
				} satisfies RsvpActionResult);
			}

			await createRsvpSubmission(fetch, {
				site: siteId,
				name: parsed.data.name,
				email: parsed.data.email,
				phone: parsed.data.phone,
				baby_age: parsed.data.baby_age,
				message: parsed.data.message,
				source: SITE_SOURCE
			});
		} catch (error) {
			console.error('[rsvp] Directus create failed:', error);
			return fail(500, {
				rsvp: { ok: false, error: 'server_error' }
			} satisfies RsvpActionResult);
		}

		// Email is best-effort — log + continue on failure.
		await sendRsvpNotification({
			name: parsed.data.name,
			email: parsed.data.email,
			phone: parsed.data.phone,
			babyAge: parsed.data.baby_age,
			message: parsed.data.message,
			source: SITE_SOURCE,
			submittedAt: new Date()
		});

		return { rsvp: { ok: true } } satisfies RsvpActionResult;
	}
};
