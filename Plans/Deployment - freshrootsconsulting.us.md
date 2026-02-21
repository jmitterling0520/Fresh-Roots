# Deploy Fresh Roots to freshrootsconsulting.us

This guide walks you through deploying the Next.js site to **Vercel** and connecting your domain **freshrootsconsulting.us**.

---

## Why Vercel?

- Built by the Next.js team; zero-config for Next.js
- Free tier: unlimited personal projects, automatic HTTPS, global CDN
- Custom domains (like freshrootsconsulting.us) are free
- Connects to GitHub for automatic deploys on push

---

## GitHub Repo and Vercel

**Current setup:** The live site (freshrootsconsulting.us) is deployed from Vercel, and Vercel is connected to:

- **https://github.com/jmitterling0520/fresh_roots_consulting_website** (website-only repo)

Your main project repo (where you work in Cursor) is:

- **https://github.com/jmitterling0520/Fresh-Roots** (full project: `Website/`, `Plans/`, `Organization/`, `Services/`, etc.)

### Which repo should Vercel use?

| Option | Repo | Root Directory | Pros | Cons |
|--------|------|----------------|------|------|
| **A (recommended)** | [Fresh-Roots](https://github.com/jmitterling0520/Fresh-Roots) | `Website` | Single source of truth; one push from Cursor updates the site; no syncing | Need to point Vercel at Fresh-Roots and set Root Directory |
| **B** | [fresh_roots_consulting_website](https://github.com/jmitterling0520/fresh_roots_consulting_website) | *(empty—repo is website-only)* | Already connected | You must push/sync website changes to this repo separately from Fresh-Roots |

**Recommendation: Use Option A (Fresh-Roots + Root Directory = Website).** Then you push once to Fresh-Roots from Cursor and Vercel deploys the `Website/` folder. No need to maintain two repos or sync between them.

**To switch Vercel to Fresh-Roots (Option A):**

1. Vercel Dashboard → your project (freshrootsconsulting.us) → **Settings** → **Git**.
2. **Disconnect** the current repo (fresh_roots_consulting_website) if you want to switch.
3. **Connect Git Repository** → choose **jmitterling0520/Fresh-Roots**, branch **main**.
4. **Settings** → **Build and Deployment** → **Root Directory** → set to **Website** → Save.
5. **Deployments** → trigger a **Redeploy** (or push a commit to Fresh-Roots). Confirm the site at freshrootsconsulting.us looks correct.

After that, keep working in the Fresh-Roots repo; every push to `main` will deploy the site.

---

## Step 1: Push Your Code to GitHub

If the project isn’t on GitHub yet:

1. Use the existing [Fresh-Roots](https://github.com/jmitterling0520/Fresh-Roots) repo or create one at [github.com/new](https://github.com/new).
2. From your project root:
   ```bash
   cd "/Users/James/Documents/Fresh Roots"
   git remote add origin https://github.com/jmitterling0520/Fresh-Roots.git
   git push -u origin main
   ```

---

## Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub is easiest).
2. Click **Add New…** → **Project**.
3. **Import** your GitHub repository: **Fresh-Roots** (recommended) or **fresh_roots_consulting_website**.
4. **Root Directory:** if using **Fresh-Roots**, set to `Website`. If using **fresh_roots_consulting_website**, leave empty (repo is website-only).
5. Leave framework preset as **Next.js** and click **Deploy**.
6. Wait for the first deploy. You’ll get a URL like `your-project.vercel.app`.

---

## Step 3: Add Your Custom Domain

1. In the Vercel project, open **Settings** → **Domains**.
2. Add both: `freshrootsconsulting.us` and `www.freshrootsconsulting.us`.
3. Set **www.freshrootsconsulting.us** as the **primary** domain in Vercel Domains so **freshrootsconsulting.us** (apex) redirects to **www**.
4. Vercel will show the DNS records you need. You’ll use one of these:

   **Option A – CNAME (for www only)**  
   - If you only use `www.freshrootsconsulting.us`, add:
     - **Name:** `www`  
     - **Value:** `cname.vercel-dns.com`

   **Option B – A records (for apex: freshrootsconsulting.us)**  
   - For the root domain `freshrootsconsulting.us`, add:
     - **A** → `76.76.21.21`
   - (Vercel may show a different IP; use what’s shown in the Domains panel.)

   **Option C – Both**  
   - A record for `@` (or `freshrootsconsulting.us`) → `76.76.21.21`  
   - CNAME for `www` → `cname.vercel-dns.com`  
   In Vercel Domains, set **www.freshrootsconsulting.us** as **primary** so **freshrootsconsulting.us** redirects to www.

5. Add the DNS records at your registrar (see **Namecheap** below).
6. DNS can take from a few minutes up to 48 hours. Vercel will issue an SSL certificate automatically once DNS is correct.

---

## Step 3b: Namecheap DNS (freshrootsconsulting.us)

You bought the domain from **Namecheap**. Use these steps to point it at Vercel.

1. Log in at [namecheap.com](https://www.namecheap.com) → **Domain List** → click **Manage** next to **freshrootsconsulting.us**.
2. Open the **Advanced DNS** tab.
3. Remove or leave any existing A/CNAME records for `@` and `www`; you’ll replace or add as below.

**Apex (freshrootsconsulting.us):**

| Type | Host | Value | TTL |
|------|------|--------|-----|
| **A Record** | `@` | `76.76.21.21` | Automatic (or 300) |

- Click **Add New Record** → choose **A Record**.
- **Host:** `@`
- **Value:** `76.76.21.21`
- **TTL:** Automatic (or 300). Save.

**www (www.freshrootsconsulting.us):**

| Type | Host | Value | TTL |
|------|------|--------|-----|
| **CNAME Record** | `www` | `cname.vercel-dns.com` | Automatic (or 300) |

- Click **Add New Record** → choose **CNAME Record**.
- **Host:** `www`
- **Value:** `cname.vercel-dns.com`
- **TTL:** Automatic (or 300). Save.

4. If Vercel’s Domains page shows a different A record IP, use that instead of `76.76.21.21`.
5. Wait 5–30 minutes (sometimes up to 48 hours). Namecheap’s **Advanced DNS** page will show a green check when propagation is done; Vercel will then show the domain as verified and enable HTTPS.

**Namecheap tip:** If you don’t see **Advanced DNS**, make sure you’re on the **Domain List** → **Manage** for freshrootsconsulting.us, then use the **Advanced DNS** tab (not “Nameservers” or “Redirect”).

---

## Step 4: Verify

- Visit **https://www.freshrootsconsulting.us** (primary); **https://freshrootsconsulting.us** should redirect to www.
- Confirm the site loads and that **https** works (no browser warnings).

---

## Contact Form on Vercel

The contact form currently saves to a **file** (`data/submissions.json`). On Vercel the filesystem is **read-only**, so those writes will fail and the form will return 500 in production.

**Options:**

1. **Short term:** Leave as-is. The rest of the site works; form submissions will fail until you switch storage.
2. **Recommended next step:** Add email (e.g. [Resend](https://resend.com)) or a database (e.g. Vercel Postgres, Supabase) and change the `/api/contact` route to use that instead of the file. See **Plans/How to Engage - Implementation Plan.md** (Phase 3) and **Plans/Form Submission Monitoring Plan.md**.

---

## Agreement Form on Vercel (Submit for Review)

The agreement form at `/agreement` saves submissions and sends an approval link by email. On Vercel the filesystem is read-only, so the app uses **Upstash Redis** for storage when the env vars are set.

**To enable agreement submissions in production:**

1. Go to [Vercel Marketplace](https://vercel.com/marketplace) and search for **Upstash Redis** (or [Upstash Redis integration](https://vercel.com/integrations/upstash)).
2. Add the integration to your project and follow the setup (create a Redis database if needed).
3. Vercel will inject `KV_REST_API_URL` and `KV_REST_API_TOKEN` (and related vars) into your project.
4. Redeploy the site.

If Redis env vars (`KV_REST_API_URL` + `KV_REST_API_TOKEN`, or `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`) are not set (e.g. local dev), the app falls back to file storage (`data/agreement-submissions.json`).

### Agreement view (magic link)

After approval, the agreement is viewable at `/agreement/view/[token]` only via a **magic link**. When someone visits without a valid link, they see an email form; after entering an authorized email, a time-limited link is emailed to them (valid 24 hours).

**Requirements:**
- **Redis** (same as above) — magic tokens are stored in Redis.
- **Resend** — `RESEND_API_KEY` and `CONTACT_FORM_FROM_EMAIL` (see [Contact Form - Resend Setup](Contact%20Form%20-%20Resend%20Setup.md)).
- **Consultant access** — `CONTACT_FORM_TO_EMAIL` or `CONSULTANT_EMAIL` so you (the consultant) can request a magic link with your own email.

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Sends the magic link email via Resend. |
| `CONTACT_FORM_FROM_EMAIL` | "From" address for magic link emails (optional; defaults to `Fresh Roots Consulting <onboarding@resend.dev>`). |
| `CONTACT_FORM_TO_EMAIL` or `CONSULTANT_EMAIL` | Email(s) allowed to request a magic link for any agreement. `CONTACT_FORM_TO_EMAIL` is typically your main email; `CONSULTANT_EMAIL` can be set separately. |

---

## Quick Reference

| Step              | Where                    | Action |
|-------------------|--------------------------|--------|
| Code              | GitHub                   | **Fresh-Roots** (main project) or **fresh_roots_consulting_website** (website-only). Recommended: Fresh-Roots with Root Directory = `Website`. |
| Build             | Vercel → Project         | Root Directory = `Website` (if using Fresh-Roots); empty (if using fresh_roots_consulting_website) |
| Domain            | Vercel → Settings → Domains | Add both; set **www.freshrootsconsulting.us** as primary (apex redirects to www) |
| DNS               | Namecheap → Manage → Advanced DNS | A record `@` → 76.76.21.21; CNAME `www` → cname.vercel-dns.com |
| HTTPS             | Vercel                   | Automatic after DNS is correct |

---

## Troubleshooting

- **"Too many HTTP redirects"** (CSS/JS fail to load): See **Redirect loop** below.
- **Push to GitHub not showing on freshrootsconsulting.us:** See **Push not showing on live site** below.
- **Domain not working:** Wait up to 48 hours for DNS, then re-check the records. Use [Vercel’s DNS check](https://vercel.com/docs/concepts/projects/domains#dns-records) or `dig freshrootsconsulting.us`.
- **Namecheap still shows “Parked” or default page:** You’re editing **Advanced DNS**, not “Nameservers”. Keep nameservers as **Namecheap BasicDNS** (or PremiumDNS) and only add/update the A and CNAME records above.
- **Wrong project / 404:** Ensure the Vercel project’s **Root Directory** is `Website`.
- **Build fails:** Run `npm run build` inside `Website/` locally and fix any TypeScript or build errors before pushing.

### Redirect loop ("too many HTTP redirects")

If the page or assets (CSS, JS) fail with **"too many HTTP redirects"**, www and apex are redirecting to each other: e.g. vercel.json (or another rule) redirects www → apex, and Vercel Domains redirects apex → www.

**Fix:** Use **only one** place to redirect between www and apex.

1. **Vercel Domains:** In the project → **Settings** → **Domains** → set **www.freshrootsconsulting.us** as **primary**. Add **freshrootsconsulting.us** (apex) and let Vercel redirect it to www. Do **not** also add a www ↔ apex redirect in `vercel.json`; that creates a loop.
2. **If you had a redirect in vercel.json:** Remove it (we removed the www → apex redirect from this project’s vercel.json for this reason). Redeploy. The custom domain and assets should load without a loop.

### Push not showing on live site

If you pushed to GitHub but https://www.freshrootsconsulting.us (or https://freshrootsconsulting.us) still shows old content:

1. **Confirm Vercel is connected to GitHub**
   - [Vercel Dashboard](https://vercel.com/dashboard) → your project (the one with freshrootsconsulting.us).
   - **Settings** → **Git** → confirm **Connected Git Repository** is one of: `jmitterling0520/Fresh-Roots` (with Root Directory = `Website`) or `jmitterling0520/fresh_roots_consulting_website`. If it says "No Git Repository connected", connect it: **Connect Git Repository** → choose the repo and branch (e.g. `main`). If using Fresh-Roots, set **Root Directory** to `Website` in **Settings** → **Build and Deployment**.

2. **Confirm Root Directory**
   - **Settings** → **Build and Deployment** → **Root Directory** must be `Website` (so Vercel builds the Next.js app). If it’s empty or wrong, set to `Website` and save; trigger a redeploy.

3. **Check the latest deployment**
   - In the project, open the **Deployments** tab. Find the latest deployment and check:
     - **Status:** Should be "Ready". If it’s "Failed" or "Error", open it and fix the build error (often Root Directory or build logs).
     - **Source:** Should show the commit you just pushed (e.g. "Deploy: deployment guide..."). If the latest deployment is from an old commit, Vercel may not be getting pushes—re-check **Settings** → **Git**.

4. **Redeploy**
   - **Deployments** → click the **⋯** on the latest deployment → **Redeploy** (or push a small commit and wait for the new deployment). After it’s "Ready", the live site should update within a minute or two.

### Renders on *.vercel.app but not on www.freshrootsconsulting.us (or freshrootsconsulting.us)

If the site **renders correctly** when you open the **Vercel app URL** (e.g. `your-project.vercel.app`) but **does not render properly** at **www.freshrootsconsulting.us** or **freshrootsconsulting.us**, the custom domain is almost certainly pointing at a **different Vercel project** (or an old deployment).

**Fix: Use the same project for the domain and for your code**

1. **See which project has the domain**
   - [Vercel Dashboard](https://vercel.com/dashboard) → open each project that might be related (e.g. "Fresh-Roots", "fresh-roots-website", "fresh_roots_consulting_website").
   - In each project go to **Settings** → **Domains**.
   - Find the project where **freshrootsconsulting.us** and/or **www.freshrootsconsulting.us** are listed.

2. **Two cases**
   - **If the domain is on the OLD project** (e.g. connected to **fresh_roots_consulting_website**): That project is what www.freshrootsconsulting.us serves. Your new code is in **Fresh-Roots**, so the *.vercel.app URL for the Fresh-Roots project shows the new site, but the custom domain still shows the old project.
     - **Fix:** Move the domain to the **Fresh-Roots** project: In the **Fresh-Roots** project → **Settings** → **Domains** → **Add** → enter **freshrootsconsulting.us** (and **www.freshrootsconsulting.us** if you use it). Vercel will ask to remove the domain from the other project; confirm. Then in the Fresh-Roots project set **Root Directory** to **Website** (if not already), redeploy, and the custom domain will serve the same build as *.vercel.app.
   - **If the domain is already on the Fresh-Roots project:** Use the checklist below (**Project correct but domain still wrong**).

**Project correct (GitHub + Root Directory) but custom domain still wrong**

If the project is already on the right repo and Root Directory = **Website**, but www.freshrootsconsulting.us still doesn’t match *.vercel.app:

1. **Production deployment**
   - **Deployments** → find the deployment you want live (latest from `main`).
   - If it doesn’t have the **Production** badge: click **⋯** on it → **Promote to Production**. The custom domain serves whatever deployment is **Production**.

2. **Domain assigned to Production**
   - **Settings** → **Domains** → click **freshrootsconsulting.us** (and **www.freshrootsconsulting.us** if listed).
   - Ensure each domain is assigned to **Production** (not Preview or Development). If it’s on Preview, it will serve preview builds instead of the Production one.

3. **Clean redeploy**
   - **Deployments** → **⋯** on the latest deployment → **Redeploy**.
   - If you see **Clear build cache** or similar, use it so the redeploy isn’t reusing an old cache.
   - After the new deployment is **Ready**, make sure it’s **Production** (step 1).

4. **Test without cache**
   - Open **https://www.freshrootsconsulting.us** (or **https://freshrootsconsulting.us**) in an **incognito/private** window (or another device). If it still differs from *.vercel.app, compare response headers (e.g. **x-vercel-id** or **server**) for both URLs to confirm they hit the same deployment.

**After moving the domain (if you did step 2):**
   - Wait a minute or two, then open **https://www.freshrootsconsulting.us** (or **https://freshrootsconsulting.us**) in an **incognito/private** window. It should match the *.vercel.app site.

---

**Last updated:** February 2025
