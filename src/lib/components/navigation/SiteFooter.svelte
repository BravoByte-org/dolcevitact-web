<script lang="ts">
	import { base } from '$app/paths';
	import GoldRule from '$components/decor/GoldRule.svelte';
	import OliveBranch from '$components/decor/OliveBranch.svelte';
	import type { NavItem, NavChild } from './types';

	let {
		items = [],
		siteTitle = 'Dolce Vita Baby Circle',
		contactEmail = 'babycircle@dolcevitact.com',
		cityLine = 'Stamford, Connecticut',
		tagline = 'An Italian-inspired circle for mothers and babies — the first chapter of Dolce Vita.'
	}: {
		items?: NavItem[];
		siteTitle?: string;
		contactEmail?: string;
		cityLine?: string;
		tagline?: string;
	} = $props();

	const navItems = $derived(items.slice(0, 6));

	const year = new Date().getFullYear();

	function resolveHref(item: NavChild): string {
		if (item.url) {
			const u = item.url;
			if (u.startsWith('#')) return u;
			if (/^https?:\/\//i.test(u) || u.startsWith('//') || u.startsWith('mailto:')) return u;
			const path = u.startsWith('/') ? u : `/${u}`;
			return `${base}${path}`;
		}
		if (item.page?.slug) {
			const slug = item.page.slug.startsWith('/') ? item.page.slug : `/${item.page.slug}`;
			return `${base}${slug}`;
		}
		return '#';
	}
</script>

<footer class="dv-footer">
	<div class="dv-footer__rule">
		<GoldRule size="md" />
	</div>

	<div class="dv-footer__inner">
		<div class="dv-footer__brand">
			<div class="dv-footer__olive" aria-hidden="true">
				<OliveBranch tone="sage" />
			</div>
			<p class="dv-footer__script">{siteTitle}</p>
			<p class="dv-footer__tagline">{tagline}</p>
		</div>

		{#if navItems.length > 0}
			<nav class="dv-footer__nav" aria-label="Footer">
				<p class="dv-eyebrow dv-footer__nav-heading">Explore</p>
				<ul>
					{#each navItems as item (item.id)}
						<li>
							<a
								class="dv-footer__link"
								href={resolveHref(item)}
								target={item.open_in_new_tab ? '_blank' : undefined}
								rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
							>
								{item.title}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		{/if}

		<div class="dv-footer__contact">
			<p class="dv-eyebrow dv-footer__nav-heading">Reach us</p>
			<a class="dv-footer__email" href="mailto:{contactEmail}">{contactEmail}</a>
			<p class="dv-footer__city">{cityLine}</p>
		</div>
	</div>

	<div class="dv-footer__meta">
		<p>&copy; {year} {siteTitle} · Made with amore in Connecticut.</p>
	</div>
</footer>

<style>
	.dv-footer {
		margin-top: auto;
		padding: 4rem 1.5rem 2.5rem;
		background: color-mix(in srgb, var(--dv-color-ivory-deep) 80%, var(--dv-color-ivory));
		position: relative;
	}

	.dv-footer__rule {
		max-width: 12rem;
		margin-inline: auto;
	}

	.dv-footer__inner {
		margin-top: 3rem;
		margin-inline: auto;
		max-width: 64rem;
		display: grid;
		gap: 3rem;
		grid-template-columns: 1fr;
		text-align: center;
	}

	@media (min-width: 720px) {
		.dv-footer__inner {
			grid-template-columns: 1.4fr 1fr 1fr;
			text-align: left;
			align-items: start;
		}
	}

	.dv-footer__olive {
		width: 9rem;
		margin-inline: auto;
		margin-bottom: 1rem;
	}

	@media (min-width: 720px) {
		.dv-footer__olive {
			margin-inline: 0;
		}
	}

	.dv-footer__script {
		font-family: var(--dv-font-script);
		font-size: clamp(2.5rem, 1.6rem + 2vw, 3.5rem);
		color: var(--dv-color-terracotta-deep);
		line-height: 1;
	}

	.dv-footer__tagline {
		margin-top: 0.75rem;
		max-width: 22rem;
		font-family: var(--dv-font-display);
		font-size: 1.1rem;
		line-height: 1.5;
		color: var(--dv-color-charcoal-soft);
	}

	@media (min-width: 720px) {
		.dv-footer__tagline {
			margin-inline: 0;
		}
	}

	.dv-footer__nav-heading {
		margin-bottom: 1rem;
	}

	.dv-footer__nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.dv-footer__link {
		font-family: var(--dv-font-display);
		font-size: 1.05rem;
		color: var(--dv-color-charcoal);
		text-decoration: none;
		transition: color var(--dv-duration-fast) var(--dv-ease-soft);
	}

	.dv-footer__link:hover {
		color: var(--dv-color-terracotta-deep);
	}

	.dv-footer__link:focus-visible {
		outline: 2px solid var(--dv-color-terracotta-deep);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.dv-footer__email {
		display: block;
		font-family: var(--dv-font-display);
		font-size: 1.15rem;
		color: var(--dv-color-terracotta-deep);
		text-decoration: none;
	}

	.dv-footer__email:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
		text-decoration-color: color-mix(in srgb, var(--dv-color-terracotta) 50%, transparent);
	}

	.dv-footer__email:focus-visible {
		outline: 2px solid var(--dv-color-terracotta-deep);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.dv-footer__city {
		margin-top: 0.5rem;
		font-family: var(--dv-font-sans);
		font-size: 0.85rem;
		color: var(--dv-color-charcoal-soft);
	}

	.dv-footer__meta {
		margin-top: 3.5rem;
		padding-top: 1.75rem;
		border-top: 1px solid color-mix(in srgb, var(--dv-color-charcoal) 6%, transparent);
		text-align: center;
		font-family: var(--dv-font-sans);
		font-size: 0.72rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
	}
</style>
