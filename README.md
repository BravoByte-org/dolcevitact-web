# dolcevitact-web

Marketing site for **Dolce Vita CT** at [dolcevitact.com](https://dolcevitact.com),
a premium Italian-inspired mom & baby experience in Stamford, Connecticut.
Owned and operated by **BravoByteLLC**.

Part of the [BravoByte](../bravobyte-ai) ecosystem. This is a **delivery
repo** — it composes shared modules and stays thin. See
[`spec.md`](./spec.md) for current status.

---

## Stack

- **SvelteKit 2** with Svelte 5 runes
- **TypeScript** strict mode
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Directus** (shared BravoByte multi-site instance, key `dolcevita`)
- **Resend** for RSVP notification email
- **Vercel** hosting via `@sveltejs/adapter-vercel`
- **Vitest** + **Playwright** for testing

---

## Getting started

```bash
pnpm install
cp .env.example .env       # then fill in DIRECTUS_TOKEN + RESEND_API_KEY
pnpm dev
```

Open http://localhost:5173.

### Useful scripts

| Script          | What it does                                               |
| --------------- | ---------------------------------------------------------- |
| `pnpm dev`      | Start the dev server                                       |
| `pnpm build`    | Production build (Vercel adapter)                          |
| `pnpm preview`  | Preview the production build on `:4002`                    |
| `pnpm check`    | Type-check the project (`svelte-kit sync && svelte-check`) |
| `pnpm lint`     | Prettier check + ESLint                                    |
| `pnpm format`   | Prettier write                                             |
| `pnpm test`     | Vitest unit tests                                          |
| `pnpm test:e2e` | Playwright end-to-end tests                                |

---

## Repo layout

```
src/
  app.css              # Tailwind v4 entry + design-token import
  app.html             # SvelteKit document shell
  hooks.server.ts
  lib/
    components/        # Svelte components (sections, blocks, navigation, decor)
    styles/            # tokens.css, fonts.css
    util/              # cms helpers, formatters
    server/            # Directus client (server-only)
  routes/
    +layout.svelte     # global head, fonts, layout
    +page.svelte       # homepage (single-page composition)
    reserve/           # RSVP form action (M5)
static/                # robots.txt, og-image, favicon
.github/
  ISSUE_TEMPLATE/      # 11 templates copied from bravobyte-platform
  workflows/ci.yml     # CI (will refactor to call platform reusable workflow)
.ai/                   # Repo-specific AI rules (inherits from workspace)
.cursor/               # Cursor-native rules (.mdc)
.docs/                 # Architecture, ADRs, operations
spec.md                # Single source of truth (≤500 lines)
```

---

## Workflow

This repo participates in the [BravoByte workflow](../bravobyte-ai/spec.md):
Strategize → Architect → Verify plan → Build → Verify code → Capture →
Update.

Issues are tracked on the
[BravoByte/Dolce Vita CT Board](https://github.com/orgs/BravoByte-org/projects/4).
Work follows the milestones M-1 → M6 documented in
[`spec.md`](./spec.md#5-milestones).

PRs use squash-merge with conventional titles per the
[git-history-and-merge-policy](../bravobyte-ai/playbooks/git-history-and-merge-policy.md).

---

## License

Proprietary © BravoByteLLC. All rights reserved.
