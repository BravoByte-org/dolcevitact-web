<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';

	type EventData = {
		eyebrow?: string | null;
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

<section id="event" class="dv-event">
	<div class="dv-event__card">
		<div class="dv-event__heading">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-h2 mt-3 text-balance">{data.title}</h2>
			{/if}
			<div class="dv-event__rule">
				<GoldRule size="sm" />
			</div>
			{#if data.subtitle}
				<p class="dv-lede mx-auto mt-4 text-balance">{data.subtitle}</p>
			{/if}
		</div>

		<dl class="dv-event__meta">
			{#if formattedDate}
				<div class="dv-event__row">
					<dt>Date</dt>
					<dd>{formattedDate}</dd>
				</div>
			{/if}
			{#if data.time}
				<div class="dv-event__row">
					<dt>Time</dt>
					<dd>{data.time}</dd>
				</div>
			{/if}
			{#if data.city}
				<div class="dv-event__row">
					<dt>Location</dt>
					<dd>
						{data.city}
						{#if data.location_note}
							<span class="dv-event__note">{data.location_note}</span>
						{/if}
					</dd>
				</div>
			{/if}
			{#if data.price}
				<div class="dv-event__row">
					<dt>Investment</dt>
					<dd>{data.price}</dd>
				</div>
			{/if}
		</dl>

		{#if ctaHref && data.cta_label}
			<div class="dv-event__actions">
				<a class="dv-event__cta" href={ctaHref}>{data.cta_label}</a>
			</div>
		{/if}
	</div>
</section>

<style>
	.dv-event {
		padding: clamp(3rem, 8vw, 5rem) 1.5rem;
	}

	.dv-event__card {
		margin-inline: auto;
		max-width: 44rem;
		padding: clamp(2rem, 5vw, 3rem);
		background: color-mix(in srgb, var(--dv-color-ivory) 70%, white);
		border: 1px solid color-mix(in srgb, var(--dv-color-gold) 30%, transparent);
		border-radius: var(--dv-radius-lg, 1.25rem);
		box-shadow: var(--dv-shadow-lift);
		text-align: center;
	}

	.dv-event__rule {
		margin-top: 1.5rem;
	}

	.dv-event__meta {
		margin-top: 2.5rem;
		display: grid;
		gap: 1rem;
		text-align: left;
	}

	.dv-event__row {
		display: grid;
		grid-template-columns: 7.5rem 1fr;
		gap: 1rem;
		padding: 0.5rem 0;
		border-bottom: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 6%, transparent);
	}

	.dv-event__row dt {
		font-family: var(--dv-font-sans);
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
		padding-top: 0.25rem;
	}

	.dv-event__row dd {
		font-family: var(--dv-font-display);
		font-size: 1.05rem;
		color: var(--dv-color-charcoal);
		margin: 0;
	}

	.dv-event__note {
		display: block;
		margin-top: 0.25rem;
		font-family: var(--dv-font-sans);
		font-size: 0.85rem;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-event__actions {
		margin-top: 2rem;
	}

	.dv-event__cta {
		display: inline-flex;
		align-items: center;
		padding: 0.9rem 2rem;
		background: var(--dv-color-terracotta);
		color: var(--dv-color-ivory);
		font-family: var(--dv-font-sans);
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		border-radius: var(--dv-radius-pill, 999px);
		transition: background-color var(--dv-duration-base) var(--dv-ease-soft);
	}
	.dv-event__cta:hover {
		background: var(--dv-color-terracotta-deep);
	}
</style>
