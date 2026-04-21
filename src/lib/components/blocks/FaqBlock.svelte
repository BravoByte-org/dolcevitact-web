<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';

	type FaqItem = {
		id?: string | number;
		question?: string | null;
		answer_html?: string | null;
		sort?: number | null;
	};

	type FaqData = {
		anchor?: string | null;
		eyebrow?: string | null;
		script_accent?: string | null;
		title?: string | null;
		subtitle?: string | null;
		items?: FaqItem[] | null;
	};

	let { data }: { data: FaqData } = $props();

	const items = $derived(
		Array.isArray(data.items) ? [...data.items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : []
	);

	const anchor = $derived(data.anchor ?? 'faq');
</script>

<section id={anchor} class="dv-faq">
	<div class="dv-faq__inner">
		<header class="dv-faq__header">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.script_accent}
				<p class="dv-faq__script">{data.script_accent}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-faq__title text-balance">{data.title}</h2>
			{/if}
			<div class="dv-faq__rule">
				<GoldRule size="sm" />
			</div>
			{#if data.subtitle}
				<p class="dv-faq__lede mx-auto text-balance">{data.subtitle}</p>
			{/if}
		</header>

		{#if items.length > 0}
			<ul class="dv-faq__list">
				{#each items as item, i (item.id ?? i)}
					<li class="dv-faq__item">
						<details>
							<summary class="dv-faq__q">
								<span class="dv-faq__q-text">{item.question}</span>
								<span aria-hidden="true" class="dv-faq__chevron">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
										<path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</span>
							</summary>
							{#if item.answer_html}
								<div class="dv-faq__a">
									<!-- Trusted HTML from Directus rich text; sanitize upstream if editors are not fully trusted. -->
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html item.answer_html}
								</div>
							{/if}
						</details>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<style>
	.dv-faq {
		padding: var(--dv-space-section) 1.5rem;
	}

	.dv-faq__inner {
		margin-inline: auto;
		max-width: 46rem;
	}

	.dv-faq__header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.dv-faq__script {
		margin-top: 0.5rem;
		font-family: var(--dv-font-script);
		font-size: clamp(1.75rem, 1.2rem + 1.4vw, 2.5rem);
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-faq__title {
		margin-top: 0.75rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(1.75rem, 1.25rem + 1.6vw, 2.5rem);
		line-height: 1.15;
		color: var(--dv-color-charcoal);
	}

	.dv-faq__rule {
		margin-top: 1.5rem;
	}

	.dv-faq__lede {
		margin-top: 1.25rem;
		max-width: 36rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 1.1rem;
		line-height: 1.55;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-faq__list {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid color-mix(in srgb, var(--dv-color-gold) 35%, transparent);
	}

	.dv-faq__item {
		border-bottom: 1px solid color-mix(in srgb, var(--dv-color-gold) 35%, transparent);
	}

	.dv-faq__q {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.5rem 0.25rem;
		cursor: pointer;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: 1.2rem;
		line-height: 1.35;
		color: var(--dv-color-charcoal);
		list-style: none;
		transition: color var(--dv-duration-fast) var(--dv-ease-soft);
	}

	.dv-faq__q:hover,
	details[open] > .dv-faq__q {
		color: var(--dv-color-terracotta-deep);
	}

	.dv-faq__q::-webkit-details-marker {
		display: none;
	}

	.dv-faq__q-text {
		flex: 1;
	}

	.dv-faq__chevron {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border: 1px solid color-mix(in srgb, var(--dv-color-gold) 60%, transparent);
		border-radius: 9999px;
		color: var(--dv-color-gold-deep);
		transition:
			transform var(--dv-duration-base) var(--dv-ease-soft),
			color var(--dv-duration-fast) var(--dv-ease-soft),
			border-color var(--dv-duration-fast) var(--dv-ease-soft);
	}

	.dv-faq__chevron svg {
		width: 0.9rem;
		height: 0.9rem;
	}

	details[open] > .dv-faq__q .dv-faq__chevron {
		transform: rotate(180deg);
		color: var(--dv-color-terracotta);
		border-color: color-mix(in srgb, var(--dv-color-terracotta) 50%, transparent);
	}

	.dv-faq__a {
		padding: 0 0.25rem 1.5rem;
		font-family: var(--dv-font-display);
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-faq__a :global(p + p) {
		margin-top: 0.75rem;
	}

	.dv-faq__a :global(a) {
		color: var(--dv-color-terracotta-deep);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--dv-color-gold) 55%, transparent);
	}
</style>
