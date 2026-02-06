# Contact Form: Resend Setup

The contact form sends you an email for each submission via **Resend** when `RESEND_API_KEY` and `CONTACT_FORM_TO_EMAIL` are set. On Vercel (production) you **must** set these so the form works; locally they're optional (form falls back to saving to `data/submissions.json`).

---

## What you need to do

### 1. Create a Resend account and get an API key

1. Go to [resend.com](https://resend.com) and sign up (free tier is enough).
2. Open [resend.com/api-keys](https://resend.com/api-keys) and create an API key (e.g. "Fresh Roots contact form").
3. Copy the key (starts with `re_`). You'll add it as an env var below.

### 2. Add environment variables

**Local (optional, for testing email locally):**

- In `Website/` create a file `.env.local` (it's gitignored).
- Add:
  ```
  RESEND_API_KEY=re_your_key_here
  CONTACT_FORM_TO_EMAIL=james.mitterling@icloud.com
  ```
- Restart the dev server and submit the form; you should get an email.

**Vercel (required for production):**

1. Vercel Dashboard → your project (freshrootsconsulting.us) → **Settings** → **Environment Variables**.
2. Add:
   - **Name:** `RESEND_API_KEY`  
     **Value:** your Resend API key (e.g. `re_xxxx...`)  
     **Environments:** Production (and Preview if you want)
   - **Name:** `CONTACT_FORM_TO_EMAIL`  
     **Value:** the email where you want form submissions (e.g. `james.mitterling@icloud.com` or later `contact@freshrootsconsulting.us`)  
     **Environments:** Production (and Preview if you want)
3. **Redeploy** the project (Deployments → ⋯ → Redeploy) so the new env vars are picked up.

### 3. "From" address (optional)

- **Default:** The app uses `Fresh Roots Contact <onboarding@resend.dev>`. Resend's free tier allows this for testing; you can only send **to** the email address of your Resend account when using `onboarding@resend.dev`.
- **Production / your domain:** In Resend, add and verify **freshrootsconsulting.us** (Resend Dashboard → Domains). Then add an env var:
  - **Name:** `CONTACT_FORM_FROM_EMAIL`  
  - **Value:** `Fresh Roots <contact@freshrootsconsulting.us>` (or another verified address)
- After that, form emails will appear from contact@freshrootsconsulting.us and you can send to any address.

### 4. Test

- Open https://www.freshrootsconsulting.us (or your preview URL), go to the contact form, submit with test data.
- Check the inbox for `CONTACT_FORM_TO_EMAIL`; you should receive the submission details.

---

## Env vars summary

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes (for email) | Resend API key from [resend.com/api-keys](https://resend.com/api-keys). |
| `CONTACT_FORM_TO_EMAIL` | Yes (for email) | Email address that receives each form submission. |
| `CONTACT_FORM_FROM_EMAIL` | No | "From" address (e.g. `Fresh Roots <contact@freshrootsconsulting.us>`). Default: `Fresh Roots Contact <onboarding@resend.dev>`. Verify your domain in Resend to use your own. |

---

## Troubleshooting

- **"Failed to send notification"** (form shows this error after submit):
  1. **Check Vercel env vars:** Project → **Settings** → **Environment Variables**. Ensure **`RESEND_API_KEY`** and **`CONTACT_FORM_TO_EMAIL`** are set for **Production** (and that you redeployed after adding them).
  2. **Resend "from" / "to" rules (free tier):** If you use the default **from** `onboarding@resend.dev`, Resend may only allow sending **to** the email address of your Resend account. Set **`CONTACT_FORM_TO_EMAIL`** to that same address, or verify your domain in Resend and set **`CONTACT_FORM_FROM_EMAIL`** to a verified address (e.g. `Fresh Roots <contact@freshrootsconsulting.us>`).
  3. **Invalid API key:** In [Resend → API Keys](https://resend.com/api-keys), confirm the key is active and copy it again into Vercel as **`RESEND_API_KEY`** (no extra spaces). Redeploy.
  4. **See the exact error:** Vercel → your project → **Deployments** → open the latest deployment → **Functions** or **Logs**. Look for `Resend error:` to see Resend’s message (e.g. "From address is not verified", "Invalid API key").
- **Form still returns 500 on production:** Ensure `RESEND_API_KEY` and `CONTACT_FORM_TO_EMAIL` are set in Vercel and you redeployed after adding them.
- **"From address is not verified":** Either use the default `onboarding@resend.dev` (and send only to your Resend account email) or verify freshrootsconsulting.us in Resend and set `CONTACT_FORM_FROM_EMAIL`.
- **No email received:** Check Resend Dashboard → Logs for delivery status; check spam; confirm `CONTACT_FORM_TO_EMAIL` is correct in Vercel.
