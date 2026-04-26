# dolcevitact.com — Product Spec

> **Owner:** BravoByteLLC for the Dolce Vita brand
> **Domain:** https://dolcevitact.com (the `ct` suffix is a domain-availability quirk — the brand is "Dolce Vita")
> **First chapter:** Dolce Vita Baby Circle
> **Brand architecture:** branded house, paths-first (see [`.docs/adrs/0002-brand-architecture.md`](./.docs/adrs/0002-brand-architecture.md))
> **Status:** M0–M5 complete. Brand rename + ADR 0002 merged (PR #30). Canonical brand lockup (PR #33). **M6 Launch in progress** — M6a analytics (PR #34) + M6b SEO (PR #35) + M6c a11y/perf in flight; remaining: M6d (security headers) → M6e (release cut).
> **Last Updated:** April 25, 2026

This is the single source of truth for what `dolcevitact-web` is, why it exists,
and where we are. It must stay under 500 lines and reference detail files
rather than duplicating them.

---

## 1. Project overview

**Dolce Vita** is a premium Italian-inspired lifestyle brand based in Stamford,
Connecticut. The first chapter is **Dolce Vita Baby Circle**, a warm, refined
mama-and-bambino class led by a native Italian speaker, teacher, and mom.
Future chapters under consideration include cucina (homecooked Italian food
service), online classes, and a newsletter.

`dolcevitact-web` is the marketing single-page application that launches the
brand, introduces the Baby Circle, and converts visitors into RSVPs. It is
architected as a branded-house portal: the homepage currently _is_ the Baby
Circle; new offerings will live at sibling paths (`/cucina`, `/classes`, etc.)
on the same domain rather than as separate sites — see
[`.docs/adrs/0002-brand-architecture.md`](./.docs/adrs/0002-brand-architecture.md).

**Tech stack:** SvelteKit 2 (Svelte 5 runes) · TypeScript · Tailwind v4 ·
Vitest · Playwright · Directus (shared multi-site, key `dolcevita`) ·
Resend · Vercel.

**Shared dependencies:**

- `@bravobyte/types` — shared content contracts. Will be added in M1 once the
  Dolce Vita contracts are extracted and a Phase-1 distribution path is in
  place (npm workspace at the BravoByte root or a private registry).
- Future: `@bravobyte/frontend-core`, `@bravobyte/data-core`

---

## 2. Workflow

This repo follows the [BravoByte workflow](../bravobyte-ai/spec.md):
Strategize → Architect → Verify plan → Build → Verify code → Capture → Update.

Personas, rules, and playbooks are inherited from the workspace-level
configuration. Repo-local rules live in `.cursor/rules/` (when added).

---

## 3. Repo placement (Rule Zero)

| Concern                                                     | Repo                                                                      | Why                        |
| ----------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------- |
| Brand copy, palette, typography, imagery, page composition  | this repo                                                                 | client-local               |
| Smooth-scroll SPA layout, sticky nav, grain texture         | this repo first → `bravobyte-frontend-core` once a second client needs it | shared-candidate           |
| FAQ / event-details / RSVP-form / RSVP-submission contracts | `bravobyte-types`                                                         | shared-core, extracted now |
| Directus integration helpers, site-scoped queries           | this repo first → `bravobyte-data-core` later                             | shared-candidate           |

---

## 4. Sections

The homepage is a single Directus `pages` row composed of M2A blocks. All
section blocks shipped through M4a/b/c. The brand mark above the hero ships
via the canonical `BrandLockup` component (M6, PR #33).

| Section                  | Block                               | Status                  |
| ------------------------ | ----------------------------------- | ----------------------- |
| Hero                     | `block_hero` + `BrandLockup`        | done (M4a/c, M6 lockup) |
| About the experience     | `block_card_group`                  | done (M4a/c)            |
| How it works             | `block_timeline`                    | done (M4a/c)            |
| Who it's for             | `block_card_group`                  | done (M4a/c)            |
| Founder                  | `block_team` (single member)        | done (M4a/c)            |
| Event details            | `block_event_details`               | done (M1/M2/M4)         |
| RSVP                     | `block_rsvp_form` + `?/rsvp` action | done (M1/M2/M5)         |
| Brand story / philosophy | `block_rich_text`                   | done (M4a/c)            |
| FAQ                      | `block_faq` + `block_faq_items`     | done (M1/M2/M4)         |
| Sticky nav + footer      | `SiteNav` + `SiteFooter`            | done (M4b)              |

---

## 5. Milestones

| ID  | Name                     | Status      | GitHub Milestone                                                   | Notes                                                                                                                                                                                                                                                                                                                                                                            |
| --- | ------------------------ | ----------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M-1 | GitHub workspace         | done        | —                                                                  | Repo, labels, templates, board, epics, stories                                                                                                                                                                                                                                                                                                                                   |
| M0  | Foundation               | done        | [#1](https://github.com/BravoByte-org/dolcevitact-web/milestone/1) | Scaffold + Directus `dolcevita` site row + Vercel + DNS (DNS verified by founder)                                                                                                                                                                                                                                                                                                |
| M1  | Shared content contracts | done        | [#2](https://github.com/BravoByte-org/dolcevitact-web/milestone/2) | `@bravobyte/types` extension shipped + consumed                                                                                                                                                                                                                                                                                                                                  |
| M2  | Directus schema          | done        | [#3](https://github.com/BravoByte-org/dolcevitact-web/milestone/3) | Idempotent migration applied + verified Apr 21 2026 (runlog: [`.docs/operations/m2-verification.md`](./.docs/operations/m2-verification.md))                                                                                                                                                                                                                                     |
| M3  | Design system            | done        | [#4](https://github.com/BravoByte-org/dolcevitact-web/milestone/4) | Tokens, decoratives, motion (PR #16)                                                                                                                                                                                                                                                                                                                                             |
| M4  | Sections                 | done        | [#5](https://github.com/BravoByte-org/dolcevitact-web/milestone/5) | M4a block shell (PR #20), M4b sticky nav + drawer (PR #23), M4c full styling + a11y smoke (PR #26). Styling guide: [`.docs/architecture/block-styling-guide.md`](./.docs/architecture/block-styling-guide.md)                                                                                                                                                                    |
| M5  | RSVP                     | done        | [#6](https://github.com/BravoByte-org/dolcevitact-web/milestone/6) | `?/rsvp` form action → Zod validate → Directus `rsvp_submissions` write → Resend notification + honeypot + success/error UI (PR #28). Brand rename promoted via PR #30 (recovery from stranded stack). Plan: [`.docs/architecture/m5-rsvp-plan.md`](./.docs/architecture/m5-rsvp-plan.md)                                                                                        |
| M6  | Launch                   | in progress | [#7](https://github.com/BravoByte-org/dolcevitact-web/milestone/7) | Brand lockup (PR #33), M6a analytics (PR #34), M6b SEO (PR #35). M6c: full-page axe + keyboard smoke, non-blocking Google Fonts, `:focus-visible`, terracotta CTA contrast (AA), Lighthouse CI (`lighthouserc.cjs` + `perf:lhci`), CI job E2E a11y — addresses #12 part 2. Remaining: M6d `vercel.json` security headers (#13 part 1) → M6e release cut + RSVP smoke (#13 + #24) |

GitHub Project board: [BravoByte/Dolce Vita Board](https://github.com/orgs/BravoByte-org/projects/4)

---

## 6. Brand expression (summary)

- Warm ivory paper, terracotta, muted sage, sand taupe, restrained gold,
  soft charcoal text.
- Display serif (Cormorant Garamond) + script accent (Tangerine) +
  refined sans body (Inter).
- Subtle paper grain background, gold rule dividers, olive-branch decoratives.
- Editorial layout, generous whitespace, gentle motion only.
- No childish, cartoonish, or generic-daycare visual cues.

Full design notes: `.docs/architecture/design-system.md` (added in M3).

---

## 7. Out of scope for v1 (parked)

- Class calendar / recurring events
- Testimonials block
- Blog / journal
- Bilingual EN/IT (Directus translations layer — structural change not required)
- Sibling brand chapters (cucina, online classes, newsletter) — covered by
  Phase 2 of the brand-architecture ADR; ship after Baby Circle proves out.

---

## 8. Architecture decisions

| ADR  | Title                                                                                     | Status   |
| ---- | ----------------------------------------------------------------------------------------- | -------- |
| 0001 | [Dolce Vita delivery architecture](./.docs/adrs/0001-dolce-vita-architecture.md)          | Accepted |
| 0002 | [Brand architecture: branded house, paths-first](./.docs/adrs/0002-brand-architecture.md) | Accepted |

---

## 9. Operational links

| Resource            | URL                                              |
| ------------------- | ------------------------------------------------ |
| Production          | https://dolcevitact.com                          |
| Repo                | https://github.com/BravoByte-org/dolcevitact-web |
| Project board       | https://github.com/orgs/BravoByte-org/projects/4 |
| Directus site key   | `dolcevita`                                      |
| Email notifications | `RSVP_NOTIFY_EMAIL` (Resend)                     |
