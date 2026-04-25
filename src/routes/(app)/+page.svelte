<script lang="ts">
	import type { PageData } from './$types';
	import BlockRenderer from '$components/blocks/BlockRenderer.svelte';
	import BrandLockup from '$components/brand/BrandLockup.svelte';
	import GoldRule from '$components/decor/GoldRule.svelte';
	import OliveBranch from '$components/decor/OliveBranch.svelte';
	import type { Block } from '$components/blocks/types';

	let { data }: { data: PageData } = $props();

	/*
	 * Site-wide constants used by per-page SEO + structured data. Hard-coded
	 * here (vs. pulled from CMS) because they're identity-level: the
	 * canonical URL, brand name, and OG image asset don't vary by page or
	 * by Directus content. If/when sibling chapters launch (e.g. /cucina),
	 * each `+page.svelte` will own its own canonical URL + page-specific
	 * SEO block.
	 */
	const SITE_URL = 'https://dolcevitact.com';
	const SITE_BRAND = 'Dolce Vita Baby Circle';
	const PAGE_URL = `${SITE_URL}/`;

	/*
	 * OG image — placeholder URL via placehold.co with brand-aligned hex
	 * colors so rich previews render today (Slack, Discord, Twitter, FB,
	 * LinkedIn, iMessage). Pre-launch polish replaces this with a designer
	 * asset hosted at `/og-image.png` (see follow-up issue).
	 */
	const OG_IMAGE = 'https://placehold.co/1200x630/f6f1ec/b8694b/png?text=Dolce+Vita+Baby+Circle';

	const page = $derived((data.pages?.[0] as Record<string, unknown> | undefined) ?? null);
	const blocks = $derived(
		(page?.blocks as Block[] | undefined)?.filter((b) => b && b.collection && b.item) ?? []
	);
	const cmsSeoTitle = $derived(page?.seo_title as string | undefined);
	const pageTitle = $derived(cmsSeoTitle ?? (page?.title as string | undefined) ?? SITE_BRAND);
	const pageDescription = $derived(
		(page?.seo_description as string | undefined) ??
			'An Italian-inspired morning for mama and bambino in Stamford, CT — the first chapter of Dolce Vita.'
	);

	/*
	 * Title-construction policy:
	 *   - When the CMS has an `seo_title`, treat it as editor-authored and
	 *     use it verbatim. Editors can include the brand themselves (and
	 *     usually do) — appending it would produce things like
	 *     "Dolce Vita Baby Circle — ... | Dolce Vita Baby Circle".
	 *   - Otherwise, use either the page's plain `title` suffixed with the
	 *     brand, or just the brand alone.
	 */
	const fullTitle = $derived.by(() => {
		if (cmsSeoTitle) return cmsSeoTitle;
		if (pageTitle === SITE_BRAND) return SITE_BRAND;
		return `${pageTitle} | ${SITE_BRAND}`;
	});

	/*
	 * Schema.org LocalBusiness block — drives rich-result eligibility for
	 * "Dolce Vita Baby Circle" knowledge-panel surfaces in Google. Kept as
	 * a derived JSON object then stringified at render time so future
	 * page-specific entries (e.g. Event for the next class date) compose
	 * cleanly. Skipping `Event` for now: until founder confirms session
	 * dates, posting fake dates would risk a "deceptive structured data"
	 * penalty.
	 */
	const localBusinessJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'LocalBusiness',
			'@id': `${SITE_URL}/#localbusiness`,
			name: SITE_BRAND,
			alternateName: 'Dolce Vita',
			description: pageDescription,
			url: PAGE_URL,
			image: OG_IMAGE,
			email: 'babycircle@dolcevitact.com',
			address: {
				'@type': 'PostalAddress',
				addressLocality: 'Stamford',
				addressRegion: 'CT',
				addressCountry: 'US'
			},
			areaServed: {
				'@type': 'City',
				name: 'Stamford'
			}
		})
			// Defensive escapes: CMS-supplied text could include `<`, `>`, or
			// `&` which would otherwise let an editor's content escape the
			// `<script type="application/ld+json">` block. JSON.stringify alone
			// does NOT escape these (only quotes / control chars).
			.replace(/</g, '\\u003c')
			.replace(/>/g, '\\u003e')
			.replace(/&/g, '\\u0026')
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={PAGE_URL} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={PAGE_URL} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:image" content={OG_IMAGE} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="{SITE_BRAND} — Italian-inspired morning for mama and bambino"
	/>

	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={OG_IMAGE} />

	<!--
		Standard SvelteKit JSON-LD pattern. The JSON above is .replace()-d to
		escape `<`, `>`, and `&` as unicode escapes, so editor-supplied CMS
		text cannot break out of the script tag. The closing `</script>` is
		split across a string concatenation so Svelte's template compiler
		doesn't terminate the route's `<svelte:head>` block prematurely.
	-->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${localBusinessJsonLd}</` + `script>`}
</svelte:head>

{#if blocks.length > 0}
	<BlockRenderer {blocks} />
{:else}
	<!--
		Fallback: if Directus is unreachable or the seeded page hasn't landed
		yet, render the M3 editorial placeholder so production never shows a
		blank page on a CMS hiccup. The canonical Dolce Vita / Baby Circle
		lockup carries the brand identity; the H1 below remains the page's
		descriptive headline (one H1 per page, brand mark stays decorative).
	-->
	<section class="dv-fallback">
		<div class="dv-fallback__inner">
			<p class="dv-eyebrow">Stamford · Connecticut</p>
			<div class="dv-fallback__olive">
				<OliveBranch tone="sage" />
			</div>
			<div class="dv-fallback__lockup">
				<BrandLockup variant="hero" />
			</div>
			<h1 class="dv-h1 dv-anim-rise mt-8 text-balance">
				An Italian-inspired morning for mama e bambino
			</h1>
			<div class="mt-6">
				<GoldRule size="md" />
			</div>
			<p class="dv-lede dv-anim-rise mx-auto mt-8 text-balance">
				The Baby Circle — a warm, refined Italian circle for mothers and babies, coming this spring
				in Stamford.
			</p>
			<a
				href="mailto:babycircle@dolcevitact.com?subject=Dolce%20Vita%20Baby%20Circle%20early%20list"
				class="dv-fallback__cta">Be the first to know</a
			>
		</div>
	</section>
{/if}

<style>
	.dv-fallback {
		padding: clamp(4rem, 12vw, 7rem) 1.5rem;
	}

	.dv-fallback__inner {
		margin-inline: auto;
		max-width: 48rem;
		text-align: center;
	}

	.dv-fallback__olive {
		margin-inline: auto;
		margin-top: 2rem;
		width: 12rem;
	}

	.dv-fallback__lockup {
		display: flex;
		justify-content: center;
		margin-top: 1.5rem;
	}

	.dv-fallback__cta {
		display: inline-flex;
		align-items: center;
		margin-top: 3rem;
		padding: 0.9rem 2rem;
		background: var(--dv-color-terracotta);
		color: var(--dv-color-ivory);
		font-family: var(--dv-font-sans);
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		border-radius: var(--dv-radius-pill, 999px);
		transition: background-color var(--dv-duration-base) var(--dv-ease-soft);
	}
	.dv-fallback__cta:hover {
		background: var(--dv-color-terracotta-deep);
	}
</style>
