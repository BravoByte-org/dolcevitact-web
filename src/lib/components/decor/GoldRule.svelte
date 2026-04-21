<script lang="ts">
	/**
	 * GoldRule — a thin gold divider with a small lozenge in the centre.
	 * Used between sections, beneath eyebrows, and to terminate quoted blocks.
	 *
	 * Variants:
	 *   - 'sm' (default): 4rem wide; for in-section emphasis under eyebrows
	 *   - 'md': 8rem; for header / footer separators
	 *   - 'lg': 14rem; for between major sections
	 */
	type Size = 'sm' | 'md' | 'lg';

	type Props = {
		size?: Size;
		class?: string;
	};

	let { size = 'sm', class: extraClass = '' }: Props = $props();

	const widths: Record<Size, string> = {
		sm: 'w-16',
		md: 'w-32',
		lg: 'w-56'
	};
</script>

<div
	class="dv-gold-rule mx-auto flex items-center gap-2 {widths[size]} {extraClass}"
	aria-hidden="true"
>
	<span class="dv-gold-rule__line"></span>
	<span class="dv-gold-rule__diamond"></span>
	<span class="dv-gold-rule__line"></span>
</div>

<style>
	.dv-gold-rule__line {
		flex: 1 1 auto;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent 0%,
			var(--dv-color-gold) 40%,
			var(--dv-color-gold) 60%,
			transparent 100%
		);
		transform-origin: center;
		animation: dv-rule-grow var(--dv-duration-slow) var(--dv-ease-soft) both;
	}

	.dv-gold-rule__diamond {
		width: 6px;
		height: 6px;
		flex: 0 0 auto;
		background-color: var(--dv-color-gold);
		transform: rotate(45deg);
		opacity: 0.85;
	}
</style>
