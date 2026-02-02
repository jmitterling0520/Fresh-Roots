# How to Engage with Fresh Roots — Implementation Plan

This plan covers **website changes** and **workflow processes** so new potential clients can (1) understand what Fresh Roots does, (2) book a free 30-minute conversation (Calendly or form), and (3) receive a tailored post-call questionnaire generated from the [Client Discovery Prompt](../Services/Client%20Discovery%20Prompt.md).

---

## Decisions & Completed Work

**Last updated:** Reflecting implementation to date.

| Decision / outcome | Details |
|--------------------|---------|
| **“How to Engage” placement** | Folded into a **revamped Contact section** (single section with heading “How to Engage”). No separate section between Expertise and Contact. |
| **Step 2 layout** | The short form lives **inside Step 2** (“Book a conversation”). Step 3 (“After our first conversation”) appears **after** the form. Copy makes it explicit: “Schedule a free 30-minute call **or** fill out the short form below.” |
| **Direct contact block** | The “Or reach out directly” block (Email, Phone, LinkedIn) was **removed** from the Contact section to keep the page focused on the two paths (Calendly or form). |
| **Form backend** | **Own backend** instead of Formspree/Netlify: Next.js API route `POST /api/contact` stores submissions in `Website/data/submissions.json` (file-based). See Phase 3 below for storage/email notes. |
| **Navigation** | Nav label is **“How to Engage”** and links to `#contact`. Hero **“Get Started”** button scrolls to `#contact`. |
| **Monitoring** | A separate plan covers form/API monitoring: [Form Submission Monitoring Plan.md](./Form%20Submission%20Monitoring%20Plan.md). |

**Still to do:** Add your real Calendly URL in `Contact.tsx` (`CALENDLY_URL`). For production (e.g. Vercel), consider moving form storage from file to a DB or adding email notifications (see Phase 3).

---

## Overview & Goals

| Goal | Description |
|------|-------------|
| **Clarity** | Visitors understand what Fresh Roots does from the website. |
| **Low-friction booking** | Free 30-min call via Calendly **or** a short form (org + problem). |
| **Structured intake** | Form captures company name, website, and problem—feeding into discovery. |
| **Post-call questionnaire** | After the first conversation, you send a **tailored** questionnaire (About Client, Service Concept, 10–20 questions) generated via the Client Discovery Prompt. |

---

## End-to-End Flow (Target)

```
Visitor → Reads site (About, Services, Expertise)
    → Clicks "Book a free 30-min call" OR "Tell us about your organization"
    → [Calendly] Books slot  OR  [Form] Submits company name, website, problem
    → First 30-min conversation
    → You run Client Discovery Prompt (company name + website) → Get questionnaire
    → You send tailored questionnaire to client
    → Client completes it → You use responses for next steps (proposal, etc.)
```

---

## Phase 1: Website — "How to Engage" Section

**Objective:** Make the path from “interested” to “first conversation” explicit.

### 1.1 Add a "How to Engage" (or "Get Started") section

- **Placement:** Between **Expertise** and **Contact** (or fold into a revamped Contact section).  
  **→ Done:** Folded into a revamped Contact section.
- **Content:**
  1. **Step 1 — Learn.** Briefly restate that the site explains what we do (About, Services, Expertise) and link to those sections.
  2. **Step 2 — Book a conversation.** Free 30-minute call to discuss their organization and goals. Two options:
     - **Option A:** Schedule directly with [Calendly link/embed].
     - **Option B:** Fill out a short form (company name, website, what problem they’re trying to solve). You’ll reach out to schedule.
  3. **Step 3 — After our first conversation.** You’ll send a tailored discovery questionnaire so you can better understand their needs and propose next steps.

### 1.2 Update navigation and CTAs

- Add **“How to Engage”** (or “Get Started”) to the nav; link to `#how-to-engage` or `#contact` if you merge it with Contact.  
  **→ Done:** Nav shows “How to Engage” and links to `#contact`.
- Ensure the Hero **“Get Started”** CTA scrolls to the engagement section (or Contact) rather than only showing email/phone.  
  **→ Done:** Hero CTA scrolls to `#contact`.
- Add a secondary CTA in **Contact** (or **How to Engage**): e.g. **“Book a free 30-min call”** and **“Tell us about your organization”** (form).  
  **→ Done:** “Schedule a free 30-min call” CTA + form inside Step 2.

### 1.3 Clarify “what we do” on the site

- **Services** and **Expertise** already explain offerings. Optionally add a single short “We help small businesses (1–10 employees) with process, technology, data, and automation” line near the top or in **How to Engage** to reinforce who you serve.  
  **→ Done:** That line appears in the Contact (“How to Engage”) section.

---

## Phase 2: Free 30-Minute Conversation — Calendly & Form

### 2.1 Calendly setup

1. Create a [Calendly](https://calendly.com) account (free tier is fine).
2. Create an event type: **“Fresh Roots — Free 30-Minute Discovery Call.”**
   - Duration: 30 minutes.
   - Buffer between meetings if desired.
   - Add a short description (e.g. “A casual conversation about your organization and how we might help.”).
   - Optional: Add Calendly’s “Questions” to collect **company name** and **company website** so you have them even when users book directly.
3. Use the Calendly **link** and/or **embed** on the website:
   - **Link:** “Book a free 30-min call” → `https://calendly.com/your-link`.
   - **Embed:** Use Calendly’s inline embed in a modal or a dedicated block on the **How to Engage** / **Contact** section.

### 2.2 Pre-call intake form (alternative or complement)

**Purpose:** Capture org context and problem **before** the call. This aligns with Client Discovery inputs: **company name**, **company website**, and (implicitly) **problem**.

**Suggested fields:**

| Field | Required | Notes |
|-------|----------|--------|
| **Company name** | Yes | `{{company_name}}` for Client Discovery |
| **Company website** | Yes | `{{company_website}}` for Client Discovery |
| **Your name** | Yes | Who you’ll schedule with |
| **Email** | Yes | Where to send calendar link / questionnaire |
| **What problem are you trying to solve?** | Yes | Free text; helps you prep for the call and tailor the questionnaire |
| **Industry** (optional) | No | Dropdown or short text |
| **Team size** (optional) | No | e.g. 1–5, 6–10, or “Prefer not to say” |

**Form placement:** In the **How to Engage** or **Contact** section, clearly labeled (e.g. “Or tell us about your organization first — we’ll reach out to schedule a call”).  
**→ Done:** Form is inside Step 2 (“Book a conversation”), with copy: “Or fill out the form below and we’ll reach out to schedule.”

**Form handling (implemented):**

- **Decision:** Use **our own backend** (Next.js API route) instead of Formspree/Netlify.
- **Implemented:** `POST /api/contact` accepts JSON, validates required fields, appends to `Website/data/submissions.json` with a `received_at` timestamp. Post-submit message: “Thanks — we’ll be in touch within 1–2 business days to schedule your call.”
- **Optional later:** Add email notification (e.g. Resend) or move to a DB for production (e.g. Vercel); see Phase 3 and [Form Submission Monitoring Plan](./Form%20Submission%20Monitoring%20Plan.md).

---

## Phase 3: Form Handling & Notifications

### 3.1 Implemented: Own backend

- **Form** submits via JavaScript to **`/api/contact`** (Next.js API route).
- **Storage:** Submissions are appended to **`Website/data/submissions.json`** (gitignored). Each entry includes all form fields plus `received_at`.
- **Production note:** On serverless (e.g. Vercel) the app filesystem is read-only; for production either use a DB (Vercel Postgres, Supabase) or an email-only flow (e.g. Resend) so you still receive submissions.

### 3.2 Optional: Notifications and storage

- **Email per submission:** Add Resend (or similar) in the API route; send yourself an email with the submission when `POST /api/contact` succeeds.
- **Google Sheet / Airtable / Notion:** Use Zapier, Make, or a serverless function to create a row per submission if you want a spreadsheet/CRM view.
- **DB in app:** Next.js API route + Vercel Postgres or Supabase if you want everything in one place and serverless-friendly storage.

### 3.3 Post-submission message

- **Done:** A clear **“Thanks — we’ll be in touch within 1–2 business days to schedule your call”** message is shown after a successful submit. On error, the form shows an error message (e.g. validation or network).

---

## Phase 4: Post–First-Call Workflow — Questionnaire Generation

**Objective:** After the first 30-minute conversation, you send a **tailored** questionnaire generated from the Client Discovery Prompt.

### 4.1 Inputs you need

- **Company name** — from form, Calendly questions, or call.
- **Company website** — same sources.
- Optional: Brief notes from the call (could be used to refine prompt inputs later; the prompt itself uses only name + website for now).

### 4.2 Running the Client Discovery Prompt

The prompt (see `Services/Client Discovery Prompt.md`) expects:

- `{{company_name}}`
- `{{company_website}}`

It produces:

1. **About Client** (markdown brief)
2. **Tailored service concept** (one primary offering for that client)
3. **Leadership/Owner Questionnaire** (10–20 questions in 3–5 groups)

**Ways to run it:**

| Approach | Effort | How |
|----------|--------|-----|
| **Manual** | Low | Paste prompt + replace placeholders in ChatGPT/Claude; copy questionnaire (and optionally other outputs) for the client. |
| **Notion / doc template** | Low | Keep the prompt in a template; you replace `{{...}}` and paste into an LLM. |
| **Lightweight tool** | Medium | Small app or script: you enter company name + website, it calls an LLM API with the full prompt and returns the three sections. You could build this as a Next.js route or a local CLI. |
| **Integrated workflow** | Higher | Form submission → auto-fetch website content → generate About Client + questionnaire; you review and send. |

**Recommendation:** Start with **manual** (or Notion template). Once you have a steady flow of leads, add a **lightweight tool** (e.g. simple UI that hits OpenAI/Anthropic API with the prompt) to speed things up.

### 4.3 Format of the questionnaire you send

- **Option A — Email:** Paste the questionnaire (markdown or plain text) into an email. Ask them to reply with answers.
- **Option B — Google Form / Typeform:** Create a form with the generated questions; send the link. Easier for them to fill and for you to analyze.
- **Option C — Doc:** Put the questionnaire in a shared Google Doc or Notion page; they add answers in designated sections.

Use whatever fits your style and volume; the prompt already defines the structure (headings, mix of open-ended and scale questions).

---

## Phase 5: Delivering the Questionnaire & Follow-Up

### 5.1 When to send

- **Right after the call** (same day or next) — while the conversation is fresh.
- Or **within 1–2 business days** if you need time to run the prompt and format the questionnaire.

### 5.2 Template email (example)

You can adapt this when sending the questionnaire:

```
Subject: Fresh Roots — Discovery Questionnaire for [Company Name]

Hi [Name],

Thanks for taking the time to speak today. As discussed, I’ve put together a short questionnaire to better understand [Company Name]’s goals, current setup, and priorities. Your answers will help me tailor how we can support you.

[Attach / link to questionnaire — Google Form, doc, or pasted questions.]

Please complete it at your convenience. If anything is unclear, just skip or add a note. I’ll follow up once I’ve reviewed your responses.

Best,
James
```

### 5.3 After they complete it

- Use the **About Client** and **Tailored Service Concept** (from the same prompt run) to shape your proposal or next conversation.
- Keep questionnaire answers in one place (doc, CRM, or tool) so you can refer back when scoping and delivering.

---

## Implementation Checklist

Use this as an ordered checklist. You can do Phases 1–2 first, then 3–5.

### Website

- [x] Add **“How to Engage”** (or **“Get Started”**) section: 3 steps (Learn → Book conversation → Post-call questionnaire). *(Folded into revamped Contact section.)*
- [x] Add **“How to Engage”** to navigation; ensure Hero **“Get Started”** scrolls to it (or Contact).
- [ ] Create Calendly event **“Free 30-Minute Discovery Call”** and add optional questions (company name, website).
- [x] Add **“Book a free 30-min call”** CTA linking to Calendly (and/or embed). *(Replace placeholder `CALENDLY_URL` in `Contact.tsx` with your real link.)*
- [x] Build **pre-call form** (company name, website, your name, email, “What problem are you trying to solve?”, optional industry/team size).
- [x] Wire form to backend. *(Own API: `POST /api/contact`; stores in `data/submissions.json`.)*
- [x] Add post-submit confirmation message (and optional “we received your info” email). *(Confirmation done; optional email not yet added.)*
- [x] Store form submissions. *(File-based in `Website/data/submissions.json`; optional DB/email for production.)*

### Workflow

- [ ] Document where you’ll keep form + Calendly leads (sheet, Notion, etc.).
- [ ] Create a **Client Discovery runbook**: where the prompt lives, how you substitute `{{company_name}}` and `{{company_website}}`, which LLM you use.
- [ ] Choose questionnaire delivery format (email, Google Form, Typeform, or doc) and create a template.
- [ ] Write and save the **“Discovery Questionnaire for [Company]”** email template.
- [ ] (Optional) Build a small **questionnaire generator** (e.g. Next.js page or script) that takes name + website and returns the three prompt outputs.

### Process

- [ ] Define **SLA**: e.g. respond to form within 1–2 business days; send questionnaire within 1–2 days after the first call.
- [ ] Add a **follow-up** step in your process (e.g. “Send questionnaire” and “Review answers → proposal”) so nothing falls through the cracks.

---

## Tech Notes

### Calendly embed (inline)

- In Calendly: Share → Embed → Inline. Copy the embed code.
- In Next.js, you can use an `iframe` in a new **“Book a call”** block or modal. Ensure `globals.css` or component styles account for the iframe width/height on mobile.

### Form backend (current)

- **Own API:** Form POSTs JSON to **`/api/contact`**; see `Website/app/api/contact/route.ts`. Submissions are stored in **`Website/data/submissions.json`** (see Phase 3). For production on serverless, add a DB or email (e.g. Resend).

### Form without custom backend (alternatives)

- **Formspree:** `action="https://formspree.io/f/YOUR_ID"`, `method="POST"`. No backend code required.
- **Netlify Forms:** Add `name="contact"` (or similar) and `data-netlify="true"` to the form; Netlify parses it at build time. See [Netlify Forms](https://docs.netlify.com/forms/setup/).

### Form + Calendly together

- **Form only:** User submits form → you email them a Calendly link. No direct Calendly on site.
- **Calendly primary, form optional:** “Prefer to tell us about your organization first? Fill out this form and we’ll reach out.” Both paths feed the same post-call workflow.

---

## Summary

| Phase | Focus | Status | Output |
|-------|--------|--------|--------|
| **1** | Website | Done | “How to Engage” folded into Contact; updated nav & CTAs; small-business tagline |
| **2** | Booking | Partial | Pre-call form live; Calendly CTA in place (add your link) |
| **3** | Form handling | Done | Own backend: `POST /api/contact` → `data/submissions.json`; post-submit message |
| **4** | Questionnaire | Pending | Run Client Discovery Prompt → tailored questionnaire |
| **5** | Delivery | Pending | Send questionnaire (email/form/doc) + template + follow-up process |

**Related:** Form/API monitoring is covered in [Form Submission Monitoring Plan](./Form%20Submission%20Monitoring%20Plan.md).

This gives you a clear path from **“interested visitor”** to **“first call”** to **“tailored discovery questionnaire”** using your existing Client Discovery Prompt and service offerings.
