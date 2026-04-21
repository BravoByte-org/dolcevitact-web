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
			<h2 class="dv-h2 mb-10 text-center">{data.title}</h2>
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

<style>
	.dv-stats {
		padding: clamp(3rem, 8vw, 5rem) 1.5rem;
	}

	.dv-stats__inner {
		margin-inline: auto;
		max-width: 64rem;
	}

	.dv-stats__grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		text-align: center;
	}

	.dv-stats__value {
		font-family: var(--dv-font-display);
		font-size: var(--dv-text-h2, 2.5rem);
		color: var(--dv-color-terracotta-deep);
	}

	.dv-stats__label {
		margin-top: 0.5rem;
		font-family: var(--dv-font-sans);
		font-size: 0.75rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
	}
</style>
