<script lang="ts">
	import { resolveAssetUrl, type DirectusFileRef } from '$util/cms/assets';

	type Member = {
		id?: string | number;
		name?: string | null;
		role?: string | null;
		bio?: string | null;
		portrait?: DirectusFileRef;
		sort?: number | null;
	};

	type TeamData = {
		eyebrow?: string | null;
		title?: string | null;
		subtitle?: string | null;
		members?: Member[] | null;
	};

	let { data }: { data: TeamData } = $props();

	const members = $derived(
		Array.isArray(data.members)
			? [...data.members].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
			: []
	);
</script>

<section id="founder" class="dv-team">
	<div class="dv-team__inner">
		<header class="dv-team__header">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-h2 mt-3">{data.title}</h2>
			{/if}
			{#if data.subtitle}
				<p class="dv-lede mx-auto mt-4 text-balance">{data.subtitle}</p>
			{/if}
		</header>

		{#if members.length > 0}
			<div class="dv-team__grid">
				{#each members as m, i (m.id ?? i)}
					{@const portrait = resolveAssetUrl(m.portrait)}
					<article class="dv-team__card">
						{#if portrait}
							<img src={portrait} alt={m.name ?? ''} class="dv-team__portrait" loading="lazy" />
						{:else}
							<div class="dv-team__portrait dv-team__portrait--placeholder" aria-hidden="true">
								<span>{(m.name ?? '').slice(0, 1)}</span>
							</div>
						{/if}

						{#if m.name}
							<h3 class="dv-team__name">{m.name}</h3>
						{/if}
						{#if m.role}
							<p class="dv-team__role">{m.role}</p>
						{/if}
						{#if m.bio}
							<p class="dv-team__bio">{m.bio}</p>
						{/if}
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.dv-team {
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-team__inner {
		margin-inline: auto;
		max-width: 60rem;
	}

	.dv-team__header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.dv-team__grid {
		display: grid;
		gap: 3rem;
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
	}

	.dv-team__card {
		text-align: center;
	}

	.dv-team__portrait {
		display: block;
		margin-inline: auto;
		width: 10rem;
		height: 10rem;
		border-radius: 9999px;
		object-fit: cover;
		box-shadow: var(--dv-shadow-card);
	}

	.dv-team__portrait--placeholder {
		background: color-mix(in srgb, var(--dv-color-sage) 25%, var(--dv-color-ivory));
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--dv-font-script, serif);
		font-size: 3.5rem;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-team__name {
		margin-top: 1.25rem;
		font-family: var(--dv-font-display);
		font-size: 1.5rem;
		color: var(--dv-color-charcoal);
	}

	.dv-team__role {
		margin-top: 0.25rem;
		font-family: var(--dv-font-sans);
		font-size: 0.75rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
	}

	.dv-team__bio {
		margin-top: 1rem;
		font-family: var(--dv-font-sans);
		line-height: 1.65;
		color: var(--dv-color-charcoal-soft);
	}
</style>
