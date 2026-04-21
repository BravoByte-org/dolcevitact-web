#!/usr/bin/env node
/*
 * Dolce Vita CT — navigation seed
 * --------------------------------------------------------------
 * Idempotent upsert of the `header` navigation row + its section
 * anchor items for the `dolcevita` site. Re-runnable safely; if
 * the row or items already exist, their sort + title + url fields
 * are PATCHed instead of duplicated.
 *
 * Usage:
 *   DIRECTUS_ADMIN_TOKEN=<token> node scripts/directus/seed-navigation.mjs
 *   DIRECTUS_ADMIN_TOKEN=<token> node scripts/directus/seed-navigation.mjs --dry-run
 *
 * Env:
 *   DIRECTUS_URL           defaults to https://cms.bravobyte.co
 *   DIRECTUS_ADMIN_TOKEN   required; system-admin token with nav CRU
 *   SITE_KEY               defaults to "dolcevita"
 *
 * M4b deliverable — see PR on BravoByte-org/dolcevitact-web.
 */

import process from 'node:process';

const ARGS = new Set(process.argv.slice(2));
const DRY_RUN = ARGS.has('--dry-run');

const DIRECTUS_URL = (process.env.DIRECTUS_URL ?? 'https://cms.bravobyte.co').replace(/\/$/, '');
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;
const SITE_KEY = process.env.SITE_KEY ?? 'dolcevita';
const NAV_KEY = 'header';

if (!ADMIN_TOKEN) {
	console.error(
		'\n✗ DIRECTUS_ADMIN_TOKEN is required.\n  Export an admin token and retry:\n  DIRECTUS_ADMIN_TOKEN=… node scripts/directus/seed-navigation.mjs\n'
	);
	process.exit(1);
}

// ──────────────────────────────────────────────────────────────────────
//  HTTP helper (GET always executes; writes are skipped in --dry-run)
// ──────────────────────────────────────────────────────────────────────

async function api(method, path, body) {
	if (DRY_RUN && method !== 'GET') {
		console.log(`  [dry-run] ${method} ${path}`, body ? JSON.stringify(body).slice(0, 200) : '');
		return { data: { id: `dry-run-${Math.random().toString(16).slice(2, 10)}` } };
	}

	const res = await fetch(`${DIRECTUS_URL}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${ADMIN_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: body ? JSON.stringify(body) : undefined
	});

	const text = await res.text();
	const json = text ? JSON.parse(text) : null;

	if (!res.ok) {
		const message = json?.errors?.[0]?.message ?? text;
		const err = new Error(`${method} ${path} → ${res.status}: ${message}`);
		err.status = res.status;
		err.payload = json;
		throw err;
	}

	return json;
}

async function findOne(collection, filter, fields = ['id']) {
	const qs = new URLSearchParams({
		filter: JSON.stringify(filter),
		fields: fields.join(','),
		limit: '1'
	});
	const r = await api('GET', `/items/${collection}?${qs}`);
	return r.data?.[0] ?? null;
}

// ──────────────────────────────────────────────────────────────────────
//  Nav definition
// ──────────────────────────────────────────────────────────────────────

/**
 * Order matches the spec's 10-section flow (hero is implicit, RSVP is
 * promoted to the pill CTA by SiteNav on the client). Every `url`
 * targets an anchor on the same page because the marketing site is a
 * single-page experience; the site-scoped `fetchNavigation` treats
 * these as ordinary links.
 */
const NAV_ITEMS = [
	{ title: 'The experience', url: '#about', sort: 1 },
	{ title: 'How it works', url: '#how-it-works', sort: 2 },
	{ title: 'For you', url: '#who-its-for', sort: 3 },
	{ title: 'Your guide', url: '#founder', sort: 4 },
	{ title: 'Event', url: '#event', sort: 5 },
	{ title: 'FAQ', url: '#faq', sort: 6 },
	{ title: 'Reserve', url: '#rsvp', sort: 7 }
];

// ──────────────────────────────────────────────────────────────────────
//  Main
// ──────────────────────────────────────────────────────────────────────

async function main() {
	console.log(
		`\n→ Seeding navigation for site=${SITE_KEY} key=${NAV_KEY} on ${DIRECTUS_URL}${
			DRY_RUN ? ' (dry-run)' : ''
		}\n`
	);

	const site = await findOne('sites', { key: { _eq: SITE_KEY } });
	if (!site) {
		throw new Error(
			`sites row with key="${SITE_KEY}" not found — run scripts/directus/migrate.mjs first.`
		);
	}
	console.log(`  site.id = ${site.id}`);

	let nav = await findOne(
		'navigation',
		{ _and: [{ key: { _eq: NAV_KEY } }, { site: { _eq: site.id } }] },
		['id', 'is_active']
	);
	if (!nav) {
		console.log(`  + creating navigation row key=${NAV_KEY}`);
		const r = await api('POST', '/items/navigation', {
			key: NAV_KEY,
			site: site.id,
			is_active: true,
			label: 'Dolce Vita — header'
		});
		nav = r.data;
	} else if (!nav.is_active) {
		console.log(`  ≡ reactivating navigation row`);
		await api('PATCH', `/items/navigation/${nav.id}`, { is_active: true });
	} else {
		console.log(`  ≡ navigation row exists`);
	}

	for (const item of NAV_ITEMS) {
		const existing = await findOne(
			'navigation_items',
			{
				_and: [{ navigation: { _eq: nav.id } }, { url: { _eq: item.url } }]
			},
			['id']
		);
		const payload = {
			navigation: nav.id,
			title: item.title,
			url: item.url,
			sort: item.sort,
			open_in_new_tab: false
		};
		if (existing) {
			console.log(`    ≡ ${item.url} (${item.title})`);
			await api('PATCH', `/items/navigation_items/${existing.id}`, {
				title: item.title,
				sort: item.sort,
				open_in_new_tab: false
			});
		} else {
			console.log(`    + ${item.url} (${item.title})`);
			await api('POST', '/items/navigation_items', payload);
		}
	}

	console.log('\n✓ Navigation seed complete.\n');
}

main().catch((err) => {
	console.error('\n✗ Seed failed.');
	console.error(err);
	process.exit(1);
});
