<script lang="ts">
	import { base } from '$app/paths';
	import BrandLockup from '$components/brand/BrandLockup.svelte';
	import HamburgerButton from './HamburgerButton.svelte';
	import type { NavItem, NavChild } from './types';

	let {
		items = [],
		siteTitle = 'Dolce Vita Baby Circle',
		ctaLabel = 'Reserve',
		ctaHref = '#rsvp'
	}: {
		items?: NavItem[];
		siteTitle?: string;
		ctaLabel?: string;
		ctaHref?: string;
	} = $props();

	const MOBILE_PANEL_ID = 'dv-nav-mobile-panel';

	let mobileOpen = $state(false);
	let scrolled = $state(false);
	let panelRef: HTMLDivElement | null = $state(null);
	let hamburgerWrapperRef: HTMLDivElement | null = $state(null);

	/**
	 * Filter out the Reserve/CTA item from the inline link list so the
	 * pill CTA never duplicates it. Treated by exact slug match on `#rsvp`
	 * or a title that matches the `ctaLabel` — either works from the CMS
	 * side without a dedicated flag field.
	 */
	const inlineItems = $derived(
		items.filter((item) => {
			const href = resolveHref(item);
			return href !== ctaHref && item.title?.toLowerCase() !== ctaLabel.toLowerCase();
		})
	);

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

	function closeMobile() {
		mobileOpen = false;
	}

	function toggleMobile() {
		mobileOpen = !mobileOpen;
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape' && mobileOpen) {
			e.preventDefault();
			closeMobile();
			hamburgerWrapperRef?.querySelector<HTMLButtonElement>('button')?.focus();
		}
	}

	function onScroll() {
		scrolled = window.scrollY > 16;
	}

	// Scroll listener: adds a hairline rule + tighter padding once the user
	// scrolls past the hero, so the sticky bar gains authority without ever
	// feeling like a heavy corporate top-bar.
	$effect(() => {
		if (typeof window === 'undefined') return;
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	// Body scroll lock while the drawer is open, with focus pulled into the
	// first focusable element inside the panel for keyboard users.
	$effect(() => {
		if (typeof document === 'undefined') return;
		const cls = 'dv-scroll-locked';
		if (mobileOpen) {
			document.body.classList.add(cls);
			const firstLink = panelRef?.querySelector<HTMLElement>('a, button');
			firstLink?.focus();
		} else {
			document.body.classList.remove(cls);
		}
		return () => document.body.classList.remove(cls);
	});
</script>

<svelte:window onkeydown={onKey} />

<header class="dv-nav" class:dv-nav--scrolled={scrolled}>
	<div class="dv-nav__bar">
		<a href="/" class="dv-nav__brand" onclick={closeMobile} aria-label={siteTitle}>
			<BrandLockup variant="nav" />
		</a>

		<nav class="dv-nav__desktop" aria-label="Primary">
			{#each inlineItems as item (item.id)}
				<a
					class="dv-nav__link"
					href={resolveHref(item)}
					target={item.open_in_new_tab ? '_blank' : undefined}
					rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
				>
					{item.title}
				</a>
			{/each}
			<a class="dv-nav__cta" href={ctaHref}>{ctaLabel}</a>
		</nav>

		<div class="dv-nav__mobile-trigger" bind:this={hamburgerWrapperRef}>
			<HamburgerButton open={mobileOpen} controls={MOBILE_PANEL_ID} onclick={toggleMobile} />
		</div>
	</div>
</header>

{#if mobileOpen}
	<button type="button" class="dv-nav__scrim" aria-label="Close menu" onclick={closeMobile}
	></button>
{/if}

<div
	id={MOBILE_PANEL_ID}
	class="dv-nav__panel"
	class:dv-nav__panel--open={mobileOpen}
	role="dialog"
	aria-modal="true"
	aria-label="Main menu"
	aria-hidden={!mobileOpen}
	inert={!mobileOpen}
	bind:this={panelRef}
>
	<div class="dv-nav__panel-inner">
		<div class="dv-nav__panel-brand">
			<BrandLockup variant="footer" />
		</div>

		<ul class="dv-nav__panel-list">
			{#each inlineItems as item (item.id)}
				<li>
					<a
						class="dv-nav__panel-link"
						href={resolveHref(item)}
						target={item.open_in_new_tab ? '_blank' : undefined}
						rel={item.open_in_new_tab ? 'noopener noreferrer' : undefined}
						onclick={closeMobile}
					>
						{item.title}
					</a>
				</li>
			{/each}
		</ul>

		<a class="dv-nav__panel-cta" href={ctaHref} onclick={closeMobile}>{ctaLabel}</a>

		<p class="dv-nav__panel-meta">Stamford · Connecticut</p>
	</div>
</div>

<style>
	.dv-nav {
		position: sticky;
		top: 0;
		z-index: 60;
		background: color-mix(in srgb, var(--dv-color-ivory) 85%, transparent);
		-webkit-backdrop-filter: saturate(140%) blur(12px);
		backdrop-filter: saturate(140%) blur(12px);
		border-bottom: 1px solid transparent;
		transition:
			border-color var(--dv-duration-base) var(--dv-ease-soft),
			box-shadow var(--dv-duration-base) var(--dv-ease-soft),
			padding var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-nav--scrolled {
		border-bottom-color: color-mix(in srgb, var(--dv-color-charcoal) 8%, transparent);
		box-shadow: 0 1px 0 0 color-mix(in srgb, var(--dv-color-gold) 25%, transparent);
	}

	.dv-nav__bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		margin-inline: auto;
		max-width: 80rem;
		padding: 1.25rem 1.5rem;
	}

	.dv-nav--scrolled .dv-nav__bar {
		padding-block: 0.9rem;
	}

	.dv-nav__brand {
		display: inline-flex;
		align-items: center;
		color: var(--dv-color-charcoal);
		text-decoration: none;
		border-radius: 4px;
	}

	.dv-nav__brand:focus-visible {
		outline: 2px solid var(--dv-color-terracotta-deep);
		outline-offset: 6px;
	}

	.dv-nav__desktop {
		display: none;
		align-items: center;
		gap: 2rem;
	}

	@media (min-width: 840px) {
		.dv-nav__desktop {
			display: flex;
		}
	}

	.dv-nav__link {
		font-family: var(--dv-font-sans);
		font-size: 0.72rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		color: var(--dv-color-charcoal-soft);
		text-decoration: none;
		transition: color var(--dv-duration-fast) var(--dv-ease-soft);
	}

	.dv-nav__link:hover {
		color: var(--dv-color-terracotta-deep);
	}

	.dv-nav__link:focus-visible {
		outline: 2px solid var(--dv-color-terracotta-deep);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.dv-nav__cta {
		margin-left: 0.5rem;
		padding: 0.65rem 1.35rem;
		background: var(--dv-color-terracotta);
		color: var(--dv-color-ivory);
		font-family: var(--dv-font-sans);
		font-size: 0.72rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		border-radius: 9999px;
		text-decoration: none;
		transition: background-color var(--dv-duration-fast) var(--dv-ease-soft);
	}

	.dv-nav__cta:hover {
		background: var(--dv-color-terracotta-deep);
	}

	.dv-nav__cta:focus-visible {
		outline: 2px solid var(--dv-color-terracotta-deep);
		outline-offset: 4px;
	}

	.dv-nav__mobile-trigger {
		display: flex;
		align-items: center;
	}

	@media (min-width: 840px) {
		.dv-nav__mobile-trigger {
			display: none;
		}
	}

	/* ---------- mobile drawer ---------- */

	.dv-nav__scrim {
		position: fixed;
		inset: 0;
		z-index: 55;
		background: color-mix(in srgb, var(--dv-color-charcoal) 30%, transparent);
		-webkit-backdrop-filter: blur(2px);
		backdrop-filter: blur(2px);
		border: none;
		cursor: default;
	}

	@media (min-width: 840px) {
		.dv-nav__scrim {
			display: none;
		}
	}

	.dv-nav__panel {
		position: fixed;
		inset: 0;
		z-index: 65;
		pointer-events: none;
		background: var(--dv-color-ivory);
		transform: translateY(-16px);
		opacity: 0;
		transition:
			transform var(--dv-duration-base) var(--dv-ease-soft),
			opacity var(--dv-duration-base) var(--dv-ease-soft);
	}

	.dv-nav__panel--open {
		pointer-events: auto;
		transform: translateY(0);
		opacity: 1;
	}

	@media (min-width: 840px) {
		.dv-nav__panel,
		.dv-nav__panel--open {
			display: none;
		}
	}

	.dv-nav__panel-inner {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		padding: 5rem 2rem 3rem;
		text-align: center;
	}

	.dv-nav__panel-brand {
		display: flex;
		justify-content: center;
		margin-bottom: 2.5rem;
	}

	.dv-nav__panel-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.dv-nav__panel-link {
		display: inline-block;
		font-family: var(--dv-font-display);
		font-size: 1.5rem;
		color: var(--dv-color-charcoal);
		text-decoration: none;
	}

	.dv-nav__panel-link:hover {
		color: var(--dv-color-terracotta-deep);
	}

	.dv-nav__panel-link:focus-visible {
		outline: 2px solid var(--dv-color-terracotta-deep);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.dv-nav__panel-cta:focus-visible {
		outline: 2px solid var(--dv-color-terracotta-deep);
		outline-offset: 4px;
	}

	.dv-nav__panel-cta {
		margin-top: 3rem;
		align-self: center;
		padding: 0.9rem 2rem;
		background: var(--dv-color-terracotta);
		color: var(--dv-color-ivory);
		font-family: var(--dv-font-sans);
		font-size: 0.8rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		border-radius: 9999px;
		text-decoration: none;
	}

	.dv-nav__panel-meta {
		margin-top: auto;
		padding-top: 3rem;
		font-family: var(--dv-font-sans);
		font-size: 0.72rem;
		letter-spacing: var(--dv-tracking-eyebrow);
		text-transform: uppercase;
		color: var(--dv-color-charcoal-mute);
	}

	:global(.dv-scroll-locked) {
		overflow: hidden;
	}
</style>
