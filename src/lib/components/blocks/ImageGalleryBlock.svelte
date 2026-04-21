<script lang="ts">
	import { resolveAssetUrl, type DirectusFileRef } from '$util/cms/assets';

	type GalleryItem = {
		id?: string | number;
		image?: DirectusFileRef;
		alt?: string | null;
		caption?: string | null;
		sort?: number | null;
	};

	type GalleryData = {
		eyebrow?: string | null;
		title?: string | null;
		subtitle?: string | null;
		items?: GalleryItem[] | null;
	};

	let { data }: { data: GalleryData } = $props();

	const items = $derived(
		Array.isArray(data.items)
			? [...data.items]
					.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
					.map((item) => ({ ...item, src: resolveAssetUrl(item.image) }))
			: []
	);
</script>

<section class="dv-gallery">
	<div class="dv-gallery__inner">
		<header class="dv-gallery__header">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-gallery__title text-balance">{data.title}</h2>
			{/if}
			{#if data.subtitle}
				<p class="dv-gallery__lede mx-auto text-balance">{data.subtitle}</p>
			{/if}
		</header>

		{#if items.length > 0}
			<ul class="dv-gallery__grid">
				{#each items as item, i (item.id ?? i)}
					{#if item.src}
						<li
							class="dv-gallery__cell"
							data-shape={i % 3 === 0 ? 'tall' : i % 3 === 1 ? 'wide' : 'square'}
						>
							<figure>
								<div class="dv-gallery__frame">
									<img src={item.src} alt={item.alt ?? ''} loading="lazy" />
								</div>
								{#if item.caption}
									<figcaption class="dv-gallery__caption">{item.caption}</figcaption>
								{/if}
							</figure>
						</li>
					{/if}
				{/each}
			</ul>
		{/if}
	</div>
</section>

<style>
	.dv-gallery {
		padding: var(--dv-space-section) 1.5rem;
	}

	.dv-gallery__inner {
		margin-inline: auto;
		max-width: 76rem;
	}

	.dv-gallery__header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.dv-gallery__title {
		margin-top: 0.5rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(1.75rem, 1.25rem + 1.6vw, 2.5rem);
		line-height: 1.15;
		color: var(--dv-color-charcoal);
	}

	.dv-gallery__lede {
		margin-top: 1rem;
		max-width: 36rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 1.1rem;
		line-height: 1.55;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-gallery__grid {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.dv-gallery__frame {
		position: relative;
		overflow: hidden;
		border-radius: var(--dv-radius-md);
		box-shadow: var(--dv-shadow-soft);
		aspect-ratio: 4 / 5;
	}

	.dv-gallery__cell[data-shape='wide'] .dv-gallery__frame {
		aspect-ratio: 5 / 4;
	}

	.dv-gallery__cell[data-shape='square'] .dv-gallery__frame {
		aspect-ratio: 1 / 1;
	}

	.dv-gallery__cell img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.9s var(--dv-ease-soft);
	}

	.dv-gallery__cell:hover img {
		transform: scale(1.03);
	}

	.dv-gallery__caption {
		margin-top: 0.65rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 0.95rem;
		color: var(--dv-color-charcoal-mute);
		text-align: center;
	}
</style>
