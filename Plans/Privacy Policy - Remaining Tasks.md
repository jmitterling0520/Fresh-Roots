# Privacy Policy — Remaining Tasks

This plan tracks the **remaining follow-up tasks** for the Fresh Roots website Privacy Policy ([`/privacy`](../../Website/app/privacy/page.tsx)) so it stays accurate and compliant as the site evolves.

---

## Overview

| Task | Status | Notes |
|------|--------|------|
| Replace placeholder contact details (Section 9) | To do | Add real email or contact form link for privacy inquiries. |
| Review policy with a lawyer | To do | Tailor to jurisdiction (e.g. Michigan) and future services. |
| Update policy when adding tracking/cookies | To do (when applicable) | Update “Information we collect” and “Cookies”; add consent banner if needed. |

---

## Task 1: Replace Placeholder Contact Details (Section 9 — “Contact Us”)

**Objective:** Give visitors a clear way to reach you for privacy-related requests (access, correction, deletion, questions).

**Current state:** Section 9 says “By email or through the contact form on our website” with a link to `/#contact`. No dedicated privacy email.

**Options:**

| Option | Action |
|--------|--------|
| **A. Use main contact form** | Keep as-is if you’re happy for privacy requests to come through the same form. Ensure you check submissions and respond within a reasonable time (e.g. 30 days for access/deletion requests). |
| **B. Dedicated privacy email** | Add a specific email (e.g. `privacy@freshrootsconsulting.com`) in Section 9 of the privacy page. Update the “Contact Us” list to include that address. |
| **C. Contact form + email** | “Contact us via the [contact form](/contact) or at [your-email] for privacy requests.” |

**Steps:**

- [ ] Decide which option (A, B, or C).
- [ ] If B or C: obtain or confirm the email address to publish.
- [ ] Edit `Website/app/privacy/page.tsx`, Section 9 (“Contact Us”), and replace or supplement the placeholder with the chosen contact method.
- [ ] Save and deploy; spot-check the `/privacy` page.

---

## Task 2: Review Policy with a Lawyer

**Objective:** Have the Privacy Policy reviewed and tailored to your jurisdiction and business so it accurately reflects your practices and legal obligations.

**Why:** Laws vary by state (e.g. Michigan) and by audience (e.g. EU/UK → GDPR; California → CCPA). A lawyer can:

- Align wording with your actual data flows and retention.
- Add or adjust clauses for your jurisdiction.
- Advise on future services (e.g. analytics, cookies, client portals).

**Steps:**

- [ ] Identify a lawyer familiar with privacy / small business (or use your existing counsel).
- [ ] Share the current Privacy Policy and a short description of: what data you collect (contact form, Calendly if used), where it’s stored, how long you keep it, and any plans (e.g. Google Analytics, email marketing).
- [ ] Get written feedback or a redline.
- [ ] Implement agreed changes in `Website/app/privacy/page.tsx`.
- [ ] Update the “Effective date” at the top if you make material changes.
- [ ] Re-publish the updated policy.

---

## Task 3: When Adding Tracking or Cookies — Update Policy and (If Needed) Consent

**Objective:** Whenever you add analytics, advertising, or other non-essential cookies/tracking, update the Privacy Policy and add a cookie/consent mechanism if required (e.g. GDPR, CCPA).

**Trigger:** You add (or plan to add) any of:

- Google Analytics, Plausible, or similar analytics
- Advertising or remarketing pixels
- Non-essential cookies (e.g. preference or marketing cookies)
- Third-party embeds that set cookies (e.g. some video or social widgets)

**Steps:**

1. **Update “Information we collect”**
   - [ ] Describe the new data (e.g. pages visited, device/browser info, IP, cookie IDs).
   - [ ] State the purpose (e.g. analytics, improving the site, advertising).

2. **Add or expand a “Cookies” (or “Cookies and similar technologies”) section**
   - [ ] List categories of cookies (strictly necessary, analytics, marketing, etc.).
   - [ ] Name the tools (e.g. Google Analytics) and link to their privacy policies.
   - [ ] Explain how long cookies last and how users can control or delete them (browser settings, opt-out links).

3. **Consent / choice (if required)**
   - [ ] If you have EU/UK or other visitors and use non-essential cookies: add a **cookie consent banner** or similar (e.g. “Accept” / “Reject” / “Manage preferences”) and only set non-essential cookies after consent.
   - [ ] Document in the policy that you use a consent mechanism and how users can change preferences.

4. **Implementation**
   - [ ] Implement the consent banner or script (e.g. next/script for GA, or a consent manager).
   - [ ] Test: no non-essential cookies before consent (if required).
   - [ ] Publish the updated Privacy Policy and bump the “Effective date” if the changes are material.

**Reference:** Current policy states we do not use non-essential cookies. When that changes, this section and the “Information we collect” section must be updated.

---

## Summary Checklist

| # | Task | Done |
|---|------|------|
| 1 | Replace placeholder contact details in Section 9 | ☐ |
| 2 | Review policy with a lawyer; implement changes | ☐ |
| 3 | When adding tracking/cookies: update policy + add consent if needed | ☐ (when applicable) |

---

*Last updated: February 2, 2026*
