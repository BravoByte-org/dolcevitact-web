# Block Styling Guide

**Scope**: Authoring convention for every Svelte component under
`src/lib/components/blocks/*` and shared UI primitives on this site.

This guide operationalises the
[`tailwind-svelte.md`](../../../bravobyte-ai/rules/tailwind-svelte.md) rule
for Dolce Vita. Same rule, cookbook form.

---

## TL;DR

1. Markup carries **semantic BEM class names only** — never inline Tailwind
   utilities.
2. CSS lives in a **`<style lang="postcss">`** block with
   `@reference '../../../app.css';` at the top.
3. Utilities are applied via **`@apply`** inside BEM-scoped rules.
4. Interaction / state uses **nested selectors** (`&:hover`,
   `&:focus-visible`, `&:disabled`).
5. Brand tokens are referenced directly as CSS custom properties
   (`var(--dv-color-terracotta)`) when they are not yet mapped to a Tailwind
   utility class. Prefer the utility when both exist.
6. Every interactive element must have a visible **`:focus-visible`** ring.
   Default treatment on this site:
   `outline: 2px solid var(--dv-color-terracotta-deep); outline-offset: 4px;`

## Canonical template

```svelte
<script lang="ts">
	type Props = { headline?: string | null };
	let { data }: { data: Props } = $props();
</script>

<section class="dv-example">
	<div class="dv-example__inner">
		{#if data.headline}
			<h2 class="dv-example__headline dv-h2">{data.headline}</h2>
		{/if}
		<a href="#cta" class="dv-example__cta">Reserve</a>
	</div>
</section>

<style lang="postcss">
	@reference '../../../app.css';

	.dv-example {
		padding: clamp(3rem, 8vw, 6rem) 1.5rem;
	}

	.dv-example__inner {
		@apply mx-auto max-w-[52rem] text-center;
	}

	.dv-example__headline {
		@apply text-balance;
	}

	.dv-example__cta {
		@apply bg-terracotta text-ivory inline-flex items-center rounded-full px-8 py-[0.9rem] font-sans text-[0.8rem] tracking-[0.14em] uppercase transition-colors;

		&:hover {
			@apply bg-terracotta-deep;
		}

		&:focus-visible {
			outline: 2px solid var(--dv-color-terracotta-deep);
			outline-offset: 4px;
		}
	}
</style>
```

## What counts as "utility"

Use `@apply` for:

- Layout utilities (`flex`, `grid`, `mx-auto`, `max-w-*`, `gap-*`)
- Spacing utilities (`mt-*`, `px-*`, `py-*`)
- Typography utilities Tailwind ships (`text-*`, `font-sans`, `uppercase`,
  `tracking-*`)
- Brand colour utilities mapped in `app.css` (`bg-terracotta`, `text-ivory`)
- Responsive prefixes (`md:w-56`) — not raw `@media` queries inside the
  block's own CSS.

Prefer custom CSS + tokens for:

- Decorative effects not represented as utilities
  (`backdrop-filter`, custom `clip-path`, `color-mix(...)`)
- Stateful animations (`@keyframes`)
- Anything that requires referencing a token mid-value
  (`color-mix(in srgb, var(--dv-color-gold) 12%, transparent)`)

## Navigation exception

Nav + footer components (`SiteNav.svelte`, `HamburgerButton.svelte`,
`SiteFooter.svelte`) keep plain `<style>` blocks with CSS custom
properties. They predate the rule and contain zero inline utilities in
markup, so they already meet the hard compliance bar. Keep them that way.
Only convert to `@apply` when refactor actually reduces duplication.

## A11y smoke test

The mobile nav drawer has a dedicated Playwright + axe-core smoke test at
`tests/e2e/nav-drawer.a11y.spec.ts`. Run it locally with:

```bash
pnpm test:a11y
```

It boots `pnpm build && pnpm preview` on port 4002 and verifies:

- No WCAG 2.1 AA violations while the drawer is open
- Body scroll lock (`.dv-scroll-locked`) is applied on open
- Esc closes the drawer and returns focus to the hamburger trigger
- Focus is pulled into the panel on open

Add more `@a11y`-tagged specs next to this one for other interactive
blocks (FAQ accordion, RSVP form) as they gain complexity.

## Reusability candidates

When a block's `@apply` set becomes generic across projects
(Starway + Dolce Vita + future client), lift the rule into
`bravobyte-frontend-core` as a shared component and keep only the
brand-token override here. See `bravobyte-ai/rules/reusability.md`.
