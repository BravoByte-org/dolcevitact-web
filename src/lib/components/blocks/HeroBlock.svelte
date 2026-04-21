<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';
	import OliveBranch from '$components/decor/OliveBranch.svelte';

	type HeroData = {
		eyebrow?: string | null;
		script_accent?: string | null;
		headline?: string | null;
		subheading?: string | null;
		cta_label?: string | null;
		cta_url?: string | null;
		cta_anchor?: string | null;
		secondary_label?: string | null;
		secondary_url?: string | null;
	};

	let { data }: { data: HeroData } = $props();

	const ctaHref = $derived(data.cta_anchor || data.cta_url || null);
	const secondaryHref = $derived(data.secondary_url || null);
</script>

<section id="hero" class="dv-hero">
	<div class="dv-hero__veil" aria-hidden="true"></div>

	<div class="dv-hero__inner">
		<div class="dv-hero__olive dv-hero__olive--top" aria-hidden="true">
			<OliveBranch tone="sage" />
		</div>

		{#if data.eyebrow}
			<p class="dv-eyebrow dv-anim-rise">{data.eyebrow}</p>
		{/if}

		{#if data.script_accent}
			<p class="dv-hero__script dv-anim-rise">{data.script_accent}</p>
		{/if}

		{#if data.headline}
			<h1 class="dv-hero__headline dv-anim-rise text-balance">{data.headline}</h1>
		{/if}

		<div class="dv-hero__rule dv-anim-rise">
			<GoldRule size="md" />
			<span class="dv-hero__dot" aria-hidden="true"></span>
		</div>

		{#if data.subheading}
			<p class="dv-hero__lede dv-anim-rise mx-auto text-balance">
				{data.subheading}
			</p>
		{/if}

		{#if (ctaHref && data.cta_label) || (secondaryHref && data.secondary_label)}
			<div class="dv-hero__actions dv-anim-rise">
				{#if ctaHref && data.cta_label}
					<a href={ctaHref} class="dv-hero__cta">
						<span>{data.cta_label}</span>
						<span aria-hidden="true" class="dv-hero__cta-arrow">→</span>
					</a>
				{/if}
				{#if secondaryHref && data.secondary_label}
					<a href={secondaryHref} class="dv-hero__cta-secondary">
						{data.secondary_label}
					</a>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	.dv-hero {
		position: relative;
		padding: clamp(5rem, 14vw, 10rem) 1.5rem clamp(4rem, 10vw, 7rem);
		overflow: hidden;
	}

	/* Soft ivory gradient wash to give the hero editorial "paper" depth
	 * without introducing a separate surface color. */
	.dv-hero__veil {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(
				ellipse 80% 60% at 50% 20%,
				color-mix(in srgb, var(--dv-color-sage) 8%, transparent),
				transparent 70%
			),
			radial-gradient(
				ellipse 60% 40% at 80% 80%,
				color-mix(in srgb, var(--dv-color-terracotta) 6%, transparent),
				transparent 65%
			);
	}

	.dv-hero__inner {
		position: relative;
		margin-inline: auto;
		max-width: 56rem;
		text-align: center;
	}

	.dv-hero__olive {
		margin-inline: auto;
		width: 9rem;
		opacity: 0.85;
	}

	.dv-hero__olive--top {
		margin-bottom: 1.75rem;
	}

	@media (min-width: 640px) {
		.dv-hero__olive {
			width: 11rem;
		}
	}

	.dv-hero__script {
		margin-top: 0.75rem;
		font-family: var(--dv-font-script);
		font-size: clamp(2rem, 1.4rem + 1.6vw, 3rem);
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-hero__headline {
		margin-top: 1rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(2.5rem, 1.6rem + 3.6vw, 4.75rem);
		line-height: 1.08;
		letter-spacing: -0.01em;
		color: var(--dv-color-charcoal);
	}

	.dv-hero__rule {
		position: relative;
		margin-top: 2.25rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.dv-hero__dot {
		width: 5px;
		height: 5px;
		border-radius: 9999px;
		background: var(--dv-color-terracotta);
	}

	.dv-hero__lede {
		margin-top: 1.5rem;
		max-width: 38rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: clamp(1.1rem, 0.95rem + 0.55vw, 1.35rem);
		line-height: 1.55;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-hero__actions {
		margin-top: 3rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 1.5rem;
		justify-content: center;
		align-items: center;
	}

	.dv-hero__cta {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		padding: 1rem 2.25rem;
		background: var(--dv-color-terracotta);
		color: var(--dv-color-ivory);
		font-family: var(--dv-font-sans);
		font-size: 0.78rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		border-radius: 9999px;
		text-decoration: none;
		box-shadow: var(--dv-shadow-soft);
		transition:
			background-color var(--dv-duration-base) var(--dv-ease-soft),
			transform var(--dv-duration-base) var(--dv-ease-soft),
			box-shadow var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-hero__cta:hover {
		background: var(--dv-color-terracotta-deep);
		transform: translateY(-1px);
		box-shadow: var(--dv-shadow-card);
	}

	.dv-hero__cta-arrow {
		display: inline-block;
		transition: transform var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-hero__cta:hover .dv-hero__cta-arrow {
		transform: translateX(3px);
	}

	.dv-hero__cta-secondary {
		display: inline-flex;
		align-items: center;
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

	.dv-hero__cta-secondary:hover {
		color: var(--dv-color-terracotta-deep);
		border-bottom-color: var(--dv-color-terracotta);
	}
</style>
