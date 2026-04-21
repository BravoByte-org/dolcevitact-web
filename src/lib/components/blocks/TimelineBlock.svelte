<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';

	type TimelineItem = {
		id?: string | number;
		year?: string | null;
		title?: string | null;
		description?: string | null;
		sort?: number | null;
	};

	type TimelineData = {
		anchor?: string | null;
		eyebrow?: string | null;
		script_accent?: string | null;
		title?: string | null;
		subtitle?: string | null;
		items?: TimelineItem[] | null;
	};

	let { data }: { data: TimelineData } = $props();

	const items = $derived(
		Array.isArray(data.items) ? [...data.items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : []
	);

	const anchor = $derived(data.anchor ?? 'how-it-works');

	const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

	function markerFor(step: TimelineItem, index: number): string {
		if (step.year && step.year.trim().length > 0) return step.year;
		return ROMAN[index] ?? String(index + 1);
	}
</script>

<section id={anchor} class="dv-timeline">
	<div class="dv-timeline__inner">
		<header class="dv-timeline__header">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.script_accent}
				<p class="dv-timeline__script">{data.script_accent}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-timeline__title text-balance">{data.title}</h2>
			{/if}
			<div class="dv-timeline__rule">
				<GoldRule size="sm" />
			</div>
			{#if data.subtitle}
				<p class="dv-timeline__lede mx-auto text-balance">{data.subtitle}</p>
			{/if}
		</header>

		{#if items.length > 0}
			<ol class="dv-timeline__list">
				{#each items as step, i (step.id ?? i)}
					<li class="dv-timeline__item">
						<span class="dv-timeline__marker" aria-hidden="true">
							{markerFor(step, i)}
						</span>
						<div class="dv-timeline__body">
							{#if step.title}
								<h3 class="dv-timeline__item-title">{step.title}</h3>
							{/if}
							{#if step.description}
								<p class="dv-timeline__desc">{step.description}</p>
							{/if}
						</div>
					</li>
				{/each}
			</ol>
		{/if}
	</div>
</section>

<style>
	.dv-timeline {
		padding: var(--dv-space-section) 1.5rem;
	}

	.dv-timeline__inner {
		margin-inline: auto;
		max-width: 48rem;
	}

	.dv-timeline__header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.dv-timeline__script {
		margin-top: 0.5rem;
		font-family: var(--dv-font-script);
		font-size: clamp(1.75rem, 1.2rem + 1.4vw, 2.5rem);
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-timeline__title {
		margin-top: 0.75rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(1.75rem, 1.25rem + 1.6vw, 2.5rem);
		line-height: 1.15;
		color: var(--dv-color-charcoal);
	}

	.dv-timeline__rule {
		margin-top: 1.5rem;
	}

	.dv-timeline__lede {
		margin-top: 1.5rem;
		max-width: 36rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 1.15rem;
		line-height: 1.55;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-timeline__list {
		list-style: none;
		padding: 0;
		margin: 0;
		position: relative;
	}

	/* Dotted gold guideline that connects the markers — dotted reads
	 * more like a decorative stitching line than a harsh solid bar. */
	.dv-timeline__list::before {
		content: '';
		position: absolute;
		left: 1.65rem;
		top: 1.75rem;
		bottom: 1.75rem;
		width: 0;
		border-left: 1px dotted color-mix(in srgb, var(--dv-color-gold) 70%, transparent);
	}

	.dv-timeline__item {
		position: relative;
		display: grid;
		grid-template-columns: 3.5rem 1fr;
		gap: 1.75rem;
		padding: 1.5rem 0;
	}

	.dv-timeline__item + .dv-timeline__item {
		padding-top: 2rem;
	}

	.dv-timeline__marker {
		position: relative;
		z-index: 1;
		justify-self: start;
		width: 3.25rem;
		height: 3.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background: var(--dv-color-ivory);
		border: 1px solid color-mix(in srgb, var(--dv-color-gold) 75%, transparent);
		box-shadow: inset 0 0 0 4px color-mix(in srgb, var(--dv-color-ivory) 60%, white);
		color: var(--dv-color-gold-deep);
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 1.05rem;
		letter-spacing: 0.02em;
	}

	.dv-timeline__item-title {
		padding-top: 0.3rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: 1.4rem;
		line-height: 1.25;
		color: var(--dv-color-charcoal);
	}

	.dv-timeline__desc {
		margin-top: 0.65rem;
		font-family: var(--dv-font-sans);
		font-size: 1rem;
		line-height: 1.7;
		color: var(--dv-color-charcoal-soft);
	}
</style>
