<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';

	type FaqItem = {
		id?: string | number;
		question?: string | null;
		answer_html?: string | null;
		sort?: number | null;
	};

	type FaqData = {
		eyebrow?: string | null;
		title?: string | null;
		subtitle?: string | null;
		items?: FaqItem[] | null;
	};

	let { data }: { data: FaqData } = $props();

	const items = $derived(
		Array.isArray(data.items) ? [...data.items].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) : []
	);
</script>

<section id="faq" class="dv-faq">
	<div class="dv-faq__inner">
		<header class="dv-faq__header">
			{#if data.eyebrow}
				<p class="dv-faq__eyebrow dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-faq__title dv-h2">{data.title}</h2>
			{/if}
			<div class="dv-faq__rule">
				<GoldRule size="sm" />
			</div>
			{#if data.subtitle}
				<p class="dv-faq__subtitle dv-lede">{data.subtitle}</p>
			{/if}
		</header>

		{#if items.length > 0}
			<ul class="dv-faq__list">
				{#each items as item, i (item.id ?? i)}
					<li class="dv-faq__item">
						<details class="dv-faq__details">
							<summary class="dv-faq__q">
								<span>{item.question}</span>
								<span aria-hidden="true" class="dv-faq__chevron">+</span>
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

<style lang="postcss">
	@reference '../../../app.css';

	.dv-faq {
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-faq__inner {
		@apply mx-auto max-w-[42rem];
	}

	.dv-faq__header {
		@apply mb-10 text-center;
	}

	.dv-faq__title {
		@apply mt-3;
	}

	.dv-faq__rule {
		@apply mt-5;
	}

	.dv-faq__subtitle {
		@apply mx-auto mt-4 text-balance;
	}

	.dv-faq__list {
		@apply m-0 list-none p-0;
		border-top: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 8%, transparent);
	}

	.dv-faq__item {
		border-bottom: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 8%, transparent);
	}

	.dv-faq__q {
		@apply text-charcoal font-display flex cursor-pointer list-none items-center justify-between gap-4 px-1 py-5 text-[1.15rem];

		&::-webkit-details-marker {
			display: none;
		}

		&:focus-visible {
			@apply outline-terracotta-deep outline-2 outline-offset-2;
		}
	}

	.dv-faq__chevron {
		@apply text-terracotta font-sans text-2xl;
		transition: transform var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-faq__details[open] .dv-faq__chevron {
		transform: rotate(45deg);
	}

	.dv-faq__a {
		@apply text-charcoal-soft px-1 pb-5 font-sans;
		line-height: 1.65;
	}
</style>
