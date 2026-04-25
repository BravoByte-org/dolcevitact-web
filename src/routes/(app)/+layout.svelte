<script lang="ts">
	import '../../app.css';
	import Grain from '$components/decor/Grain.svelte';
	import SiteNav from '$components/navigation/SiteNav.svelte';
	import SiteFooter from '$components/navigation/SiteFooter.svelte';
	import type { NavItem } from '$components/navigation/types';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const site = $derived(
		(data.site as { title?: string | null; description?: string | null } | null) ?? null
	);
	const siteTitle = $derived(site?.title ?? 'Dolce Vita Baby Circle');
	const navItems = $derived(((data.navigation ?? []) as NavItem[]) ?? []);
</script>

<svelte:head>
	<title>{siteTitle} — Italian-inspired mama & bambino circle in Stamford, CT</title>
	<meta
		name="description"
		content={site?.description ??
			'Dolce Vita Baby Circle — an Italian-inspired morning of music, language, and movement for mama and bambino in Stamford, Connecticut. The first chapter of Dolce Vita.'}
	/>
	<link rel="canonical" href="https://dolcevitact.com/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={siteTitle} />
	<meta
		property="og:description"
		content="A warm, refined Italian-inspired class for moms and babies in Stamford, CT."
	/>
	<meta property="og:url" content="https://dolcevitact.com/" />
	<meta property="og:locale" content="en_US" />
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
