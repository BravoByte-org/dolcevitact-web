<script lang="ts">
	/**
	 * BrandLockup — canonical Dolce Vita / Baby Circle stacked mark.
	 *
	 *     Dolce Vita        ← serif, terracotta (1.0×)
	 *     Baby Circle       ← script, muted sage (0.5×)
	 *     ─── ♥ ───         ← thin gold rule + small terracotta heart
	 *
	 * Implements the verbatim founder spec captured in
	 * `.docs/architecture/brand-logo-spec.md` (closes #32).
	 *
	 * The 1.0× / 0.5× ratio between title and subtitle is the only
	 * inviolable rule. All other sizes — gaps, divider, heart — are
	 * derived from a single `--dv-lockup-size` custom property so the
	 * three variants below render in lockstep.
	 *
	 * Variants
	 * --------
	 *  nav     Compact left/right-alignable mark for the sticky header.
	 *  footer  Mid-size centred mark for the footer brand block.
	 *  hero    Full-size centred mark for the hero / fallback hero.
	 *
	 * Accessibility
	 * -------------
	 * The visible text ("Dolce Vita" + "Baby Circle") is the accessible
	 * name — screen readers read it naturally as a phrase. The divider
	 * and heart are decorative (`aria-hidden`). Crawlers still see the
	 * brand text as plain DOM text, which keeps SEO simple.
	 */

	type Variant = 'nav' | 'footer' | 'hero';

	type Props = {
		variant?: Variant;
		title?: string;
		subtitle?: string;
		/** Optional element override for the wrapper. Defaults to `div`. */
		as?: 'div' | 'span' | 'p';
		class?: string;
	};

	let {
		variant = 'hero',
		title = 'Dolce Vita',
		subtitle = 'Baby Circle',
		as = 'div',
		class: extraClass = ''
	}: Props = $props();
</script>

<svelte:element this={as} class="dv-lockup dv-lockup--{variant} {extraClass}">
	<span class="dv-lockup__title">{title}</span>
	<span class="dv-lockup__subtitle">{subtitle}</span>
	<span class="dv-lockup__divider" aria-hidden="true">
		<span class="dv-lockup__rule"></span>
		<svg class="dv-lockup__heart" viewBox="0 0 24 24" role="presentation" focusable="false">
			<path
				fill="currentColor"
				d="M12 21s-7-4.35-9.5-9.1C.9 8.6 2.7 5 6.4 5c2 0 3.4 1.05 5.6 3.2C14.2 6.05 15.6 5 17.6 5 21.3 5 23.1 8.6 21.5 11.9 19 16.65 12 21 12 21z"
			/>
		</svg>
		<span class="dv-lockup__rule"></span>
	</span>
</svelte:element>

<style>
	/*
	 * The lockup is built around a single sizing custom property:
	 * --dv-lockup-size sets the title font-size; everything else
	 * (subtitle, gaps, divider width, heart size) derives from it
	 * via em / fixed ratios. Variants only override --dv-lockup-size.
	 */
	.dv-lockup {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		line-height: 1;
		color: var(--dv-color-charcoal);
	}

	/* Variants — only the sizing knob changes per context */
	.dv-lockup--nav {
		--dv-lockup-size: clamp(1.4rem, 1rem + 0.6vw, 1.6rem);
	}

	.dv-lockup--footer {
		--dv-lockup-size: clamp(1.9rem, 1.3rem + 1vw, 2.4rem);
	}

	.dv-lockup--hero {
		--dv-lockup-size: clamp(3rem, 2rem + 3vw, 4.5rem);
	}

	.dv-lockup__title {
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: var(--dv-lockup-size);
		line-height: 1;
		letter-spacing: 0.01em;
		color: var(--dv-color-terracotta);
	}

	/* Subtitle is locked at exactly half the title baseline (1.0× / 0.5×). */
	.dv-lockup__subtitle {
		font-family: var(--dv-font-script);
		font-weight: 700;
		font-size: calc(var(--dv-lockup-size) * 0.5);
		line-height: 1;
		color: var(--dv-color-sage-deep);
		/* Title → subtitle gap: 8px @ 52px baseline = 0.154em of title. */
		margin-top: calc(var(--dv-lockup-size) * 0.154);
	}

	.dv-lockup__divider {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: calc(var(--dv-lockup-size) * 0.18);
		/* Subtitle → divider gap: 12px @ 52px baseline = 0.231em of title. */
		margin-top: calc(var(--dv-lockup-size) * 0.231);
		/* Total divider width — modest by design, never spans the full title. */
		width: calc(var(--dv-lockup-size) * 2.4);
	}

	.dv-lockup__rule {
		flex: 1 1 auto;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent 0%,
			color-mix(in srgb, var(--dv-color-gold) 70%, transparent) 30%,
			color-mix(in srgb, var(--dv-color-gold) 70%, transparent) 70%,
			transparent 100%
		);
	}

	.dv-lockup__heart {
		flex: 0 0 auto;
		width: calc(var(--dv-lockup-size) * 0.28);
		height: calc(var(--dv-lockup-size) * 0.28);
		color: var(--dv-color-terracotta);
	}

	/*
	 * Honor reduced-motion: nothing here animates today, but if a parent
	 * adds an entrance animation we want this mark to remain stable.
	 */
	@media (prefers-reduced-motion: reduce) {
		.dv-lockup,
		.dv-lockup__title,
		.dv-lockup__subtitle,
		.dv-lockup__divider {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
