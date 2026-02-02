# Deploy Fresh Roots to freshrootsconsulting.us

This guide walks you through deploying the Next.js site to **Vercel** and connecting your domain **freshrootsconsulting.us**.

---

## Why Vercel?

- Built by the Next.js team; zero-config for Next.js
- Free tier: unlimited personal projects, automatic HTTPS, global CDN
- Custom domains (like freshrootsconsulting.us) are free
- Connects to GitHub for automatic deploys on push

---

## Step 1: Push Your Code to GitHub

If the project isn’t on GitHub yet:

1. Create a new repository at [github.com/new](https://github.com/new) (e.g. `fresh-roots-website`).
2. From your project root:
   ```bash
   cd "/Users/James/Documents/Fresh Roots"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
   (Use your actual repo URL and branch name.)

---

## Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub is easiest).
2. Click **Add New…** → **Project**.
3. **Import** your GitHub repository (e.g. `fresh-roots-website`).
4. **Root Directory:** set to `Website` (so Vercel builds the Next.js app, not the repo root).
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
| Code              | GitHub                   | Repo with `Website/` as the app |
| Build             | Vercel → Project         | Root Directory = `Website` |
| Domain            | Vercel → Settings → Domains | Add `freshrootsconsulting.us` (and optional www) |
| DNS               | Namecheap → Manage → Advanced DNS | A record `@` → 76.76.21.21; CNAME `www` → cname.vercel-dns.com |
| HTTPS             | Vercel                   | Automatic after DNS is correct |

---

## Troubleshooting

- **Domain not working:** Wait up to 48 hours for DNS, then re-check the records. Use [Vercel’s DNS check](https://vercel.com/docs/concepts/projects/domains#dns-records) or `dig freshrootsconsulting.us`.
- **Namecheap still shows “Parked” or default page:** You’re editing **Advanced DNS**, not “Nameservers”. Keep nameservers as **Namecheap BasicDNS** (or PremiumDNS) and only add/update the A and CNAME records above.
- **Wrong project / 404:** Ensure the Vercel project’s **Root Directory** is `Website`.
- **Build fails:** Run `npm run build` inside `Website/` locally and fix any TypeScript or build errors before pushing.

---

**Last updated:** February 2025
