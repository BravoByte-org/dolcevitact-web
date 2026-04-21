<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';
	import OliveBranch from '$components/decor/OliveBranch.svelte';

	// Placeholder homepage that exercises the M3 design system.
	// Replaced in M4 (#9, #10) once Directus content + sticky nav land.
</script>

<main
	class="dv-anim-fade mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-24 text-center"
>
	<p class="dv-eyebrow">Stamford · Connecticut</p>

	<div class="mt-8 w-44 sm:w-56">
		<OliveBranch tone="sage" />
	</div>

	<p class="dv-script mt-6">Dolce Vita CT</p>

	<h1 class="dv-h1 dv-anim-rise mt-4 max-w-2xl">
		An Italian-inspired moment for <em class="font-display text-terracotta italic"
			>mama e bambino</em
		>
	</h1>

	<div class="mt-8">
		<GoldRule size="md" />
	</div>

	<p class="dv-lede dv-anim-rise mx-auto mt-8 max-w-xl text-balance">
		Reservations open soon for the first <strong class="font-medium">Dolce Vita Baby Circle</strong> —
		a warm, refined class for moms and babies, led by a native Italian speaker, teacher, and mom.
	</p>

	<a
		href="mailto:hello@dolcevitact.com?subject=Dolce%20Vita%20CT%20—%20early%20list"
		class="bg-terracotta hover:bg-terracotta-deep text-ivory shadow-soft mt-12 inline-flex items-center justify-center rounded-md px-7 py-3.5 text-sm font-medium tracking-[0.18em] uppercase transition-colors duration-300 ease-[var(--ease-soft)]"
	>
		Be the first to know
	</a>

	<p class="text-charcoal-mute mt-16 text-xs tracking-widest uppercase">Coming spring · Stamford</p>
</main>
