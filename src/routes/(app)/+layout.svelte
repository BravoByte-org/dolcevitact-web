<script lang="ts">
	import '../../app.css';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import Grain from '$components/decor/Grain.svelte';
	import SiteNav from '$components/navigation/SiteNav.svelte';
	import SiteFooter from '$components/navigation/SiteFooter.svelte';
	import type { NavItem } from '$components/navigation/types';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	/*
	 * Vercel Web Analytics + Speed Insights are wired here at the (app)
	 * layout level so every marketing route is tracked from a single
	 * place. Both helpers are SSR-safe — they no-op on the server and
	 * inject their scripts on the client. No env vars or tokens are
	 * required: Vercel auto-detects the deployment ID at runtime.
	 *
	 * `mode: dev ? 'development' : 'production'` keeps local `pnpm dev`
	 * out of the prod analytics bucket while still letting us verify the
	 * `/_vercel/insights/*` requests fire end-to-end on preview deploys.
	 */
	injectAnalytics({ mode: dev ? 'development' : 'production' });
	injectSpeedInsights();

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const site = $derived(
		(data.site as { title?: string | null; description?: string | null } | null) ?? null
	);
	const siteTitle = $derived(site?.title ?? 'Dolce Vita Baby Circle');
	const navItems = $derived(((data.navigation ?? []) as NavItem[]) ?? []);
</script>

<svelte:head>
	<!--
		Site-wide head: only tags that DON'T vary per-page live here. Per-page
		title / description / canonical / og:url / og:image / twitter / JSON-LD
		are owned by each `+page.svelte` so the route can override cleanly
		without duplicate `<title>` tags.
	-->

	<meta name="theme-color" content="#f6f1ec" />
	<meta name="apple-mobile-web-app-title" content="Dolce Vita" />
	<meta name="application-name" content="Dolce Vita Baby Circle" />
	<meta name="format-detection" content="telephone=no" />

	<meta property="og:site_name" content="Dolce Vita Baby Circle" />
	<meta property="og:locale" content="en_US" />
	<meta name="twitter:card" content="summary_large_image" />

	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="manifest" href="/site.webmanifest" />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&family=Tangerine:wght@400;700&display=swap"
	/>
</svelte:head>

<Grain />

<a href="#main" class="dv-skip-link">Skip to content</a>

<div class="dv-shell">
	<SiteNav items={navItems} {siteTitle} />

	<main id="main" class="dv-shell__main">
		{@render children?.()}
	</main>

	<SiteFooter items={navItems} {siteTitle} />
</div>

<style>
	/*
	 * Smooth in-page jumps for the sticky nav's section anchors. Scroll
	 * offset matches the default nav bar height (64px compact, ~80px on
	 * the wider bar) so the heading lands just under the sticky ribbon
	 * instead of hiding behind it.
	 */
	:global(html) {
		scroll-behavior: smooth;
		scroll-padding-top: 5rem;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}
	}

	.dv-skip-link {
		position: absolute;
		left: -9999px;
		top: 1rem;
	}
	.dv-skip-link:focus {
		left: 1rem;
		z-index: 100;
		padding: 0.5rem 0.75rem;
		background: var(--dv-color-ivory);
		color: var(--dv-color-charcoal);
		border-radius: 0.5rem;
	}

	.dv-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		position: relative;
		z-index: 10;
	}

	.dv-shell__main {
		flex: 1;
	}
</style>
