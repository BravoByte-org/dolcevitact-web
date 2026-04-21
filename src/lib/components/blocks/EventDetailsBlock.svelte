<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';
	import OliveBranch from '$components/decor/OliveBranch.svelte';

	type EventData = {
		anchor?: string | null;
		eyebrow?: string | null;
		script_accent?: string | null;
		title?: string | null;
		subtitle?: string | null;
		date?: string | null;
		time?: string | null;
		city?: string | null;
		location_note?: string | null;
		price?: string | null;
		cta_label?: string | null;
		cta_url?: string | null;
		cta_anchor?: string | null;
	};

	let { data }: { data: EventData } = $props();

	const ctaHref = $derived(data.cta_anchor || data.cta_url || null);
	const anchor = $derived(data.anchor ?? 'event');

	const formattedDate = $derived.by(() => {
		if (!data.date) return null;
		const d = new Date(data.date);
		if (Number.isNaN(d.getTime())) return data.date;
		return d.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	});
</script>

<section id={anchor} class="dv-event">
	<div class="dv-event__card">
		<div class="dv-event__olive" aria-hidden="true">
			<OliveBranch tone="sage" />
		</div>

		<div class="dv-event__heading">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.script_accent}
				<p class="dv-event__script">{data.script_accent}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-event__title text-balance">{data.title}</h2>
			{/if}
			<div class="dv-event__rule">
				<GoldRule size="sm" />
			</div>
			{#if data.subtitle}
				<p class="dv-event__lede mx-auto text-balance">{data.subtitle}</p>
			{/if}
		</div>

		<dl class="dv-event__meta">
			{#if formattedDate}
				<div class="dv-event__row">
					<dt>
						<svg
							class="dv-event__icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.25"
							aria-hidden="true"
						>
							<rect x="3" y="5" width="18" height="16" rx="1.5" />
							<path d="M3 9h18" />
							<path d="M8 3v4M16 3v4" stroke-linecap="round" />
						</svg>
						<span>Date</span>
					</dt>
					<dd>{formattedDate}</dd>
				</div>
			{/if}
			{#if data.time}
				<div class="dv-event__row">
					<dt>
						<svg
							class="dv-event__icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.25"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="9" />
							<path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<span>Time</span>
					</dt>
					<dd>{data.time}</dd>
				</div>
			{/if}
			{#if data.city}
				<div class="dv-event__row">
					<dt>
						<svg
							class="dv-event__icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.25"
							aria-hidden="true"
						>
							<path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" stroke-linejoin="round" />
							<circle cx="12" cy="10" r="2.5" />
						</svg>
						<span>Location</span>
					</dt>
					<dd>
						{data.city}
						{#if data.location_note}
							<span class="dv-event__note">{data.location_note}</span>
						{/if}
					</dd>
				</div>
			{/if}
			{#if data.price}
				<div class="dv-event__row dv-event__row--price">
					<dt>
						<svg
							class="dv-event__icon"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.25"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="9" />
							<path
								d="M15 9a3 3 0 00-3-2c-1.7 0-3 1-3 2.5S10 12 12 12s3 1 3 2.5-1.3 2.5-3 2.5a3 3 0 01-3-2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<span>Investment</span>
					</dt>
					<dd class="dv-event__price">{data.price}</dd>
				</div>
			{/if}
		</dl>

		{#if ctaHref && data.cta_label}
			<div class="dv-event__actions">
				<a class="dv-event__cta" href={ctaHref}>
					<span>{data.cta_label}</span>
					<span aria-hidden="true" class="dv-event__cta-arrow">→</span>
				</a>
			</div>
		{/if}
	</div>
</section>

<style>
	.dv-event {
		padding: var(--dv-space-section) 1.5rem;
	}

	.dv-event__card {
		position: relative;
		margin-inline: auto;
		max-width: 46rem;
		padding: clamp(2.5rem, 6vw, 4rem) clamp(1.75rem, 5vw, 3.5rem);
		background: color-mix(in srgb, var(--dv-color-ivory) 60%, white);
		border: 1px solid color-mix(in srgb, var(--dv-color-gold) 40%, transparent);
		border-radius: var(--dv-radius-lg);
		box-shadow: var(--dv-shadow-lift);
		text-align: center;
	}

	.dv-event__olive {
		position: absolute;
		top: -1.5rem;
		left: 50%;
		transform: translateX(-50%);
		width: 6rem;
		opacity: 0.8;
	}

	.dv-event__script {
		margin-top: 0.5rem;
		font-family: var(--dv-font-script);
		font-size: clamp(1.75rem, 1.2rem + 1.4vw, 2.5rem);
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-event__title {
		margin-top: 0.75rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(1.75rem, 1.25rem + 1.6vw, 2.5rem);
		line-height: 1.15;
		color: var(--dv-color-charcoal);
	}

	.dv-event__rule {
		margin-top: 1.5rem;
	}

	.dv-event__lede {
		margin-top: 1.25rem;
		max-width: 34rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 1.1rem;
		line-height: 1.55;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-event__meta {
		margin: 2.75rem 0 0;
		display: grid;
		gap: 0.25rem;
		text-align: left;
	}

	.dv-event__row {
		display: grid;
		grid-template-columns: 8rem 1fr;
		gap: 1.25rem;
		align-items: baseline;
		padding: 1rem 0;
		border-bottom: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 6%, transparent);
	}

	.dv-event__row:last-child {
		border-bottom: none;
	}

	.dv-event__row dt {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		font-family: var(--dv-font-sans);
		font-size: 0.72rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
	}

	.dv-event__icon {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
		color: var(--dv-color-gold-deep);
	}

	.dv-event__row dd {
		font-family: var(--dv-font-display);
		font-size: 1.1rem;
		line-height: 1.45;
		color: var(--dv-color-charcoal);
		margin: 0;
	}

	.dv-event__note {
		display: block;
		margin-top: 0.35rem;
		font-family: var(--dv-font-sans);
		font-size: 0.85rem;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-event__row--price dd {
		font-family: var(--dv-font-script);
		font-size: 2.15rem;
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-event__price {
		font-feature-settings: 'liga' 1;
	}

	.dv-event__actions {
		margin-top: 2.5rem;
	}

	.dv-event__cta {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.95rem 2rem;
		background: var(--dv-color-terracotta);
		color: var(--dv-color-ivory);
		font-family: var(--dv-font-sans);
		font-size: 0.78rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		text-decoration: none;
		border-radius: 9999px;
		box-shadow: var(--dv-shadow-soft);
		transition:
			background-color var(--dv-duration-base) var(--dv-ease-soft),
			transform var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-event__cta:hover {
		background: var(--dv-color-terracotta-deep);
		transform: translateY(-1px);
	}

	.dv-event__cta-arrow {
		transition: transform var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-event__cta:hover .dv-event__cta-arrow {
		transform: translateX(3px);
	}

	@media (max-width: 540px) {
		.dv-event__row {
			grid-template-columns: 1fr;
			gap: 0.4rem;
		}
	}
</style>
