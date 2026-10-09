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
			<h2 class="dv-gallery__title dv-h2">{data.title}</h2>
		{/if}
		{#if data.subtitle}
			<p class="dv-gallery__subtitle dv-lede">{data.subtitle}</p>
		{/if}

		{#if items.length > 0}
			<ul class="dv-gallery__grid">
				{#each items as item, i (item.id ?? i)}
					{#if item.src}
						<li class="dv-gallery__cell">
							<figure class="dv-gallery__figure">
								<img src={item.src} alt={item.alt ?? ''} loading="lazy" class="dv-gallery__img" />
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

<style lang="postcss">
	@reference '../../../app.css';

	.dv-gallery {
		padding: clamp(3rem, 8vw, 5rem) 1.5rem;
	}

	.dv-gallery__inner {
		@apply mx-auto max-w-[72rem];
	}

	.dv-gallery__title {
		@apply text-center;
	}

	.dv-gallery__subtitle {
		@apply mx-auto mt-4 text-center text-balance;
	}

	.dv-gallery__grid {
		@apply mt-10 grid list-none gap-4 p-0;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
	}

	.dv-gallery__img {
		@apply shadow-soft block h-auto w-full rounded-md;
	}

	.dv-gallery__caption {
		@apply text-charcoal-mute mt-2 text-center font-sans text-[0.8rem];
	}
</style>
