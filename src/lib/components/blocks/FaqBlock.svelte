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
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-h2 mt-3">{data.title}</h2>
			{/if}
			<div class="dv-faq__rule">
				<GoldRule size="sm" />
			</div>
			{#if data.subtitle}
				<p class="dv-lede mx-auto mt-4 text-balance">{data.subtitle}</p>
			{/if}
		</header>

		{#if items.length > 0}
			<ul class="dv-faq__list">
				{#each items as item, i (item.id ?? i)}
					<li class="dv-faq__item">
						<details>
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

<style>
	.dv-faq {
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-faq__inner {
		margin-inline: auto;
		max-width: 42rem;
	}

	.dv-faq__header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.dv-faq__rule {
		margin-top: 1.25rem;
	}

	.dv-faq__list {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 8%, transparent);
	}

	.dv-faq__item {
		border-bottom: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 8%, transparent);
	}

	.dv-faq__q {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 0.25rem;
		cursor: pointer;
		font-family: var(--dv-font-display);
		font-size: 1.15rem;
		color: var(--dv-color-charcoal);
		list-style: none;
	}

	.dv-faq__q::-webkit-details-marker {
		display: none;
	}

	.dv-faq__chevron {
		font-family: var(--dv-font-sans);
		font-size: 1.5rem;
		color: var(--dv-color-terracotta);
		transition: transform var(--dv-duration-base) var(--dv-ease-soft);
	}

	details[open] .dv-faq__chevron {
		transform: rotate(45deg);
	}

	.dv-faq__a {
		padding: 0 0.25rem 1.25rem;
		color: var(--dv-color-charcoal-soft);
		font-family: var(--dv-font-sans);
		line-height: 1.65;
	}
</style>
