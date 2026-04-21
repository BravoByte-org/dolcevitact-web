<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';
	import OliveBranch from '$components/decor/OliveBranch.svelte';

	type CtaData = {
		eyebrow?: string | null;
		script_accent?: string | null;
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
		<div class="dv-cta__olive" aria-hidden="true">
			<OliveBranch tone="sage" />
		</div>

		{#if data.eyebrow}
			<p class="dv-eyebrow">{data.eyebrow}</p>
		{/if}
		{#if data.script_accent}
			<p class="dv-cta__script">{data.script_accent}</p>
		{/if}
		{#if data.title}
			<h2 class="dv-cta__title text-balance">{data.title}</h2>
		{/if}

		<div class="dv-cta__rule">
			<GoldRule size="sm" />
		</div>

		{#if data.subtitle}
			<p class="dv-cta__lede mx-auto text-balance">{data.subtitle}</p>
		{/if}

		<div class="dv-cta__actions">
			{#if data.primary_url && data.primary_label}
				<a class="dv-cta__primary" href={data.primary_url}>
					<span>{data.primary_label}</span>
					<span aria-hidden="true" class="dv-cta__arrow">→</span>
				</a>
			{/if}
			{#if data.secondary_url && data.secondary_label}
				<a class="dv-cta__secondary" href={data.secondary_url}>{data.secondary_label}</a>
			{/if}
		</div>
	</div>
</section>

<style>
	.dv-cta {
		padding: var(--dv-space-section) 1.5rem;
	}

	.dv-cta__inner {
		margin-inline: auto;
		max-width: 44rem;
		text-align: center;
	}

	.dv-cta__olive {
		margin-inline: auto;
		width: 7rem;
		margin-bottom: 1.25rem;
		opacity: 0.85;
	}

	.dv-cta__script {
		margin-top: 0.5rem;
		font-family: var(--dv-font-script);
		font-size: clamp(1.75rem, 1.2rem + 1.4vw, 2.75rem);
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-cta__title {
		margin-top: 0.75rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(1.75rem, 1.25rem + 1.8vw, 2.75rem);
		line-height: 1.15;
		color: var(--dv-color-charcoal);
	}

	.dv-cta__rule {
		margin-top: 1.5rem;
	}

	.dv-cta__lede {
		margin-top: 1.5rem;
		max-width: 34rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 1.15rem;
		line-height: 1.55;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-cta__actions {
		margin-top: 2.5rem;
		display: flex;
		gap: 1.25rem;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	.dv-cta__primary {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.95rem 2rem;
		background: var(--dv-color-terracotta);
		color: var(--dv-color-ivory);
		font-family: var(--dv-font-sans);
		font-size: 0.78rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		text-decoration: none;
		border-radius: 9999px;
		box-shadow: var(--dv-shadow-soft);
		transition:
			background-color var(--dv-duration-base) var(--dv-ease-soft),
			transform var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-cta__primary:hover {
		background: var(--dv-color-terracotta-deep);
		transform: translateY(-1px);
	}

	.dv-cta__arrow {
		transition: transform var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-cta__primary:hover .dv-cta__arrow {
		transform: translateX(3px);
	}

	.dv-cta__secondary {
		padding: 0.6rem 0.25rem;
		font-family: var(--dv-font-display);
		font-size: 1.05rem;
		font-style: italic;
		color: var(--dv-color-charcoal-soft);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--dv-color-gold) 60%, transparent);
		transition:
			color var(--dv-duration-fast) var(--dv-ease-soft),
			border-color var(--dv-duration-fast) var(--dv-ease-soft);
	}

	.dv-cta__secondary:hover {
		color: var(--dv-color-terracotta-deep);
		border-bottom-color: var(--dv-color-terracotta);
	}
</style>
