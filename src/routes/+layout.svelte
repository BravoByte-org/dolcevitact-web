<script lang="ts">
	import '../app.css';

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
</svelte:head>

{@render children()}
