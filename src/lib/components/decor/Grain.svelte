<script lang="ts">
	/**
	 * Grain — a paper-texture noise overlay applied via SVG `feTurbulence`.
	 * Renders as a fixed full-screen layer behind the page content (when
	 * mounted at the layout level) so the entire site sits on a subtly
	 * textured ivory paper rather than a flat solid colour.
	 *
	 * Defaults to a low-intensity layer suitable for body backgrounds.
	 * Tune `opacity` for hero-emphasis variants.
	 */
	type Props = {
		opacity?: number;
		class?: string;
	};

	let { opacity = 0.06, class: extraClass = '' }: Props = $props();
</script>

<div class="dv-grain {extraClass}" style:opacity aria-hidden="true">
	<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
		<filter id="dv-grain-noise">
			<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
			<feColorMatrix
				type="matrix"
				values="0 0 0 0 0.17
				        0 0 0 0 0.16
				        0 0 0 0 0.15
				        0 0 0 0.85 0"
			/>
		</filter>
		<rect width="100%" height="100%" filter="url(#dv-grain-noise)" />
	</svg>
</div>

<style>
	.dv-grain {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		mix-blend-mode: multiply;
	}
</style>
