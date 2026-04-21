<script lang="ts">
	/**
	 * OliveBranch — a hand-drawn-feeling SVG of an olive sprig.
	 * Default colour is muted sage; pass `tone="gold"` for the rare gold
	 * accent variant used in the hero. The component is purely decorative
	 * and announces itself as such to assistive tech.
	 */
	type Tone = 'sage' | 'gold';

	type Props = {
		tone?: Tone;
		flip?: boolean;
		class?: string;
	};

	let { tone = 'sage', flip = false, class: extraClass = '' }: Props = $props();

	const stroke = $derived(
		tone === 'gold' ? 'var(--dv-color-gold-deep)' : 'var(--dv-color-sage-deep)'
	);
	const leaf = $derived(tone === 'gold' ? 'var(--dv-color-gold)' : 'var(--dv-color-sage)');
	const berry = $derived(
		tone === 'gold' ? 'var(--dv-color-terracotta-deep)' : 'var(--dv-color-charcoal-soft)'
	);
</script>

<svg
	viewBox="0 0 200 80"
	xmlns="http://www.w3.org/2000/svg"
	role="presentation"
	aria-hidden="true"
	class="dv-olive {extraClass}"
	style:transform={flip ? 'scaleX(-1)' : undefined}
>
	<g fill="none" {stroke} stroke-width="1.2" stroke-linecap="round">
		<path d="M10 40 C 60 38, 130 42, 190 40" />
		<path d="M55 40 C 50 30, 45 24, 38 22" />
		<path d="M75 40 C 72 50, 70 56, 64 60" />
		<path d="M95 40 C 92 30, 90 24, 84 21" />
		<path d="M115 40 C 112 50, 110 56, 104 59" />
		<path d="M135 40 C 132 31, 130 25, 124 22" />
		<path d="M155 40 C 152 50, 150 55, 145 58" />
	</g>
	<g fill={leaf} {stroke} stroke-width="0.6">
		<ellipse cx="36" cy="20" rx="8" ry="3" transform="rotate(-25 36 20)" />
		<ellipse cx="63" cy="61" rx="8" ry="3" transform="rotate(28 63 61)" />
		<ellipse cx="82" cy="19" rx="8" ry="3" transform="rotate(-25 82 19)" />
		<ellipse cx="103" cy="60" rx="8" ry="3" transform="rotate(28 103 60)" />
		<ellipse cx="122" cy="20" rx="8" ry="3" transform="rotate(-25 122 20)" />
		<ellipse cx="144" cy="59" rx="8" ry="3" transform="rotate(28 144 59)" />
	</g>
	<g fill={berry}>
		<circle cx="44" cy="25" r="1.5" />
		<circle cx="74" cy="55" r="1.5" />
		<circle cx="90" cy="24" r="1.5" />
		<circle cx="115" cy="54" r="1.5" />
		<circle cx="130" cy="25" r="1.5" />
		<circle cx="153" cy="53" r="1.5" />
	</g>
</svg>

<style>
	.dv-olive {
		display: block;
		width: 100%;
		height: auto;
		opacity: 0.85;
	}
</style>
