<script lang="ts">
	import BrandLockup from '$components/brand/BrandLockup.svelte';
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
			<p class="dv-hero__eyebrow dv-eyebrow">{data.eyebrow}</p>
		{/if}

		<div class="dv-hero__olive" aria-hidden="true">
			<OliveBranch tone="sage" />
		</div>

		<!--
			Canonical brand lockup sits above the page H1. The lockup is the
			brand identity; the H1 below remains the descriptive headline.
			See `.docs/architecture/brand-logo-spec.md`.
		-->
		<div class="dv-hero__lockup">
			<BrandLockup variant="hero" />
		</div>

		{#if data.headline}
			<h1 class="dv-hero__headline dv-h1 dv-anim-rise">{data.headline}</h1>
		{/if}

		<div class="dv-hero__rule">
			<GoldRule size="md" />
		</div>

		{#if data.subheading}
			<p class="dv-hero__subheading dv-lede dv-anim-rise">
				{data.subheading}
			</p>
		{/if}

		{#if ctaHref && data.cta_label}
			<a href={ctaHref} class="dv-hero__cta">
				{data.cta_label}
			</a>
		{/if}
	</div>
</section>

<style lang="postcss">
	@reference '../../../app.css';

	.dv-hero {
		padding: clamp(4rem, 12vw, 8rem) 1.5rem;
	}

	.dv-hero__inner {
		@apply mx-auto max-w-[52rem] text-center;
	}

	.dv-hero__olive {
		@apply mx-auto mt-8 w-48 sm:w-56;
	}

	.dv-hero__lockup {
		@apply mt-8 flex justify-center;
	}

	.dv-hero__headline {
		@apply mt-10 text-balance;
	}

	.dv-hero__rule {
		@apply mt-8;
	}

	.dv-hero__subheading {
		@apply mx-auto mt-8 max-w-[36rem] text-balance;
	}

	.dv-hero__cta {
		@apply bg-terracotta-deep shadow-soft mt-12 inline-flex items-center rounded-full px-8 py-[0.9rem] font-sans text-[0.8rem] tracking-[0.14em] text-white uppercase transition-colors;

		&:hover {
			background: color-mix(in srgb, var(--dv-color-terracotta-deep) 85%, #000);
		}

		&:focus-visible {
			@apply outline-terracotta-deep outline-2 outline-offset-4;
		}
	}
</style>
