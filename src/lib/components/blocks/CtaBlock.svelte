<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';

	type CtaData = {
		eyebrow?: string | null;
		title?: string | null;
		subtitle?: string | null;
		primary_label?: string | null;
		primary_url?: string | null;
		secondary_label?: string | null;
		secondary_url?: string | null;
	};

	let { data }: { data: CtaData } = $props();
</script>

<section class="dv-cta">
	<div class="dv-cta__inner">
		{#if data.eyebrow}
			<p class="dv-cta__eyebrow dv-eyebrow">{data.eyebrow}</p>
		{/if}
		{#if data.title}
			<h2 class="dv-cta__title dv-h2">{data.title}</h2>
		{/if}

		<div class="dv-cta__rule">
			<GoldRule size="sm" />
		</div>

		{#if data.subtitle}
			<p class="dv-cta__subtitle dv-lede">{data.subtitle}</p>
		{/if}

		<div class="dv-cta__actions">
			{#if data.primary_url && data.primary_label}
				<a class="dv-cta__primary" href={data.primary_url}>{data.primary_label}</a>
			{/if}
			{#if data.secondary_url && data.secondary_label}
				<a class="dv-cta__secondary" href={data.secondary_url}>{data.secondary_label}</a>
			{/if}
		</div>
	</div>
</section>

<style lang="postcss">
	@reference '../../../app.css';

	.dv-cta {
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-cta__inner {
		@apply mx-auto max-w-[42rem] text-center;
	}

	.dv-cta__title {
		@apply mt-3 text-balance;
	}

	.dv-cta__rule {
		@apply mt-6;
	}

	.dv-cta__subtitle {
		@apply mx-auto mt-6 text-balance;
	}

	.dv-cta__actions {
		@apply mt-8 flex flex-wrap justify-center gap-4;
	}

	.dv-cta__primary,
	.dv-cta__secondary {
		@apply inline-flex items-center rounded-full px-7 py-[0.85rem] font-sans text-[0.8rem] tracking-[0.14em] uppercase;
		transition:
			background-color var(--dv-duration-base) var(--dv-ease-soft),
			color var(--dv-duration-base) var(--dv-ease-soft);

		&:focus-visible {
			@apply outline-terracotta-deep outline-2 outline-offset-4;
		}
	}

	.dv-cta__primary {
		@apply bg-terracotta-deep text-white;

		&:hover {
			background: color-mix(in srgb, var(--dv-color-terracotta-deep) 85%, #000);
		}
	}

	.dv-cta__secondary {
		@apply text-charcoal;
		border: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 30%, transparent);

		&:hover {
			background: color-mix(in srgb, var(--dv-color-charcoal) 5%, transparent);
		}
	}
</style>
