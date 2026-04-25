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
				<p class="dv-cards__eyebrow dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-cards__title dv-h2">{data.title}</h2>
			{/if}
			{#if data.subtitle}
				<p class="dv-cards__subtitle dv-lede">{data.subtitle}</p>
			{/if}
		</header>

		{#if items.length > 0}
			<ul class="dv-cards__grid">
				{#each items as item, i (item.id ?? i)}
					<li class="dv-cards__card">
						{#if item.title}
							<h3 class="dv-cards__card-title">{item.title}</h3>
						{/if}
						{#if item.summary}
							<p class="dv-cards__card-summary">{item.summary}</p>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<style lang="postcss">
	@reference '../../../app.css';

	.dv-cards {
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-cards__inner {
		@apply mx-auto max-w-[68rem];
	}

	.dv-cards__header {
		@apply mb-12 text-center;
	}

	.dv-cards__title {
		@apply mt-3;
	}

	.dv-cards__subtitle {
		@apply mx-auto mt-4 text-balance;
	}

	.dv-cards__grid {
		@apply grid list-none gap-6 p-0;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	}

	.dv-cards__card {
		@apply shadow-soft rounded-lg px-6 py-7;
		background: color-mix(in srgb, var(--dv-color-ivory) 60%, white 40%);
		border: 1px solid color-mix(in srgb, var(--dv-color-sage) 20%, transparent);
		transition:
			transform var(--dv-duration-base) var(--dv-ease-soft),
			box-shadow var(--dv-duration-base) var(--dv-ease-soft);

		&:hover {
			@apply shadow-card;
			transform: translateY(-2px);
		}
	}

	.dv-cards__card-title {
		@apply text-charcoal font-display text-2xl;
	}

	.dv-cards__card-summary {
		@apply text-charcoal-soft mt-3 font-sans text-[0.95rem];
		line-height: 1.65;
	}
</style>
