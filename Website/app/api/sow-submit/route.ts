import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { Resend } from 'resend'
import { getSow } from '@/lib/sow/registry'
import { saveSowSubmission } from '@/lib/sow/sow-storage'
import { getBaseUrl } from '@/lib/sow/base-url'
import type { SowSubmission } from '@/lib/sow/types'

function validate(
  body: Record<string, unknown>
): { ok: true; data: SowSubmission } | { ok: false; error: string } {
  const sowSlug = body.sow_slug
  if (sowSlug == null || typeof sowSlug !== 'string' || sowSlug.trim() === '') {
    return { ok: false, error: 'SOW slug is required' }
  }
  const sow = getSow(sowSlug.trim())
  if (!sow || sow.meta.status !== 'active') {
    return { ok: false, error: 'SOW not found' }
  }

  const email = body.email
  if (email == null || typeof email !== 'string' || email.trim() === '') {
    return { ok: false, error: 'Email is required' }
  }
  const signerName = body.signer_name
  if (signerName == null || typeof signerName !== 'string' || signerName.trim() === '') {
    return { ok: false, error: 'Signer name is required' }
  }
  const signerTitle = body.signer_title
  if (signerTitle == null || typeof signerTitle !== 'string' || signerTitle.trim() === '') {
    return { ok: false, error: 'Title is required' }
  }
  const signatureImage = body.signature_image
  if (signatureImage == null || typeof signatureImage !== 'string' || !signatureImage) {
    return { ok: false, error: 'Signature is required' }
  }

  return {
    ok: true,
    data: {
      token: randomUUID(),
      sow_slug: sow.meta.slug,
      customer_name: sow.meta.customer,
      email: String(email).trim(),
      signer_name: String(signerName).trim(),
      signer_title: String(signerTitle).trim(),
      signature_image: signatureImage,
      client_signer_date:
        body.client_signer_date != null
          ? String(body.client_signer_date).trim()
          : '',
    },
  }
}

function buildEmailHtml(
  submission: SowSubmission & { received_at: string },
  approvalUrl: string,
  sowTitle: string
): string {
  const rows: [string, string][] = [
    ['SOW', sowTitle],
    ['Customer', submission.customer_name],
    ['Email', submission.email],
    ['Signer name', submission.signer_name],
    ['Signer title', submission.signer_title],
    ['Client signer date', submission.client_signer_date],
    ['Received at', submission.received_at],
  ]
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;">${label}</td><td style="padding:6px 0;">${String(value).replace(/</g, '&lt;')}</td></tr>`
    )
    .join('')
  const signatureImg = submission.signature_image
    ? `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;">Signature</td><td style="padding:6px 0;"><img src="${submission.signature_image}" alt="Customer signature" style="max-width:200px;max-height:60px;" /></td></tr>`
    : ''
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5;">
  <h2 style="margin-top:0;">SOW submitted for review</h2>
  <table style="border-collapse: collapse;">${body}${signatureImg}</table>
  <p style="margin-top:1.5rem;"><a href="${approvalUrl}" style="display:inline-block;padding:10px 20px;background:#3a4556;color:white;text-decoration:none;border-radius:6px;font-weight:600;">Approve this SOW</a></p>
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

    const sow = getSow(validated.data.sow_slug)!
    const submission = {
      ...validated.data,
      received_at: new Date().toISOString(),
    }

    await saveSowSubmission(submission)

    const baseUrl = getBaseUrl(request)
    const approvalUrl = `${baseUrl}/sow/${submission.sow_slug}/approve/${submission.token}`

    const resendKey = process.env.RESEND_API_KEY
    const toEmail = process.env.CONTACT_FORM_TO_EMAIL

    if (resendKey && toEmail) {
      const resend = new Resend(resendKey)
      const fromEmail =
        process.env.CONTACT_FORM_FROM_EMAIL ||
        'Fresh Roots Contact <onboarding@resend.dev>'
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        subject: `Fresh Roots: SOW submitted for review — ${submission.customer_name}`,
        html: buildEmailHtml(submission, approvalUrl, sow.meta.title),
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
    const msg = err instanceof Error ? err.message : String(err)
    const code =
      err instanceof Error && 'code' in err
        ? String((err as { code?: string }).code)
        : ''
    console.error('SOW submit error:', msg, code ? `[${code}]` : '')
    if (process.env.VERCEL === '1' && !process.env.BLOB_READ_WRITE_TOKEN) {
      console.error(
        'Hint: Set BLOB_READ_WRITE_TOKEN in Vercel → Settings → Environment Variables, then redeploy.'
      )
    }
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    )
  }
}
