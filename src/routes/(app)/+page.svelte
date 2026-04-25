<script lang="ts">
	import type { PageData } from './$types';
	import BlockRenderer from '$components/blocks/BlockRenderer.svelte';
	import BrandLockup from '$components/brand/BrandLockup.svelte';
	import GoldRule from '$components/decor/GoldRule.svelte';
	import OliveBranch from '$components/decor/OliveBranch.svelte';
	import type { Block } from '$components/blocks/types';

	let { data }: { data: PageData } = $props();

	const page = $derived((data.pages?.[0] as Record<string, unknown> | undefined) ?? null);
	const blocks = $derived(
		(page?.blocks as Block[] | undefined)?.filter((b) => b && b.collection && b.item) ?? []
	);
	const seoTitle = $derived(
		(page?.seo_title as string | undefined) ??
			(page?.title as string | undefined) ??
			'Dolce Vita Baby Circle'
	);
	const seoDescription = $derived(
		(page?.seo_description as string | undefined) ??
			'An Italian-inspired morning for mama and bambino in Stamford, CT — the first chapter of Dolce Vita.'
	);
</script>

<svelte:head>
	<title>{seoTitle} | Dolce Vita Baby Circle</title>
	<meta name="description" content={seoDescription} />
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
