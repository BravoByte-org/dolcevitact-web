<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';
	import OliveBranch from '$components/decor/OliveBranch.svelte';

	type HeroData = {
		eyebrow?: string | null;
		headline?: string | null;
		subheading?: string | null;
		cta_label?: string | null;
		cta_url?: string | null;
		cta_anchor?: string | null;
	};

	let { data }: { data: HeroData } = $props();

	const ctaHref = $derived(data.cta_anchor || data.cta_url || null);
</script>

<section id="hero" class="dv-hero">
	<div class="dv-hero__inner">
		{#if data.eyebrow}
			<p class="dv-eyebrow">{data.eyebrow}</p>
		{/if}

		<div class="dv-hero__olive" aria-hidden="true">
			<OliveBranch tone="sage" />
		</div>

		{#if data.headline}
			<h1 class="dv-h1 dv-anim-rise text-balance">{data.headline}</h1>
		{/if}

		<div class="dv-hero__rule">
			<GoldRule size="md" />
		</div>

		{#if data.subheading}
			<p class="dv-lede dv-anim-rise mx-auto text-balance">
				{data.subheading}
			</p>
		{/if}

		{#if ctaHref && data.cta_label}
			<a
				href={ctaHref}
				class="bg-terracotta hover:bg-terracotta-deep text-ivory shadow-soft dv-hero__cta"
			>
				{data.cta_label}
			</a>
		{/if}
	</div>
</section>

<style>
	.dv-hero {
		padding: clamp(4rem, 12vw, 8rem) 1.5rem;
	}

	.dv-hero__inner {
		margin-inline: auto;
		max-width: 52rem;
		text-align: center;
	}

	.dv-hero__olive {
		margin-inline: auto;
		margin-top: 2rem;
		width: 12rem;
	}

	@media (min-width: 640px) {
		.dv-hero__olive {
			width: 14rem;
		}
	}

	.dv-hero__rule {
		margin-top: 2rem;
	}

	.dv-lede {
		margin-top: 2rem;
		max-width: 36rem;
	}

	.dv-hero__cta {
		display: inline-flex;
		align-items: center;
		margin-top: 3rem;
		padding: 0.9rem 2rem;
		border-radius: var(--dv-radius-pill, 999px);
		font-family: var(--dv-font-sans);
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		transition: background-color var(--dv-duration-base) var(--dv-ease-soft);
	}
</style>
