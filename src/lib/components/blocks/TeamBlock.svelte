<script lang="ts">
	import GoldRule from '$components/decor/GoldRule.svelte';
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
		anchor?: string | null;
		eyebrow?: string | null;
		script_accent?: string | null;
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

	const anchor = $derived(data.anchor ?? 'founder');

	// Single-member layouts are asymmetric editorial portraits; two or
	// more members drop into a gentle grid.
	const isFeatured = $derived(members.length === 1);
</script>

<section id={anchor} class="dv-team" class:dv-team--featured={isFeatured}>
	<div class="dv-team__inner">
		<header class="dv-team__header">
			{#if data.eyebrow}
				<p class="dv-eyebrow">{data.eyebrow}</p>
			{/if}
			{#if data.script_accent}
				<p class="dv-team__script">{data.script_accent}</p>
			{/if}
			{#if data.title}
				<h2 class="dv-team__title text-balance">{data.title}</h2>
			{/if}
			<div class="dv-team__rule">
				<GoldRule size="sm" />
			</div>
			{#if data.subtitle}
				<p class="dv-team__lede mx-auto text-balance">{data.subtitle}</p>
			{/if}
		</header>

		{#if isFeatured && members[0]}
			{@const m = members[0]}
			{@const portrait = resolveAssetUrl(m.portrait)}
			<article class="dv-team__featured">
				<div class="dv-team__portrait-wrap">
					{#if portrait}
						<img src={portrait} alt={m.name ?? ''} class="dv-team__portrait" loading="lazy" />
					{:else}
						<div class="dv-team__portrait dv-team__portrait--placeholder" aria-hidden="true">
							<span>{(m.name ?? '').slice(0, 1)}</span>
						</div>
					{/if}
					<div class="dv-team__frame" aria-hidden="true"></div>
				</div>

				<div class="dv-team__copy">
					{#if m.role}
						<p class="dv-team__role">{m.role}</p>
					{/if}
					{#if m.name}
						<h3 class="dv-team__name">{m.name}</h3>
					{/if}
					{#if m.name}
						<p class="dv-team__signature" aria-hidden="true">{m.name.split(' ')[0]}</p>
					{/if}
					{#if m.bio}
						<p class="dv-team__bio">{m.bio}</p>
					{/if}
				</div>
			</article>
		{:else if members.length > 0}
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
		padding: var(--dv-space-section) 1.5rem;
	}

	.dv-team__inner {
		margin-inline: auto;
		max-width: 64rem;
	}

	.dv-team__header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.dv-team__script {
		margin-top: 0.5rem;
		font-family: var(--dv-font-script);
		font-size: clamp(1.75rem, 1.2rem + 1.4vw, 2.5rem);
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-team__title {
		margin-top: 0.75rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(1.75rem, 1.25rem + 1.6vw, 2.5rem);
		line-height: 1.15;
		color: var(--dv-color-charcoal);
	}

	.dv-team__rule {
		margin-top: 1.5rem;
	}

	.dv-team__lede {
		margin-top: 1.5rem;
		max-width: 36rem;
		font-family: var(--dv-font-display);
		font-style: italic;
		font-size: 1.15rem;
		line-height: 1.55;
		color: var(--dv-color-charcoal-soft);
	}

	/* ─────────────── Featured (single) layout ─────────────── */

	.dv-team__featured {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
		align-items: center;
	}

	@media (min-width: 840px) {
		.dv-team__featured {
			grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
			gap: 4.5rem;
		}
	}

	.dv-team__portrait-wrap {
		position: relative;
		justify-self: center;
		width: min(20rem, 100%);
		aspect-ratio: 4 / 5;
	}

	.dv-team--featured .dv-team__portrait {
		position: relative;
		z-index: 1;
		width: 100%;
		height: 100%;
		border-radius: var(--dv-radius-md);
		object-fit: cover;
		box-shadow: var(--dv-shadow-lift);
	}

	.dv-team--featured .dv-team__portrait--placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		background: color-mix(in srgb, var(--dv-color-sage) 20%, var(--dv-color-ivory));
		font-family: var(--dv-font-script);
		font-size: 6rem;
		color: var(--dv-color-terracotta-deep);
	}

	/* Gold hairline frame offset slightly behind the portrait. */
	.dv-team__frame {
		position: absolute;
		inset: 1rem -1rem -1rem 1rem;
		border: 1px solid color-mix(in srgb, var(--dv-color-gold) 70%, transparent);
		border-radius: var(--dv-radius-md);
		pointer-events: none;
		z-index: 0;
	}

	.dv-team__copy {
		text-align: left;
	}

	.dv-team__copy .dv-team__role {
		margin-bottom: 0.5rem;
		font-family: var(--dv-font-sans);
		font-size: 0.72rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
	}

	.dv-team__copy .dv-team__name {
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: clamp(2rem, 1.4rem + 1.6vw, 2.75rem);
		line-height: 1.15;
		color: var(--dv-color-charcoal);
	}

	.dv-team__signature {
		margin-top: -0.25rem;
		font-family: var(--dv-font-script);
		font-size: clamp(2.25rem, 1.6rem + 1.8vw, 3rem);
		line-height: 1;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-team__copy .dv-team__bio {
		margin-top: 1.5rem;
		font-family: var(--dv-font-display);
		font-size: 1.1rem;
		line-height: 1.75;
		color: var(--dv-color-charcoal-soft);
	}

	/* ─────────────── Multi-member grid ─────────────── */

	.dv-team__grid {
		display: grid;
		gap: 3rem;
		grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
	}

	.dv-team__card {
		text-align: center;
	}

	.dv-team__card .dv-team__portrait {
		display: block;
		margin-inline: auto;
		width: 10rem;
		height: 10rem;
		border-radius: 9999px;
		object-fit: cover;
		box-shadow: var(--dv-shadow-card);
	}

	.dv-team__card .dv-team__portrait--placeholder {
		background: color-mix(in srgb, var(--dv-color-sage) 25%, var(--dv-color-ivory));
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--dv-font-script);
		font-size: 3.5rem;
		color: var(--dv-color-terracotta-deep);
	}

	.dv-team__card .dv-team__name {
		margin-top: 1.25rem;
		font-family: var(--dv-font-display);
		font-weight: 500;
		font-size: 1.5rem;
		color: var(--dv-color-charcoal);
	}

	.dv-team__card .dv-team__role {
		margin-top: 0.25rem;
		font-family: var(--dv-font-sans);
		font-size: 0.72rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
	}

	.dv-team__card .dv-team__bio {
		margin-top: 1rem;
		font-family: var(--dv-font-sans);
		line-height: 1.65;
		color: var(--dv-color-charcoal-soft);
	}
</style>
