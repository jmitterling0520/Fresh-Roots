# How to Engage with Fresh Roots — Implementation Plan

This plan covers **website changes** and **workflow processes** so new potential clients can (1) understand what Fresh Roots does, (2) book a free 30-minute conversation (Calendly or form), and (3) receive a tailored post-call questionnaire generated from the [Client Discovery Prompt](../Services/Client%20Discovery%20Prompt.md).

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
- **Content:**
  1. **Step 1 — Learn.** Briefly restate that the site explains what we do (About, Services, Expertise) and link to those sections.
  2. **Step 2 — Book a conversation.** Free 30-minute call to discuss their organization and goals. Two options:
     - **Option A:** Schedule directly with [Calendly link/embed].
     - **Option B:** Fill out a short form (company name, website, what problem they’re trying to solve). You’ll reach out to schedule.
  3. **Step 3 — After our first conversation.** You’ll send a tailored discovery questionnaire so you can better understand their needs and propose next steps.

### 1.2 Update navigation and CTAs

- Add **“How to Engage”** (or “Get Started”) to the nav; link to `#how-to-engage` or `#contact` if you merge it with Contact.
- Ensure the Hero **“Get Started”** CTA scrolls to the engagement section (or Contact) rather than only showing email/phone.
- Add a secondary CTA in **Contact** (or **How to Engage**): e.g. **“Book a free 30-min call”** and **“Tell us about your organization”** (form).

### 1.3 Clarify “what we do” on the site

- **Services** and **Expertise** already explain offerings. Optionally add a single short “We help small businesses (1–10 employees) with process, technology, data, and automation” line near the top or in **How to Engage** to reinforce who you serve.

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

**Form handling options (Phase 3):**

- **Simple:** Form submits to a **form backend** (e.g. Formspree, Netlify Forms, Google Forms) → email notification to you → you manually schedule via Calendly and send the link.
- **Integrated:** Form POST to your own API/route → store submissions (e.g. Airtable, Google Sheet, or DB) and optionally trigger “we’ve received your submission” email + add to your calendar workflow.

---

## Phase 3: Form Handling & Notifications

### 3.1 Minimal setup (quickest)

- Use **Formspree** or **Netlify Forms** (if deployed on Netlify):
  - Form `action` points to their endpoint.
  - You receive an email per submission with all fields.
  - You then manually add the lead to your process (spreadsheet, CRM, or todo) and send a Calendly link.

### 3.2 Optional: Store submissions

- **Google Sheet:** Formspree can forward to a Google Sheet via Zapier/Make, or use Google Forms instead of a custom form (trade-off: less control over UI).
- **Airtable / Notion:** Use Zapier, Make, or a small serverless function to create a row per submission.
- **Your app:** Next.js API route + serverless DB (e.g. Vercel Postgres, Supabase) if you want everything in one place later.

### 3.3 Post-submission message

- Show a clear **“Thanks — we’ll be in touch within 1–2 business days to schedule your call”** (or similar) message after form submit.
- Optional: Send an automated **“We received your info”** email (e.g. via Formspree or your backend).

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

- [ ] Add **“How to Engage”** (or **“Get Started”**) section: 3 steps (Learn → Book conversation → Post-call questionnaire).
- [ ] Add **“How to Engage”** to navigation; ensure Hero **“Get Started”** scrolls to it (or Contact).
- [ ] Create Calendly event **“Free 30-Minute Discovery Call”** and add optional questions (company name, website).
- [ ] Add **“Book a free 30-min call”** CTA linking to Calendly (and/or embed).
- [ ] Build **pre-call form** (company name, website, your name, email, “What problem are you trying to solve?”).
- [ ] Wire form to Formspree / Netlify Forms (or chosen backend); configure email notifications.
- [ ] Add post-submit confirmation message (and optional “we received your info” email).
- [ ] Optionally store form submissions (Google Sheet, Airtable, etc.) if desired.

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

### Form without custom backend

- **Formspree:** `action="https://formspree.io/f/YOUR_ID"`, `method="POST"`. No backend code required.
- **Netlify Forms:** Add `name="contact"` (or similar) and `data-netlify="true"` to the form; Netlify parses it at build time. See [Netlify Forms](https://docs.netlify.com/forms/setup/).

### Form + Calendly together

- **Form only:** User submits form → you email them a Calendly link. No direct Calendly on site.
- **Calendly primary, form optional:** “Prefer to tell us about your organization first? Fill out this form and we’ll reach out.” Both paths feed the same post-call workflow.

---

## Summary

| Phase | Focus | Output |
|-------|--------|--------|
| **1** | Website | “How to Engage” section, updated nav & CTAs |
| **2** | Booking | Calendly live + pre-call form (company, website, problem) |
| **3** | Form handling | Notifications + optional storage |
| **4** | Questionnaire | Run Client Discovery Prompt → tailored questionnaire |
| **5** | Delivery | Send questionnaire (email/form/doc) + template + follow-up process |

This gives you a clear path from **“interested visitor”** to **“first call”** to **“tailored discovery questionnaire”** using your existing Client Discovery Prompt and service offerings.
