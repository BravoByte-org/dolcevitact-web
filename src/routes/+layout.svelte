<script lang="ts">
	import '../app.css';
	import Grain from '$components/decor/Grain.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Dolce Vita CT — Italian-inspired mom & baby experience in Stamford, CT</title>
	<meta
		name="description"
		content="Dolce Vita CT is a premium Italian-inspired mom & baby experience in Stamford, Connecticut. Reserve your spot at the Dolce Vita Baby Circle."
	/>
	<link rel="canonical" href="https://dolcevitact.com/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Dolce Vita CT" />
	<meta
		property="og:description"
		content="A warm, refined Italian-inspired class for moms and babies in Stamford, CT."
	/>
	<meta property="og:url" content="https://dolcevitact.com/" />
	<meta property="og:locale" content="en_US" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&family=Tangerine:wght@400;700&display=swap"
	/>
</svelte:head>

<Grain />

<div class="relative z-10">
	{@render children()}
</div>
