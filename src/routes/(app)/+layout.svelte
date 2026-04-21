<script lang="ts">
	import '../../app.css';
	import Grain from '$components/decor/Grain.svelte';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const site = $derived(
		(data.site as { title?: string | null; description?: string | null } | null) ?? null
	);
	const siteTitle = $derived(site?.title ?? 'Dolce Vita CT');
</script>

<svelte:head>
	<title>{siteTitle} — Italian-inspired mom & baby experience in Stamford, CT</title>
	<meta
		name="description"
		content={site?.description ??
			'Dolce Vita CT is a premium Italian-inspired mom & baby experience in Stamford, Connecticut. Reserve your spot at the Dolce Vita Baby Circle.'}
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
	<!--
		M4b will replace this temporary ribbon with a real editorial sticky nav
		+ mobile drawer. Kept minimal here so M4a focuses strictly on the
		Directus → BlockRenderer wiring.
	-->
	<header class="dv-shell__header">
		<a href="/" class="dv-shell__brand">
			<span class="dv-script">{siteTitle}</span>
		</a>
	</header>

	<main id="main" class="dv-shell__main">
		{@render children?.()}
	</main>

	<footer class="dv-shell__footer">
		<div class="dv-shell__footer-inner">
			<p class="dv-shell__footer-brand">{siteTitle}</p>
			<p class="dv-shell__footer-meta">
				Stamford, Connecticut · &copy; {new Date().getFullYear()}
			</p>
		</div>
	</footer>
</div>

<style>
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

	.dv-shell__header {
		display: flex;
		justify-content: center;
		padding: 2rem 1.5rem 1rem;
	}

	.dv-shell__brand {
		color: var(--dv-color-charcoal);
	}

	.dv-shell__main {
		flex: 1;
	}

	.dv-shell__footer {
		margin-top: auto;
		padding: 3rem 1.5rem 2.5rem;
		border-top: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 8%, transparent);
	}

	.dv-shell__footer-inner {
		margin-inline: auto;
		max-width: 48rem;
		text-align: center;
	}

	.dv-shell__footer-brand {
		font-family: var(--dv-font-script, serif);
		font-size: 2rem;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-shell__footer-meta {
		margin-top: 0.5rem;
		font-family: var(--dv-font-sans);
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
	}
</style>
