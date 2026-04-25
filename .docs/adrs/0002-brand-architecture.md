# ADR 0002 — Brand architecture: branded house, paths-first

- **Status:** Accepted
- **Date:** 2026-04-25
- **Deciders:** Lion (with Architect persona: Orion)
- **Related:** [ADR 0001 — Delivery architecture](./0001-dolce-vita-architecture.md)

## Context

The original brief framed `dolcevitact.com` as a single-purpose marketing site
for "Dolce Vita CT — a premium Italian-inspired mom & baby experience". On
April 25 2026, the founder clarified two important facts that change how the
site should be modeled:

1. **The brand name is "Dolce Vita", not "Dolce Vita CT".** The `ct` suffix
   is purely a domain-availability artifact (Connecticut state code) — the
   apex `dolcevita.com` was unavailable at registration time.
2. **The Baby Circle is the first chapter of a larger brand,** not the brand
   itself. Future chapters under consideration include:
   - **Dolce Vita Cucina** — homecooked Italian food service
   - **online classes** — Italian-curious adults
   - a **newsletter** / lifestyle journal
   - additional in-person experiences

This raised an architecture question that needed to be answered _before_ the
M6 launch and certainly before any second offering ships:

> When the second offering launches, where does it live?
> A separate domain? A subdomain? A new path on the same site?

We had three credible options:

| Option               | Example                              | Cost                               | SEO          | Ops                                      | Customer mental model             |
| -------------------- | ------------------------------------ | ---------------------------------- | ------------ | ---------------------------------------- | --------------------------------- |
| Separate domains     | `dolcevitababycircle.com` + new TLDs | High (registrar, DNS, SEO restart) | Fragmented   | N projects, N CMS sites, N analytics     | "Different companies"             |
| Subdomain per brand  | `babycircle.dolcevitact.com`         | Medium                             | Diluted      | Still N projects, N CMS sites            | "Same family, different products" |
| Paths on same domain | `dolcevitact.com/baby-circle`        | Low (one project, one CMS site)    | Consolidated | One project, one CMS site, one analytics | "One brand, multiple offerings" ✓ |

For a startup brand at this stage — pre-revenue on the first offering, with
unproven appetite for chapters two and three — the operational and SEO cost of
splitting the brand surface is hard to justify.

## Decision

**Adopt a branded-house architecture rooted at `dolcevitact.com`, with new
offerings added as paths rather than subdomains or separate domains.**

Concretely:

1. **One domain, one brand.** `dolcevitact.com` is the canonical home of the
   Dolce Vita brand. The apex hosts the parent-brand surface and the current
   live offering.
2. **Paths-first for new offerings.** New chapters launch at sibling paths
   (`/cucina`, `/classes`, `/journal`, etc.) on the same domain, in the same
   SvelteKit app, backed by the same Directus `dolcevita` site.
3. **Naming hierarchy in copy:**
   - Parent brand: **Dolce Vita** (used in framing copy, hero script
     accents, footer, email signatures).
   - Offering name: **Dolce Vita Baby Circle**, **Dolce Vita Cucina**, etc.
     (used in headlines, page titles, SEO titles, navigation).
   - Never "Dolce Vita CT" in customer-facing copy. The `ct` suffix only
     appears in the literal URL.
4. **Subdomains are reserved for non-brand surfaces.** Examples that _would_
   justify a subdomain in the future:
   - `shop.dolcevitact.com` — a separate e-commerce platform that requires
     its own framework, headless backend, or PCI surface.
   - `cms.dolcevitact.com` / `app.dolcevitact.com` — admin or app surfaces.
     We do not currently need these (we share `cms.bravobyte.co`).
   - A spin-off brand that genuinely targets a different audience and breaks
     the parent-brand promise.

## Phased growth plan

The architecture is implemented in three phases that match the business
trajectory; we do not pre-build for phases that may never arrive.

### Phase 1 — now (M0–M6)

- `dolcevitact.com/` _is_ the Baby Circle landing page.
- The Directus `pages` row at `slug=/` composes the Baby Circle blocks.
- The hero, footer, and SEO frame the parent brand ("Dolce Vita") with the
  offering name ("Baby Circle") in headlines and titles.
- No `/baby-circle` path yet — it would be a redundant duplicate of `/`.

### Phase 2 — second offering ships (e.g. Cucina)

When the second offering moves from idea to commitment, we restructure
without breaking SEO:

- Move the Baby Circle homepage content to `slug=/baby-circle` (with a
  301 redirect from `/` if we elect to convert `/` into a brand portal).
- Either:
  - **Option A (preferred):** Promote `/` to a thin **brand portal** that
    introduces Dolce Vita and links to each chapter. Each chapter lives at
    `/baby-circle`, `/cucina`, etc. Each is its own Directus `pages` row.
  - **Option B:** Keep `/` as the Baby Circle home (most-trafficked), add
    `/cucina` as a sibling. Use this if Baby Circle is still ~100% of
    traffic and a portal would feel hollow.
- Reuse the existing SvelteKit `(app)` route group, BlockRenderer, and
  Directus block library wholesale. Each chapter is content, not code.
- Navigation seed (`scripts/directus/seed-navigation.mjs`) gains a top-level
  "Offerings" group or chapter-specific items.

### Phase 3 — maturity (optional)

- If a chapter outgrows the marketing-site shape (e.g. Cucina becomes a
  full-blown ordering platform), promote it to its own subdomain
  (`shop.dolcevitact.com`) with the marketing landing remaining at
  `/cucina` linking to the platform.
- Re-evaluate `dolcevita.com` apex acquisition once revenue justifies it;
  if acquired, mirror content and 301 from `dolcevitact.com`.

## Defensive actions (recommended)

These are cheap insurance, not architectural commitments:

- Register sibling domains as defensive holds, redirecting to
  `dolcevitact.com`: `dolcevita.life`, `dolcevitalife.com`,
  `dolcevita.kitchen`, etc. (founder's call; not required by this ADR).
- Reserve common social handles under "DolceVita" + a chapter qualifier
  (e.g. `@dolcevita.babycircle`).

## Consequences

### Positive

- **One SEO surface to grow.** Authority compounds on `dolcevitact.com`
  rather than splitting across N domains.
- **One project to operate.** One Vercel project, one Directus site, one
  analytics property, one CMS authoring experience, one design system.
- **Lean-startup friendly.** Adding a chapter is content work, not
  infrastructure work.
- **Customer mental model is consistent.** "Dolce Vita has a Baby Circle and
  a Cucina" reads more naturally than "Dolce Vita Baby Circle and Dolce
  Vita Cucina are separate companies".
- **Cheap to reverse.** If a chapter genuinely needs to spin out, we move
  it to a subdomain with 301s and lose very little.

### Negative

- The `dolcevitact.com` URL is suboptimal forever. The `ct` reads like a
  Connecticut suffix to anyone who knows US state codes; outside CT it
  reads like noise. We mitigate by never typing "Dolce Vita CT" anywhere
  customer-visible — copy always says "Dolce Vita" and the URL is just
  the URL.
- A future spin-off that needs a clean break has more URL surface to
  redirect. Acceptable given how unlikely this is at the current stage.

### Trade-offs

- We accept that early SEO traffic to `/` will (in Phase 2) need to either
  redirect or stay-and-be-the-Baby-Circle. We will decide between
  Option A (brand portal at `/`) and Option B (Baby Circle at `/`) at the
  time, based on the traffic split and the strategic story we want to tell.

## How this ADR shows up in the codebase

- `src/routes/(app)/+layout.svelte` — site title defaults to "Dolce Vita
  Baby Circle"; meta description frames it as the first chapter of Dolce
  Vita.
- `src/routes/(app)/+page.svelte` — fallback hero uses parent brand
  ("Dolce Vita") in script accent, with the Baby Circle named in the
  headline.
- `src/lib/components/navigation/SiteNav.svelte`,
  `SiteFooter.svelte` — same naming convention.
- `scripts/directus/migrate.mjs` — `sites.name = "Dolce Vita"`,
  `sites.title = "Dolce Vita Baby Circle"`.
- `scripts/directus/update-brand.mjs` — targeted, idempotent script that
  updates the existing CMS rows to match the conventions in this ADR.
  Created so we don't have to re-run the full `migrate.mjs --seed` (which
  would only operate on a fresh database anyway).
- `.cursor/rules/dolcevita-project.mdc` — the brand/offering/domain
  decision tree and naming conventions are now part of the always-applied
  project rules.

## References

- ADR 0001 — Delivery architecture
- Workspace [`spec.md`](../../spec.md)
- Founder conversation, 2026-04-25 (transcript on file)
