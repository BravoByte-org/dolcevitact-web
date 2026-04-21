# M5 — RSVP intake

The `RsvpFormBlock` posts to the homepage `?/rsvp` form action. The flow is
server-side only — the Directus App Service token, Resend API key, and
notification email never touch the browser.

## Request lifecycle

1. **Browser** — `use:enhance` posts `FormData` to `?/rsvp`; the submit
   button switches to "Sending…".
2. **SvelteKit action** (`src/routes/(app)/+page.server.ts`)
   - Parses `FormData` → plain object
   - Validates with `rsvpFormSchema` (`src/lib/server/rsvp.ts`)
   - On failure → `fail(400, { rsvp: { ok: false, fieldErrors, values } })`
     and the form re-renders with inline error copy + preserved values.
   - On honeypot hit (`_hp` non-empty) → returns `{ ok: true }` without
     any side effects, so bots see the success state and never learn
     they were filtered.
3. **Directus write** — `createRsvpSubmission` resolves the `sites.id`
   for `DIRECTUS_SITE_KEY` (cached in module scope) and creates an
   `rsvp_submissions` row with `status: 'new'` and `source:
<PUBLIC_SITE_URL>/#rsvp`. The App Service token (editor policy) is
   authorized; we do not rely on Public `create` at this layer.
4. **Email notification** (`src/lib/server/email.ts`)
   - Lazy Resend client (`RESEND_API_KEY` resolved once)
   - Sends HTML + plain-text to `RSVP_NOTIFY_EMAIL`
   - **Best-effort**: failures are logged and swallowed. A 4xx from
     Resend never invalidates a successful Directus write.
5. **Browser** — the page rerenders with `form.rsvp.ok === true`; the
   `RsvpFormBlock` swaps to the success state (`success_title` +
   `success_body` from the CMS row) with `aria-live="polite"`.

## Spam posture

Honeypot field (`_hp`) — visually and a11y-hidden, silently accepted when
filled. No captcha in v1. If spam pressure rises we can add server-side
rate limiting keyed on `request.getClientAddress()` via Vercel KV or
Upstash Redis — out of scope for M5.

## Env contract

| Variable            | Scope  | Purpose                                                                    |
| ------------------- | ------ | -------------------------------------------------------------------------- |
| `DIRECTUS_TOKEN`    | server | Existing App Service token — also authorizes `rsvp_submissions` write      |
| `DIRECTUS_SITE_KEY` | server | Resolves `sites.id` for the `site` FK on submissions (default `dolcevita`) |
| `RESEND_API_KEY`    | server | Resend API key (optional — absence disables email but preserves writes)    |
| `RSVP_NOTIFY_EMAIL` | server | Internal recipient for new-RSVP notifications                              |
| `RSVP_NOTIFY_FROM`  | server | `From:` header used by Resend (defaults to `reservations@dolcevitact.com`) |
| `PUBLIC_SITE_URL`   | shared | Used to build the `source` attribution string                              |

## Degradation matrix

| Failure                           | Directus write | Email notification | User sees     |
| --------------------------------- | -------------- | ------------------ | ------------- |
| Validation error (bad email etc.) | skipped        | skipped            | Inline errors |
| Honeypot triggered                | skipped        | skipped            | Success UI    |
| Site UUID cannot be resolved      | skipped        | skipped            | Generic error |
| Directus write fails              | failed         | skipped            | Generic error |
| Resend API missing / 5xx          | succeeded      | logged-and-skipped | Success UI    |

## Tests

- `src/lib/server/rsvp.test.ts` — Vitest coverage of the Zod schema
  (trim, lowercase, empty-optional coercion, honeypot reject, length
  caps, required fields).

## Repo placement (Rule Zero)

- Zod schema + Directus write helper: **client-local** (lives in
  `dolcevitact-web`). When a second client reuses the same RSVP shape,
  promote the schema and helper to `bravobyte-data-core`.
- Resend email wrapper: **shared-candidate**. Stays here until a second
  client needs transactional email; then promote to
  `bravobyte-frontend-core` or a new `bravobyte-email` package.
- Success/error UI, honeypot pattern: **client-local** presentation.
