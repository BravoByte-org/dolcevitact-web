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
				<p class="dv-timeline__eyebrow dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-timeline__title dv-h2">{data.title}</h2>
			{/if}
			{#if data.subtitle}
				<p class="dv-timeline__subtitle dv-lede">{data.subtitle}</p>
			{/if}
		</header>

		{#if items.length > 0}
			<ol class="dv-timeline__list">
				{#each items as step, i (step.id ?? i)}
					<li class="dv-timeline__item">
						<span class="dv-timeline__marker" aria-hidden="true">{step.year ?? i + 1}</span>
						<div class="dv-timeline__body">
							{#if step.title}
								<h3 class="dv-timeline__step-title">{step.title}</h3>
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

<style lang="postcss">
	@reference '../../../app.css';

	.dv-timeline {
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-timeline__inner {
		@apply mx-auto max-w-[42rem];
	}

	.dv-timeline__header {
		@apply mb-12 text-center;
	}

	.dv-timeline__title {
		@apply mt-3;
	}

	.dv-timeline__subtitle {
		@apply mx-auto mt-4 text-balance;
	}

	.dv-timeline__list {
		@apply relative m-0 list-none p-0;
	}

	.dv-timeline__list::before {
		content: '';
		@apply absolute top-4 bottom-4 left-[1.35rem] w-px;
		background: color-mix(in srgb, var(--dv-color-gold) 60%, transparent);
	}

	.dv-timeline__item {
		@apply relative grid gap-6 py-4;
		grid-template-columns: 3rem 1fr;
	}

	.dv-timeline__marker {
		@apply bg-ivory text-gold-deep font-display relative z-[1] flex h-11 w-11 items-center justify-center rounded-full text-base;
		border: 1px solid color-mix(in srgb, var(--dv-color-gold) 70%, transparent);
	}

	.dv-timeline__step-title {
		@apply text-charcoal font-display text-xl;
	}

	.dv-timeline__desc {
		@apply text-charcoal-soft mt-2 font-sans;
		line-height: 1.65;
	}
</style>
