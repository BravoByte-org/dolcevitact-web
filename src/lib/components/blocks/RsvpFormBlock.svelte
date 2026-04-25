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
				<p class="dv-rsvp__eyebrow dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-rsvp__title dv-h2">{data.title}</h2>
			{/if}
			{#if data.subtitle}
				<p class="dv-rsvp__subtitle dv-lede">{data.subtitle}</p>
			{/if}
		</header>

		<form class="dv-rsvp__form" method="post" action="?/rsvp" aria-describedby="rsvp-disabled-hint">
			<div class="dv-rsvp__field">
				<label class="dv-rsvp__label" for="rsvp-name">Name</label>
				<input
					class="dv-rsvp__input"
					id="rsvp-name"
					name="name"
					type="text"
					autocomplete="name"
					disabled
					required
				/>
			</div>
			<div class="dv-rsvp__field">
				<label class="dv-rsvp__label" for="rsvp-email">Email</label>
				<input
					class="dv-rsvp__input"
					id="rsvp-email"
					name="email"
					type="email"
					autocomplete="email"
					disabled
					required
				/>
			</div>
			<div class="dv-rsvp__field">
				<label class="dv-rsvp__label" for="rsvp-phone">Phone (optional)</label>
				<input
					class="dv-rsvp__input"
					id="rsvp-phone"
					name="phone"
					type="tel"
					autocomplete="tel"
					disabled
				/>
			</div>
			<div class="dv-rsvp__field dv-rsvp__field--full">
				<label class="dv-rsvp__label" for="rsvp-baby-age">Baby's age</label>
				<input class="dv-rsvp__input" id="rsvp-baby-age" name="baby_age" type="text" disabled />
			</div>
			<div class="dv-rsvp__field dv-rsvp__field--full">
				<label class="dv-rsvp__label" for="rsvp-notes">Anything we should know?</label>
				<textarea
					class="dv-rsvp__input dv-rsvp__input--textarea"
					id="rsvp-notes"
					name="notes"
					rows="4"
					disabled
				></textarea>
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

<style lang="postcss">
	@reference '../../../app.css';

	.dv-rsvp {
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-rsvp__inner {
		@apply mx-auto max-w-[40rem];
	}

	.dv-rsvp__header {
		@apply mb-10 text-center;
	}

	.dv-rsvp__title {
		@apply mt-3 text-balance;
	}

	.dv-rsvp__subtitle {
		@apply mx-auto mt-4 text-balance;
	}

	.dv-rsvp__form {
		@apply grid gap-x-6 gap-y-5;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	}

	.dv-rsvp__field {
		@apply flex flex-col;
	}

	.dv-rsvp__field--full {
		grid-column: 1 / -1;
	}

	.dv-rsvp__label {
		@apply text-charcoal-mute mb-[0.35rem] font-sans text-[0.72rem] tracking-[0.16em] uppercase;
	}

	.dv-rsvp__input {
		@apply text-charcoal rounded-md px-[0.9rem] py-3 font-sans text-[0.95rem];
		background: color-mix(in srgb, var(--dv-color-ivory) 70%, white);
		border: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 15%, transparent);

		&:disabled {
			@apply cursor-not-allowed opacity-60;
		}

		&:focus-visible {
			@apply outline-terracotta-deep outline-2 outline-offset-2;
		}
	}

	.dv-rsvp__hint {
		@apply text-charcoal-soft text-center font-sans text-[0.85rem];
		grid-column: 1 / -1;
	}

	.dv-rsvp__submit {
		@apply bg-terracotta text-ivory cursor-not-allowed rounded-full border-none px-8 py-[0.9rem] font-sans text-[0.8rem] tracking-[0.14em] uppercase opacity-60;
		grid-column: 1 / -1;
		justify-self: center;

		&:focus-visible {
			@apply outline-terracotta-deep outline-2 outline-offset-4;
		}
	}
</style>
