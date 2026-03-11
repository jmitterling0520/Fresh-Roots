# Connect a new Vercel KV (Redis) database

Use this when you create a **new** KV database in Vercel (e.g. after your previous Redis was archived).

## 1. Get the new credentials in Vercel

1. Open [Vercel Dashboard](https://vercel.com) → your project (e.g. Fresh-Roots or the site project).
2. Go to **Storage** (or **Integrations** if the DB was added via Upstash).
3. Open the **new** KV database you created.
4. Find the REST API credentials:
   - **KV_REST_API_URL** — e.g. `https://xxxxx.upstash.io`
   - **KV_REST_API_TOKEN** — long token string

   (They may be under “REST API”, “.env”, or “Connect to Project”.)

## 2. Set environment variables in Vercel

1. In the same project, go to **Settings** → **Environment Variables**.
2. Add or update:
   - **KV_REST_API_URL** = (paste the URL from step 1)
   - **KV_REST_API_TOKEN** = (paste the token from step 1)
3. Apply to **Production**, **Preview**, and **Development** if you want KV in all environments.
4. Save.

If the old archived database had these same variable names, overwriting them with the new DB’s values is enough.

## 3. Redeploy

- **Deployments** → open the latest deployment → **Redeploy** (or push a new commit).
- New deployments will use the new KV database.

## 4. Local development (optional)

To use the new Redis locally (agreement form + magic links):

1. Copy `Website/.env.example` to `Website/.env.local` (if you don’t already have `.env.local`).
2. In `.env.local`, set:
   - `KV_REST_API_URL` = (same URL as in Vercel)
   - `KV_REST_API_TOKEN` = (same token as in Vercel)
3. Restart `npm run dev` if it’s running.

If these are not set locally, the app uses **file storage** (`data/agreement-submissions.json`) instead of Redis.

## What uses this database

- **Agreement submissions** — data from the `/agreement` form.
- **Magic links** — tokens for `/agreement/view/[token]` (24‑hour links).

The new database starts **empty**. Old submissions and magic links from the archived database are not migrated; only new submissions and new magic-link requests will appear in the new DB.
