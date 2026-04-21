# M2 — Directus migration verification runlog

One-time record of the first real `node scripts/directus/migrate.mjs --seed`
run against the shared BravoByte Directus instance (`https://cms.bravobyte.co`),
performed on **April 21, 2026**. The script is idempotent, so re-runs are
safe; this file documents the initial apply for audit.

## Steps executed

| #   | Step                                     | Outcome                                                                                                                                                                                                                                |
| --- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Merge [PR #18][pr18]                     | closes the 4-commit dry-run robustness fix chain; all CI green (Install / Lint / Typecheck / Unit / Build / Vercel Preview)                                                                                                            |
| 2   | `--seed --dry-run`                       | Read-only preview: zero creates, zero deletes, ~40 idempotent metadata PATCHes on existing fields + collections + two relation `meta.one_field`/`sort_field` nudges. Confirms the live schema matches what the committed script wants. |
| 3   | `--seed` (real apply)                    | Applied 40+ PATCHes silently (apply mode doesn't print each one). Completed clean; exit 0.                                                                                                                                             |
| 4   | Anonymous `POST /items/rsvp_submissions` | `HTTP 204` (success) — this revealed a bug, see below.                                                                                                                                                                                 |
| 5   | Patch `migrate.mjs` for the bug          | Commit included in this PR; re-ran `--seed --skip-schema` to backfill the missing Public permission. Output: `+ perm create rsvp_submissions on policy abf8a154…`.                                                                     |
| 6   | Re-verify anonymous `POST`               | `HTTP 204` again — now backed by a real Public permission row, not a coincidental Directus default.                                                                                                                                    |

[pr18]: https://github.com/BravoByte-org/dolcevitact-web/pull/18

## Bug found + fixed during verification

**Symptom:** Admin probe showed zero `Public` permission rows on
`rsvp_submissions` after the first real apply, even though the script's
`backfillPermissions` function clearly intended to grant Public `create`
there (see header comment line 31, "Public: create-only on
`rsvp_submissions` (allow-list fields)").

**Root cause:** `findPolicyByName('Public')` (line 729 pre-fix) looked up
the Public policy by the literal string `"Public"`. Directus stores
system policy names as i18n translation keys — the built-in Public policy
is stored as `$t:public_label`. The filter returned an empty array,
`pub` was `null`, and the `if (pub)` guard silently skipped the
permission row. No warning, no failure.

**Impact if un-fixed:** M5 RSVP form submissions would silently return
`403 FORBIDDEN` from every anonymous visitor — a "works in admin,
breaks in prod" class of bug.

**Fix (this PR):**

1. `findPolicyByName` now accepts a variadic list of candidate names
   (first match wins) and is rewritten to fall back through each.
2. The call-site in `backfillPermissions` passes both `'Public'` and
   `'$t:public_label'` and prints a `⚠` warning if neither matches
   (parallel to the existing Published Content Reader warn at line
   723-727).
3. The Apr 21 Directus permissions rule at
   [`bravobyte-ai/rules/directus-collection-permissions.md`](../../../bravobyte-ai/rules/directus-collection-permissions.md)
   gained a "Looking up system policies by name" section codifying the
   pattern — future migration scripts on other clients inherit the fix.

## Live state after M2 close

| Artifact                                    | Status / ID                                                                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `dolcevita` site row                        | `d934e7c1-6b20-4ea8-aaa7-ba7343d43b2c`                                                                            |
| `Dolce Vita Content` editor policy          | `61af0ccc-b1e5-4258-a356-0e0d09e135b2`                                                                            |
| `Dolce Vita Editor` role                    | `19dd94b4-1407-4b5c-b30d-63c414c71a7a`                                                                            |
| `Dolce Vita App Service` user               | `f48174ea-0702-45cc-843f-bc6c2c66b844`                                                                            |
| App Service token (in `.env`)               | valid — `/users/me` returns `HTTP 200`                                                                            |
| `block_faq` + `block_faq_items`             | created, `display_template` = `{{title}}` / `{{question}}`                                                        |
| `block_event_details`                       | created, `display_template` = `{{title}} — {{date}}`                                                              |
| `block_rsvp_form`                           | created, `display_template` = `{{title}}`                                                                         |
| `rsvp_submissions`                          | created, `display_template` = `{{name}} — {{email}}`, archive_field=`status` archive_value=`cancelled`            |
| `page_blocks` M2A `one_allowed_collections` | includes all 3 new block parents + the pre-existing 8                                                             |
| Placeholder homepage                        | `a92a946c-d116-4abe-b143-cd084f2eff20`, 9 blocks                                                                  |
| Published Content Reader → read             | all 4 new block collections                                                                                       |
| Dolce Vita Content (editor) → CRU           | all 4 new block collections, `rsvp_submissions` R+U only                                                          |
| **Public → create on `rsvp_submissions`**   | backfilled after the policy-name-fix re-run (allow-list: site/name/email/phone/baby_age/message/event_ref/source) |

## Not applied (intentional)

- **en-US / client-locale field translations** — per
  `spec.md §7 Out of scope for v1`, Dolce Vita is English-only at launch.
  The rule at `bravobyte-ai/rules/directus-collection-display.md` still
  expects translations on multi-locale clients; it's correctly skipped
  here and should be revisited if/when a second locale is added.

## Residual cleanup

One smoke-test row was created in `rsvp_submissions` during step 4 (anonymous
`POST` with `source=m2-verification-runlog`). The local admin token only
has the MCP Agent role which lacks `read` on this collection, so the row
could not be deleted from this session. **Human admin should delete it
via the Directus admin UI** before M5 goes live.

## Cross-references

- Runbook: [`./directus-migration.md`](./directus-migration.md)
- Rules: [`bravobyte-ai/rules/directus-collection-permissions.md`](../../../bravobyte-ai/rules/directus-collection-permissions.md) · [`bravobyte-ai/rules/directus-collection-display.md`](../../../bravobyte-ai/rules/directus-collection-display.md)
- ADR: [`../adrs/0001-dolce-vita-architecture.md`](../adrs/0001-dolce-vita-architecture.md)
