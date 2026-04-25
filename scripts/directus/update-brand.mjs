#!/usr/bin/env node
/**
 * Dolce Vita — targeted brand-rename script (idempotent)
 * ──────────────────────────────────────────────────────────────────────
 *
 * Applies the naming hierarchy from ADR 0002
 * (.docs/adrs/0002-brand-architecture.md) to existing Directus content:
 *
 *   - Parent brand: "Dolce Vita"
 *   - Offering name: "Dolce Vita Baby Circle"
 *   - Never "Dolce Vita CT" in customer-facing copy
 *
 * Why a separate script (and not `migrate.mjs --seed`)?
 *   The seed step in migrate.mjs only creates rows on a *fresh* CMS — it
 *   short-circuits when the homepage already exists. Production CMS already
 *   has all the rows; we just need to rewrite specific fields. This script
 *   targets exactly those fields and is safe to run repeatedly: each PATCH
 *   is guarded by either a "current value matches the OLD value" check or
 *   an "always-overwrite to the canonical NEW value" pattern, depending on
 *   the field.
 *
 * Usage
 * ──────
 *   DIRECTUS_ADMIN_TOKEN=…   node scripts/directus/update-brand.mjs --dry-run
 *   DIRECTUS_ADMIN_TOKEN=…   node scripts/directus/update-brand.mjs
 *
 *   --dry-run   log every PATCH without sending it
 *   --site=…    site key (default: dolcevita)
 *
 * Scope
 * ──────
 *   sites                    name, title, description       (always overwrite)
 *   pages (slug=/)           title, seo_title, seo_descr.   (always overwrite)
 *   block_hero (homepage)    script_accent → "Dolce Vita"   (always overwrite)
 *   block_event_details      title (offering naming)        (only if matches OLD)
 *   block_rsvp_form          consent_copy + success_body    (only if matches OLD)
 *   block_rich_text rows     known seed copy → new copy     (only if matches OLD)
 *
 * Anything not in the scope above is left alone — editors may have already
 * tuned wording in Directus and we don't want to clobber human edits.
 */

import { randomUUID } from 'node:crypto';
import process from 'node:process';

const ARGS = process.argv.slice(2);
const DRY_RUN = ARGS.includes('--dry-run');
const SITE_KEY = (ARGS.find((a) => a.startsWith('--site=')) ?? '--site=dolcevita').split('=')[1];

const DIRECTUS_URL = (process.env.DIRECTUS_URL ?? 'https://cms.bravobyte.co').replace(/\/$/, '');
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
	console.error(
		'\n✗ DIRECTUS_ADMIN_TOKEN is required.\n  Export it first:\n  DIRECTUS_ADMIN_TOKEN=… node scripts/directus/update-brand.mjs\n'
	);
	process.exit(1);
}

let patchCount = 0;
let skipCount = 0;

async function api(method, path, body) {
	if (DRY_RUN && method !== 'GET') {
		console.log(`  [dry-run] ${method} ${path}`, body ? JSON.stringify(body).slice(0, 240) : '');
		return { data: { id: randomUUID() } };
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

async function findMany(collection, filter, fields = ['id'], limit = 100) {
	const qs = new URLSearchParams({
		filter: JSON.stringify(filter),
		fields: fields.join(','),
		limit: String(limit)
	});
	const r = await api('GET', `/items/${collection}?${qs}`);
	return r.data ?? [];
}

/**
 * Always overwrite the listed fields on a row to the canonical brand
 * values. Use for fields whose only correct value is the canonical one
 * (titles, SEO strings, brand names).
 */
async function overwriteFields(collection, id, patch, label) {
	console.log(`  → patch ${collection}/${id} (${label})`);
	for (const [k, v] of Object.entries(patch)) {
		const display = typeof v === 'string' && v.length > 60 ? `${v.slice(0, 57)}…` : v;
		console.log(`      ${k} = ${JSON.stringify(display)}`);
	}
	await api('PATCH', `/items/${collection}/${id}`, patch);
	patchCount++;
}

/**
 * Patch a row only if every field still has its OLD seeded value (i.e.
 * an editor hasn't already rewritten it). Protects against clobbering
 * human edits made directly in Directus.
 */
async function rewriteIfPristine(collection, id, current, transitions, label) {
	const patch = {};
	const skipped = [];
	for (const { field, from, to } of transitions) {
		const cur = current?.[field];
		if (cur === to) {
			skipped.push(`${field} (already canonical)`);
			continue;
		}
		if (cur === from) {
			patch[field] = to;
		} else {
			skipped.push(`${field} (edited away from seed; left as-is)`);
		}
	}
	if (Object.keys(patch).length === 0) {
		console.log(`  ≡ ${collection}/${id} (${label}): nothing to do — ${skipped.join(', ')}`);
		skipCount++;
		return;
	}
	if (skipped.length) console.log(`  · ${collection}/${id} skipped: ${skipped.join(', ')}`);
	await overwriteFields(collection, id, patch, label);
}

// ──────────────────────────────────────────────────────────────────────
//  Update steps
// ──────────────────────────────────────────────────────────────────────

async function updateSite() {
	console.log(`\n· sites (key=${SITE_KEY})`);
	const site = await findOne('sites', { key: { _eq: SITE_KEY } }, [
		'id',
		'name',
		'title',
		'description'
	]);
	if (!site) {
		console.error(`  ✗ site "${SITE_KEY}" not found`);
		process.exit(2);
	}
	await overwriteFields(
		'sites',
		site.id,
		{
			name: 'Dolce Vita',
			title: 'Dolce Vita Baby Circle',
			description:
				'Dolce Vita Baby Circle — an Italian-inspired mama & bambino circle in Stamford, Connecticut. The first chapter of the Dolce Vita brand.'
		},
		'parent-brand naming'
	);
	return site.id;
}

async function updateHomepage(siteId) {
	console.log('\n· pages (slug=/)');
	const page = await findOne(
		'pages',
		{ _and: [{ site: { _eq: siteId } }, { slug: { _eq: '/' } }] },
		['id', 'title', 'seo_title', 'seo_description', 'blocks.id', 'blocks.collection', 'blocks.item']
	);
	if (!page) {
		console.error('  ✗ homepage row not found; skipping page-scoped updates');
		return null;
	}
	await overwriteFields(
		'pages',
		page.id,
		{
			title: 'Dolce Vita Baby Circle',
			seo_title: 'Dolce Vita Baby Circle — Italian-inspired mama & bambino in Stamford, CT',
			seo_description:
				'Reserve your spot at the Dolce Vita Baby Circle — a warm, refined Italian-inspired morning for mama and bambino in Stamford, Connecticut. The first chapter of Dolce Vita.'
		},
		'homepage SEO'
	);
	return page;
}

async function updateHero(page) {
	if (!page?.blocks?.length) return;
	const heroEntry = page.blocks.find((b) => b.collection === 'block_hero');
	if (!heroEntry) {
		console.log('\n· block_hero: no hero on homepage; skipping');
		return;
	}
	console.log('\n· block_hero (script accent)');
	const hero = await findOne('block_hero', { id: { _eq: heroEntry.item } }, [
		'id',
		'script_accent',
		'headline'
	]);
	if (!hero) return;
	// Always force the script accent to the parent brand — that's the
	// branded-house framing recorded in ADR 0002. This intentionally
	// overrides any prior "Dolce Vita CT" string.
	if (hero.script_accent !== 'Dolce Vita') {
		await overwriteFields(
			'block_hero',
			hero.id,
			{ script_accent: 'Dolce Vita' },
			'parent-brand script accent'
		);
	} else {
		console.log('  ≡ block_hero script_accent already canonical');
		skipCount++;
	}
}

async function updateEventDetails(siteId) {
	console.log('\n· block_event_details');
	const rows = await findMany('block_event_details', { site: { _eq: siteId } }, ['id', 'title']);
	for (const row of rows) {
		await rewriteIfPristine(
			'block_event_details',
			row.id,
			row,
			[
				{
					field: 'title',
					from: 'Dolce Vita Baby Circle · Spring Session',
					to: 'Dolce Vita Baby Circle · Spring Session'
				}
			],
			'event title'
		);
	}
}

async function updateRsvpForm(siteId) {
	console.log('\n· block_rsvp_form');
	const rows = await findMany('block_rsvp_form', { site: { _eq: siteId } }, [
		'id',
		'success_body',
		'consent_copy'
	]);
	for (const row of rows) {
		await rewriteIfPristine(
			'block_rsvp_form',
			row.id,
			row,
			[
				{
					field: 'success_body',
					from: 'Your note is in. Look for an email from hello@dolcevitact.com within a day.',
					to: 'Your note is in. Look for an email from babycircle@dolcevitact.com within a day.'
				},
				{
					field: 'consent_copy',
					from: "By reserving you agree to receive a follow-up email from Dolce Vita CT. We don't share your information.",
					to: "By reserving you agree to receive a follow-up email from the Dolce Vita Baby Circle. We don't share your information."
				}
			],
			'rsvp consent + success copy'
		);
	}
}

async function updateRichText() {
	console.log('\n· block_rich_text (homepage seed copy)');
	// We don't site-scope block_rich_text because the collection is shared
	// across sites and not site-scoped at the schema level. Instead we
	// match the EXACT seeded HTML, which is unique enough to identify
	// just the rows that came from migrate.mjs --seed.
	const transitions = [
		{
			from: '<p>Dolce Vita CT is a small, intentional circle for Italian-curious families — a morning of music, language, and movement designed to feel like a Sunday in Liguria.</p>',
			to: '<p>The Dolce Vita Baby Circle is a small, intentional gathering for Italian-curious families — a morning of music, language, and movement designed to feel like a Sunday in Liguria.</p>'
		},
		{
			from: '<p>Dolce Vita CT exists because raising a child between two languages should feel like a gift, not a chore. Our circles are the opposite of a class — they are small rituals built around the sounds of home.</p>',
			to: '<p>Dolce Vita exists because raising a child between two languages should feel like a gift, not a chore. Our Baby Circle is the opposite of a class — it is a small ritual built around the sounds of home.</p>'
		}
	];
	for (const { from, to } of transitions) {
		const matches = await findMany('block_rich_text', { content: { _eq: from } }, ['id']);
		if (matches.length === 0) {
			console.log(`  ≡ no rich_text rows match seed snippet (${from.slice(0, 60)}…)`);
			skipCount++;
			continue;
		}
		for (const row of matches) {
			await overwriteFields('block_rich_text', row.id, { content: to }, 'rich text rewrite');
		}
	}
}

// ──────────────────────────────────────────────────────────────────────
//  Main
// ──────────────────────────────────────────────────────────────────────

async function main() {
	console.log(`\nDolce Vita — brand rename (${DIRECTUS_URL})`);
	console.log(`  site key      : ${SITE_KEY}`);
	console.log(`  mode          : ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

	const siteId = await updateSite();
	const page = await updateHomepage(siteId);
	await updateHero(page);
	await updateEventDetails(siteId);
	await updateRsvpForm(siteId);
	await updateRichText();

	console.log(`\n✓ done. ${patchCount} patch(es), ${skipCount} skipped.`);
	if (DRY_RUN) console.log('  (dry-run — re-run without --dry-run to apply.)');
}

main().catch((err) => {
	console.error('\n✗ failed:', err.message);
	if (err.payload) console.error(JSON.stringify(err.payload, null, 2));
	process.exit(1);
});
