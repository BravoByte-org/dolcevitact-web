<script lang="ts">
	type RichTextData = {
		eyebrow?: string | null;
		title?: string | null;
		content?: string | null;
	};

	let { data }: { data: RichTextData } = $props();
</script>

<section class="dv-rich">
	<div class="dv-rich__inner">
		{#if data.eyebrow}
			<p class="dv-rich__eyebrow dv-eyebrow">{data.eyebrow}</p>
		{/if}
		{#if data.title}
			<h2 class="dv-rich__title dv-h2">{data.title}</h2>
		{/if}
		{#if data.content}
			<div class="dv-rich__body">
				<!-- Trusted HTML from Directus rich text; sanitize upstream if editors are not fully trusted. -->
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html data.content}
			</div>
		{/if}
	</div>
</section>

<style lang="postcss">
	@reference '../../../app.css';

	.dv-rich {
		padding: clamp(3rem, 8vw, 5rem) 1.5rem;
	}

	.dv-rich__inner {
		@apply mx-auto max-w-[42rem] text-center;
	}

	.dv-rich__title {
		@apply mt-3;
	}

	.dv-rich__body {
		@apply text-charcoal-soft font-display mt-6;
		font-size: var(--dv-text-lede, 1.125rem);
		line-height: var(--dv-leading-body, 1.75);
	}

	.dv-rich__body :global(p + p) {
		@apply mt-4;
	}

	.dv-rich__body :global(em) {
		@apply text-terracotta-deep;
	}
</style>
