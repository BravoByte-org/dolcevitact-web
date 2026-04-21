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
		{#if data.title}
			<h2 class="dv-h2 text-center">{data.title}</h2>
		{/if}
		{#if data.subtitle}
			<p class="dv-lede mx-auto mt-4 text-center text-balance">{data.subtitle}</p>
		{/if}

		{#if items.length > 0}
			<ul class="dv-gallery__grid">
				{#each items as item, i (item.id ?? i)}
					{#if item.src}
						<li class="dv-gallery__cell">
							<figure>
								<img src={item.src} alt={item.alt ?? ''} loading="lazy" />
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
		padding: clamp(3rem, 8vw, 5rem) 1.5rem;
	}

	.dv-gallery__inner {
		margin-inline: auto;
		max-width: 72rem;
	}

	.dv-gallery__grid {
		margin-top: 2.5rem;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		list-style: none;
		padding: 0;
	}

	.dv-gallery__cell img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: var(--dv-radius-md, 0.75rem);
		box-shadow: var(--dv-shadow-soft);
	}

	.dv-gallery__caption {
		margin-top: 0.5rem;
		font-family: var(--dv-font-sans);
		font-size: 0.8rem;
		color: var(--dv-color-charcoal-mute);
		text-align: center;
	}
</style>
