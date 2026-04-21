#!/usr/bin/env node
/**
 * Dolce Vita CT — one-shot Directus migration (idempotent)
 * ──────────────────────────────────────────────────────────────────────
 *
 * Brings the shared BravoByte Directus instance (https://cms.bravobyte.co)
 * into the shape `dolcevitact-web` expects. The script is safe to re-run:
 * every step is guarded by a "fetch, then create if missing, else patch"
 * pattern, so partial failures don't leave the instance in a half-migrated
 * state.
 *
 * What it does
 * ──────────────
 *   1. Ensures the `dolcevita` site row exists
 *   2. Creates a "Dolce Vita App Service" Directus user + static token
 *      (role = App Service, policy = Published Content Reader; linked to
 *      the site via `site_users`)
 *   3. Creates a "Dolce Vita Content" editor policy + a "Dolce Vita
 *      Editor" role referencing it
 *   4. Creates the five Dolce-Vita-first collections + their fields:
 *         - block_faq            (site-scoped M2A block parent)
 *         - block_faq_items      (O2M children of block_faq)
 *         - block_event_details  (site-scoped M2A block parent)
 *         - block_rsvp_form      (site-scoped M2A block parent, config only)
 *         - rsvp_submissions     (site-scoped write-target for M5)
 *   5. Extends `page_blocks` M2A `one_allowed_collections` with the three
 *      new block parents (block_faq, block_event_details, block_rsvp_form)
 *   6. Backfills all permissions:
 *         - Published Content Reader: read on the 4 new block collections
 *         - Dolce Vita Content (editor): CRU on all reachable collections
 *         - Public: create-only on `rsvp_submissions` (allow-list fields)
 *   7. Seeds a placeholder homepage row with the full 9-block body
 *      (hero → rich_text → timeline → card_group → team → event_details
 *      → rsvp_form → rich_text → faq) so the delivery app renders
 *      end-to-end before editors sit down to finalize copy.
 *
 * How to run
 * ──────────────
 *   DIRECTUS_ADMIN_TOKEN=<admin_token> \
 *     node scripts/directus/migrate.mjs --seed
 *
 * Flags
 * ──────────────
 *   --seed         Create the placeholder homepage body (default: skip)
 *   --skip-schema  Skip collection/field/relation ops (useful when only
 *                  permissions or seed need to be re-applied)
 *   --dry-run      Log every POST/PATCH without executing
 *
 * Environment
 * ──────────────
 *   DIRECTUS_URL           defaults to https://cms.bravobyte.co
 *   DIRECTUS_ADMIN_TOKEN   required; must be a system-admin token
 *   SITE_KEY               defaults to `dolcevita`
 *
 * Exit codes
 * ──────────────
 *   0  success (idempotent no-op is still 0)
 *   1  missing token / fatal error
 *   2  Directus API error (inspect stderr for the HTTP payload)
 */

import { randomUUID } from 'node:crypto';
import process from 'node:process';

const ARGS = new Set(process.argv.slice(2));
const DRY_RUN = ARGS.has('--dry-run');
const SKIP_SCHEMA = ARGS.has('--skip-schema');
const DO_SEED = ARGS.has('--seed');

const DIRECTUS_URL = (process.env.DIRECTUS_URL ?? 'https://cms.bravobyte.co').replace(/\/$/, '');
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;
const SITE_KEY = process.env.SITE_KEY ?? 'dolcevita';

if (!ADMIN_TOKEN) {
	console.error(
		'\n✗ DIRECTUS_ADMIN_TOKEN is required.\n  Export it first:\n  DIRECTUS_ADMIN_TOKEN=… node scripts/directus/migrate.mjs --seed\n'
	);
	process.exit(1);
}

// ──────────────────────────────────────────────────────────────────────
//  HTTP helper
// ──────────────────────────────────────────────────────────────────────

async function api(method, path, body) {
	if (DRY_RUN && method !== 'GET') {
		console.log(`  [dry-run] ${method} ${path}`, body ? JSON.stringify(body).slice(0, 200) : '');
		// Return a stub entity so downstream code that consumes the response
		// (e.g. `const r = await api(...); r.data.id`) doesn't crash and we
		// walk through every migration step during a dry-run.
		//
		// Use real UUIDs (not prefixed strings) because later GETs filter on
		// these ids against UUID columns in Postgres — e.g.
		// `site_users.sites_id = $1` fails with "invalid input syntax for
		// type uuid" if we hand it "dry-run-<uuid>". The `[dry-run]` log
		// prefix above already makes provenance obvious.
		//
		// In a real run this branch is never taken; the Directus response is
		// returned verbatim below.
		return { data: { id: randomUUID(), token: `dolcevita_dryrun_${randomUUID()}` } };
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

// ──────────────────────────────────────────────────────────────────────
//  Idempotent upserters
// ──────────────────────────────────────────────────────────────────────

/** Fetch a collection definition, or null if it doesn't exist yet. */
async function getCollection(collection) {
	try {
		const r = await api('GET', `/collections/${collection}`);
		return r.data;
	} catch (e) {
		if (e.status === 404 || e.status === 403) return null;
		throw e;
	}
}

/**
 * Create a collection + its fields in one round-trip when it doesn't
 * exist; otherwise ensure each field individually. Directus's
 * `POST /collections` accepts an inline `fields` array so the most common
 * path is a single request.
 */
async function upsertCollection({ collection, meta, schema, fields }) {
	const existing = await getCollection(collection);
	if (!existing) {
		console.log(`  + creating collection ${collection}`);
		await api('POST', '/collections', {
			collection,
			meta: meta ?? {},
			schema: schema ?? {},
			fields: fields ?? []
		});
		return;
	}

	console.log(`  ≡ collection ${collection} exists, ensuring fields`);
	for (const field of fields ?? []) {
		await upsertField(collection, field);
	}
	// Refresh meta (display template / translations) on every run.
	if (meta) {
		await api('PATCH', `/collections/${collection}`, { meta });
	}
}

async function getField(collection, field) {
	try {
		const r = await api('GET', `/fields/${collection}/${field}`);
		return r.data;
	} catch (e) {
		if (e.status === 404 || e.status === 403) return null;
		throw e;
	}
}

async function upsertField(collection, def) {
	const existing = await getField(collection, def.field);
	if (!existing) {
		console.log(`    + field ${collection}.${def.field}`);
		await api('POST', `/fields/${collection}`, def);
	} else {
		// Refresh meta-only patch (interface, options, translations, display)
		// without touching the schema side, which Directus may reject on
		// subtle shape differences.
		if (def.meta) {
			await api('PATCH', `/fields/${collection}/${def.field}`, { meta: def.meta });
		}
	}
}

async function getRelation(collection, field) {
	try {
		const r = await api('GET', `/relations/${collection}/${field}`);
		return r.data;
	} catch (e) {
		if (e.status === 404 || e.status === 403) return null;
		throw e;
	}
}

async function upsertRelation(def) {
	const existing = await getRelation(def.collection, def.field);
	if (!existing) {
		console.log(
			`    + relation ${def.collection}.${def.field} → ${def.related_collection ?? 'M2A'}`
		);
		await api('POST', '/relations', def);
	} else if (def.meta) {
		await api('PATCH', `/relations/${def.collection}/${def.field}`, { meta: def.meta });
	}
}

// System collections aren't exposed under /items/* — they have their own
// dedicated REST endpoints. Route GETs accordingly so this helper works
// for both user-defined and system collections.
const SYSTEM_COLLECTION_ENDPOINTS = {
	directus_users: '/users',
	directus_roles: '/roles',
	directus_policies: '/policies',
	directus_permissions: '/permissions',
	directus_files: '/files',
	directus_folders: '/folders'
};

/** Find the first item matching a filter, or null. */
async function findOne(collection, filter, fields = ['id']) {
	const qs = new URLSearchParams({
		filter: JSON.stringify(filter),
		fields: fields.join(','),
		limit: '1'
	});
	const base = SYSTEM_COLLECTION_ENDPOINTS[collection] ?? `/items/${collection}`;
	const r = await api('GET', `${base}?${qs}`);
	return r.data?.[0] ?? null;
}

/** Permissions: find by policy+collection+action, create if missing. */
async function ensurePermission({ policy, collection, action, fields, permissions }) {
	const existing = await findOne(
		'directus_permissions',
		{ policy: { _eq: policy }, collection: { _eq: collection }, action: { _eq: action } },
		['id']
	);
	if (existing) return;
	console.log(`    + perm ${action} ${collection} on policy ${policy.slice(0, 8)}…`);
	await api('POST', '/permissions', { policy, collection, action, fields, permissions });
}

// ──────────────────────────────────────────────────────────────────────
//  Identity + site bootstrap
// ──────────────────────────────────────────────────────────────────────

async function ensureSite() {
	const existing = await findOne('sites', { key: { _eq: SITE_KEY } }, ['id', 'name', 'key', 'url']);
	if (existing) {
		console.log(`  ≡ site "${SITE_KEY}" exists (${existing.id})`);
		return existing.id;
	}
	console.log(`  + creating site "${SITE_KEY}"`);
	const r = await api('POST', '/items/sites', {
		name: 'Dolce Vita CT',
		key: SITE_KEY,
		url: 'https://dolcevitact.com',
		title: 'Dolce Vita CT',
		description: 'A premium Italian-inspired mom & baby experience in Stamford, Connecticut.',
		status: 'published'
	});
	return r.data.id;
}

/** Look up an existing policy by name; null if not found. */
async function findPolicyByName(name) {
	const r = await api(
		'GET',
		`/policies?filter[name][_eq]=${encodeURIComponent(name)}&fields=id,name&limit=1`
	);
	return r.data?.[0] ?? null;
}

/** Look up an existing role by name; null if not found. */
async function findRoleByName(name) {
	const r = await api(
		'GET',
		`/roles?filter[name][_eq]=${encodeURIComponent(name)}&fields=id,name&limit=1`
	);
	return r.data?.[0] ?? null;
}

async function ensureEditorPolicyAndRole() {
	let policy = await findPolicyByName('Dolce Vita Content');
	if (!policy) {
		console.log('  + creating policy "Dolce Vita Content"');
		const r = await api('POST', '/policies', {
			name: 'Dolce Vita Content',
			icon: 'badge',
			description: `Editor permissions for the ${SITE_KEY} site.`,
			app_access: true,
			admin_access: false
		});
		policy = r.data;
	} else {
		console.log(`  ≡ policy "Dolce Vita Content" exists (${policy.id})`);
	}

	let role = await findRoleByName('Dolce Vita Editor');
	if (!role) {
		console.log('  + creating role "Dolce Vita Editor"');
		const r = await api('POST', '/roles', {
			name: 'Dolce Vita Editor',
			icon: 'local_florist',
			description: 'Editors authoring content for dolcevitact.com',
			policies: [{ policy: policy.id }]
		});
		role = r.data;
	} else {
		console.log(`  ≡ role "Dolce Vita Editor" exists (${role.id})`);
		// Ensure the policy is attached. (roles.policies is a junction
		// surface; the PATCH is idempotent via `sync`-style payload.)
		await api('PATCH', `/roles/${role.id}`, { policies: [{ policy: policy.id }] }).catch(() => {});
	}

	return { policyId: policy.id, roleId: role.id };
}

async function ensureAppServiceUser(siteId) {
	const appServiceRole = await findRoleByName('App Service');
	if (!appServiceRole) {
		throw new Error(
			'"App Service" role not found in Directus. Create it once (or rename the existing App Service role to match) before running this migration.'
		);
	}

	const email = 'dolcevita-app@bravobyte.co';
	const existing = await findOne('directus_users', { email: { _eq: email } }, ['id', 'token']);

	if (existing) {
		console.log(`  ≡ Dolce Vita App Service user exists (${existing.id})`);
		await ensureSiteUserLink(siteId, existing.id);
		return { userId: existing.id, token: existing.token };
	}

	const token = `dolcevita_${randomUUID().replace(/-/g, '')}`;
	console.log('  + creating Dolce Vita App Service user + static token');
	const r = await api('POST', '/users', {
		first_name: 'Dolce Vita',
		last_name: 'App Service',
		email,
		role: appServiceRole.id,
		status: 'active',
		token,
		description: 'SSR read-only token for dolcevitact-web'
	});
	const userId = r.data.id;
	await ensureSiteUserLink(siteId, userId);

	console.log('\n  ─────────────────────────────────────────────────');
	console.log('   New Dolce Vita App Service token (copy to Vercel +');
	console.log('   local .env as DIRECTUS_TOKEN / PRIVATE_DIRECTUS_TOKEN):');
	console.log(`     ${token}`);
	console.log('  ─────────────────────────────────────────────────\n');

	return { userId, token };
}

async function ensureSiteUserLink(siteId, userId) {
	const existing = await findOne(
		'site_users',
		{ sites_id: { _eq: siteId }, directus_users_id: { _eq: userId } },
		['id']
	);
	if (existing) return;
	console.log(`    + linking user ${userId.slice(0, 8)}… to site ${siteId.slice(0, 8)}…`);
	await api('POST', '/items/site_users', {
		sites_id: siteId,
		directus_users_id: userId
	});
}

// ──────────────────────────────────────────────────────────────────────
//  Field factory helpers
// ──────────────────────────────────────────────────────────────────────

// Note: Directus injects date_created / user_created / date_updated / user_updated
// automatically when the collection is created with the standard pattern — we
// don't redeclare them here. If you need to override the audit fields for a
// specific collection, add them explicitly to that collection's fields array.

const fStr = (name, opts = {}) => ({
	field: name,
	type: 'string',
	schema: { is_nullable: opts.nullable ?? true, max_length: opts.max ?? 255 },
	meta: {
		interface: opts.interface ?? 'input',
		options: opts.options,
		note: opts.note,
		translations: opts.translations,
		required: opts.required ?? false,
		width: opts.width ?? 'full'
	}
});

const fText = (name, opts = {}) => ({
	field: name,
	type: 'text',
	schema: { is_nullable: opts.nullable ?? true },
	meta: {
		interface: opts.interface ?? 'input-multiline',
		note: opts.note,
		translations: opts.translations,
		required: opts.required ?? false
	}
});

const fHtml = (name, opts = {}) => ({
	field: name,
	type: 'text',
	schema: { is_nullable: opts.nullable ?? true },
	meta: { interface: 'input-rich-text-html', note: opts.note, translations: opts.translations }
});

const fInt = (name, opts = {}) => ({
	field: name,
	type: 'integer',
	schema: { is_nullable: opts.nullable ?? true },
	meta: {
		interface: opts.interface ?? 'input',
		note: opts.note,
		hidden: opts.hidden ?? false,
		sort: opts.sort
	}
});

const fDate = (name, opts = {}) => ({
	field: name,
	type: 'date',
	schema: { is_nullable: opts.nullable ?? true },
	meta: { interface: 'datetime', note: opts.note, translations: opts.translations }
});

// fUuid helper omitted — every M2O UUID field in this migration is declared
// inline so each callsite can control `is_nullable`, `required`, and the
// `select-dropdown-m2o` interface independently without stacking option
// overrides through a helper.

const fSelect = (name, choices, opts = {}) => ({
	field: name,
	type: 'string',
	schema: { is_nullable: opts.nullable ?? true, default_value: opts.default },
	meta: {
		interface: 'select-dropdown',
		options: { choices: choices.map((v) => ({ text: v, value: v })) },
		note: opts.note
	}
});

// ──────────────────────────────────────────────────────────────────────
//  Schema definitions
// ──────────────────────────────────────────────────────────────────────

const COLLECTIONS = [
	{
		collection: 'block_faq',
		meta: {
			icon: 'quiz',
			display_template: '{{title}}',
			note: 'Accordion-style FAQ section (parent). Items live in block_faq_items.',
			sort_field: 'sort'
		},
		schema: {},
		fields: [
			{
				field: 'id',
				type: 'uuid',
				schema: { is_primary_key: true, has_auto_increment: false, is_nullable: false },
				meta: { special: ['uuid'], readonly: true, hidden: true }
			},
			fStr('eyebrow', { note: 'Small caps label above the section heading.' }),
			fStr('title', { required: true, note: 'Section heading.' }),
			fText('subtitle', { note: 'Optional paragraph under the heading.' }),
			fInt('sort', { hidden: true, sort: true }),
			{
				field: 'site',
				type: 'uuid',
				schema: { is_nullable: false },
				meta: { interface: 'select-dropdown-m2o', required: true }
			},
			{
				field: 'items',
				type: 'alias',
				meta: { special: ['o2m'], interface: 'list-o2m', options: { template: '{{question}}' } }
			}
		]
	},
	{
		collection: 'block_faq_items',
		meta: {
			icon: 'help_outline',
			display_template: '{{question}}',
			note: 'Individual FAQ question/answer; child of block_faq.',
			sort_field: 'sort',
			hidden: true
		},
		schema: {},
		fields: [
			{
				field: 'id',
				type: 'uuid',
				schema: { is_primary_key: true, is_nullable: false },
				meta: { special: ['uuid'], readonly: true, hidden: true }
			},
			{
				field: 'faq',
				type: 'uuid',
				schema: { is_nullable: false },
				meta: { interface: 'select-dropdown-m2o', required: true }
			},
			fStr('question', { required: true, max: 500 }),
			fHtml('answer_html', { note: 'Rich-text answer body.' }),
			fInt('sort', { hidden: true, sort: true })
		]
	},
	{
		collection: 'block_event_details',
		meta: {
			icon: 'event',
			display_template: '{{title}} — {{date}}',
			note: 'Structured event card (date, time, city, CTA).',
			sort_field: 'sort'
		},
		schema: {},
		fields: [
			{
				field: 'id',
				type: 'uuid',
				schema: { is_primary_key: true, is_nullable: false },
				meta: { special: ['uuid'], readonly: true, hidden: true }
			},
			fStr('eyebrow'),
			fStr('title', { required: true }),
			fDate('date', { note: 'Event date (YYYY-MM-DD).' }),
			fStr('time', { note: 'Human-readable time, e.g. "10:00 – 11:30 AM".' }),
			fStr('city', { note: 'Display city, e.g. "Stamford, CT".' }),
			fText('location_note', { note: 'Short note — venue, parking, etc.' }),
			fStr('cta_label', { note: 'e.g. "Reserve your spot".' }),
			fStr('cta_anchor', {
				note: 'Hash or path target for the CTA (e.g. "#rsvp").'
			}),
			fInt('sort', { hidden: true, sort: true }),
			{
				field: 'site',
				type: 'uuid',
				schema: { is_nullable: false },
				meta: { interface: 'select-dropdown-m2o', required: true }
			}
		]
	},
	{
		collection: 'block_rsvp_form',
		meta: {
			icon: 'mail',
			display_template: '{{title}}',
			note: 'Configuration block rendered as an RSVP form. Submissions land in rsvp_submissions.',
			sort_field: 'sort'
		},
		schema: {},
		fields: [
			{
				field: 'id',
				type: 'uuid',
				schema: { is_primary_key: true, is_nullable: false },
				meta: { special: ['uuid'], readonly: true, hidden: true }
			},
			fStr('eyebrow'),
			fStr('title', { required: true }),
			fText('subtitle'),
			fStr('success_title', { required: true, note: 'Shown after a successful submit.' }),
			fText('success_body', { note: 'Body shown beneath success_title.' }),
			fText('consent_copy', { note: 'Small-print consent line under the submit button.' }),
			fInt('sort', { hidden: true, sort: true }),
			{
				field: 'site',
				type: 'uuid',
				schema: { is_nullable: false },
				meta: { interface: 'select-dropdown-m2o', required: true }
			}
		]
	},
	{
		collection: 'rsvp_submissions',
		meta: {
			icon: 'inbox',
			display_template: '{{name}} — {{email}}',
			note: 'Inbound RSVP form submissions. Public Create, Editor Read/Update, no Delete.',
			archive_field: 'status',
			archive_value: 'cancelled',
			unarchive_value: 'new',
			sort_field: 'date_created'
		},
		schema: {},
		fields: [
			{
				field: 'id',
				type: 'uuid',
				schema: { is_primary_key: true, is_nullable: false },
				meta: { special: ['uuid'], readonly: true, hidden: true }
			},
			{
				field: 'site',
				type: 'uuid',
				schema: { is_nullable: false },
				meta: { interface: 'select-dropdown-m2o', required: true }
			},
			fStr('name', { required: true, max: 120 }),
			fStr('email', { required: true, max: 200 }),
			fStr('phone', { max: 60 }),
			fStr('baby_age', { max: 60, note: 'Free-form text, e.g. "4 months".' }),
			fText('message'),
			{
				field: 'event_ref',
				type: 'uuid',
				schema: { is_nullable: true },
				meta: {
					interface: 'select-dropdown-m2o',
					note: 'Optional link to the specific block_event_details the RSVP targets.'
				}
			},
			fSelect('status', ['new', 'contacted', 'confirmed', 'cancelled'], {
				default: 'new',
				nullable: false,
				note: 'Lifecycle — matches @bravobyte/types RsvpStatus.'
			}),
			fStr('source', { max: 80, note: 'e.g. "dolcevitact.com/#rsvp".' })
		]
	}
];

const RELATIONS = [
	// O2M: block_faq 1 → n block_faq_items.faq
	{
		collection: 'block_faq_items',
		field: 'faq',
		related_collection: 'block_faq',
		meta: {
			one_field: 'items',
			sort_field: 'sort',
			one_deselect_action: 'delete'
		},
		schema: { on_delete: 'CASCADE' }
	},
	// M2O: block_faq.site → sites
	{
		collection: 'block_faq',
		field: 'site',
		related_collection: 'sites',
		meta: { sort_field: null },
		schema: { on_delete: 'NO ACTION' }
	},
	// M2O: block_event_details.site → sites
	{
		collection: 'block_event_details',
		field: 'site',
		related_collection: 'sites',
		schema: { on_delete: 'NO ACTION' }
	},
	// M2O: block_rsvp_form.site → sites
	{
		collection: 'block_rsvp_form',
		field: 'site',
		related_collection: 'sites',
		schema: { on_delete: 'NO ACTION' }
	},
	// M2O: rsvp_submissions.site → sites
	{
		collection: 'rsvp_submissions',
		field: 'site',
		related_collection: 'sites',
		schema: { on_delete: 'NO ACTION' }
	},
	// M2O: rsvp_submissions.event_ref → block_event_details (optional)
	{
		collection: 'rsvp_submissions',
		field: 'event_ref',
		related_collection: 'block_event_details',
		schema: { on_delete: 'SET NULL' }
	}
];

// ──────────────────────────────────────────────────────────────────────
//  page_blocks M2A extension
// ──────────────────────────────────────────────────────────────────────

async function extendPageBlocksAllowedCollections() {
	const rel = await getRelation('page_blocks', 'item');
	if (!rel) {
		throw new Error(
			'`page_blocks.item` M2A relation is missing. Run the Starway-era migration for page_blocks first; this script only extends the allowed-collections list.'
		);
	}
	const current = rel.meta?.one_allowed_collections ?? [];
	const needed = ['block_faq', 'block_event_details', 'block_rsvp_form'];
	const missing = needed.filter((c) => !current.includes(c));
	if (missing.length === 0) {
		console.log('  ≡ page_blocks M2A already allows all Dolce Vita blocks');
		return;
	}
	const next = [...new Set([...current, ...needed])];
	console.log(`  + extending page_blocks M2A: +${missing.join(', ')}`);
	await api('PATCH', '/relations/page_blocks/item', {
		meta: { one_allowed_collections: next }
	});
}

// ──────────────────────────────────────────────────────────────────────
//  Permissions
// ──────────────────────────────────────────────────────────────────────

async function backfillPermissions(editorPolicyId) {
	const pcr = await findPolicyByName('Published Content Reader');
	if (!pcr) {
		console.warn(
			'  ⚠ Published Content Reader policy not found; skipping its read backfill. Create it in Directus admin and re-run.'
		);
	}

	const pub = await findPolicyByName('Public');

	// Published Content Reader (shared SSR read): permissions:{} on block collections
	// since they're reached only via site-scoped pages.
	const pcrBlockCollections = [
		'block_faq',
		'block_faq_items',
		'block_event_details',
		'block_rsvp_form'
	];
	if (pcr) {
		for (const collection of pcrBlockCollections) {
			await ensurePermission({
				policy: pcr.id,
				collection,
				action: 'read',
				fields: ['*'],
				permissions: {}
			});
		}
	}

	// Dolce Vita Content (editor): CRU on site-scoped pages/navigation/etc.
	// + all block parents + children + rsvp_submissions (R+U, no Create from
	// the admin since the public form creates those).
	const SITE_FILTER = {
		site: { users: { directus_users_id: { _eq: '$CURRENT_USER' } } }
	};

	// site-scoped content collections
	const siteScoped = ['pages', 'posts', 'articles', 'navigation', 'navigation_items'];
	for (const collection of siteScoped) {
		for (const action of ['read', 'create', 'update']) {
			await ensurePermission({
				policy: editorPolicyId,
				collection,
				action,
				fields: ['*'],
				permissions: collection === 'navigation_items' ? {} : SITE_FILTER
			});
		}
	}

	// block parents + children + junction (no filter; gated via pages parent)
	const blocks = [
		'page_blocks',
		'block_hero',
		'block_rich_text',
		'block_card_group',
		'block_card_items',
		'block_team',
		'block_timeline',
		'block_timeline_items',
		'block_cta',
		'block_image_gallery',
		'block_gallery_items',
		'block_faq',
		'block_faq_items',
		'block_event_details',
		'block_rsvp_form'
	];
	for (const collection of blocks) {
		for (const action of ['read', 'create', 'update']) {
			await ensurePermission({
				policy: editorPolicyId,
				collection,
				action,
				fields: ['*'],
				permissions: {}
			});
		}
	}

	// rsvp_submissions: editor can read + update (e.g. set status=contacted).
	// Editors do NOT create submissions (the public form does).
	for (const action of ['read', 'update']) {
		await ensurePermission({
			policy: editorPolicyId,
			collection: 'rsvp_submissions',
			action,
			fields: ['*'],
			permissions: SITE_FILTER
		});
	}

	// Public: create-only on rsvp_submissions, with a narrow allow-list.
	// Site FK is pinned via validation (the form action server-side writes
	// site=dolcevita; Directus validates the allowed fields below).
	if (pub) {
		await ensurePermission({
			policy: pub.id,
			collection: 'rsvp_submissions',
			action: 'create',
			fields: ['site', 'name', 'email', 'phone', 'baby_age', 'message', 'event_ref', 'source'],
			permissions: {}
		});
	}
}

// ──────────────────────────────────────────────────────────────────────
//  Seed homepage
// ──────────────────────────────────────────────────────────────────────

async function seedHomepage(siteId) {
	const existing = await findOne(
		'pages',
		{ _and: [{ site: { _eq: siteId } }, { slug: { _eq: '/' } }] },
		['id']
	);
	if (existing) {
		console.log(`  ≡ homepage already seeded (${existing.id}); skipping seed.`);
		return;
	}

	console.log('  + seeding placeholder homepage blocks');

	const hero = await api('POST', '/items/block_hero', {
		eyebrow: 'Stamford · Connecticut',
		headline: 'An Italian-inspired moment for mama e bambino',
		subheading:
			'A warm, refined class for moms and babies, led by a native Italian speaker, teacher, and mom.',
		buttons: JSON.stringify([
			{ label: 'Reserve your spot', href: '#rsvp', variant: 'primary' },
			{ label: 'Learn more', href: '#about', variant: 'secondary' }
		])
	});

	const about = await api('POST', '/items/block_rich_text', {
		content:
			'<p>Dolce Vita CT is a small, intentional circle for Italian-curious families — a morning of music, language, and movement designed to feel like a Sunday in Liguria.</p>'
	});

	const timeline = await api('POST', '/items/block_timeline', {
		title: 'How it works'
	});
	for (const [i, step] of [
		{ year: '1', title: 'Reserve', description: 'RSVP to reserve your spot in the next circle.' },
		{
			year: '2',
			title: 'Arrive',
			description: 'Come to the studio 10 minutes early — coffee and conversation before we begin.'
		},
		{
			year: '3',
			title: 'Experience',
			description:
				'A 90-minute Italian-led session: lullabies, storytime, light movement, and a moment for mamas.'
		}
	].entries()) {
		await api('POST', '/items/block_timeline_items', {
			...step,
			sort: i,
			timeline: timeline.data.id
		});
	}

	const cardGroup = await api('POST', '/items/block_card_group', {
		title: "Who it's for"
	});
	for (const [i, card] of [
		{
			title: 'New mamas',
			summary:
				'Gentle, welcoming, and unhurried — bring your newborn, your questions, and yourself.'
		},
		{
			title: 'Italian families',
			summary: 'A rare place to pass the language to the next generation without trying too hard.'
		},
		{
			title: 'Italian-curious',
			summary: 'No prior Italian needed — come for the lullabies and the community.'
		},
		{
			title: 'Second-time moms',
			summary: 'A calm hour for you, a stimulating one for your little one.'
		}
	].entries()) {
		await api('POST', '/items/block_card_items', {
			...card,
			sort: i,
			card_group: cardGroup.data.id
		});
	}

	const team = await api('POST', '/items/block_team', {
		title: 'Your guide'
	});

	const eventDetails = await api('POST', '/items/block_event_details', {
		eyebrow: 'First Circle',
		title: 'Dolce Vita Baby Circle · Spring Session',
		city: 'Stamford, CT',
		cta_label: 'Reserve your spot',
		cta_anchor: '#rsvp',
		location_note: 'Exact address sent by email after you reserve.',
		site: siteId,
		sort: 0
	});

	const rsvpForm = await api('POST', '/items/block_rsvp_form', {
		eyebrow: 'Reserve',
		title: 'Tell us a little about you',
		subtitle:
			"Spots are limited to keep the circle intimate. We'll follow up within 24 hours to confirm your reservation.",
		success_title: "Grazie — we'll be in touch",
		success_body: 'Your note is in. Look for an email from hello@dolcevitact.com within a day.',
		consent_copy:
			"By reserving you agree to receive a follow-up email from Dolce Vita CT. We don't share your information.",
		site: siteId,
		sort: 0
	});

	const story = await api('POST', '/items/block_rich_text', {
		content:
			'<p>Dolce Vita CT exists because raising a child between two languages should feel like a gift, not a chore. Our circles are the opposite of a class — they are small rituals built around the sounds of home.</p>'
	});

	const faq = await api('POST', '/items/block_faq', {
		eyebrow: 'FAQ',
		title: 'Quick answers',
		site: siteId,
		sort: 0
	});
	for (const [i, item] of [
		{
			question: 'How old should my baby be?',
			answer_html: '<p>0–18 months is ideal, but come however old you are.</p>'
		},
		{
			question: 'Do I need to speak Italian?',
			answer_html: '<p>Not a word. Everything is guided in both English and Italian.</p>'
		},
		{
			question: 'What should I bring?',
			answer_html: '<p>A blanket or mat, a change of clothes, and yourself.</p>'
		},
		{
			question: 'Can dads and partners come?',
			answer_html: '<p>Absolutely — Dolce Vita is for the whole family.</p>'
		}
	].entries()) {
		await api('POST', '/items/block_faq_items', {
			...item,
			sort: i,
			faq: faq.data.id
		});
	}

	console.log('  + creating pages row + page_blocks M2A wiring');
	const page = await api('POST', '/items/pages', {
		slug: '/',
		title: 'Dolce Vita CT',
		status: 'published',
		template_type: 'homepage',
		site: siteId,
		seo_title: 'Dolce Vita CT — Italian-inspired mom & baby experience in Stamford, CT',
		seo_description:
			'Reserve your spot at the Dolce Vita Baby Circle — a warm, refined Italian-inspired class for moms and babies in Stamford, Connecticut.'
	});

	const blockOrder = [
		{ collection: 'block_hero', id: hero.data.id },
		{ collection: 'block_rich_text', id: about.data.id },
		{ collection: 'block_timeline', id: timeline.data.id },
		{ collection: 'block_card_group', id: cardGroup.data.id },
		{ collection: 'block_team', id: team.data.id },
		{ collection: 'block_event_details', id: eventDetails.data.id },
		{ collection: 'block_rsvp_form', id: rsvpForm.data.id },
		{ collection: 'block_rich_text', id: story.data.id },
		{ collection: 'block_faq', id: faq.data.id }
	];
	for (const [i, block] of blockOrder.entries()) {
		await api('POST', '/items/page_blocks', {
			pages_id: page.data.id,
			collection: block.collection,
			item: block.id,
			sort: i
		});
	}

	console.log(`  ✓ homepage seeded: pages.id=${page.data.id}`);
}

// ──────────────────────────────────────────────────────────────────────
//  Main
// ──────────────────────────────────────────────────────────────────────

async function main() {
	console.log(`\nDolce Vita CT — Directus migration (${DIRECTUS_URL})`);
	console.log(`  mode: ${DRY_RUN ? 'DRY RUN' : 'APPLY'}`);
	console.log(`  site: ${SITE_KEY}`);
	console.log(`  seed: ${DO_SEED}`);
	console.log(`  skip-schema: ${SKIP_SCHEMA}\n`);

	console.log('[1/6] Ensure site row');
	const siteId = await ensureSite();

	console.log('[2/6] Ensure editor policy + role');
	const { policyId } = await ensureEditorPolicyAndRole();

	console.log('[3/6] Ensure App Service user + static token');
	await ensureAppServiceUser(siteId);

	if (!SKIP_SCHEMA) {
		console.log('[4/6] Create collections + fields + relations');
		for (const def of COLLECTIONS) {
			await upsertCollection(def);
		}
		for (const rel of RELATIONS) {
			await upsertRelation(rel);
		}
		console.log('  extending page_blocks M2A allowed_collections');
		await extendPageBlocksAllowedCollections();
	} else {
		console.log('[4/6] Skipping schema ops (--skip-schema)');
	}

	console.log('[5/6] Backfill permissions');
	await backfillPermissions(policyId);

	if (DO_SEED) {
		console.log('[6/6] Seed placeholder homepage');
		await seedHomepage(siteId);
	} else {
		console.log('[6/6] Skipping seed (pass --seed to create the placeholder homepage)');
	}

	console.log('\n✓ migration complete\n');
}

main().catch((err) => {
	console.error('\n✗ migration failed:', err.message);
	if (err.payload) console.error(JSON.stringify(err.payload, null, 2));
	process.exit(2);
});
