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
				<p class="dv-team__eyebrow dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-team__title dv-h2">{data.title}</h2>
			{/if}
			{#if data.subtitle}
				<p class="dv-team__subtitle dv-lede">{data.subtitle}</p>
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

<style lang="postcss">
	@reference '../../../app.css';

	.dv-team {
		padding: clamp(3.5rem, 9vw, 6rem) 1.5rem;
	}

	.dv-team__inner {
		@apply mx-auto max-w-[60rem];
	}

	.dv-team__header {
		@apply mb-12 text-center;
	}

	.dv-team__title {
		@apply mt-3;
	}

	.dv-team__subtitle {
		@apply mx-auto mt-4 text-balance;
	}

	.dv-team__grid {
		@apply grid gap-12;
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
	}

	.dv-team__card {
		@apply text-center;
	}

	.dv-team__portrait {
		@apply shadow-card mx-auto block h-40 w-40 rounded-full object-cover;
	}

	.dv-team__portrait--placeholder {
		@apply font-script text-terracotta-deep flex items-center justify-center text-[3.5rem];
		background: color-mix(in srgb, var(--dv-color-sage) 25%, var(--dv-color-ivory));
	}

	.dv-team__name {
		@apply text-charcoal font-display mt-5 text-2xl;
	}

	.dv-team__role {
		@apply text-charcoal-mute mt-1 font-sans text-xs tracking-[0.16em] uppercase;
	}

	.dv-team__bio {
		@apply text-charcoal-soft mt-4 font-sans;
		line-height: 1.65;
	}
</style>
