<script lang="ts">
	/*
	 * BlockRenderer — binds Dolce Vita's Directus block schema to renderable
	 * components.
	 *
	 * Why per-app: the mapping from Directus collection → component +
	 * data adapter is inherently client-local (each app's CMS schema and
	 * brand-shell needs differ). Generic block markup lives in
	 * `@bravobyte-org/frontend-core`; brand-specific blocks (`HeroBlock`)
	 * and single-consumer blocks (`FaqBlock`, `EventDetailsBlock`,
	 * `RsvpFormBlock`) stay here — see
	 * `bravobyte/.docs/architecture/extraction-strategy.md`.
	 *
	 * Surface: every entry can opt into a `surface` value (`'raised'` for
	 * lifted ivory cards, `'inverse'` for charcoal slabs). Dolce's brand
	 * voice currently leans on the airy ivory surface, so we leave the
	 * default; this hook lets editors flip individual sections via the
	 * componentMap without touching block markup.
	 *
	 * Data adapters: per-block `adapt` functions normalise Directus item
	 * shapes onto the canonical `*BlockData` shapes shipped by frontend-core
	 * (`portrait → portrait_url`, `image → src`, etc., resolving Directus
	 * file refs to URLs along the way).
	 */
	import {
		CardGroupBlock,
		CtaBlock,
		ImageGalleryBlock,
		RichTextBlock,
		StatsBlock,
		TeamBlock,
		TimelineBlock,
		type SectionSurface
	} from '@bravobyte-org/frontend-core';
	import type { Component } from 'svelte';
	import EventDetailsBlock from './EventDetailsBlock.svelte';
	import FaqBlock from './FaqBlock.svelte';
	import HeroBlock from './HeroBlock.svelte';
	import RsvpFormBlock from './RsvpFormBlock.svelte';
	import { resolveAssetUrl, type DirectusFileRef } from '$util/cms/assets';
	import type { Block } from './types';

	/*
	 * Each block has a different required `data` shape; the renderer is the
	 * single boundary that maps Directus collection → component + adapter,
	 * so a permissive component prop type is correct here. The `adapt`
	 * function is what enforces shape correctness at runtime.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type AnyBlockComponent = Component<{ data: any; surface?: SectionSurface }>;

	type BlockEntry = {
		component: AnyBlockComponent;
		surface?: SectionSurface;
		adapt?: (item: Record<string, unknown>) => Record<string, unknown>;
	};

	let { blocks = [] }: { blocks: Block[] } = $props();

	const componentMap: Record<string, BlockEntry> = {
		block_hero: { component: HeroBlock },

		block_rich_text: { component: RichTextBlock },

		block_stats: { component: StatsBlock },

		block_card_group: { component: CardGroupBlock },

		block_team: {
			component: TeamBlock,
			adapt: (item) => ({
				...item,
				members: Array.isArray(item.members)
					? item.members.map((m: Record<string, unknown>) => ({
							...m,
							portrait_url: resolveAssetUrl(m.portrait as DirectusFileRef | undefined) ?? null
						}))
					: []
			})
		},

		block_timeline: { component: TimelineBlock },

		block_cta: { component: CtaBlock },

		block_image_gallery: {
			component: ImageGalleryBlock,
			adapt: (item) => ({
				...item,
				items: Array.isArray(item.items)
					? item.items.map((g: Record<string, unknown>) => ({
							...g,
							src: resolveAssetUrl(g.image as DirectusFileRef | undefined) ?? null
						}))
					: []
			})
		},

		block_faq: { component: FaqBlock },
		block_event_details: { component: EventDetailsBlock },
		block_rsvp_form: { component: RsvpFormBlock }
	};
</script>

{#each blocks as block, i (block.id ?? `${block.collection}-${i}`)}
	{@const entry = componentMap[block.collection]}
	{#if entry && block.item}
		{@const data = entry.adapt ? entry.adapt(block.item) : block.item}
		<entry.component {data} surface={entry.surface} />
	{/if}
{/each}
