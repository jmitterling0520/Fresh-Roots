import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { AgreementSubmission } from '../agreement-submit/route'

function getSubmissionsPath(): string {
  const dir = path.join(process.cwd(), 'data')
  return path.join(dir, 'agreement-submissions.json')
}

type ApprovalPayload = {
  token: string
  consultant_name: string
  consultant_title: string
  consultant_signature: string
  consultant_date: string
}

function buildCompletedAgreementHtml(
  client: { client_name: string; signer_name: string; signer_title: string; client_signer_date: string; cap_hours: string; cap_dollars: string; signature_image: string | null },
  consultant: { consultant_name: string; consultant_title: string; consultant_signature: string; consultant_date: string },
  effectiveDate: string
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
body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.4; max-width: 8.5in; margin: 1in auto; padding: 0 1in; }
h1 { font-size: 14pt; text-align: center; margin-bottom: 0.5em; }
h2 { font-size: 12pt; font-weight: bold; margin-top: 1em; margin-bottom: 0.25em; }
p { margin: 0.5em 0; text-align: justify; }
ul { margin: 0.25em 0; padding-left: 1.5em; }
li { margin: 0.15em 0; }
table { border-collapse: collapse; width: 100%; margin: 0.75em 0; }
th, td { border: 1px solid #000; padding: 0.35em 0.5em; text-align: left; }
th { font-weight: bold; }
.sig-table { border: none; }
.sig-table td { border: none; padding: 0.25rem 1rem 0.25rem 0; }
hr { margin: 2em 0; border: none; border-top: 1px solid #ccc; }
@media print { body { margin: 0.5in; } }
</style>
</head>
<body>

<h1>Fresh Roots Consulting<br>Technology and Process Efficiency<br>Month to Month Agreement</h1>

<p>This Month to Month Retainer Agreement ("Agreement") is entered into as of ${effectiveDate} (the "Effective Date") between <strong>Fresh Roots Consulting, LLC</strong> ("Consultant"), with its principal place of business at 1100 S Second Ave, Alpena, MI 49707, and <strong>${client.client_name}</strong> ("Client").</p>

<p>This is a standalone agreement. The Standard Terms and Conditions in <strong>Exhibit A</strong> are incorporated by reference and apply to this Agreement.</p>

<p><strong>WHEREAS</strong>, Consultant is engaged in operations optimization and technology efficiency consulting (the "Services"), and Client desires to engage Consultant to provide such Services on a month-to-month retainer basis.</p>

<p><strong>NOW THEREFORE</strong>, Consultant and Client agree as follows:</p>

<h2>1. Scope of Services</h2>
<p>Consultant will provide professional services consisting of operations optimization and technology efficiency consulting, delivered remotely via web conference, phone, and email. Services are organized as Operations Optimization (Process Inefficiencies Analysis, Process Assessment &amp; Analysis, Efficiency Improvement Roadmaps, etc.) and Technology Efficiency (Technology Inefficiencies Analysis, Technology Stack Assessment, etc.).</p>

<h2>2. Service Plan, Rate, and Payment Terms</h2>
<p>Consultant's rate is <strong>$150.00 per hour</strong>. Client will be invoiced at the end of each month for Services performed during the prior month.</p>
<p><em>Monthly cap (if elected): ${displayCapHours} hours or $${displayCapDollars}</em></p>

<h2>3. Service Hours and Response Time</h2>
<p>Services: Monday–Friday, 9:00 a.m.–5:00 p.m. Eastern. Response: next business day.</p>

<h2>4. Term and Termination</h2>
<p>Month to month; auto-renews unless Client provides written notice at the beginning of the last week of the month. Either party may terminate for breach with 14 days' notice and opportunity to cure.</p>

<h2>5. Terms in This Agreement Prevail</h2>
<p>In the event of any conflict, the terms of this Agreement control.</p>

<table class="sig-table">
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

<hr>
<h1>EXHIBIT A – STANDARD TERMS AND CONDITIONS</h1>
<p>Payment terms, acceptance of deliverables, ownership of IP, confidentiality, non-solicitation, limitation of liability, arbitration, and miscellaneous terms apply as set forth in the standard Fresh Roots Consulting agreement terms.</p>

</body>
</html>`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const token = body.token
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }
    const consultantName = body.consultant_name
    const consultantTitle = body.consultant_title
    const consultantSignature = body.consultant_signature
    const consultantDate = body.consultant_date
    if (!consultantName?.trim() || !consultantTitle?.trim() || !consultantSignature) {
      return NextResponse.json({ error: 'Consultant name, title, and signature are required' }, { status: 400 })
    }

    const filePath = getSubmissionsPath()
    const raw = await readFile(filePath, 'utf-8')
    const submissions: (AgreementSubmission & { token?: string; approved?: boolean })[] = JSON.parse(raw)
    const idx = submissions.findIndex((s) => (s as { token?: string }).token === token)
    if (idx < 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    const sub = submissions[idx]
    if (sub.approved) {
      return NextResponse.json({ error: 'Agreement already approved' }, { status: 400 })
    }

    const approvalDate = consultantDate?.trim() || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const updated = {
      ...sub,
      approved: true,
      consultant_name: consultantName.trim(),
      consultant_title: consultantTitle.trim(),
      consultant_signature: consultantSignature,
      consultant_date: approvalDate,
    }
    submissions[idx] = updated

    await writeFile(filePath, JSON.stringify(submissions, null, 2), 'utf-8')

    const effectiveDate = approvalDate
    const html = buildCompletedAgreementHtml(
      {
        client_name: sub.client_name,
        signer_name: sub.signer_name,
        signer_title: sub.signer_title,
        client_signer_date: sub.client_signer_date,
        cap_hours: sub.cap_hours,
        cap_dollars: sub.cap_dollars,
        signature_image: sub.signature_image,
      },
      {
        consultant_name: consultantName.trim(),
        consultant_title: consultantTitle.trim(),
        consultant_signature: consultantSignature,
        consultant_date: approvalDate,
      },
      effectiveDate
    )

    return NextResponse.json({ ok: true, html })
  } catch (err) {
    const e = err as NodeJS.ErrnoException & { message?: string }
    if (e.code === 'ENOENT') {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    console.error('Agreement approve POST error:', e)
    const msg = e.code === 'EACCES' || e.code === 'EROFS'
      ? 'Cannot save approval (read-only filesystem). If deployed on Vercel, file storage is not supported.'
      : e.message || 'Failed to approve'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
