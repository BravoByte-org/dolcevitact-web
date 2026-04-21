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
			<p class="dv-eyebrow">{data.eyebrow}</p>
		{/if}
		{#if data.title}
			<h2 class="dv-h2 mt-3 text-balance">{data.title}</h2>
		{/if}

		<div class="dv-cta__rule">
			<GoldRule size="sm" />
		</div>

		{#if data.subtitle}
			<p class="dv-lede mx-auto mt-6 text-balance">{data.subtitle}</p>
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

<style>
	.dv-cta {
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-cta__inner {
		margin-inline: auto;
		max-width: 42rem;
		text-align: center;
	}

	.dv-cta__rule {
		margin-top: 1.5rem;
	}

	.dv-cta__actions {
		margin-top: 2rem;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.dv-cta__primary,
	.dv-cta__secondary {
		display: inline-flex;
		align-items: center;
		padding: 0.85rem 1.75rem;
		font-family: var(--dv-font-sans);
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		border-radius: var(--dv-radius-pill, 999px);
		transition:
			background-color var(--dv-duration-base) var(--dv-ease-soft),
			color var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-cta__primary {
		background: var(--dv-color-terracotta);
		color: var(--dv-color-ivory);
	}
	.dv-cta__primary:hover {
		background: var(--dv-color-terracotta-deep);
	}

	.dv-cta__secondary {
		border: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 30%, transparent);
		color: var(--dv-color-charcoal);
	}
	.dv-cta__secondary:hover {
		background: color-mix(in srgb, var(--dv-color-charcoal) 5%, transparent);
	}
</style>
