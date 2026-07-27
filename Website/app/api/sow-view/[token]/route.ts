import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSowSubmissionByToken } from '@/lib/sow/sow-storage'
import { getSow } from '@/lib/sow/registry'
import { getSowHtmlBuilder } from '@/lib/sow/html-registry'
import { createSowMagicToken, verifySowMagicToken } from '@/lib/sow/sow-magic'
import { getBaseUrl } from '@/lib/sow/base-url'

function isAuthorizedEmail(
  email: string,
  submissionEmail: string,
  consultantEmail: string | undefined
): boolean {
  const e = email.trim().toLowerCase()
  if (submissionEmail.toLowerCase() === e) return true
  if (consultantEmail && consultantEmail.toLowerCase() === e) return true
  return false
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const sub = await getSowSubmissionByToken(token)
    if (!sub) {
      return NextResponse.json({ error: 'SOW not found' }, { status: 404 })
    }
    if (
      !sub.approved ||
      !sub.consultant_name ||
      !sub.consultant_title ||
      !sub.consultant_signature
    ) {
      return NextResponse.json({ error: 'SOW not yet approved' }, { status: 400 })
    }

    const sow = getSow(sub.sow_slug)
    const buildHtml = getSowHtmlBuilder(sub.sow_slug)
    if (!sow || !buildHtml) {
      return NextResponse.json({ error: 'SOW not found' }, { status: 404 })
    }

    const url = new URL(request.url)
    const accessToken = url.searchParams.get('access')
    if (!accessToken) {
      return NextResponse.json({ requireMagicLink: true }, { status: 200 })
    }

    const verifiedSowToken = await verifySowMagicToken(accessToken)
    if (!verifiedSowToken || verifiedSowToken !== token) {
      return NextResponse.json(
        { error: 'Invalid or expired link. Request a new one.' },
        { status: 403 }
      )
    }

    const effectiveDate = sub.consultant_date || sub.client_signer_date
    const baseUrl = getBaseUrl(request)
    const html = buildHtml(
      {
        email: sub.email,
        signer_name: sub.signer_name,
        signer_title: sub.signer_title,
        signature_image: sub.signature_image,
        client_signer_date: sub.client_signer_date,
      },
      {
        consultant_name: sub.consultant_name,
        consultant_title: sub.consultant_title,
        consultant_signature: sub.consultant_signature,
        consultant_date: sub.consultant_date!,
      },
      effectiveDate,
      baseUrl
    )

    return NextResponse.json({
      html,
      customerName: sub.customer_name,
      signatureDate: sub.consultant_date || sub.client_signer_date,
      sow_slug: sub.sow_slug,
      title: sow.meta.title,
    })
  } catch (err) {
    console.error('SOW view GET error:', err)
    return NextResponse.json({ error: 'Failed to load SOW' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const body = await request.json()
    const email = body?.email
    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const sub = await getSowSubmissionByToken(token)
    if (!sub) {
      return NextResponse.json({ error: 'SOW not found' }, { status: 404 })
    }
    if (
      !sub.approved ||
      !sub.consultant_name ||
      !sub.consultant_title ||
      !sub.consultant_signature
    ) {
      return NextResponse.json({ error: 'SOW not yet approved' }, { status: 400 })
    }

    const consultantEmail =
      process.env.CONTACT_FORM_TO_EMAIL || process.env.CONSULTANT_EMAIL
    if (!isAuthorizedEmail(email, sub.email, consultantEmail)) {
      return NextResponse.json(
        { error: 'This email is not authorized to view this SOW.' },
        { status: 403 }
      )
    }

    const magicToken = await createSowMagicToken(token, email.trim())
    const baseUrl = getBaseUrl(request)
    const viewUrl = `${baseUrl}/sow/${sub.sow_slug}/view/${token}?access=${magicToken}`

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
    }

    const resend = new Resend(resendKey)
    const fromEmail =
      process.env.CONTACT_FORM_FROM_EMAIL ||
      'Fresh Roots Consulting <onboarding@resend.dev>'
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [email.trim()],
      subject: `View your SOW — Fresh Roots Consulting`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5;">
  <h2 style="margin-top:0;">View your executed Statement of Work</h2>
  <p>Click the link below to view and download your SOW with Fresh Roots Consulting, LLC.</p>
  <p style="margin-top:1.5rem;"><a href="${viewUrl}" style="display:inline-block;padding:10px 20px;background:#3a4556;color:white;text-decoration:none;border-radius:6px;font-weight:600;">View SOW</a></p>
  <p style="font-size:0.9rem;color:#666;">This link expires in 24 hours. If you did not request this, you can ignore this email.</p>
  <p style="font-size:0.85rem;color:#888;">Or copy this link: ${viewUrl}</p>
</body>
</html>`,
    })

    if (error) {
      console.error('Resend error:', JSON.stringify(error))
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('SOW view POST error:', err)
    return NextResponse.json({ error: 'Failed to send link' }, { status: 500 })
  }
}
