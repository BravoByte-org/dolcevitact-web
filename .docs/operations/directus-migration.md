# Directus migration runbook — Dolce Vita

One-shot migration that brings the shared BravoByte Directus instance
(`https://cms.bravobyte.co`) into the shape `dolcevitact-web` expects. The
script lives at [`scripts/directus/migrate.mjs`](../../scripts/directus/migrate.mjs);
this file is the operator's guide.

## When to run this

- **First run:** once per project, during M2, with `--seed` to bootstrap
  the placeholder homepage content.
- **Re-runs:** every time a new collection / field / relation is added
  to `COLLECTIONS` or `RELATIONS` in the script. The script is
  idempotent — existing rows are patched, not duplicated.
- **Permissions-only refresh:** `--skip-schema` re-applies only the
  permission backfill, useful after a Directus permissions UI change
  silently dropped a row.

## Prerequisites

1. **Admin token.** You need a Directus system-admin static token (not
   the Starway App Service token). In the admin UI: go to your profile,
   scroll to "Token", set a value, save, and copy it. This token has
   write access to `directus_collections`, `directus_fields`,
   `directus_relations`, `directus_policies`, `directus_permissions`,
   and `directus_users`.
2. **Starway-era schema is already in place.** The script assumes
   `sites`, `pages`, `page_blocks` (with **both** M2A relation sides
   seeded), `block_hero`, `block_rich_text`, `block_card_group`,
   `block_team`, `block_timeline`, `block_cta`, `block_image_gallery`
   already exist. The script's `page_blocks` M2A step is an **extend**,
   not a create — if the polymorphic side is missing, it bails.
3. **`App Service` role, `Published Content Reader` policy, and
   `Public` policy exist in Directus.** The script looks them up by
   name. If any are renamed, update the name lookups in
   `findRoleByName` / `findPolicyByName` calls at the bottom of
   `migrate.mjs` before running.

## First run (apply + seed)

```bash
cd dolcevitact-web

# Dry-run first to preview every POST/PATCH without writing.
DIRECTUS_ADMIN_TOKEN='<admin_token>' \
  node scripts/directus/migrate.mjs --seed --dry-run

# When the dry-run output looks right, apply for real:
DIRECTUS_ADMIN_TOKEN='<admin_token>' \
  node scripts/directus/migrate.mjs --seed
```

The script's output will include a banner:

```
─────────────────────────────────────────────────
 New Dolce Vita App Service token (copy to Vercel +
 local .env as DIRECTUS_TOKEN / PRIVATE_DIRECTUS_TOKEN):
   dolcevita_<hex>
─────────────────────────────────────────────────
```

**Copy that token.** On re-runs, the App Service user already exists and
the token is not re-printed — if you lose it, regenerate via the
Directus admin UI (user → "Token" field → Generate → Save).

## What to do with the App Service token

1. **Local `.env`** — add to `dolcevitact-web/.env`:

   ```
   DIRECTUS_TOKEN="dolcevita_<hex>"
   PRIVATE_DIRECTUS_TOKEN="dolcevita_<hex>"
   ```

   The `.env` file is gitignored; **never** commit the token.

2. **Vercel project env** — add via the Vercel dashboard or CLI:

   ```bash
   vercel env add DIRECTUS_TOKEN production
   vercel env add DIRECTUS_TOKEN preview
   vercel env add DIRECTUS_TOKEN development
   # repeat for PRIVATE_DIRECTUS_TOKEN
   ```

   Re-deploy the project after adding so SSR picks up the new value.

## Flags

| Flag            | Purpose                                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `--seed`        | Create the placeholder homepage row with 9 blocks + 4 FAQ items. Skipped by default so re-runs don't keep creating duplicate pages. |
| `--skip-schema` | Skip collection/field/relation ops; only run identity + permissions + (optional) seed. Useful after an admin UI edit.               |
| `--dry-run`     | Log every non-GET HTTP call without executing. Read-only calls (`GET /…`) still run so the script can report what it would change.  |

## Verification (post-apply)

1. Admin UI: the left sidebar now shows the five new collections
   (`block_faq`, `block_faq_items`, `block_event_details`,
   `block_rsvp_form`, `rsvp_submissions`). The "Pages Blocks" M2A on a
   Dolce Vita page lists three new block types alongside the existing
   ones.
2. API probe with the new App Service token:

   ```bash
   DIRECTUS_URL='https://cms.bravobyte.co'
   TOKEN='dolcevita_<hex>'

   # Site row resolves, homepage returns with blocks.
   curl -H "Authorization: Bearer $TOKEN" \
     "$DIRECTUS_URL/items/pages?filter[site][key][_eq]=dolcevita&fields=*,blocks.*"

   # Public create on rsvp_submissions succeeds anonymously (no token).
   curl -X POST -H 'Content-Type: application/json' \
     -d '{"site":"<dolcevita_site_uuid>","name":"Smoke Test","email":"smoke@example.com","source":"runbook"}' \
     "$DIRECTUS_URL/items/rsvp_submissions"
   ```

3. Delivery app — once local `.env` is populated, `pnpm run dev` and
   hit `/`. The homepage placeholder (from M3) is still rendering until
   M4 ships the real BlockRenderer; verify via the server log that
   `fetchHomepage()` returns a non-empty array rather than crashing.

## Rollback

The script has no destructive path. To undo a seed:

```bash
# Delete all Dolce Vita pages + their blocks (cascades aren't set on
# page_blocks intentionally, so junction rows must be deleted first).
DIRECTUS_URL='https://cms.bravobyte.co'
TOKEN='<admin_token>'
SITE_ID='<dolcevita_site_uuid>'
PAGE_IDS=$(curl -sH "Authorization: Bearer $TOKEN" \
  "$DIRECTUS_URL/items/pages?filter[site][_eq]=$SITE_ID&fields=id" | jq -r '.data[].id')

for PID in $PAGE_IDS; do
  JUNCTIONS=$(curl -sH "Authorization: Bearer $TOKEN" \
    "$DIRECTUS_URL/items/page_blocks?filter[pages_id][_eq]=$PID&fields=id" | jq -r '.data[].id')
  for JID in $JUNCTIONS; do
    curl -X DELETE -H "Authorization: Bearer $TOKEN" "$DIRECTUS_URL/items/page_blocks/$JID"
  done
  curl -X DELETE -H "Authorization: Bearer $TOKEN" "$DIRECTUS_URL/items/pages/$PID"
done
```

To drop the Dolce-Vita-first collections, use the Directus admin UI
(Settings → Data Model → collection → ⋮ → Delete). The SDK API supports
it too (`DELETE /collections/:name`) but the admin UI also handles the
dependent `directus_permissions` rows, which is what you want.

## Cross-references

- Shared rule: [`bravobyte-ai/rules/directus-collection-permissions.md`](../../../bravobyte-ai/rules/directus-collection-permissions.md)
- Shared rule: [`bravobyte-ai/rules/directus-collection-display.md`](../../../bravobyte-ai/rules/directus-collection-display.md)
- Cursor rule: [`.cursor/rules/directus-collection-permissions.mdc`](../../.cursor/rules/directus-collection-permissions.mdc) (not yet added to this repo; inherits the workspace rule)
- ADR: [`.docs/adrs/0001-dolce-vita-architecture.md`](../adrs/0001-dolce-vita-architecture.md)
