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

	// Typed as `any` because each block component has a different `data`
	// shape; the map guarantees we only render a component when its
	// collection name matches, so the runtime payload always matches.
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
</script>

{#each blocks as block, i (block.id ?? `${block.collection}-${i}`)}
	{@const Component = componentMap[block.collection]}
	{#if Component && block.item}
		<Component data={block.item} />
	{/if}
{/each}
