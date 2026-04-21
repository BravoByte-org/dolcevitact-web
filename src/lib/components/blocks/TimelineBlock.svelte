<script lang="ts">
	type TimelineItem = {
		id?: string | number;
		year?: string | null;
		title?: string | null;
		description?: string | null;
		sort?: number | null;
	};

	type TimelineData = {
		eyebrow?: string | null;
		title?: string | null;
		subtitle?: string | null;
		items?: TimelineItem[] | null;
	};

	let { data }: { data: TimelineData } = $props();

	const items = $derived(
		Array.isArray(data.items) ? [...data.items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : []
	);
</script>

<section id="how-it-works" class="dv-timeline">
	<div class="dv-timeline__inner">
		<header class="dv-timeline__header">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-h2 mt-3">{data.title}</h2>
			{/if}
			{#if data.subtitle}
				<p class="dv-lede mx-auto mt-4 text-balance">{data.subtitle}</p>
			{/if}
		</header>

		{#if items.length > 0}
			<ol class="dv-timeline__list">
				{#each items as step, i (step.id ?? i)}
					<li class="dv-timeline__item">
						<span class="dv-timeline__marker" aria-hidden="true">{step.year ?? i + 1}</span>
						<div class="dv-timeline__body">
							{#if step.title}
								<h3 class="dv-timeline__title">{step.title}</h3>
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
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-timeline__inner {
		margin-inline: auto;
		max-width: 42rem;
	}

	.dv-timeline__header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.dv-timeline__list {
		list-style: none;
		padding: 0;
		margin: 0;
		position: relative;
	}

	.dv-timeline__list::before {
		content: '';
		position: absolute;
		left: 1.35rem;
		top: 1rem;
		bottom: 1rem;
		width: 1px;
		background: color-mix(in srgb, var(--dv-color-gold) 60%, transparent);
	}

	.dv-timeline__item {
		position: relative;
		display: grid;
		grid-template-columns: 3rem 1fr;
		gap: 1.5rem;
		padding: 1rem 0;
	}

	.dv-timeline__marker {
		position: relative;
		z-index: 1;
		width: 2.75rem;
		height: 2.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background: var(--dv-color-ivory);
		border: 1px solid color-mix(in srgb, var(--dv-color-gold) 70%, transparent);
		color: var(--dv-color-gold-deep);
		font-family: var(--dv-font-display);
		font-size: 1rem;
	}

	.dv-timeline__title {
		font-family: var(--dv-font-display);
		font-size: 1.25rem;
		color: var(--dv-color-charcoal);
	}

	.dv-timeline__desc {
		margin-top: 0.5rem;
		font-family: var(--dv-font-sans);
		color: var(--dv-color-charcoal-soft);
		line-height: 1.65;
	}
</style>
