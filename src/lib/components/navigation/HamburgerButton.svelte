<script lang="ts">
	let {
		open = false,
		controls,
		onclick
	}: {
		open?: boolean;
		controls: string;
		onclick?: (event: MouseEvent) => void;
	} = $props();
</script>

<button
	type="button"
	class="dv-hamburger"
	class:dv-hamburger--open={open}
	aria-expanded={open}
	aria-controls={controls}
	aria-label={open ? 'Close menu' : 'Open menu'}
	{onclick}
>
	<span class="dv-hamburger__line"></span>
	<span class="dv-hamburger__line"></span>
	<span class="dv-hamburger__line"></span>
</button>

<style>
	.dv-hamburger {
		position: relative;
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.28rem;
		width: 2.5rem;
		height: 2.5rem;
		padding: 0;
		background: transparent;
		border: 1px solid transparent;
		border-radius: 9999px;
		cursor: pointer;
		transition:
			background-color var(--dv-duration-fast) var(--dv-ease-soft),
			border-color var(--dv-duration-fast) var(--dv-ease-soft);
	}

	.dv-hamburger:hover {
		background: color-mix(in srgb, var(--dv-color-gold) 12%, transparent);
		border-color: color-mix(in srgb, var(--dv-color-gold) 40%, transparent);
	}

	.dv-hamburger:focus-visible {
		outline: 2px solid var(--dv-color-terracotta-deep);
		outline-offset: 2px;
	}

	.dv-hamburger__line {
		display: block;
		width: 1.1rem;
		height: 1px;
		background: var(--dv-color-charcoal);
		transition:
			transform var(--dv-duration-base) var(--dv-ease-soft),
			opacity var(--dv-duration-fast) var(--dv-ease-soft);
		transform-origin: center;
	}

	.dv-hamburger--open .dv-hamburger__line:nth-child(1) {
		transform: translateY(0.37rem) rotate(45deg);
	}

	.dv-hamburger--open .dv-hamburger__line:nth-child(2) {
		opacity: 0;
	}

	.dv-hamburger--open .dv-hamburger__line:nth-child(3) {
		transform: translateY(-0.37rem) rotate(-45deg);
	}
</style>
