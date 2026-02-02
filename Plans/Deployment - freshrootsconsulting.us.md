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
2. Enter: `freshrootsconsulting.us`
3. Optionally add: `www.freshrootsconsulting.us` (Vercel can redirect www → apex or vice versa).
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
   Then in Vercel Domains you can set the apex as primary and redirect www to it (or the opposite).

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

- Visit **https://freshrootsconsulting.us** (and **https://www.freshrootsconsulting.us** if you added www).
- Confirm the site loads and that **https** works (no browser warnings).

---

## Contact Form on Vercel

The contact form currently saves to a **file** (`data/submissions.json`). On Vercel the filesystem is **read-only**, so those writes will fail and the form will return 500 in production.

**Options:**

1. **Short term:** Leave as-is. The rest of the site works; form submissions will fail until you switch storage.
2. **Recommended next step:** Add email (e.g. [Resend](https://resend.com)) or a database (e.g. Vercel Postgres, Supabase) and change the `/api/contact` route to use that instead of the file. See **Plans/How to Engage - Implementation Plan.md** (Phase 3) and **Plans/Form Submission Monitoring Plan.md**.

---

## Quick Reference

| Step              | Where                    | Action |
|-------------------|--------------------------|--------|
| Code              | GitHub                   | **Fresh-Roots** (main project) or **fresh_roots_consulting_website** (website-only). Recommended: Fresh-Roots with Root Directory = `Website`. |
| Build             | Vercel → Project         | Root Directory = `Website` (if using Fresh-Roots); empty (if using fresh_roots_consulting_website) |
| Domain            | Vercel → Settings → Domains | Add `freshrootsconsulting.us` (and optional www) |
| DNS               | Namecheap → Manage → Advanced DNS | A record `@` → 76.76.21.21; CNAME `www` → cname.vercel-dns.com |
| HTTPS             | Vercel                   | Automatic after DNS is correct |

---

## Troubleshooting

- **Push to GitHub not showing on freshrootsconsulting.us:** See **Push not showing on live site** below.
- **Domain not working:** Wait up to 48 hours for DNS, then re-check the records. Use [Vercel’s DNS check](https://vercel.com/docs/concepts/projects/domains#dns-records) or `dig freshrootsconsulting.us`.
- **Namecheap still shows “Parked” or default page:** You’re editing **Advanced DNS**, not “Nameservers”. Keep nameservers as **Namecheap BasicDNS** (or PremiumDNS) and only add/update the A and CNAME records above.
- **Wrong project / 404:** Ensure the Vercel project’s **Root Directory** is `Website`.
- **Build fails:** Run `npm run build` inside `Website/` locally and fix any TypeScript or build errors before pushing.

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

---

**Last updated:** February 2025
