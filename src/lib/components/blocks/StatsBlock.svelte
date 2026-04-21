<script lang="ts">
	type StatsData = {
		title?: string | null;
		eyebrow?: string | null;
		stats?: Array<{ label?: string; value?: string }>;
	};

	let { data }: { data: StatsData } = $props();

	const stats = $derived(Array.isArray(data.stats) ? data.stats : []);
</script>

<section class="dv-stats">
	<div class="dv-stats__inner">
		{#if data.eyebrow}
			<p class="dv-eyebrow dv-stats__eyebrow">{data.eyebrow}</p>
		{/if}
		{#if data.title}
			<h2 class="dv-stats__title text-balance">{data.title}</h2>
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
		padding: var(--dv-space-section) 1.5rem;
	}

	.dv-stats__inner {
		margin-inline: auto;
		max-width: 68rem;
		text-align: center;
	}

	.dv-stats__eyebrow {
		display: block;
	}

	.dv-stats__title {
		margin-top: 0.75rem;
		margin-bottom: 3rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(1.5rem, 1.15rem + 1vw, 2rem);
		color: var(--dv-color-charcoal);
	}

	.dv-stats__grid {
		display: grid;
		gap: 2.5rem;
		grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
		align-items: start;
	}

	.dv-stats__item {
		padding: 0 0.5rem;
		position: relative;
	}

	.dv-stats__item + .dv-stats__item::before {
		content: '';
		position: absolute;
		left: 0;
		top: 10%;
		bottom: 10%;
		width: 1px;
		background: color-mix(in srgb, var(--dv-color-gold) 55%, transparent);
	}

	@media (max-width: 640px) {
		.dv-stats__item + .dv-stats__item::before {
			display: none;
		}
	}

	.dv-stats__value {
		font-family: var(--dv-font-script);
		font-size: clamp(3rem, 2rem + 2.5vw, 4.5rem);
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-stats__label {
		margin-top: 0.75rem;
		font-family: var(--dv-font-sans);
		font-size: 0.72rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
	}
</style>
