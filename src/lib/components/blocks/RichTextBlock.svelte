<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';

	type RichTextData = {
		anchor?: string | null;
		eyebrow?: string | null;
		script_accent?: string | null;
		title?: string | null;
		content?: string | null;
		align?: 'center' | 'left' | null;
	};

	let { data }: { data: RichTextData } = $props();

	const align = $derived(data.align ?? 'center');
</script>

<section id={data.anchor ?? undefined} class="dv-rich" data-align={align}>
	<div class="dv-rich__inner">
		<header class="dv-rich__header">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.script_accent}
				<p class="dv-rich__script">{data.script_accent}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-rich__title text-balance">{data.title}</h2>
			{/if}
			{#if data.title || data.eyebrow}
				<div class="dv-rich__rule">
					<GoldRule size="sm" />
				</div>
			{/if}
		</header>

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
		padding: var(--dv-space-section) 1.5rem;
	}

	.dv-rich__inner {
		margin-inline: auto;
		max-width: 42rem;
	}

	.dv-rich[data-align='center'] .dv-rich__inner {
		text-align: center;
	}

	.dv-rich[data-align='left'] .dv-rich__inner {
		text-align: left;
	}

	.dv-rich__header {
		margin-bottom: 2.5rem;
	}

	.dv-rich[data-align='left'] .dv-rich__header {
		text-align: left;
	}

	.dv-rich__script {
		margin-top: 0.5rem;
		font-family: var(--dv-font-script);
		font-size: clamp(1.75rem, 1.2rem + 1.4vw, 2.5rem);
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-rich__title {
		margin-top: 0.75rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(1.75rem, 1.25rem + 1.6vw, 2.5rem);
		line-height: 1.15;
		color: var(--dv-color-charcoal);
	}

	.dv-rich__rule {
		margin-top: 1.5rem;
	}

	.dv-rich[data-align='left'] .dv-rich__rule {
		display: flex;
		justify-content: flex-start;
	}

	.dv-rich__body {
		font-family: var(--dv-font-display);
		font-size: clamp(1.05rem, 0.95rem + 0.3vw, 1.2rem);
		line-height: 1.75;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-rich__body :global(p) {
		margin: 0;
	}

	.dv-rich__body :global(p + p) {
		margin-top: 1.25rem;
	}

	.dv-rich__body :global(em) {
		font-style: italic;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-rich__body :global(strong) {
		font-weight: 600;
		color: var(--dv-color-charcoal);
	}

	.dv-rich__body :global(a) {
		color: var(--dv-color-terracotta-deep);
		text-decoration: none;
		border-bottom: 1px solid color-mix(in srgb, var(--dv-color-gold) 55%, transparent);
		transition: border-color var(--dv-duration-fast) var(--dv-ease-soft);
	}

	.dv-rich__body :global(a:hover) {
		border-bottom-color: var(--dv-color-terracotta);
	}

	.dv-rich__body :global(blockquote) {
		margin: 2rem 0;
		padding: 0 1.25rem;
		border-left: 1px solid color-mix(in srgb, var(--dv-color-gold) 70%, transparent);
		font-style: italic;
		color: var(--dv-color-charcoal);
	}

	.dv-rich__body :global(ul),
	.dv-rich__body :global(ol) {
		margin: 1.25rem 0;
		padding-left: 1.5rem;
	}

	.dv-rich__body :global(li) {
		margin-top: 0.5rem;
	}

	.dv-rich__body :global(li::marker) {
		color: var(--dv-color-gold-deep);
	}
</style>
