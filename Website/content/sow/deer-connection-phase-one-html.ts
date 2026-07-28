import type { SowClientFields, SowConsultantFields } from '@/lib/sow/types'
import { deerConnectionMeta } from '@/content/sow/deer-connection-phase-one-meta'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildDeerConnectionSowHtml(
  client: SowClientFields,
  consultant: SowConsultantFields,
  effectiveDate: string,
  baseUrl: string = 'http://localhost:3000'
): string {
  const meta = deerConnectionMeta
  const contact = meta.customerContact!
  const origin = baseUrl.replace(/\/$/, '')
  const clientSig = client.signature_image
    ? `<img src="${client.signature_image}" alt="Customer signature" style="max-width:200px;max-height:60px;object-fit:contain;" />`
    : '__________________________'
  const consultantSig = consultant.consultant_signature
    ? `<img src="${consultant.consultant_signature}" alt="Provider signature" style="max-width:200px;max-height:60px;object-fit:contain;" />`
    : '__________________________'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fresh Roots Consulting - SOW (Executed) — ${esc(meta.product || meta.title)}</title>
<style>
body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.4; max-width: 8.5in; margin: 1in auto; padding: 0 1in; position: relative; }
h1 { font-size: 14pt; text-align: center; margin-bottom: 0.5em; margin-top: 3.5em; }
h2 { font-size: 12pt; font-weight: bold; margin-top: 1em; margin-bottom: 0.25em; }
h3 { font-size: 11pt; font-weight: bold; margin-top: 0.75em; margin-bottom: 0.2em; }
p { margin: 0.5em 0; text-align: justify; }
ul, ol { margin: 0.25em 0; padding-left: 1.5em; }
li { margin: 0.15em 0; }
table { border-collapse: collapse; width: 100%; margin: 0.75em 0; }
th, td { border: 1px solid #000; padding: 0.35em 0.5em; text-align: left; vertical-align: top; }
th { font-weight: bold; }
.sig-table { border: none; page-break-inside: avoid; break-inside: avoid; }
.sig-table td { border: none; padding: 0.25rem 1rem 0.25rem 0; }
code { font-family: ui-monospace, monospace; font-size: 10pt; }
hr { margin: 2em 0; border: none; border-top: 1px solid #ccc; }
h1, h2, h3 { page-break-after: avoid; break-after: avoid; }
.page-break { page-break-before: always; break-before: page; }
.agreement-logo { position: absolute; top: 0; left: 1in; max-width: 180px; max-height: 72px; z-index: 1; }
@media print { body { margin: 0.5in; padding-top: 2.5em; } .agreement-logo { top: 0; left: 0.5in; } }
</style>
</head>
<body>

<img src="${origin}/Fresh-roots-Logo-transparent.png" alt="Fresh Roots Consulting" class="agreement-logo" />

<h1>Fresh Roots Consulting<br>Statement of Work<br>Phase One POV Application Development</h1>

<h2>Document control</h2>
<table>
<tr><th>Field</th><th>Value</th></tr>
<tr><td>Document</td><td>Statement of Work (SOW) — Phase One POV Application Development</td></tr>
<tr><td>Product</td><td>${esc(meta.product || '')}</td></tr>
<tr><td>Engagement</td><td>${esc(meta.engagement || '')}</td></tr>
<tr><td>Provider</td><td>${esc(meta.provider)}</td></tr>
<tr><td>Customer</td><td>${esc(meta.customer)}</td></tr>
<tr><td>Customer contact</td><td>${esc(contact.name)} · ${esc(contact.email)} · ${esc(contact.phone || '')}</td></tr>
<tr><td>Effective Date</td><td>${esc(effectiveDate)}</td></tr>
<tr><td>Fixed fee</td><td>${esc(meta.fixedFee)}</td></tr>
<tr><td>Support</td><td>Excluded — separate Time &amp; Materials (T&amp;M) contract</td></tr>
</table>

<div class="page-break page-2">
<h2>1. Parties</h2>
<p>This Statement of Work ("SOW") is entered into as of the Effective Date by and between:</p>
<ul>
<li><strong>Provider:</strong> ${esc(meta.provider)} ("Provider")</li>
<li><strong>Customer:</strong> ${esc(meta.customer)} ("Customer")</li>
</ul>
<p>Provider and Customer may each be referred to as a "Party" and together as the "Parties."</p>

<h2>2. Purpose</h2>
<p>Provider will deliver <strong>Phase One POV application development</strong> for the <strong>Deer Connection</strong> hosted website application (also referred to as Deer Connect): configuration, completion, and <strong>Production Deployment</strong> of the as-built Phase One application so Customer can operate and evaluate the platform in a production environment.</p>
<p>This SOW is a <strong>fixed-fee development engagement</strong>. It is <strong>not</strong> a recurring SaaS subscription Order Form and does <strong>not</strong> include ongoing support, maintenance, or service-level commitments. Support will be addressed under a <strong>separate Time &amp; Materials contract</strong>.</p>
</div>

<div class="page-break page-3">
<h2>3. Definitions</h2>
<table>
<tr><th>Term</th><th>Meaning</th></tr>
<tr><td><strong>Phase One POV</strong></td><td>Delivery of the current as-built Deer Connection website application into a Customer-accessible production environment, including the in-scope capabilities listed in Section 5. It is not an open-ended build-from-scratch engagement.</td></tr>
<tr><td><strong>Production Deployment</strong></td><td>The application is available at the agreed production URL (for example <code>https://deerconnect.miinsightsconsultingllc.com</code> or another URL agreed in writing by the Parties).</td></tr>
<tr><td><strong>Deliverables</strong></td><td>The production-accessible hosted web application and any handoff notes reasonably needed for Customer to operate Phase One.</td></tr>
<tr><td><strong>Acceptance (payment trigger)</strong></td><td>For the second fixed-fee invoice, Acceptance occurs upon <strong>Production Deployment</strong>. Defects noted after deployment may be addressed under the separate T&amp;M support contract and do not delay the second payment.</td></tr>
</table>

<h2>4. High-level summary of the application</h2>
<p>Deer Connection is a Michigan-focused hosted <strong>website application</strong> that connects <strong>landowners</strong>, <strong>hunters</strong>, and <strong>venison recipients</strong> for private-land hunting access, hunt and scout coordination, and venison donation logistics. It helps address rising deer populations and limited hunter access by matching landowners who need herd management with hunters seeking land, while supporting a pathway for harvested venison to reach recipients.</p>
<p><strong>Value propositions</strong></p>
<ul>
<li><strong>Landowner-led control</strong> — Landowners review hunter profiles, initiate landowner–hunter connections, and set property-level rules; hunters do not browse or request landowners for those connections.</li>
<li><strong>Guided coordination</strong> — Role-specific conversation prompts and workflows reduce miscommunication around access, scheduling, and donation logistics.</li>
<li><strong>On-site event lifecycle</strong> — Scout, hunt, and pickup events with approvals, check-in/out, reminders, and post-event reporting.</li>
<li><strong>Venison donation pathway</strong> — Landowner–recipient and hunter–recipient connections with pickup coordination and food-safety guidance.</li>
</ul>
<p><strong>Delivery model</strong></p>
<ul>
<li>Hosted web application (browser-based) accessed via a production URL.</li>
<li>End users access the site at no charge (no consumer checkout in the application).</li>
<li>The platform is <strong>technology-only</strong>: Provider does not enforce hunting, food-safety, or wildlife law beyond in-product disclaimers and guidance; compliance and liability remain with users and applicable authorities.</li>
</ul>
<p><strong>Access language:</strong> web application, hosted site, browser access. Phase One scope does <strong>not</strong> include app-store distribution or native mobile app listings.</p>
</div>

<div class="page-break page-4">
<h2>5. Scope of work (in scope)</h2>
<p>Provider will deliver and deploy the as-built Phase One Deer Connection website application with the capabilities below (unless noted otherwise).</p>

<h3>5.1 Auth and accounts</h3>
<ul>
<li>Email/password signup and login</li>
<li>Multi-role profiles (landowner, hunter, and/or venison recipient on one account)</li>
<li>Scroll-to-acknowledge Terms of Service and Privacy Policy acceptance with version tracking</li>
<li>Password reset and email confirmation flows</li>
<li>18+ eligibility attestation at signup</li>
</ul>

<h3>5.2 Onboarding and dashboard</h3>
<ul>
<li>Role-specific setup wizards (landowner, hunter, venison recipient)</li>
<li>Getting Started checklist with progress on the signed-in dashboard</li>
<li>Dashboard KPIs for pending connections, event approvals, outstanding surveys, notifications, and upcoming events</li>
</ul>

<h3>5.3 Properties and profiles</h3>
<ul>
<li>Landowner multi-property setup with stable property keys, optional names, address, and acreage</li>
<li>Per-property constraints (for example house setback rules, hunt aids, acceptable weapons, DMAP/crop-damage permits, harvest preferences)</li>
<li>Hunter profile for landowner review (photo, location interest, acreage preferences, opportunity narrative, identity and disclosure fields)</li>
<li>Venison recipient pickup-area preferences (county/township)</li>
</ul>

<h3>5.4 Connections and matching</h3>
<ul>
<li>Mutual-acceptance connection types:
  <ul>
    <li><strong>Landowner ↔ Hunter (L–H)</strong> — landowner-initiated; location-matched suggestions</li>
    <li><strong>Landowner ↔ Venison recipient (L–R)</strong></li>
    <li><strong>Hunter ↔ Venison recipient (H–R)</strong> — hunter may initiate</li>
  </ul>
</li>
<li>Request, accept, reject, and inactivate flows</li>
<li>Profile preview for connection decisions</li>
<li>Invite-by-email for people not yet on the platform</li>
<li>Role guidance for Connect → Coordinate → Schedule workflows</li>
</ul>

<h3>5.5 Messaging and coordination</h3>
<ul>
<li>Person-to-person direct message threads</li>
<li>Realtime message delivery on the Coordination surface</li>
<li>Role-specific conversation prompt libraries (click-to-insert)</li>
<li>Schedule events from chat with property selection and availability awareness</li>
</ul>

<h3>5.6 Availability (landowner schedule)</h3>
<ul>
<li>Landowner preferred and blackout date rules, scoped per property or all properties</li>
<li>Activity scope (hunt, scout, or both)</li>
<li>Conflict-aware apply/save and saved-dates management</li>
<li>Hunters and other parties <strong>read</strong> availability when picking dates; they do <strong>not</strong> edit landowner schedule rules</li>
</ul>
</div>

<div class="page-break page-5">
<h3>5.7 Events (scout / hunt / pickup)</h3>
<ul>
<li>Create, edit, cancel, and filter events</li>
<li>Property association for multi-property landowners</li>
<li>Approval workflow for requested events</li>
<li>Check-in / check-out (hunter attendance for L–H; two-party flows for pickup-style events)</li>
<li>Automated status maintenance, check-in reminders, and arrival reminders (in-app and email where configured)</li>
<li>Event notifications surfaced in navigation, dashboard, and Events banners</li>
</ul>

<h3>5.8 Surveys and reporting</h3>
<ul>
<li>Post-scout survey (deer seen, notes) after check-out</li>
<li>Post-hunt harvest report (deer seen/harvested, buck/doe counts) with DNR-oriented disclaimer</li>
<li>Landowner read-only visibility of submitted surveys/reports</li>
<li>Outstanding-survey indicators on dashboard and navigation</li>
</ul>

<h3>5.9 Hunter property hub</h3>
<ul>
<li>List of connected properties grouped by landowner</li>
<li>Per-property view of upcoming/past events and property details</li>
</ul>

<h3>5.10 Help, FAQ, and resources</h3>
<ul>
<li>Smart FAQ (searchable Q&amp;A; optional LLM rephrase when enabled)</li>
<li>Global Questions &amp; Support entry point for guests and signed-in users</li>
<li>Public Resources page with curated Michigan DNR, CWD, processor, and related links</li>
</ul>

<h3>5.11 Legal surfaces</h3>
<ul>
<li>Public Terms of Service and Privacy Policy pages</li>
<li>In-product legal review at signup</li>
</ul>

<h3>5.12 Client access and deployment</h3>
<ul>
<li>Responsive web UI usable on desktop and mobile browsers</li>
<li>Production Deployment of the hosted website application at the agreed production URL</li>
<li>Store-distributed native apps are <strong>not</strong> included</li>
</ul>

<h2>6. Deliverables</h2>
<ol>
<li><strong>Production-accessible hosted web application</strong> — Deer Connection Phase One available at the agreed production URL.</li>
<li><strong>Handoff notes</strong> — Reasonable documentation or notes needed for Customer to operate Phase One (for example environment/access notes and known operational procedures). Formal runbooks, training programs, and ongoing operational support are out of scope unless separately contracted.</li>
</ol>
</div>

<div class="page-break page-6">
<h2>7. Assumptions</h2>
<ol>
<li><strong>Customer role.</strong> Customer is the sponsoring / operating organization for Phase One. End users access the website application at no charge; there is no consumer checkout in the application.</li>
<li><strong>Hosting.</strong> The application is hosted on infrastructure appropriate for Phase One (typically Vercel for the web application; Supabase for auth, database, storage, and realtime; SendGrid for transactional email; optional LLM provider for FAQ rephrase when enabled). Primary access is via the production web URL. Customer will provide or approve domain/DNS and related access as needed for Production Deployment.</li>
<li><strong>Web-only base distribution.</strong> Phase One is browser access to the hosted website application. Responsive layout on mobile browsers is included; native app packaging is not.</li>
<li><strong>Customer inputs.</strong> Customer provides program contacts, communications/branding inputs as needed, and accepts a Michigan-centric county/township location model unless expansion is ordered under a separate agreement.</li>
<li><strong>Eligibility and compliance.</strong> Users must be 18+. Customer does not expect Provider to enforce hunting, wildlife, or food-safety law beyond platform disclaimers and educational guidance.</li>
<li><strong>No in-app admin console.</strong> FAQ content changes and similar operations are performed via Provider processes and backend tooling, not a Customer-facing admin UI, unless separately ordered.</li>
<li><strong>Third-party dependencies.</strong> Availability of auth email (SMTP), SendGrid, hosting/CDN, and related providers is required. Outages or policy changes at those providers may affect service and are outside Provider's sole control.</li>
<li><strong>Geography and time.</strong> Default Phase One geography and event timezone assumptions are Michigan / <code>America/Detroit</code> (including Kent County pilot assumptions unless otherwise agreed in writing).</li>
<li><strong>No SLA in this SOW.</strong> Formal uptime SLAs and support response commitments apply only when a separate support / T&amp;M agreement is executed.</li>
</ol>

<h2>8. Out of scope</h2>
<p>The following are <strong>not</strong> included in this SOW and require a separate written agreement (T&amp;M support contract, change order, or future SOW/amendment):</p>
<ul>
<li>Ongoing support, maintenance, monitoring, or incident response</li>
<li>Formal uptime SLAs or support severity / response commitments</li>
<li>Native iOS/Android shells and/or Apple App Store / Google Play listing and store maintenance</li>
<li>In-app payments or consumer checkout</li>
<li>In-app insurance quoting or purchase</li>
<li>Downloadable hunting license agreement workflow as a managed in-product document process</li>
<li>In-app platform administration console</li>
<li>Geographic expansion beyond Phase One pilot assumptions (for example additional counties/programs)</li>
<li>New feature development beyond the as-built Phase One capabilities listed in Section 5</li>
<li>Connection-based SaaS packaging, Monthly Billable Connections (MBC) billing, or recurring platform subscription fees</li>
<li>Custom integrations, reporting exports beyond existing product surfaces, or dedicated Customer admin tooling</li>
<li>FAQ content campaigns or program-specific content authoring at scale</li>
</ul>
</div>

<div class="page-break page-7">
<h2>9. Support (separate contract)</h2>
<p><strong>Support is not included under this SOW.</strong></p>
<p>The Parties intend to address post-deployment support, defect triage, and related operational assistance under a <strong>separate Time &amp; Materials (T&amp;M) contract</strong>. Until that agreement is executed, Provider has no obligation under this SOW to provide ongoing support, maintenance, or SLA-backed response times.</p>
<p>Customer may designate primary and backup contacts and may log defects observed after Production Deployment for handling under the separate T&amp;M agreement.</p>

<h2>10. Fees and payment</h2>
<h3>10.1 Fixed fee</h3>
<p>Total fixed fee for Phase One POV application development and Production Deployment under this SOW: <strong>$10,000.00 USD</strong>.</p>
<h3>10.2 Payment schedule</h3>
<table>
<tr><th>Invoice</th><th>Trigger</th><th>Amount</th></tr>
<tr><td>Invoice 1</td><td>SOW signing (Effective Date)</td><td>$5,000.00</td></tr>
<tr><td>Invoice 2</td><td>Production Deployment</td><td>$5,000.00</td></tr>
</table>
<h3>10.3 Payment terms</h3>
<ul>
<li><strong>Payment terms:</strong> Net 15 from invoice date</li>
<li><strong>Currency:</strong> USD</li>
<li><strong>Taxes:</strong> Fees are exclusive of applicable taxes. Customer is responsible for applicable sales, use, and similar transaction taxes, excluding taxes on Provider's net income.</li>
<li>Undisputed amounts remain due per payment terms. Customer should notify Provider of invoice disputes within 15 days of invoice date with reasonable detail.</li>
</ul>
<p>The second payment is due upon <strong>Production Deployment</strong> as defined in Section 3. Post-deployment defect notes do not delay Invoice 2.</p>

<h2>11. Change control</h2>
<p>Work outside the Phase One scope in Sections 5–6, or changes to assumptions in Section 7 that materially increase effort, requires a <strong>written change order or SOW amendment</strong> (email confirmation acceptable if both Parties clearly agree) stating additional fees, timeline impact, and revised deliverables. Provider is not obligated to perform out-of-scope work without such agreement.</p>

<h2>12. Intellectual property</h2>
<p>Subject to final legal review and any overriding master agreement between the Parties:</p>
<ol>
<li><strong>Provider background IP.</strong> Provider retains all rights in its pre-existing materials, methods, tools, frameworks, and intellectual property (collectively, &ldquo;Provider Background IP&rdquo;). Provider Background IP does not include the Phase One Deer Connection application deliverables assigned under Section 12.2.</li>
<li><strong>Application ownership.</strong> Upon completion of this SOW—meaning <strong>Production Deployment</strong> and payment of the fixed fee amounts due under Section 10—Provider assigns and transfers to Customer all right, title, and interest in and to the delivered Phase One Deer Connection application (including source code, configuration, and related work product created for Customer under this SOW), free of Provider ownership claims other than Provider Background IP. To the extent Provider Background IP is embodied in the delivered application, Customer receives a perpetual, royalty-free, non-exclusive license to use that Background IP solely as embodied in the delivered application for Customer's operation of Deer Connection.</li>
<li><strong>Customer materials.</strong> Customer retains rights in Customer-provided branding, content, and data.</li>
<li><strong>Feedback.</strong> Provider may use general feedback and know-how without restriction, provided Customer Confidential Information is not disclosed and Customer's ownership of the assigned application is not impaired.</li>
</ol>
</div>

<div class="page-break page-8">
<h2>13. Term</h2>
<p>This SOW is effective on the Effective Date and continues through <strong>Production Deployment</strong> and payment of the fixed fee amounts due under Section 10, unless earlier terminated by mutual written agreement or for material breach uncured within a reasonable period after written notice.</p>
<p>Provisions that by their nature should survive (including fees owed, IP, and confidentiality if separately agreed) survive termination or completion.</p>

<h2>14. General</h2>
<ol>
<li>This SOW may be executed in counterparts (including electronic signature).</li>
<li>If the Parties have a separate master services or consulting agreement, that agreement governs to the extent it conflicts with this SOW, except that <strong>fees, payment schedule, and Phase One scope</strong> in this SOW control for this engagement.</li>
<li>This SOW becomes binding when signed by both Parties.</li>
</ol>

<h2>15. Signatures</h2>
<p><strong>IN WITNESS WHEREOF</strong>, the Parties have caused this SOW to be executed as of the Effective Date.</p>

<table class="sig-table" id="sig-table">
<tr><td><strong>Provider:</strong></td><td>${esc(meta.provider)}</td></tr>
<tr><td>Name:</td><td>${esc(consultant.consultant_name)}</td></tr>
<tr><td>Title:</td><td>${esc(consultant.consultant_title)}</td></tr>
<tr><td>Signed:</td><td>${consultantSig}</td></tr>
<tr><td>Date:</td><td>${esc(consultant.consultant_date)}</td></tr>
<tr><td colspan="2" style="height:1em;"></td></tr>
<tr><td><strong>Customer:</strong></td><td>${esc(meta.customer)}</td></tr>
<tr><td>Name:</td><td>${esc(client.signer_name)}</td></tr>
<tr><td>Title:</td><td>${esc(client.signer_title)}</td></tr>
<tr><td>Signed:</td><td>${clientSig}</td></tr>
<tr><td>Date:</td><td>${esc(client.client_signer_date)}</td></tr>
</table>
</div>

</body>
</html>`
}
