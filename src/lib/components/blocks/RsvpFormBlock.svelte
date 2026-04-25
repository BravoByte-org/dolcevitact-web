<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	type RsvpFormData = {
		eyebrow?: string | null;
		title?: string | null;
		subtitle?: string | null;
		submit_label?: string | null;
		success_title?: string | null;
		success_body?: string | null;
		consent_copy?: string | null;
	};

	let { data }: { data: RsvpFormData } = $props();

	type RsvpField = 'name' | 'email' | 'phone' | 'baby_age' | 'message';
	type RsvpActionResult = {
		rsvp?: {
			ok: boolean;
			fieldErrors?: Partial<Record<RsvpField | '_hp', string[]>>;
			error?: 'server_error';
			values?: Record<RsvpField, string>;
		};
	};

	const result = $derived((page.form as RsvpActionResult | null)?.rsvp);
	const fieldErrors = $derived(result?.fieldErrors ?? {});
	const priorValues = $derived(result?.values);
	const isSuccess = $derived(result?.ok === true);
	const hasServerError = $derived(result?.ok === false && result?.error === 'server_error');

	let submitting = $state(false);

	function firstError(field: RsvpField): string | null {
		const errs = fieldErrors[field];
		return errs && errs.length > 0 ? errs[0] : null;
	}
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

		{#if isSuccess}
			<div class="dv-rsvp__success" role="status" aria-live="polite">
				<p class="dv-rsvp__success-title">
					{data.success_title ?? "Grazie — we'll be in touch"}
				</p>
				{#if data.success_body}
					<p class="dv-rsvp__success-body">{data.success_body}</p>
				{/if}
			</div>
		{:else}
			<form
				class="dv-rsvp__form"
				method="post"
				action="?/rsvp"
				novalidate
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						await update({ reset: true });
						submitting = false;
					};
				}}
			>
				{#if hasServerError}
					<p class="dv-rsvp__alert" role="alert">
						Something interrupted us on our side. Please try again in a moment — or email
						hello@dolcevitact.com and we'll get you on the list.
					</p>
				{/if}

				<div class="dv-rsvp__field">
					<label class="dv-rsvp__label" for="rsvp-name">Name</label>
					<input
						class="dv-rsvp__input"
						class:dv-rsvp__input--error={firstError('name')}
						id="rsvp-name"
						name="name"
						type="text"
						autocomplete="name"
						required
						aria-invalid={firstError('name') ? 'true' : undefined}
						aria-describedby={firstError('name') ? 'rsvp-name-error' : undefined}
						value={priorValues?.name ?? ''}
					/>
					{#if firstError('name')}
						<p class="dv-rsvp__error" id="rsvp-name-error">{firstError('name')}</p>
					{/if}
				</div>

				<div class="dv-rsvp__field">
					<label class="dv-rsvp__label" for="rsvp-email">Email</label>
					<input
						class="dv-rsvp__input"
						class:dv-rsvp__input--error={firstError('email')}
						id="rsvp-email"
						name="email"
						type="email"
						autocomplete="email"
						required
						aria-invalid={firstError('email') ? 'true' : undefined}
						aria-describedby={firstError('email') ? 'rsvp-email-error' : undefined}
						value={priorValues?.email ?? ''}
					/>
					{#if firstError('email')}
						<p class="dv-rsvp__error" id="rsvp-email-error">{firstError('email')}</p>
					{/if}
				</div>

				<div class="dv-rsvp__field">
					<label class="dv-rsvp__label" for="rsvp-phone">Phone (optional)</label>
					<input
						class="dv-rsvp__input"
						class:dv-rsvp__input--error={firstError('phone')}
						id="rsvp-phone"
						name="phone"
						type="tel"
						autocomplete="tel"
						aria-invalid={firstError('phone') ? 'true' : undefined}
						aria-describedby={firstError('phone') ? 'rsvp-phone-error' : undefined}
						value={priorValues?.phone ?? ''}
					/>
					{#if firstError('phone')}
						<p class="dv-rsvp__error" id="rsvp-phone-error">{firstError('phone')}</p>
					{/if}
				</div>

				<div class="dv-rsvp__field">
					<label class="dv-rsvp__label" for="rsvp-baby-age">Baby's age</label>
					<input
						class="dv-rsvp__input"
						class:dv-rsvp__input--error={firstError('baby_age')}
						id="rsvp-baby-age"
						name="baby_age"
						type="text"
						aria-invalid={firstError('baby_age') ? 'true' : undefined}
						aria-describedby={firstError('baby_age') ? 'rsvp-baby-age-error' : undefined}
						value={priorValues?.baby_age ?? ''}
					/>
					{#if firstError('baby_age')}
						<p class="dv-rsvp__error" id="rsvp-baby-age-error">{firstError('baby_age')}</p>
					{/if}
				</div>

				<div class="dv-rsvp__field dv-rsvp__field--full">
					<label class="dv-rsvp__label" for="rsvp-message">Anything we should know?</label>
					<textarea
						class="dv-rsvp__input dv-rsvp__input--textarea"
						class:dv-rsvp__input--error={firstError('message')}
						id="rsvp-message"
						name="message"
						rows="4"
						aria-invalid={firstError('message') ? 'true' : undefined}
						aria-describedby={firstError('message') ? 'rsvp-message-error' : undefined}
						>{priorValues?.message ?? ''}</textarea
					>
					{#if firstError('message')}
						<p class="dv-rsvp__error" id="rsvp-message-error">{firstError('message')}</p>
					{/if}
				</div>

				<!-- Honeypot — hidden from real users + a11y tree, fills for bots. -->
				<div class="dv-rsvp__honeypot" aria-hidden="true">
					<label for="rsvp-hp">Leave this field empty</label>
					<input id="rsvp-hp" name="_hp" type="text" tabindex="-1" autocomplete="off" value="" />
				</div>

				{#if data.consent_copy}
					<p class="dv-rsvp__consent">{data.consent_copy}</p>
				{/if}

				<button type="submit" class="dv-rsvp__submit" disabled={submitting}>
					{submitting ? 'Sending…' : (data.submit_label ?? 'Reserve your spot')}
				</button>
			</form>
		{/if}
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
		transition: border-color 160ms ease;

		&:focus-visible {
			@apply outline-terracotta-deep outline-2 outline-offset-2;
		}
	}

	.dv-rsvp__input--error {
		border-color: var(--dv-color-terracotta);
	}

	.dv-rsvp__input--textarea {
		@apply resize-y;
	}

	.dv-rsvp__error {
		@apply mt-1.5 font-sans text-[0.78rem];
		color: var(--dv-color-terracotta-deep);
	}

	.dv-rsvp__consent {
		@apply text-charcoal-soft font-sans text-[0.78rem] leading-relaxed;
		grid-column: 1 / -1;
	}

	.dv-rsvp__submit {
		@apply bg-terracotta text-ivory rounded-full border-none px-8 py-[0.9rem] font-sans text-[0.8rem] tracking-[0.14em] uppercase;
		grid-column: 1 / -1;
		justify-self: center;
		cursor: pointer;
		transition:
			transform 200ms ease,
			background-color 200ms ease,
			opacity 200ms ease;

		&:hover:not(:disabled) {
			background: var(--dv-color-terracotta-deep);
			transform: translateY(-1px);
		}

		&:focus-visible {
			@apply outline-terracotta-deep outline-2 outline-offset-4;
		}

		&:disabled {
			cursor: wait;
			opacity: 0.6;
		}
	}

	.dv-rsvp__alert {
		@apply rounded-md p-4 text-center font-sans text-[0.9rem];
		grid-column: 1 / -1;
		color: var(--dv-color-terracotta-deep);
		background: color-mix(in srgb, var(--dv-color-terracotta) 10%, white);
		border: 1px solid color-mix(in srgb, var(--dv-color-terracotta) 30%, transparent);
	}

	.dv-rsvp__success {
		@apply rounded-lg p-8 text-center;
		background: color-mix(in srgb, var(--dv-color-ivory-deep) 70%, var(--dv-color-ivory));
		border: 1px solid color-mix(in srgb, var(--dv-color-gold) 25%, transparent);
	}

	.dv-rsvp__success-title {
		@apply font-serif text-[clamp(1.5rem,3vw,2rem)] leading-tight;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-rsvp__success-body {
		@apply text-charcoal-soft mx-auto mt-3 max-w-[28rem] font-sans text-[0.95rem] leading-relaxed;
	}

	.dv-rsvp__honeypot {
		position: absolute;
		left: -10000px;
		top: auto;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}
</style>
