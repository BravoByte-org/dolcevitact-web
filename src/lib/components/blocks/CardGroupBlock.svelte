<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';

	type CardItem = {
		id?: string | number;
		title?: string | null;
		summary?: string | null;
		icon?: string | null;
		sort?: number | null;
	};

	type CardGroupData = {
		anchor?: string | null;
		eyebrow?: string | null;
		script_accent?: string | null;
		title?: string | null;
		subtitle?: string | null;
		items?: CardItem[] | null;
	};

	let { data }: { data: CardGroupData } = $props();

	const items = $derived(
		Array.isArray(data.items) ? [...data.items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : []
	);

	const anchor = $derived(data.anchor ?? 'who-its-for');
</script>

<section id={anchor} class="dv-cards">
	<div class="dv-cards__inner">
		<header class="dv-cards__header">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.script_accent}
				<p class="dv-cards__script">{data.script_accent}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-cards__title text-balance">{data.title}</h2>
			{/if}
			<div class="dv-cards__rule">
				<GoldRule size="sm" />
			</div>
			{#if data.subtitle}
				<p class="dv-cards__lede mx-auto text-balance">{data.subtitle}</p>
			{/if}
		</header>

		{#if items.length > 0}
			<ul class="dv-cards__grid">
				{#each items as item, i (item.id ?? i)}
					<li class="dv-cards__card">
						<span class="dv-cards__index" aria-hidden="true">0{i + 1}</span>
						{#if item.title}
							<h3 class="dv-cards__card-title">{item.title}</h3>
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
		padding: var(--dv-space-section) 1.5rem;
	}

	.dv-cards__inner {
		margin-inline: auto;
		max-width: 72rem;
	}

	.dv-cards__header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.dv-cards__script {
		margin-top: 0.5rem;
		font-family: var(--dv-font-script);
		font-size: clamp(1.75rem, 1.2rem + 1.4vw, 2.5rem);
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-cards__title {
		margin-top: 0.75rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(1.75rem, 1.25rem + 1.6vw, 2.5rem);
		line-height: 1.15;
		color: var(--dv-color-charcoal);
	}

	.dv-cards__rule {
		margin-top: 1.5rem;
	}

	.dv-cards__lede {
		margin-top: 1.5rem;
		max-width: 36rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 1.15rem;
		line-height: 1.55;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-cards__grid {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: 1fr;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	@media (min-width: 640px) {
		.dv-cards__grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 2rem;
		}
	}

	@media (min-width: 960px) {
		.dv-cards__grid {
			grid-template-columns: repeat(3, 1fr);
		}

		/* Gently offset even-indexed cards downward to break the rigid
		 * grid line and give the section an editorial magazine feel. */
		.dv-cards__card:nth-child(even) {
			transform: translateY(2.25rem);
		}
	}

	.dv-cards__card {
		position: relative;
		padding: 2.5rem 2rem 2rem;
		background: color-mix(in srgb, var(--dv-color-ivory) 60%, white 40%);
		border: 1px solid color-mix(in srgb, var(--dv-color-gold) 26%, transparent);
		border-radius: var(--dv-radius-md);
		transition:
			transform var(--dv-duration-base) var(--dv-ease-soft),
			border-color var(--dv-duration-base) var(--dv-ease-soft),
			box-shadow var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-cards__card:hover {
		border-color: color-mix(in srgb, var(--dv-color-terracotta) 45%, transparent);
		box-shadow: var(--dv-shadow-soft);
	}

	@media (min-width: 960px) {
		.dv-cards__card:hover {
			transform: translateY(-3px);
		}
		.dv-cards__card:nth-child(even):hover {
			transform: translateY(calc(2.25rem - 3px));
		}
	}

	.dv-cards__index {
		position: absolute;
		top: 1rem;
		right: 1.25rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 0.85rem;
		letter-spacing: 0.08em;
		color: var(--dv-color-gold-deep);
	}

	.dv-cards__card-title {
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: 1.5rem;
		line-height: 1.25;
		color: var(--dv-color-charcoal);
	}

	.dv-cards__summary {
		margin-top: 0.9rem;
		font-family: var(--dv-font-sans);
		font-size: 0.96rem;
		line-height: 1.65;
		color: var(--dv-color-charcoal-soft);
	}
</style>
