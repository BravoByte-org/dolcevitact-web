import { z } from 'zod';
import { env } from '$env/dynamic/private';
import { requestDirectus, readItems, createItem } from './directus';

/**
 * Canonical shape a client may POST to `?/rsvp`. Mirrors the shared
 * `RsvpSubmission` contract in `@bravobyte/types` minus the audit/system
 * fields Directus fills in server-side. `_hp` is a honeypot field — any
 * non-empty value marks the submission as bot traffic and is silently
 * dropped at the action layer.
 */
export const rsvpFormSchema = z.object({
	name: z
		.string({ required_error: 'Please share your name.' })
		.trim()
		.min(2, 'Please share your name.')
		.max(120, 'Please keep your name under 120 characters.'),
	email: z
		.string({ required_error: 'Please provide an email address.' })
		.trim()
		.toLowerCase()
		.email('Please provide a valid email address.')
		.max(200, 'Please keep your email under 200 characters.'),
	phone: z
		.string()
		.trim()
		.max(60, 'Please keep your phone under 60 characters.')
		.optional()
		.transform((v) => (v && v.length > 0 ? v : null)),
	baby_age: z
		.string()
		.trim()
		.max(60, 'Please keep baby age under 60 characters.')
		.optional()
		.transform((v) => (v && v.length > 0 ? v : null)),
	message: z
		.string()
		.trim()
		.max(2000, 'Please keep your note under 2000 characters.')
		.optional()
		.transform((v) => (v && v.length > 0 ? v : null)),
	_hp: z.string().max(0, 'Bot submission.').optional().default('')
});

export type RsvpFormInput = z.infer<typeof rsvpFormSchema>;
export type RsvpFieldErrors = Partial<Record<keyof RsvpFormInput, string[]>>;

type RsvpCreatePayload = {
	site: string;
	name: string;
	email: string;
	phone: string | null;
	baby_age: string | null;
	message: string | null;
	source: string;
	event_ref?: string | null;
};

/**
 * Create an `rsvp_submissions` row via the App Service token. Status is
 * forced to `new` here so an editor can triage from the Directus admin —
 * the Public policy is a fallback, but SSR writes use the token to keep
 * rate-limiting and honeypot rejection server-side.
 */
export async function createRsvpSubmission(
	fetch: typeof globalThis.fetch,
	payload: RsvpCreatePayload
): Promise<{ id: string }> {
	return requestDirectus<{ id: string }>(
		createItem('rsvp_submissions', { ...payload, status: 'new' } as Record<string, unknown>),
		fetch
	);
}

const SITE_KEY = env.DIRECTUS_SITE_KEY || 'dolcevita';

/**
 * Resolve the `sites.id` UUID for this delivery's site key (defaults to
 * `dolcevita`). Cached in module scope for the life of the lambda so we
 * only pay for the lookup on cold start — site IDs are immutable.
 */
let cachedSiteId: string | null = null;

export async function resolveSiteId(fetch: typeof globalThis.fetch): Promise<string | null> {
	if (cachedSiteId) return cachedSiteId;

	const sites = await requestDirectus<{ id: string }[]>(
		readItems('sites', {
			filter: { key: { _eq: SITE_KEY } },
			fields: ['id'],
			limit: 1
		}),
		fetch
	);

	cachedSiteId = sites?.[0]?.id ?? null;
	return cachedSiteId;
}
