# dolcevitact.com — Product Spec

> **Owner:** BravoByteLLC for Dolce Vita CT
> **Domain:** https://dolcevitact.com
> **Status:** M2 Directus schema — migration script + app-side plumbing in review; Directus admin-token run pending
> **Last Updated:** April 21, 2026

This is the single source of truth for what `dolcevitact-web` is, why it exists,
and where we are. It must stay under 500 lines and reference detail files
rather than duplicating them.

---

## 1. Project overview

Dolce Vita CT is a premium Italian-inspired mom & baby experience based in
Stamford, Connecticut. The first offering is **Dolce Vita Baby Circle**, a
warm, refined class led by a native Italian speaker, teacher, and mom.

`dolcevitact-web` is the marketing single-page application that introduces the
brand, explains the experience, and converts visitors into RSVPs.

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

The homepage is a single Directus `pages` row composed of M2A blocks:

| Section                  | Block                                 | Status             |
| ------------------------ | ------------------------------------- | ------------------ |
| Hero                     | `block_hero`                          | pending (M2/M4)    |
| About the experience     | `block_card_group`                    | pending            |
| How it works             | `block_timeline`                      | pending            |
| Who it's for             | `block_card_group`                    | pending            |
| Founder                  | `block_team` (single member)          | pending            |
| Event details            | `block_event_details` (NEW)           | pending (M1/M2)    |
| RSVP                     | `block_rsvp_form` (NEW)               | pending (M1/M2/M5) |
| Brand story / philosophy | `block_rich_text`                     | pending            |
| FAQ                      | `block_faq` + `block_faq_items` (NEW) | pending (M1/M2)    |
| Footer                   | layout component                      | pending            |

---

## 5. Milestones

| ID  | Name                     | Status      | GitHub Milestone                                                   | Notes                                          |
| --- | ------------------------ | ----------- | ------------------------------------------------------------------ | ---------------------------------------------- |
| M-1 | GitHub workspace         | done        | —                                                                  | Repo, labels, templates, board, epics, stories |
| M0  | Foundation               | in progress | [#1](https://github.com/BravoByte-org/dolcevitact-web/milestone/1) | Scaffold + Directus site row + Vercel + DNS    |
| M1  | Shared content contracts | in review   | [#2](https://github.com/BravoByte-org/dolcevitact-web/milestone/2) | `@bravobyte/types` extension (types PR #2)     |
| M2  | Directus schema          | in review   | [#3](https://github.com/BravoByte-org/dolcevitact-web/milestone/3) | Idempotent migration script + app plumbing     |
| M3  | Design system            | done        | [#4](https://github.com/BravoByte-org/dolcevitact-web/milestone/4) | Tokens, decoratives, motion (PR #16 merged)    |
| M4  | Sections                 | planned     | [#5](https://github.com/BravoByte-org/dolcevitact-web/milestone/5) | 9 sections + nav + footer                      |
| M5  | RSVP                     | planned     | [#6](https://github.com/BravoByte-org/dolcevitact-web/milestone/6) | Form action + Resend                           |
| M6  | Launch                   | planned     | [#7](https://github.com/BravoByte-org/dolcevitact-web/milestone/7) | SEO, a11y, deploy                              |

GitHub Project board: [BravoByte/Dolce Vita CT Board](https://github.com/orgs/BravoByte-org/projects/4)

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

---

## 8. Operational links

| Resource            | URL                                              |
| ------------------- | ------------------------------------------------ |
| Production          | https://dolcevitact.com                          |
| Repo                | https://github.com/BravoByte-org/dolcevitact-web |
| Project board       | https://github.com/orgs/BravoByte-org/projects/4 |
| Directus site key   | `dolcevita`                                      |
| Email notifications | `RSVP_NOTIFY_EMAIL` (Resend)                     |
