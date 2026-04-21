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
			<p class="dv-eyebrow">{data.eyebrow}</p>
		{/if}
		{#if data.title}
			<h2 class="dv-h2 mt-3">{data.title}</h2>
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

<style>
	.dv-rich {
		padding: clamp(3rem, 8vw, 5rem) 1.5rem;
	}

	.dv-rich__inner {
		margin-inline: auto;
		max-width: 42rem;
		text-align: center;
	}

	.dv-rich__body {
		margin-top: 1.5rem;
		color: var(--dv-color-charcoal-soft);
		font-family: var(--dv-font-display);
		font-size: var(--dv-text-lede, 1.125rem);
		line-height: var(--dv-leading-body, 1.75);
	}

	.dv-rich__body :global(p + p) {
		margin-top: 1rem;
	}

	.dv-rich__body :global(em) {
		color: var(--dv-color-terracotta-deep);
	}
</style>
