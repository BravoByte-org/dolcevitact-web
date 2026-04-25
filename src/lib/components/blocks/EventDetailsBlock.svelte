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
				<p class="dv-event__eyebrow dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-event__title dv-h2">{data.title}</h2>
			{/if}
			<div class="dv-event__rule">
				<GoldRule size="sm" />
			</div>
			{#if data.subtitle}
				<p class="dv-event__subtitle dv-lede">{data.subtitle}</p>
			{/if}
		</div>

		<dl class="dv-event__meta">
			{#if formattedDate}
				<div class="dv-event__row">
					<dt class="dv-event__label">Date</dt>
					<dd class="dv-event__value">{formattedDate}</dd>
				</div>
			{/if}
			{#if data.time}
				<div class="dv-event__row">
					<dt class="dv-event__label">Time</dt>
					<dd class="dv-event__value">{data.time}</dd>
				</div>
			{/if}
			{#if data.city}
				<div class="dv-event__row">
					<dt class="dv-event__label">Location</dt>
					<dd class="dv-event__value">
						{data.city}
						{#if data.location_note}
							<span class="dv-event__note">{data.location_note}</span>
						{/if}
					</dd>
				</div>
			{/if}
			{#if data.price}
				<div class="dv-event__row">
					<dt class="dv-event__label">Investment</dt>
					<dd class="dv-event__value">{data.price}</dd>
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

<style lang="postcss">
	@reference '../../../app.css';

	.dv-event {
		padding: clamp(3rem, 8vw, 5rem) 1.5rem;
	}

	.dv-event__card {
		@apply shadow-lift mx-auto max-w-[44rem] rounded-lg text-center;
		padding: clamp(2rem, 5vw, 3rem);
		background: color-mix(in srgb, var(--dv-color-ivory) 70%, white);
		border: 1px solid color-mix(in srgb, var(--dv-color-gold) 30%, transparent);
	}

	.dv-event__title {
		@apply mt-3 text-balance;
	}

	.dv-event__rule {
		@apply mt-6;
	}

	.dv-event__subtitle {
		@apply mx-auto mt-4 text-balance;
	}

	.dv-event__meta {
		@apply mt-10 grid gap-4 text-left;
	}

	.dv-event__row {
		@apply grid gap-4 py-2;
		grid-template-columns: 7.5rem 1fr;
		border-bottom: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 6%, transparent);
	}

	.dv-event__label {
		@apply text-charcoal-mute pt-1 font-sans text-[0.72rem] tracking-[0.18em] uppercase;
	}

	.dv-event__value {
		@apply text-charcoal font-display m-0 text-[1.05rem];
	}

	.dv-event__note {
		@apply text-charcoal-soft mt-1 block font-sans text-[0.85rem];
	}

	.dv-event__actions {
		@apply mt-8;
	}

	.dv-event__cta {
		@apply bg-terracotta-deep inline-flex items-center rounded-full px-8 py-[0.9rem] font-sans text-[0.8rem] tracking-[0.14em] text-white uppercase;
		transition: background-color var(--dv-duration-base) var(--dv-ease-soft);

		&:hover {
			background: color-mix(in srgb, var(--dv-color-terracotta-deep) 85%, #000);
		}

		&:focus-visible {
			@apply outline-terracotta-deep outline-2 outline-offset-4;
		}
	}
</style>
