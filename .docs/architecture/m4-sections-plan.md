# M4 — Sections implementation plan

> **Status:** active, in progress as of April 21, 2026
> **Milestone:** [M4](https://github.com/BravoByte-org/dolcevitact-web/milestone/5)
> **Precedes:** M5 (RSVP form action + Resend)
> **Inherits:** M2 Directus schema (`.docs/operations/m2-verification.md`) + M3 design system (tokens, decoratives, motion)

M4 turns the 9 M2 page blocks into real Svelte components, registers them
in a `BlockRenderer`, and replaces the layout's temporary header ribbon
with an editorial sticky nav + mobile drawer. This document is the
architecture + story breakdown; implementation will be split across
dedicated stories / PRs per [`bravobyte-ai/git-history.md`](../../../bravobyte-ai/rules/git-history.md)
(one story per PR).

## 1. Scope

### In

| Deliverable                                                                                                    | Story | Issue                                                             |
| -------------------------------------------------------------------------------------------------------------- | ----- | ----------------------------------------------------------------- |
| `$components/blocks/types.ts` + `BlockRenderer` shell                                                          | M4a-1 | [#10](https://github.com/BravoByte-org/dolcevitact-web/issues/10) |
| Six adapted shared-candidate blocks (hero, card_group, timeline, team, rich_text, cta/image_gallery if needed) | M4a-2 | "                                                                 |
| Three Dolce-Vita-first blocks (`block_event_details`, `block_rsvp_form` shell, `block_faq` + items)            | M4a-3 | "                                                                 |
| Editorial sticky nav + mobile drawer (`SiteNav` + `NavDrawer`), replaces the temp ribbon                       | M4b   | [#9](https://github.com/BravoByte-org/dolcevitact-web/issues/9)   |
| Footer polish (keep current layout footer, tidy copy + socials if any)                                         | M4b   | [#9](https://github.com/BravoByte-org/dolcevitact-web/issues/9)   |

### Out (explicitly deferred)

| Item                                                                                             | Where it lands                                                         |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `block_rsvp_form` submit action (anonymous `POST /items/rsvp_submissions` → Resend notification) | M5 ([#11](https://github.com/BravoByte-org/dolcevitact-web/issues/11)) |
| Image optimization (`@sveltejs/enhanced-img`), OG images, JSON-LD                                | M6 ([#12](https://github.com/BravoByte-org/dolcevitact-web/issues/12)) |
| Section entrance animations beyond what `$styles/motion.css` already provides                    | Captured in M6 polish pass                                             |
| Italian translations on CMS fields / UI strings                                                  | Parked (spec §7 — English-only v1)                                     |

## 2. Component architecture

### 2.1 `BlockRenderer` (mirror of Starway's pattern)

Starway's `src/lib/components/blocks/BlockRenderer.svelte` is the
canonical shape to inherit: a `componentMap` indexed by Directus
collection name, iterated with keyed `{#each}` so Svelte can reuse DOM
across HMR hops. Dolce Vita extends the map with the three DV-first
collections:

```svelte
<script lang="ts">
	import HeroBlock from './HeroBlock.svelte';
	import RichTextBlock from './RichTextBlock.svelte';
	import CardGroupBlock from './CardGroupBlock.svelte';
	import TimelineBlock from './TimelineBlock.svelte';
	import TeamBlock from './TeamBlock.svelte';
	// DV-first
	import EventDetailsBlock from './EventDetailsBlock.svelte';
	import RsvpFormBlock from './RsvpFormBlock.svelte';
	import FaqBlock from './FaqBlock.svelte';

	import type { Block } from './types';
	let { blocks = [] }: { blocks: Block[] } = $props();

	const componentMap = {
		block_hero: HeroBlock,
		block_rich_text: RichTextBlock,
		block_card_group: CardGroupBlock,
		block_timeline: TimelineBlock,
		block_team: TeamBlock,
		block_event_details: EventDetailsBlock,
		block_rsvp_form: RsvpFormBlock,
		block_faq: FaqBlock
	} as const;
</script>

{#each blocks as block, i (`${block.collection}-${block.item.id ?? i}`)}
	{@const Component = componentMap[block.collection as keyof typeof componentMap]}
	{#if Component}<Component data={block.item as never} />{/if}
{/each}
```

`types.ts` already exists (imported by `+page.svelte`); only needs a
union of the 8 block item shapes from `@bravobyte/types` once M1 lands.
Until then, keep the `Block = { collection: string; item: Record<string, unknown> }` shape and narrow inside each component — same pattern Starway uses today.

### 2.2 Per-block components (directory: `src/lib/components/blocks/`)

| File                       | Directus collection   | Starway origin? | Brand adaptations required                                                                                                                                     |
| -------------------------- | --------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HeroBlock.svelte`         | `block_hero`          | ✓               | Replace utility color + type scales with DV tokens (Cormorant display + terracotta CTA); adopt `Grain` + `GoldRule` decoratives                                |
| `RichTextBlock.svelte`     | `block_rich_text`     | ✓               | Scoped prose styles using `--dv-color-charcoal` / serif body, `OliveBranch` flourish at top if `variant === 'editorial'`                                       |
| `CardGroupBlock.svelte`    | `block_card_group`    | ✓               | Strip trucking-specific hover effects; keep image-backed variant flag; use ivory/terracotta/sage trio                                                          |
| `TimelineBlock.svelte`     | `block_timeline`      | ✓               | Replace Starway vertical-rule with DV `GoldRule` dividers; smaller year labels in script font                                                                  |
| `TeamBlock.svelte`         | `block_team`          | ✓               | Single-founder-optimized layout (most DV usage is n=1); bio reads as editorial paragraph, not Starway's card grid                                              |
| `EventDetailsBlock.svelte` | `block_event_details` | ✗ (NEW)         | Structured card: eyebrow, date/time/city stack, location note, CTA pill. Anchor via `cta_anchor` to `#rsvp`.                                                   |
| `RsvpFormBlock.svelte`     | `block_rsvp_form`     | ✗ (NEW)         | M4: renders the shell (heading, copy, fields, consent, success/error slots). M5: hooks `enhance` to the `/reserve` form action. No network I/O this milestone. |
| `FaqBlock.svelte`          | `block_faq`           | ✗ (NEW)         | Accordion pattern. Wraps child `block_faq_items` as `<details>`/`<summary>` for progressive-enhancement-first a11y.                                            |

For the 5 Starway-origin blocks, the work is **scoped CSS replacement**,
not structural rewrite — the markup, prop shapes, data flow, and M2A
resolution are all compatible. That's the payoff of the shared schema.

### 2.3 Navigation (M4b)

Replace the placeholder header ribbon with:

- `SiteNav.svelte` — sticky, 64–72px tall desktop, loses its border on scroll to blend into the hero.
  - Desktop (≥ 48em): horizontal link list (sections of the homepage as anchor links: `#about`, `#experience`, `#event`, `#rsvp`, `#faq`).
  - Mobile (< 48em): `HamburgerButton.svelte` → toggles `NavDrawer.svelte`.
- `NavDrawer.svelte` — off-canvas drawer (slides in from the right), `aria-modal`, focus-trapped, `Esc`-to-close, body-scroll-lock while open.
- Inherit Starway's breakpoint mixin pattern (`em`-based, BEM class naming). **Direct import from Starway is not permitted** (Rule Zero: repo-local first). Copy the `$styles/breakpoints.css` file shape; extract into `bravobyte-frontend-core` after a third client needs it.

### 2.4 Footer (M4b)

Keep the current `+layout.svelte` footer structurally; only refresh copy
to reference `reserve` + `hello@dolcevitact.com`. A proper `SiteFooter.svelte`
component extraction can wait until the layout grows past ~3 blocks.

## 3. Directory & naming

```
src/lib/components/
  blocks/
    BlockRenderer.svelte          — NEW (M4a-1)
    types.ts                      — NEW (M4a-1)
    HeroBlock.svelte              — NEW (M4a-2)
    RichTextBlock.svelte          — NEW (M4a-2)
    CardGroupBlock.svelte         — NEW (M4a-2)
    TimelineBlock.svelte          — NEW (M4a-2)
    TeamBlock.svelte              — NEW (M4a-2)
    EventDetailsBlock.svelte      — NEW (M4a-3)
    RsvpFormBlock.svelte          — NEW (M4a-3, shell only; M5 wires submit)
    FaqBlock.svelte               — NEW (M4a-3)
  navigation/
    SiteNav.svelte                — NEW (M4b)
    NavDrawer.svelte              — NEW (M4b)
    HamburgerButton.svelte        — NEW (M4b)
  decor/                          — unchanged (Grain, GoldRule, OliveBranch from M3)
```

All components use **scoped `<style>` with `@apply`** per
[`bravobyte-ai/rules/tailwind-svelte.md`](../../../bravobyte-ai/rules/tailwind-svelte.md)
and **nested BEM** per the Starway convention — no inline utility
classes in the rendered markup.

## 4. Reusability flags (for `bravobyte-frontend-core` extraction)

Track each as a candidate. Extraction happens when a third client
requests the same shape — until then, stay client-local per Rule Zero.

| Candidate                                                                                                         | Why it's shared-candidate                                                                                             | Extraction trigger                                                      |
| ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `BlockRenderer` registry pattern                                                                                  | Identical shape already in Starway; the registry map is the only delta per client                                     | 3rd client adopts blocks                                                |
| `HeroBlock`, `RichTextBlock`, `CardGroupBlock`, `TimelineBlock`, `TeamBlock` contracts + **un-styled** primitives | Markup structure + prop shape are shared; only CSS is client-local                                                    | 3rd client adopts blocks                                                |
| `NavDrawer` + `HamburgerButton` (body-scroll-lock, focus trap, `aria-modal`)                                      | Pure a11y utilities, zero brand opinions                                                                              | 2nd use (Starway also needs a drawer for complex nav — already partial) |
| `breakpoints.css` em-based custom media set                                                                       | Identical values across clients; zero brand variance                                                                  | 3rd client adopts Tailwind v4                                           |
| `EventDetailsBlock` + `RsvpFormBlock` + `FaqBlock` + `FaqItem` shells                                             | DV-first but the contracts are already shared in `@bravobyte/types` per M1; the unstyled shells are the next layer up | 2nd client needs event/RSVP/FAQ flows                                   |

## 5. Testing plan

| Layer       | Coverage                                                                                                         | Tool                                 |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Component   | Each block renders with a minimal prop set; `BlockRenderer` skips unknown collections without throwing           | `vitest` + `@testing-library/svelte` |
| Integration | `/` renders 9 blocks when Directus returns the seeded homepage; falls back to M3 placeholder on load failure     | `vitest` (SSR smoke)                 |
| A11y        | `NavDrawer` traps focus, restores on close, `Esc` closes; `FaqBlock` keyboard-navigable via `<details>`          | `@axe-core/playwright`               |
| Visual      | No blank states, no utility-class leak, fonts load (Cormorant, Tangerine, Inter); Lighthouse ≥ 95 deferred to M6 | Playwright + manual preview          |

Unit tests are optional for pure presentational components where the
markup and prop shape are the full contract; SSR + a11y smoke tests are
mandatory per M0's CI gate.

## 6. Verification checklist

Before marking M4 done in `spec.md`:

- [ ] `pnpm check` clean (svelte-check + tsc)
- [ ] `pnpm lint` clean (prettier + eslint)
- [ ] `pnpm test` green (unit + SSR smoke)
- [ ] `pnpm test:e2e` green for the homepage happy path
- [ ] Preview deploy on Vercel renders the 9 blocks with correct fonts + palette + grain
- [ ] `BlockRenderer` falls back silently when Directus returns an empty or partial block set (existing M3 fallback preserved)
- [ ] SiteNav is keyboard-navigable, focus-visible outlines match design tokens, drawer passes axe-core
- [ ] No inline Tailwind utility classes in any block component markup (per `tailwind-svelte.md`)
- [ ] `.docs/operations/cms-triage.md` (to be added to DV) or `spec.md` lists any content TODOs left for the editor

## 7. Story sequence (recommended PR order)

1. **M4a-1 — "BlockRenderer shell + types"** (tiny, unblocks the rest)
2. **M4a-2 — "Shared-candidate blocks (hero, rich_text, card_group, timeline, team) with DV branding"** — largest PR, paired with a `.docs/architecture/block-styling-guide.md` that records the CSS-token mapping
3. **M4a-3 — "DV-first blocks (event_details, rsvp_form shell, faq)"** — no form submit yet
4. **M4b — "Sticky editorial nav + mobile drawer + footer polish"**
5. **M4 close — spec bump, re-audit display-metadata on the three DV-first collections (cross-reference [`bravobyte-ai/rules/directus-collection-display.md`](../../../bravobyte-ai/rules/directus-collection-display.md))**

After M4 closes, M5 picks up the `/reserve` form action with the
now-present (thanks to the M2 verification Public-policy fix) anonymous
`POST /items/rsvp_submissions` permission.

## 8. Cross-references

- Spec (single source of truth): [`../../spec.md`](../../spec.md)
- M2 runlog: [`../operations/m2-verification.md`](../operations/m2-verification.md)
- Runbook (migration): [`../operations/directus-migration.md`](../operations/directus-migration.md)
- ADR: [`../adrs/0001-dolce-vita-architecture.md`](../adrs/0001-dolce-vita-architecture.md)
- Starway inheritance targets: `starwaytrasporti-web/src/lib/components/blocks/` (canonical BlockRenderer shape)
- Shared rules: [`../../../bravobyte-ai/rules/tailwind-svelte.md`](../../../bravobyte-ai/rules/tailwind-svelte.md), [`../../../bravobyte-ai/rules/directus-collection-display.md`](../../../bravobyte-ai/rules/directus-collection-display.md), [`../../../bravobyte-ai/rules/directus-collection-permissions.md`](../../../bravobyte-ai/rules/directus-collection-permissions.md), [`../../../bravobyte-ai/rules/reusability.md`](../../../bravobyte-ai/rules/reusability.md)
