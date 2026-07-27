# Connect Vercel Blob for contract storage

Use this when you create or reconnect a **Blob** store for agreement and SOW submissions (replaces the old Vercel KV / Upstash Redis setup).

## 1. Create or open the Blob store in Vercel

1. Open [Vercel Dashboard](https://vercel.com) → your project.
2. Go to **Storage** → **Blob** (or **Create** → Blob).
3. Open the store used for contracts (e.g. the one behind `CONTRACT_BLOB_STORE_ID`).
4. Copy the **BLOB_READ_WRITE_TOKEN** (read-write token for the store).

## 2. Set environment variables in Vercel

1. Project → **Settings** → **Environment Variables**.
2. Add or update:
   - **BLOB_READ_WRITE_TOKEN** = (paste the read-write token)
   - Optional: **CONTRACT_BLOB_STORE_ID** = (store id from the dashboard)
3. Apply to **Production** (and Preview/Development if you want).
4. Remove obsolete **KV_REST_API_URL** / **KV_REST_API_TOKEN** if present.
5. Save, then **Redeploy**.

Also ensure **CONTACT_FORM_TO_EMAIL** and **RESEND_API_KEY** are set so approve emails send.

## 3. Local development

In `Website/.env.local`:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
# CONTACT_FORM_TO_EMAIL=you@example.com
```

If `BLOB_READ_WRITE_TOKEN` is unset locally, the app falls back to JSON files under `Website/data/` (agreements / SOWs only — magic links still require Blob).

## What Blob stores

Private JSON objects (not public URLs):

| Path | Purpose |
|------|---------|
| `contracts/agreements/{token}.json` | Month-to-month agreement submissions |
| `contracts/sows/{token}.json` | SOW submissions |
| `contracts/magic/agreements/{magic}.json` | 24h view magic links |
| `contracts/magic/sows/{magic}.json` | 24h SOW view magic links |

## Object layout note

There is no automatic migration from archived Redis. New submissions start empty in Blob.
