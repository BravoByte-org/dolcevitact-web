<script lang="ts">
	import type { Block } from './types';

	import HeroBlock from './HeroBlock.svelte';
	import RichTextBlock from './RichTextBlock.svelte';
	import StatsBlock from './StatsBlock.svelte';
	import CardGroupBlock from './CardGroupBlock.svelte';
	import TeamBlock from './TeamBlock.svelte';
	import TimelineBlock from './TimelineBlock.svelte';
	import CtaBlock from './CtaBlock.svelte';
	import ImageGalleryBlock from './ImageGalleryBlock.svelte';
	import FaqBlock from './FaqBlock.svelte';
	import EventDetailsBlock from './EventDetailsBlock.svelte';
	import RsvpFormBlock from './RsvpFormBlock.svelte';

	let { blocks = [] }: { blocks: Block[] } = $props();

	/* eslint-disable @typescript-eslint/no-explicit-any */
	const componentMap: Record<string, any> = {
		block_hero: HeroBlock,
		block_rich_text: RichTextBlock,
		block_stats: StatsBlock,
		block_card_group: CardGroupBlock,
		block_team: TeamBlock,
		block_timeline: TimelineBlock,
		block_cta: CtaBlock,
		block_image_gallery: ImageGalleryBlock,
		block_faq: FaqBlock,
		block_event_details: EventDetailsBlock,
		block_rsvp_form: RsvpFormBlock
	};
	/* eslint-enable @typescript-eslint/no-explicit-any */

	/**
	 * Assigns an editorial surface tone to each block so the page
	 * breathes with an alternating ivory / ivory-deep rhythm as you
	 * scroll. The hero (`block_hero`) is always on bare ivory so it
	 * blends straight into the nav; every subsequent non-hero block
	 * flips tone based on its ordinal position among non-hero blocks.
	 *
	 * A few blocks read best on a specific surface regardless of
	 * position — the RSVP form always sits on the deep ivory wash,
	 * the CTA block on a terracotta-tinted surface. Those overrides
	 * are baked in here rather than spread across components so the
	 * rhythm stays easy to reason about.
	 */
	type Surface = 'ivory' | 'ivory-deep' | 'terracotta-wash';

	function surfaceFor(block: Block, nonHeroIndex: number): Surface {
		if (block.collection === 'block_rsvp_form') return 'ivory-deep';
		if (block.collection === 'block_cta') return 'terracotta-wash';
		if (block.collection === 'block_hero') return 'ivory';
		return nonHeroIndex % 2 === 0 ? 'ivory-deep' : 'ivory';
	}

	const rendered = $derived.by(() => {
		let nonHero = 0;
		return blocks.map((block, i) => {
			const surface =
				block.collection === 'block_hero' ? ('ivory' as Surface) : surfaceFor(block, nonHero++);
			return { block, i, surface };
		});
	});
</script>

{#each rendered as { block, i, surface } (block.id ?? `${block.collection}-${i}`)}
	{@const Component = componentMap[block.collection]}
	{#if Component && block.item}
		<div class="dv-surface" data-surface={surface}>
			<Component data={block.item} />
		</div>
	{/if}
{/each}

<style>
	.dv-surface {
		position: relative;
	}

	.dv-surface[data-surface='ivory'] {
		background: transparent;
	}

	.dv-surface[data-surface='ivory-deep'] {
		background: color-mix(in srgb, var(--dv-color-ivory-deep) 70%, var(--dv-color-ivory));
	}

	.dv-surface[data-surface='terracotta-wash'] {
		background: color-mix(in srgb, var(--dv-color-terracotta) 8%, var(--dv-color-ivory));
	}

	/* Subtle hairline between adjacent surfaces of the same tone so the
	 * rhythm stays visible even when two ivory blocks land next to each
	 * other (e.g. hero → first ivory block). */
	.dv-surface + .dv-surface[data-surface='ivory']::before {
		content: '';
		position: absolute;
		inset: 0 10% auto;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent,
			color-mix(in srgb, var(--dv-color-gold) 22%, transparent),
			transparent
		);
	}
</style>
