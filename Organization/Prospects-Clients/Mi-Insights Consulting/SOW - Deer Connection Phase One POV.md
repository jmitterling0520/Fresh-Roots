# Statement of Work — Deer Connection Phase One POV

> **DRAFT FOR REVIEW — not a signed agreement.**  
> This document is for discussion with Mi-Insights Consulting. Commercial and legal terms are subject to final review and mutual execution. It is not legal advice.

---

## Document control

| Field | Value |
| --- | --- |
| Document | Statement of Work (SOW) — Phase One POV Application Development |
| Status | Draft for review |
| Product | Deer Connection / Deer Connect |
| Engagement | Phase One proof-of-value (POV) application development and Production Deployment |
| Provider | Fresh Roots Consulting, LLC |
| Customer | Mi-Insights Consulting |
| Customer contact | Anna Mitterling · anna@miinsightsconsultingllc.com · 517-614-2507 |
| Effective Date | ____________________ (to be completed on signing) |
| Fixed fee | $10,000 USD |
| Support | Excluded — separate Time & Materials (T&M) contract |

---

## 1. Parties

This Statement of Work (“SOW”) is entered into as of the Effective Date by and between:

- **Provider:** Fresh Roots Consulting, LLC (“Provider”)
- **Customer:** Mi-Insights Consulting (“Customer”)

Provider and Customer may each be referred to as a “Party” and together as the “Parties.”

---

## 2. Purpose

Provider will deliver **Phase One POV application development** for the **Deer Connection** hosted website application (also referred to as Deer Connect): configuration, completion, and **Production Deployment** of the as-built Phase One application so Customer can operate and evaluate the platform in a production environment.

This SOW is a **fixed-fee development engagement**. It is **not** a recurring SaaS subscription Order Form and does **not** include ongoing support, maintenance, or service-level commitments. Support will be addressed under a **separate Time & Materials contract**.

---

## 3. Definitions

| Term | Meaning |
| --- | --- |
| **Phase One POV** | Delivery of the current as-built Deer Connection website application into a Customer-accessible production environment, including the in-scope capabilities listed in Section 5. It is not an open-ended build-from-scratch engagement. |
| **Production Deployment** | The application is available at the agreed production URL (for example `https://deerconnect.miinsightsconsultingllc.com` or another URL agreed in writing by the Parties). |
| **Deliverables** | The production-accessible hosted web application and any handoff notes reasonably needed for Customer to operate Phase One. |
| **Acceptance (payment trigger)** | For the second fixed-fee invoice, Acceptance occurs upon **Production Deployment**. Defects noted after deployment may be addressed under the separate T&M support contract and do not delay the second payment. |

---

## 4. High-level summary of the application

Deer Connection is a Michigan-focused hosted **website application** that connects **landowners**, **hunters**, and **venison recipients** for private-land hunting access, hunt and scout coordination, and venison donation logistics. It helps address rising deer populations and limited hunter access by matching landowners who need herd management with hunters seeking land, while supporting a pathway for harvested venison to reach recipients.

**Value propositions**

- **Landowner-led control** — Landowners review hunter profiles, initiate landowner–hunter connections, and set property-level rules; hunters do not browse or request landowners for those connections.
- **Guided coordination** — Role-specific conversation prompts and workflows reduce miscommunication around access, scheduling, and donation logistics.
- **On-site event lifecycle** — Scout, hunt, and pickup events with approvals, check-in/out, reminders, and post-event reporting.
- **Venison donation pathway** — Landowner–recipient and hunter–recipient connections with pickup coordination and food-safety guidance.

**Delivery model**

- Hosted web application (browser-based) accessed via a production URL.
- End users access the site at no charge (no consumer checkout in the application).
- The platform is **technology-only**: Provider does not enforce hunting, food-safety, or wildlife law beyond in-product disclaimers and guidance; compliance and liability remain with users and applicable authorities.

**Access language:** web application, hosted site, browser access. Phase One scope does **not** include app-store distribution or native mobile app listings.

---

## 5. Scope of work (in scope)

Provider will deliver and deploy the as-built Phase One Deer Connection website application with the capabilities below (unless noted otherwise).

### 5.1 Auth and accounts

- Email/password signup and login
- Multi-role profiles (landowner, hunter, and/or venison recipient on one account)
- Scroll-to-acknowledge Terms of Service and Privacy Policy acceptance with version tracking
- Password reset and email confirmation flows
- 18+ eligibility attestation at signup

### 5.2 Onboarding and dashboard

- Role-specific setup wizards (landowner, hunter, venison recipient)
- Getting Started checklist with progress on the signed-in dashboard
- Dashboard KPIs for pending connections, event approvals, outstanding surveys, notifications, and upcoming events

### 5.3 Properties and profiles

- Landowner multi-property setup with stable property keys, optional names, address, and acreage
- Per-property constraints (for example house setback rules, hunt aids, acceptable weapons, DMAP/crop-damage permits, harvest preferences)
- Hunter profile for landowner review (photo, location interest, acreage preferences, opportunity narrative, identity and disclosure fields)
- Venison recipient pickup-area preferences (county/township)

### 5.4 Connections and matching

- Mutual-acceptance connection types:
  - **Landowner ↔ Hunter (L–H)** — landowner-initiated; location-matched suggestions
  - **Landowner ↔ Venison recipient (L–R)**
  - **Hunter ↔ Venison recipient (H–R)** — hunter may initiate
- Request, accept, reject, and inactivate flows
- Profile preview for connection decisions
- Invite-by-email for people not yet on the platform
- Role guidance for Connect → Coordinate → Schedule workflows

### 5.5 Messaging and coordination

- Person-to-person direct message threads
- Realtime message delivery on the Coordination surface
- Role-specific conversation prompt libraries (click-to-insert)
- Schedule events from chat with property selection and availability awareness

### 5.6 Availability (landowner schedule)

- Landowner preferred and blackout date rules, scoped per property or all properties
- Activity scope (hunt, scout, or both)
- Conflict-aware apply/save and saved-dates management
- Hunters and other parties **read** availability when picking dates; they do **not** edit landowner schedule rules

### 5.7 Events (scout / hunt / pickup)

- Create, edit, cancel, and filter events
- Property association for multi-property landowners
- Approval workflow for requested events
- Check-in / check-out (hunter attendance for L–H; two-party flows for pickup-style events)
- Automated status maintenance, check-in reminders, and arrival reminders (in-app and email where configured)
- Event notifications surfaced in navigation, dashboard, and Events banners

### 5.8 Surveys and reporting

- Post-scout survey (deer seen, notes) after check-out
- Post-hunt harvest report (deer seen/harvested, buck/doe counts) with DNR-oriented disclaimer
- Landowner read-only visibility of submitted surveys/reports
- Outstanding-survey indicators on dashboard and navigation

### 5.9 Hunter property hub

- List of connected properties grouped by landowner
- Per-property view of upcoming/past events and property details

### 5.10 Help, FAQ, and resources

- Smart FAQ (searchable Q&A; optional LLM rephrase when enabled)
- Global Questions & Support entry point for guests and signed-in users
- Public Resources page with curated Michigan DNR, CWD, processor, and related links

### 5.11 Legal surfaces

- Public Terms of Service and Privacy Policy pages
- In-product legal review at signup

### 5.12 Client access and deployment

- Responsive web UI usable on desktop and mobile browsers
- Production Deployment of the hosted website application at the agreed production URL
- Store-distributed native apps are **not** included

---

## 6. Deliverables

1. **Production-accessible hosted web application** — Deer Connection Phase One available at the agreed production URL.
2. **Handoff notes** — Reasonable documentation or notes needed for Customer to operate Phase One (for example environment/access notes and known operational procedures). Formal runbooks, training programs, and ongoing operational support are out of scope unless separately contracted.

---

## 7. Assumptions

1. **Customer role.** Customer is the sponsoring / operating organization for Phase One. End users access the website application at no charge; there is no consumer checkout in the application.
2. **Hosting.** The application is hosted on infrastructure appropriate for Phase One (typically Vercel for the web application; Supabase for auth, database, storage, and realtime; SendGrid for transactional email; optional LLM provider for FAQ rephrase when enabled). Primary access is via the production web URL. Customer will provide or approve domain/DNS and related access as needed for Production Deployment.
3. **Web-only base distribution.** Phase One is browser access to the hosted website application. Responsive layout on mobile browsers is included; native app packaging is not.
4. **Customer inputs.** Customer provides program contacts, communications/branding inputs as needed, and accepts a Michigan-centric county/township location model unless expansion is ordered under a separate agreement.
5. **Eligibility and compliance.** Users must be 18+. Customer does not expect Provider to enforce hunting, wildlife, or food-safety law beyond platform disclaimers and educational guidance.
6. **No in-app admin console.** FAQ content changes and similar operations are performed via Provider processes and backend tooling, not a Customer-facing admin UI, unless separately ordered.
7. **Third-party dependencies.** Availability of auth email (SMTP), SendGrid, hosting/CDN, and related providers is required. Outages or policy changes at those providers may affect service and are outside Provider’s sole control.
8. **Geography and time.** Default Phase One geography and event timezone assumptions are Michigan / `America/Detroit` (including Kent County pilot assumptions unless otherwise agreed in writing).
9. **No SLA in this SOW.** Formal uptime SLAs and support response commitments apply only when a separate support / T&M agreement is executed.

---

## 8. Out of scope

The following are **not** included in this SOW and require a separate written agreement (T&M support contract, change order, or future SOW/amendment):

- Ongoing support, maintenance, monitoring, or incident response
- Formal uptime SLAs or support severity / response commitments
- Native iOS/Android shells and/or Apple App Store / Google Play listing and store maintenance
- In-app payments or consumer checkout
- In-app insurance quoting or purchase
- Downloadable hunting license agreement workflow as a managed in-product document process
- In-app platform administration console
- Geographic expansion beyond Phase One pilot assumptions (for example additional counties/programs)
- New feature development beyond the as-built Phase One capabilities listed in Section 5
- Connection-based SaaS packaging, Monthly Billable Connections (MBC) billing, or recurring platform subscription fees
- Custom integrations, reporting exports beyond existing product surfaces, or dedicated Customer admin tooling
- FAQ content campaigns or program-specific content authoring at scale

---

## 9. Support (separate contract)

**Support is not included under this SOW.**

The Parties intend to address post-deployment support, defect triage, and related operational assistance under a **separate Time & Materials (T&M) contract**. Until that agreement is executed, Provider has no obligation under this SOW to provide ongoing support, maintenance, or SLA-backed response times.

Customer may designate primary and backup contacts and may log defects observed after Production Deployment for handling under the separate T&M agreement.

---

## 10. Fees and payment

### 10.1 Fixed fee

Total fixed fee for Phase One POV application development and Production Deployment under this SOW: **$10,000.00 USD**.

### 10.2 Payment schedule

| Invoice | Trigger | Amount |
| --- | --- | ---: |
| Invoice 1 | SOW signing (Effective Date) | $5,000.00 |
| Invoice 2 | Production Deployment | $5,000.00 |

### 10.3 Payment terms

- **Payment terms:** Net 15 from invoice date
- **Currency:** USD
- **Taxes:** Fees are exclusive of applicable taxes. Customer is responsible for applicable sales, use, and similar transaction taxes, excluding taxes on Provider’s net income.
- Undisputed amounts remain due per payment terms. Customer should notify Provider of invoice disputes within 15 days of invoice date with reasonable detail.

The second payment is due upon **Production Deployment** as defined in Section 3. Post-deployment defect notes do not delay Invoice 2.

---

## 11. Change control

Work outside the Phase One scope in Sections 5–6, or changes to assumptions in Section 7 that materially increase effort, requires a **written change order or SOW amendment** (email confirmation acceptable if both Parties clearly agree) stating additional fees, timeline impact, and revised deliverables. Provider is not obligated to perform out-of-scope work without such agreement.

---

## 12. Intellectual property

Subject to final legal review and any overriding master agreement between the Parties:

1. **Provider background IP.** Provider retains all rights in its pre-existing materials, methods, tools, frameworks, and intellectual property (collectively, “Provider Background IP”). Provider Background IP does not include the Phase One Deer Connection application deliverables assigned under Section 12.2.
2. **Application ownership.** Upon completion of this SOW—meaning **Production Deployment** and payment of the fixed fee amounts due under Section 10—Provider assigns and transfers to Customer all right, title, and interest in and to the delivered Phase One Deer Connection application (including source code, configuration, and related work product created for Customer under this SOW), free of Provider ownership claims other than Provider Background IP. To the extent Provider Background IP is embodied in the delivered application, Customer receives a perpetual, royalty-free, non-exclusive license to use that Background IP solely as embodied in the delivered application for Customer’s operation of Deer Connection.
3. **Customer materials.** Customer retains rights in Customer-provided branding, content, and data.
4. **Feedback.** Provider may use general feedback and know-how without restriction, provided Customer Confidential Information is not disclosed and Customer’s ownership of the assigned application is not impaired.

---

## 13. Term

This SOW is effective on the Effective Date and continues through **Production Deployment** and payment of the fixed fee amounts due under Section 10, unless earlier terminated by mutual written agreement or for material breach uncured within a reasonable period after written notice.

Provisions that by their nature should survive (including fees owed, IP, and confidentiality if separately agreed) survive termination or completion.

---

## 14. General

1. This SOW may be executed in counterparts (including electronic signature).  
2. If the Parties have a separate master services or consulting agreement, that agreement governs to the extent it conflicts with this SOW, except that **fees, payment schedule, and Phase One scope** in this SOW control for this engagement.  
3. This draft is for review only until signed by both Parties.

---

## 15. Signatures

**IN WITNESS WHEREOF**, the Parties have caused this SOW to be executed as of the Effective Date.

### Provider

**Fresh Roots Consulting, LLC**

| | |
| --- | --- |
| Signature | ________________________________ |
| Name | ________________________________ |
| Title | ________________________________ |
| Date | ________________________________ |

### Customer

**Mi-Insights Consulting**

| | |
| --- | --- |
| Signature | ________________________________ |
| Name | Anna Mitterling (or authorized signer) |
| Title | ________________________________ |
| Date | ________________________________ |

---

## Related follow-ups (not part of this SOW)

- Separate **Time & Materials support contract** (channels, rates, severity/response, included vs excluded work)
- Any future commercial arrangements Customer may choose (for example additional development, hosting assistance, or optional billing models), without implying Provider retains ownership of Deer Connection after assignment under Section 12
- Change orders for features beyond Phase One as-built scope
