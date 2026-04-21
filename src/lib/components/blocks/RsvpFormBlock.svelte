<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';

	type RsvpFormData = {
		anchor?: string | null;
		eyebrow?: string | null;
		script_accent?: string | null;
		title?: string | null;
		subtitle?: string | null;
		submit_label?: string | null;
		// `success_title` / `success_body` live on the Directus row and will be
		// surfaced by M5 once the form action + server write are in place.
	};

	let { data }: { data: RsvpFormData } = $props();

	const anchor = $derived(data.anchor ?? 'rsvp');
</script>

<section id={anchor} class="dv-rsvp">
	<div class="dv-rsvp__inner">
		<header class="dv-rsvp__header">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.script_accent}
				<p class="dv-rsvp__script">{data.script_accent}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-rsvp__title text-balance">{data.title}</h2>
			{/if}
			<div class="dv-rsvp__rule">
				<GoldRule size="sm" />
			</div>
			{#if data.subtitle}
				<p class="dv-rsvp__lede mx-auto text-balance">{data.subtitle}</p>
			{/if}
		</header>

		<div class="dv-rsvp__card" aria-describedby="rsvp-disabled-hint">
			<p class="dv-rsvp__banner">
				<span class="dv-rsvp__banner-script">Opening soon</span>
				<span class="dv-rsvp__banner-body" id="rsvp-disabled-hint">
					The list opens with our next milestone. Leave your details and we'll write to you the
					moment spots are available.
				</span>
			</p>

			<form class="dv-rsvp__form" method="post" action="?/rsvp">
				<div class="dv-rsvp__field">
					<label for="rsvp-name">Name</label>
					<input id="rsvp-name" name="name" type="text" autocomplete="name" disabled required />
				</div>
				<div class="dv-rsvp__field">
					<label for="rsvp-email">Email</label>
					<input id="rsvp-email" name="email" type="email" autocomplete="email" disabled required />
				</div>
				<div class="dv-rsvp__field">
					<label for="rsvp-phone">Phone <span class="dv-rsvp__optional">(optional)</span></label>
					<input id="rsvp-phone" name="phone" type="tel" autocomplete="tel" disabled />
				</div>
				<div class="dv-rsvp__field">
					<label for="rsvp-baby-age">Baby's age</label>
					<input id="rsvp-baby-age" name="baby_age" type="text" disabled />
				</div>
				<div class="dv-rsvp__field dv-rsvp__field--full">
					<label for="rsvp-notes">Anything we should know?</label>
					<textarea id="rsvp-notes" name="notes" rows="4" disabled></textarea>
				</div>

				<button type="submit" class="dv-rsvp__submit" disabled>
					<span>{data.submit_label ?? 'Reserve your spot'}</span>
					<span aria-hidden="true" class="dv-rsvp__submit-arrow">→</span>
				</button>
			</form>
		</div>
	</div>
</section>

<style>
	.dv-rsvp {
		padding: var(--dv-space-section) 1.5rem;
	}

	.dv-rsvp__inner {
		margin-inline: auto;
		max-width: 44rem;
	}

	.dv-rsvp__header {
		text-align: center;
		margin-bottom: 2.75rem;
	}

	.dv-rsvp__script {
		margin-top: 0.5rem;
		font-family: var(--dv-font-script);
		font-size: clamp(1.75rem, 1.2rem + 1.4vw, 2.5rem);
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-rsvp__title {
		margin-top: 0.75rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(1.75rem, 1.25rem + 1.6vw, 2.5rem);
		line-height: 1.15;
		color: var(--dv-color-charcoal);
	}

	.dv-rsvp__rule {
		margin-top: 1.5rem;
	}

	.dv-rsvp__lede {
		margin-top: 1.25rem;
		max-width: 34rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 1.1rem;
		line-height: 1.55;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-rsvp__card {
		padding: clamp(2rem, 4.5vw, 3rem);
		background: color-mix(in srgb, var(--dv-color-ivory) 60%, white);
		border: 1px solid color-mix(in srgb, var(--dv-color-gold) 30%, transparent);
		border-radius: var(--dv-radius-lg);
		box-shadow: var(--dv-shadow-soft);
	}

	.dv-rsvp__banner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		text-align: center;
		margin: 0 0 2rem;
		padding-bottom: 1.75rem;
		border-bottom: 1px dashed color-mix(in srgb, var(--dv-color-gold) 55%, transparent);
	}

	.dv-rsvp__banner-script {
		font-family: var(--dv-font-script);
		font-size: 2.5rem;
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-rsvp__banner-body {
		max-width: 32rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-rsvp__form {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 1.5rem 1.75rem;
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
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
		margin-bottom: 0.5rem;
	}

	.dv-rsvp__optional {
		font-weight: 400;
		text-transform: none;
		letter-spacing: 0;
		color: var(--dv-color-charcoal-mute);
		font-size: 0.72rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		margin-left: 0.2rem;
	}

	/* Editorial underline-only inputs — no box, just a hairline that
	 * warms to terracotta on focus. */
	.dv-rsvp__field input,
	.dv-rsvp__field textarea {
		padding: 0.55rem 0.1rem;
		background: transparent;
		border: none;
		border-bottom: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 20%, transparent);
		border-radius: 0;
		font-family: var(--dv-font-display);
		font-size: 1.05rem;
		color: var(--dv-color-charcoal);
		resize: vertical;
		transition: border-color var(--dv-duration-fast) var(--dv-ease-soft);
	}

	.dv-rsvp__field input:focus,
	.dv-rsvp__field textarea:focus {
		outline: none;
		border-bottom-color: var(--dv-color-terracotta);
	}

	.dv-rsvp__field input:disabled,
	.dv-rsvp__field textarea:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.dv-rsvp__submit {
		grid-column: 1 / -1;
		justify-self: center;
		margin-top: 0.5rem;
		padding: 1rem 2.25rem;
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		background: var(--dv-color-terracotta);
		color: var(--dv-color-ivory);
		font-family: var(--dv-font-sans);
		font-size: 0.78rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		border: none;
		border-radius: 9999px;
		opacity: 0.55;
		cursor: not-allowed;
	}

	.dv-rsvp__submit-arrow {
		transition: transform var(--dv-duration-base) var(--dv-ease-soft);
	}
</style>
