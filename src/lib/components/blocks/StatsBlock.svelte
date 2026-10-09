<script lang="ts">
	type StatsData = {
		title?: string | null;
		stats?: Array<{ label?: string; value?: string }>;
	};

	let { data }: { data: StatsData } = $props();

	const stats = $derived(Array.isArray(data.stats) ? data.stats : []);
</script>

<section class="dv-stats">
	<div class="dv-stats__inner">
		{#if data.title}
			<h2 class="dv-stats__title dv-h2">{data.title}</h2>
		{/if}
		{#if stats.length > 0}
			<dl class="dv-stats__grid">
				{#each stats as stat, i (i)}
					<div class="dv-stats__item">
						<dt class="dv-stats__value">{stat.value ?? ''}</dt>
						<dd class="dv-stats__label">{stat.label ?? ''}</dd>
					</div>
				{/each}
			</dl>
		{/if}
	</div>
</section>

<style lang="postcss">
	@reference '../../../app.css';

	.dv-stats {
		padding: clamp(3rem, 8vw, 5rem) 1.5rem;
	}

	.dv-stats__inner {
		@apply mx-auto max-w-[64rem];
	}

	.dv-stats__title {
		@apply mb-10 text-center;
	}

	.dv-stats__grid {
		@apply grid gap-8 text-center;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
	}

	.dv-stats__value {
		@apply text-terracotta-deep font-display;
		font-size: var(--dv-text-h2, 2.5rem);
	}

	.dv-stats__label {
		@apply text-charcoal-mute mt-2 font-sans text-xs tracking-[0.18em] uppercase;
	}
</style>
