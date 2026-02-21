/**
 * Build completed agreement HTML (both signatures).
 */

export function buildCompletedAgreementHtml(
  client: {
    client_name: string
    signer_name: string
    signer_title: string
    client_signer_date: string
    cap_hours: string
    cap_dollars: string
    signature_image: string | null
  },
  consultant: {
    consultant_name: string
    consultant_title: string
    consultant_signature: string
    consultant_date: string
  },
  effectiveDate: string,
  baseUrl: string = 'http://localhost:3000'
): string {
  const displayCapHours = client.cap_hours || '__________'
  const displayCapDollars = client.cap_dollars || '__________'
  const clientSig = client.signature_image
    ? `<img src="${client.signature_image}" alt="Client signature" style="max-width:200px;max-height:60px;object-fit:contain;" />`
    : '__________________________'
  const consultantSig = consultant.consultant_signature
    ? `<img src="${consultant.consultant_signature}" alt="Consultant signature" style="max-width:200px;max-height:60px;object-fit:contain;" />`
    : '__________________________'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fresh Roots Consulting - Agreement (Executed)</title>
<style>
body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.4; max-width: 8.5in; margin: 1in auto; padding: 0 1in; position: relative; }
h1 { font-size: 14pt; text-align: center; margin-bottom: 0.5em; margin-top: 3.5em; }
h2 { font-size: 12pt; font-weight: bold; margin-top: 1em; margin-bottom: 0.25em; }
p { margin: 0.5em 0; text-align: justify; }
ul { margin: 0.25em 0; padding-left: 1.5em; }
li { margin: 0.15em 0; }
table { border-collapse: collapse; width: 100%; margin: 0.75em 0; }
th, td { border: 1px solid #000; padding: 0.35em 0.5em; text-align: left; }
th { font-weight: bold; }
.sig-table { border: none; page-break-inside: avoid; break-inside: avoid; }
.sig-table td { border: none; padding: 0.25rem 1rem 0.25rem 0; }
hr { margin: 2em 0; border: none; border-top: 1px solid #ccc; }
h1, h2 { page-break-after: avoid; break-after: avoid; }
.page-break { page-break-before: always; break-before: page; }
.agreement-logo { position: absolute; top: 0; left: 1in; max-width: 180px; max-height: 72px; z-index: 1; }
@media print { body { margin: 0.5in; padding-top: 2.5em; } .agreement-logo { top: 0; left: 0.5in; } }
</style>
</head>
<body>

<img src="${baseUrl.replace(/\/$/, '')}/Fresh-roots-Logo-transparent.png" alt="Fresh Roots Consulting" class="agreement-logo" />

<h1>Fresh Roots Consulting<br>Technology and Process Efficiency<br>Month to Month Agreement</h1>

<p>This Month to Month Retainer Agreement ("Agreement") is entered into as of ${effectiveDate} (the "Effective Date") between <strong>Fresh Roots Consulting, LLC</strong> ("Consultant"), with its principal place of business at 1100 S Second Ave, Alpena, MI 49707, and <strong>${client.client_name}</strong> ("Client").</p>

<p>This is a standalone agreement. The Standard Terms and Conditions in <strong>Exhibit A</strong> are incorporated by reference and apply to this Agreement.</p>

<p><strong>WHEREAS</strong>, Consultant is engaged in operations optimization and technology efficiency consulting (the "Services"), and Client desires to engage Consultant to provide such Services on a month-to-month retainer basis.</p>

<p><strong>NOW THEREFORE</strong>, Consultant and Client agree as follows:</p>

<div class="page-1">
<h2>1. Scope of Services</h2>
<p>Consultant will provide professional services consisting of operations optimization and technology efficiency consulting, delivered remotely via web conference, phone, and email. Services are organized as Operations Optimization (Process Inefficiencies Analysis, Process Assessment &amp; Analysis, Efficiency Improvement Roadmaps, etc.) and Technology Efficiency (Technology Inefficiencies Analysis, Technology Stack Assessment, etc.).</p>

<h2>2. Service Plan, Rate, and Payment Terms</h2>
<p>Consultant's rate is <strong>$150.00 per hour</strong>. Client will be invoiced at the end of each month for Services performed during the prior month.</p>
<p><em>Monthly cap (if elected): ${displayCapHours} hours or $${displayCapDollars}</em></p>

<h2>3. Service Hours and Response Time</h2>
<p>Services: Monday–Friday, 9:00 a.m.–5:00 p.m. Eastern. Response: next business day.</p>
</div>

<div class="page-break page-2">
<h2>4. Term and Termination</h2>
<p>Month to month; auto-renews unless Client provides written notice at the beginning of the last week of the month. Either party may terminate for breach with 14 days' notice and opportunity to cure.</p>

<h2>5. Terms in This Agreement Prevail</h2>
<p>In the event of any conflict, the terms of this Agreement control.</p>

<table class="sig-table" id="sig-table">
<tr><td><strong>Client:</strong></td><td>${client.client_name}</td></tr>
<tr><td>Name:</td><td>${client.signer_name}</td></tr>
<tr><td>Title:</td><td>${client.signer_title}</td></tr>
<tr><td>Signed:</td><td>${clientSig}</td></tr>
<tr><td>Date:</td><td>${client.client_signer_date}</td></tr>
<tr><td colspan="2" style="height:1em;"></td></tr>
<tr><td><strong>Fresh Roots Consulting, LLC</strong></td><td></td></tr>
<tr><td>Name:</td><td>${consultant.consultant_name}</td></tr>
<tr><td>Title:</td><td>${consultant.consultant_title}</td></tr>
<tr><td>Signed:</td><td>${consultantSig}</td></tr>
<tr><td>Date:</td><td>${consultant.consultant_date}</td></tr>
</table>
</div>

<div class="page-break exhibit-a page-3"><hr>
<h1>EXHIBIT A – STANDARD TERMS AND CONDITIONS</h1>
<p>The following Standard Terms and Conditions are incorporated by reference into the Month to Month Agreement (the "Agreement") between Fresh Roots Consulting, LLC, a Michigan limited liability company ("Consultant"), and Client (together with its affiliates, "Client"). Capitalized terms used in this Exhibit A have the same meaning as in the Agreement unless defined here.</p>

<h2>1. No Additional Terms; Amendments.</h2>
<p>No additional or different terms proposed by Client will become part of the Agreement or any related agreement, and any such terms are rejected. The Agreement and these Standard Terms may be amended only by a written amendment signed by both parties.</p>

<h2>2. Payment Terms; Acceptance of Deliverables.</h2>
<p><strong>Payment.</strong> Client will be invoiced as described in the Agreement. All invoices are due upon receipt. If Client disputes any invoice, Client shall pay the undisputed portion promptly, give Consultant written notice of the disputed amount, and work with Consultant to resolve the dispute within fifteen (15) days. Consultant may suspend work without prejudice if undisputed amounts are not paid when due. Past-due amounts will bear interest at the rate of one percent (1%) per month (or the maximum rate permitted by law, if lower) and will be subject to reasonable costs of collection, including attorneys' fees.</p>
<p><strong>Acceptance.</strong> Any deliverable will be deemed accepted when it conforms to the descriptions and specifications in the Agreement. Client will have fourteen (14) days from delivery to notify Consultant in writing if a deliverable does not conform. If Client does not notify Consultant within that period, the deliverable is deemed accepted. If Client notifies Consultant of non-conformance within that period, Consultant will use commercially reasonable efforts to correct the non-conformance at no additional charge; redelivery will restart the acceptance period for that deliverable.</p>
</div>

<div class="page-break page-4">
<h2>3. Ownership of Intellectual Property; License.</h2>
<p><strong>Client materials.</strong> Client retains all rights in its trademarks, service marks, copyrighted works, confidential and proprietary information, and other intellectual property that it provides to Consultant for the Services.</p>
<p><strong>Consultant work product.</strong> Except for Client materials and the license below, Consultant retains all rights in its work product, including methods, processes, templates, tools, and other pre-existing or developed materials ("Consultant IP").</p>
<p><strong>License to Client.</strong> Consultant grants to Client a worldwide, perpetual, irrevocable, fully paid, non-exclusive (and, where applicable, transferable) license to use all Consultant IP included in deliverables solely for Client's internal business use in connection with the engagement, and not for resale or other commercial exploitation.</p>

<h2>4. Confidentiality; Non-Solicitation.</h2>
<p><strong>Confidentiality.</strong> Each party will keep confidential all non-public information received from the other and will use it only to perform or receive the Services or use the work product under the Agreement.</p>
<p><strong>Non-solicitation.</strong> For two (2) years after the Effective Date, neither party will, without the other's prior written consent, directly or indirectly solicit for employment or hire any person who is then (or was during the term) an employee or contractor of the other party. This does not prohibit: (a) hiring a person who contacts the hiring party on his or her own initiative without solicitation, or (b) general recruitment (e.g., advertisements, search firms) not targeted at the other party's personnel.</p>
</div>

<div class="page-break page-5">
<h2>5. Limitation of Liability.</h2>
<p>CONSULTANT WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS OR DATA, ARISING OUT OF OR RELATED TO THE AGREEMENT OR THE SERVICES. CONSULTANT'S TOTAL LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATED TO THE AGREEMENT OR THE SERVICES WILL NOT EXCEED THE AMOUNT PAID BY CLIENT TO CONSULTANT IN THE SIX (6) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY.</p>

<h2>6. Dispute Resolution; Arbitration.</h2>
<p>Any dispute arising under the Agreement will be resolved by binding arbitration administered by the American Arbitration Association ("AAA") under its Commercial Arbitration Rules. The arbitration will be conducted by a single arbitrator familiar with technology or consulting services. The arbitration will be held in Michigan (location to be agreed or as determined by the AAA). The arbitrator's award will be final and binding and may be entered in any court of competent jurisdiction. The non-prevailing party will pay the prevailing party's reasonable attorneys' fees and costs incurred in connection with the arbitration.</p>

<h2>7. Miscellaneous.</h2>
<p>Neither party may assign the Agreement without the other's prior written consent. A waiver of any breach is not a waiver of any other or subsequent breach; waivers must be in writing. The Agreement is governed by the laws of the State of Michigan, without regard to conflict of laws. The Agreement and Exhibit A (and any attachments) constitute the entire agreement and supersede all prior agreements and communications relating to the subject matter. If any provision is held invalid or unenforceable, the remainder remains in effect. Persons signing on behalf of an entity represent that they are authorized to do so. The Agreement may be executed in counterparts and by PDF or electronic signature, each of which will be an original.</p>
</div>

</body>
</html>`
}
