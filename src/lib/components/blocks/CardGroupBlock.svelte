<script lang="ts">
	type CardItem = {
		id?: string | number;
		title?: string | null;
		summary?: string | null;
		icon?: string | null;
		sort?: number | null;
	};

	type CardGroupData = {
		eyebrow?: string | null;
		title?: string | null;
		subtitle?: string | null;
		items?: CardItem[] | null;
	};

	let { data }: { data: CardGroupData } = $props();

	const items = $derived(
		Array.isArray(data.items) ? [...data.items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : []
	);
</script>

<section id="who-its-for" class="dv-cards">
	<div class="dv-cards__inner">
		<header class="dv-cards__header">
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
			<ul class="dv-cards__grid">
				{#each items as item, i (item.id ?? i)}
					<li class="dv-cards__card">
						{#if item.title}
							<h3 class="dv-cards__title">{item.title}</h3>
						{/if}
						{#if item.summary}
							<p class="dv-cards__summary">{item.summary}</p>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<style>
	.dv-cards {
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-cards__inner {
		margin-inline: auto;
		max-width: 68rem;
	}

	.dv-cards__header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.dv-cards__grid {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		list-style: none;
		padding: 0;
	}

	.dv-cards__card {
		background: color-mix(in srgb, var(--dv-color-ivory) 60%, white 40%);
		border: 1px solid color-mix(in srgb, var(--dv-color-sage) 20%, transparent);
		border-radius: var(--dv-radius-lg, 1.25rem);
		padding: 1.75rem 1.5rem;
		box-shadow: var(--dv-shadow-soft);
		transition:
			transform var(--dv-duration-base) var(--dv-ease-soft),
			box-shadow var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-cards__card:hover {
		transform: translateY(-2px);
		box-shadow: var(--dv-shadow-card);
	}

	.dv-cards__title {
		font-family: var(--dv-font-display);
		font-size: 1.5rem;
		color: var(--dv-color-charcoal);
	}

	.dv-cards__summary {
		margin-top: 0.75rem;
		font-family: var(--dv-font-sans);
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--dv-color-charcoal-soft);
	}
</style>
