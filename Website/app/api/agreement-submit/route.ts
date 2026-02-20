import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { Resend } from 'resend'

export type AgreementSubmission = {
  token: string
  email: string
  client_name: string
  cap_hours: string
  cap_dollars: string
  signer_name: string
  signer_title: string
  signature_image: string | null
  client_signer_date: string
  approved?: boolean
}

function getSubmissionsPath(): string {
  const dir = path.join(process.cwd(), 'data')
  return path.join(dir, 'agreement-submissions.json')
}

function validate(body: Record<string, unknown>): { ok: true; data: AgreementSubmission } | { ok: false; error: string } {
  const email = body.email
  if (email == null || typeof email !== 'string' || email.trim() === '') {
    return { ok: false, error: 'Email is required' }
  }
  const clientName = body.client_name
  if (clientName == null || typeof clientName !== 'string' || clientName.trim() === '') {
    return { ok: false, error: 'Business name is required' }
  }
  return {
    ok: true,
    data: {
      token: randomUUID(),
      email: String(email).trim(),
      client_name: String(clientName).trim(),
      cap_hours: body.cap_hours != null ? String(body.cap_hours).trim() : '',
      cap_dollars: body.cap_dollars != null ? String(body.cap_dollars).trim() : '',
      signer_name: body.signer_name != null ? String(body.signer_name).trim() : '',
      signer_title: body.signer_title != null ? String(body.signer_title).trim() : '',
      signature_image: body.signature_image != null && typeof body.signature_image === 'string' ? body.signature_image : null,
      client_signer_date: body.client_signer_date != null ? String(body.client_signer_date).trim() : '',
    },
  }
}

function getBaseUrl(request: Request): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  if (url) return url.replace(/\/$/, '')
  const vercel = process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') || 'http'
  if (host) return `${proto}://${host}`
  return 'http://localhost:3000'
}

function buildEmailHtml(submission: AgreementSubmission & { received_at: string }, approvalUrl: string): string {
  const rows: [string, string][] = [
    ['Email', submission.email],
    ['Client (business name)', submission.client_name],
    ['Signer name', submission.signer_name],
    ['Signer title', submission.signer_title],
    ['Monthly cap (hours)', submission.cap_hours || '(none)'],
    ['Monthly cap ($)', submission.cap_dollars || '(none)'],
    ['Client signer date', submission.client_signer_date],
    ['Received at', submission.received_at],
  ]
  const body = rows
    .map(([label, value]) => `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;">${label}</td><td style="padding:6px 0;">${String(value).replace(/</g, '&lt;')}</td></tr>`)
    .join('')
  const signatureImg = submission.signature_image
    ? `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;">Signature</td><td style="padding:6px 0;"><img src="${submission.signature_image}" alt="Client signature" style="max-width:200px;max-height:60px;" /></td></tr>`
    : ''
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5;">
  <h2 style="margin-top:0;">Agreement submitted for review</h2>
  <table style="border-collapse: collapse;">${body}${signatureImg}</table>
  <p style="margin-top:1.5rem;"><a href="${approvalUrl}" style="display:inline-block;padding:10px 20px;background:#3a4556;color:white;text-decoration:none;border-radius:6px;font-weight:600;">Approve this agreement</a></p>
  <p style="font-size:0.9rem;color:#666;">Or copy this link: ${approvalUrl}</p>
</body>
</html>`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = validate(body)
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }

    const submission = {
      ...validated.data,
      received_at: new Date().toISOString(),
    }

    const filePath = getSubmissionsPath()
    const dir = path.dirname(filePath)
    let existing: AgreementSubmission[] = []
    try {
      const raw = await readFile(filePath, 'utf-8')
      const parsed = JSON.parse(raw)
      existing = Array.isArray(parsed) ? parsed : []
    } catch {
      await mkdir(dir, { recursive: true })
    }
    existing.push(submission)
    await writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8')

    const baseUrl = getBaseUrl(request)
    const approvalUrl = `${baseUrl}/agreement/approve/${submission.token}`

    const resendKey = process.env.RESEND_API_KEY
    const toEmail = process.env.CONTACT_FORM_TO_EMAIL

    if (resendKey && toEmail) {
      const resend = new Resend(resendKey)
      const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL || 'Fresh Roots Contact <onboarding@resend.dev>'
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        subject: `Fresh Roots: Agreement submitted for review — ${submission.client_name}`,
        html: buildEmailHtml(submission, approvalUrl),
      })
      if (error) {
        console.error('Resend error:', JSON.stringify(error))
        return NextResponse.json(
          { error: 'Failed to send notification' },
          { status: 500 }
        )
      }
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Agreement submit error:', err)
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    )
  }
}
