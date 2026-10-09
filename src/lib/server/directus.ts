import {
	createDirectus,
	rest,
	staticToken,
	readItems,
	readSingleton,
	createItem
} from '@directus/sdk';
import { env } from '$env/dynamic/private';

/**
 * Typed schema for the Dolce Vita view of the shared BravoByte Directus
 * instance at https://cms.bravobyte.co. Only collections this delivery app
 * actually reads are declared — everything else goes through the SDK as
 * `Record<string, unknown>` which we never rely on.
 *
 * The five `block_faq`, `block_faq_items`, `block_event_details`,
 * `block_rsvp_form`, `rsvp_submissions` collections are Dolce-Vita-first
 * but the contracts are shared in `@bravobyte/types` so future clients can
 * reuse them without another schema migration.
 */
type Schema = {
	sites: Record<string, unknown>[];
	site_users: Record<string, unknown>[];
	pages: Record<string, unknown>[];
	page_blocks: Record<string, unknown>[];
	navigation: Record<string, unknown>[];
	navigation_items: Record<string, unknown>[];
	block_hero: Record<string, unknown>[];
	block_rich_text: Record<string, unknown>[];
	block_card_group: Record<string, unknown>[];
	block_card_items: Record<string, unknown>[];
	block_team: Record<string, unknown>[];
	block_timeline: Record<string, unknown>[];
	block_timeline_items: Record<string, unknown>[];
	block_cta: Record<string, unknown>[];
	block_image_gallery: Record<string, unknown>[];
	block_gallery_items: Record<string, unknown>[];
	block_faq: Record<string, unknown>[];
	block_faq_items: Record<string, unknown>[];
	block_event_details: Record<string, unknown>[];
	block_rsvp_form: Record<string, unknown>[];
	rsvp_submissions: Record<string, unknown>[];
};

const URL = env.DIRECTUS_URL || env.PRIVATE_DIRECTUS_URL;
const TOKEN = env.DIRECTUS_TOKEN || env.PRIVATE_DIRECTUS_TOKEN;

/**
 * URL/token are resolved lazily on first call instead of at module load so
 * `pnpm build` (which evaluates every server module during SvelteKit's
 * `analyse` postbuild step) doesn't crash in CI where no Directus env vars
 * are set. Vercel always has the runtime env wired up via `vercel env`,
 * so a real request will always have a valid URL — and if it ever doesn't,
 * throwing here gives a much clearer "your deployment is mis-configured"
 * signal than a silent fetch failure.
 */
function resolveBaseUrl(): string {
	if (!URL) {
		throw new Error(
			'Please set DIRECTUS_URL (or PRIVATE_DIRECTUS_URL) in the environment before calling Directus.'
		);
	}
	return URL;
}

const createDirectusClient = (fetch?: typeof globalThis.fetch, token?: string) => {
	const options = fetch ? { globals: { fetch } } : {};
	const client = createDirectus<Schema>(resolveBaseUrl(), options).with(rest());
	return token ? client.with(staticToken(token)) : client;
};

const getDirectusClient = (fetch?: typeof globalThis.fetch) => createDirectusClient(fetch, TOKEN);

type DirectusRequest = Parameters<ReturnType<typeof createDirectusClient>['request']>[0];

function isRejectedTokenError(error: unknown): boolean {
	const message = error instanceof Error ? error.message : JSON.stringify(error);
	return /invalid user|invalid credentials|invalid token/i.test(message);
}

/**
 * Same "retry anonymously on stale token" fallback as Starway. If the App
 * Service token is rejected (rotated, revoked, or misconfigured on Vercel)
 * we retry without a token so the Public policy can still serve whatever
 * is genuinely public. SSR loaders downstream decide what to do with the
 * empty result.
 */
async function requestDirectus<T>(
	request: DirectusRequest,
	fetch?: typeof globalThis.fetch
): Promise<T> {
	try {
		return (await getDirectusClient(fetch).request(request)) as T;
	} catch (error) {
		if (!TOKEN || !isRejectedTokenError(error)) throw error;

		console.warn('Directus token was rejected, retrying request without authentication');
		return (await createDirectusClient(fetch).request(request)) as T;
	}
}

export { getDirectusClient, requestDirectus, readItems, readSingleton, createItem };
