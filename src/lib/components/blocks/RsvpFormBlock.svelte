<script lang="ts">
	type RsvpFormData = {
		eyebrow?: string | null;
		title?: string | null;
		subtitle?: string | null;
		submit_label?: string | null;
		// `success_title` / `success_body` live on the Directus row and will be
		// surfaced by M5 once the form action + server write are in place.
	};

	let { data }: { data: RsvpFormData } = $props();
</script>

<section id="rsvp" class="dv-rsvp">
	<div class="dv-rsvp__inner">
		<header class="dv-rsvp__header">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-h2 mt-3 text-balance">{data.title}</h2>
			{/if}
			{#if data.subtitle}
				<p class="dv-lede mx-auto mt-4 text-balance">{data.subtitle}</p>
			{/if}
		</header>

		<form class="dv-rsvp__form" method="post" action="?/rsvp" aria-describedby="rsvp-disabled-hint">
			<div class="dv-rsvp__field">
				<label for="rsvp-name">Name</label>
				<input id="rsvp-name" name="name" type="text" autocomplete="name" disabled required />
			</div>
			<div class="dv-rsvp__field">
				<label for="rsvp-email">Email</label>
				<input id="rsvp-email" name="email" type="email" autocomplete="email" disabled required />
			</div>
			<div class="dv-rsvp__field">
				<label for="rsvp-phone">Phone (optional)</label>
				<input id="rsvp-phone" name="phone" type="tel" autocomplete="tel" disabled />
			</div>
			<div class="dv-rsvp__field dv-rsvp__field--full">
				<label for="rsvp-baby-age">Baby's age</label>
				<input id="rsvp-baby-age" name="baby_age" type="text" disabled />
			</div>
			<div class="dv-rsvp__field dv-rsvp__field--full">
				<label for="rsvp-notes">Anything we should know?</label>
				<textarea id="rsvp-notes" name="notes" rows="4" disabled></textarea>
			</div>

			<p id="rsvp-disabled-hint" class="dv-rsvp__hint">
				Reservations open with the next milestone — we'll let you know the moment the list is live.
			</p>

			<button type="submit" class="dv-rsvp__submit" disabled>
				{data.submit_label ?? 'Reserve your spot'}
			</button>
		</form>
	</div>
</section>

<style>
	.dv-rsvp {
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-rsvp__inner {
		margin-inline: auto;
		max-width: 40rem;
	}

	.dv-rsvp__header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.dv-rsvp__form {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 1.25rem 1.5rem;
	}

	.dv-rsvp__field {
		display: flex;
		flex-direction: column;
	}

	.dv-rsvp__field--full {
		grid-column: 1 / -1;
	}

	.dv-rsvp__field label {
		font-family: var(--dv-font-sans);
		font-size: 0.72rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
		margin-bottom: 0.35rem;
	}

	.dv-rsvp__field input,
	.dv-rsvp__field textarea {
		padding: 0.75rem 0.9rem;
		background: color-mix(in srgb, var(--dv-color-ivory) 70%, white);
		border: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 15%, transparent);
		border-radius: var(--dv-radius-md, 0.75rem);
		font-family: var(--dv-font-sans);
		font-size: 0.95rem;
		color: var(--dv-color-charcoal);
	}

	.dv-rsvp__field input:disabled,
	.dv-rsvp__field textarea:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.dv-rsvp__hint {
		grid-column: 1 / -1;
		font-family: var(--dv-font-sans);
		font-size: 0.85rem;
		color: var(--dv-color-charcoal-soft);
		text-align: center;
	}

	.dv-rsvp__submit {
		grid-column: 1 / -1;
		justify-self: center;
		padding: 0.9rem 2rem;
		background: var(--dv-color-terracotta);
		color: var(--dv-color-ivory);
		font-family: var(--dv-font-sans);
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		border: none;
		border-radius: var(--dv-radius-pill, 999px);
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
