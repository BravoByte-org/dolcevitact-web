# ADR 0001 — Dolce Vita delivery architecture

- **Status:** Accepted
- **Date:** 2026-04-21
- **Last revised:** 2026-04-25 (brand naming clarified; superseded in spirit by [ADR 0002](./0002-brand-architecture.md))
- **Deciders:** Lion (Architect persona: Orion)
- **Context:** Initial scaffold of `dolcevitact-web` for the dolcevitact.com launch.

## Context

BravoByte received a second client engagement, the **Dolce Vita** brand
(launching with the Dolce Vita Baby Circle offering at `dolcevitact.com` —
the `ct` suffix is a domain-availability quirk, not part of the brand).
The brand requires a boutique, premium marketing single-page application
backed by a content management system, with an RSVP-capture flow as the
primary conversion goal. Brand architecture decisions (paths-first vs.
subdomains, naming hierarchy) are recorded separately in
[ADR 0002](./0002-brand-architecture.md).

The original brief proposed React/Next.js. The BravoByte house stack is
SvelteKit + Tailwind + TypeScript + Directus, already in production at
[`starwaytrasporti-web`](https://github.com/BravoByte-org/starwaytrasporti-web).

## Decision

1. **Stack:** SvelteKit 2 (Svelte 5 runes) + TypeScript + Tailwind v4 +
   `@sveltejs/adapter-vercel`. Matches the BravoByte house stack and the
   shared-core extraction roadmap (`bravobyte-frontend-core`,
   `bravobyte-data-core`).

2. **CMS from day one:** A new row in the shared Directus `sites` collection
   (`key=dolcevita`). All page content authored as a single `pages` row whose
   `blocks` M2A array drives the section composition. No hardcoded copy.

3. **New shared content contracts in `bravobyte-types`:** `block_faq`,
   `block_faq_items`, `block_event_details`, `block_rsvp_form`, and
   `rsvp_submission`. Extracted now (rather than later) because every future
   client site is highly likely to need FAQ + event + RSVP shapes.

4. **RSVP submission flow:** SvelteKit form action at `/reserve`. Validates
   with Zod, applies a honeypot + IP rate-limit, writes to Directus
   `rsvp_submissions` via the App Service token, and sends a notification
   email through Resend. Notification failures are logged but do not block
   the submission.

5. **Hosting:** Vercel, with the apex `dolcevitact.com` and `www` subdomain
   bound to a single project. Production deploys from `main`, preview deploys
   from `next` per `vercel.json`.

6. **Brand-specific code stays here:** The palette, typography, copy,
   imagery, and section composition are client-local and never extracted.
   Generic primitives (smooth-scroll nav, paper-grain utility, gold-rule
   divider, BlockRenderer) live here first and are extracted to
   `bravobyte-frontend-core` once a third client needs them.

## Consequences

- **Positive:** Reuses shared types and infrastructure, accelerates extraction
  of `bravobyte-frontend-core`/`bravobyte-data-core` by exercising them
  through a second consumer, gives editors a familiar Directus authoring
  experience, and keeps the delivery repo thin.
- **Negative:** Diverges from the original Next.js framing in the brief; we
  trade ecosystem familiarity for stack consistency. Acceptable because the
  BravoByte ecosystem is the constraint that matters.
- **Trade-off:** `@bravobyte/types` is consumed via `file:../bravobyte-types`
  during Phase 1; this requires both repos to be cloned side-by-side until
  the private package registry comes online.

## References

- Workspace [`spec.md`](../../../spec.md)
- BravoByte [`new-client-repo.md`](../../../bravobyte-ai/playbooks/new-client-repo.md) playbook
- Plan: `dolcevitact-web-launch_*.plan.md`
