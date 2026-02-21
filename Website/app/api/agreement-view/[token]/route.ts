import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSubmissionByToken } from '@/lib/agreement-storage'
import { buildCompletedAgreementHtml } from '@/lib/agreement-html'
import { createMagicToken, verifyMagicToken } from '@/lib/agreement-magic'

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

    const sub = await getSubmissionByToken(token)
    if (!sub) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 })
    }
    if (!sub.approved || !sub.consultant_name || !sub.consultant_title || !sub.consultant_signature) {
      return NextResponse.json({ error: 'Agreement not yet approved' }, { status: 400 })
    }

    const url = new URL(request.url)
    const accessToken = url.searchParams.get('access')
    if (!accessToken) {
      return NextResponse.json({ requireMagicLink: true }, { status: 200 })
    }

    const verifiedAgreementToken = await verifyMagicToken(accessToken)
    if (!verifiedAgreementToken || verifiedAgreementToken !== token) {
      return NextResponse.json({ error: 'Invalid or expired link. Request a new one.' }, { status: 403 })
    }

    const effectiveDate = sub.consultant_date || sub.client_signer_date
    const baseUrl = getBaseUrl(request)
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
      clientName: sub.client_name,
      signatureDate: sub.consultant_date || sub.client_signer_date,
    })
  } catch (err) {
    console.error('Agreement view GET error:', err)
    return NextResponse.json({ error: 'Failed to load agreement' }, { status: 500 })
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

    const sub = await getSubmissionByToken(token)
    if (!sub) {
      return NextResponse.json({ error: 'Agreement not found' }, { status: 404 })
    }
    if (!sub.approved || !sub.consultant_name || !sub.consultant_title || !sub.consultant_signature) {
      return NextResponse.json({ error: 'Agreement not yet approved' }, { status: 400 })
    }

    const consultantEmail = process.env.CONTACT_FORM_TO_EMAIL || process.env.CONSULTANT_EMAIL
    if (!isAuthorizedEmail(email, sub.email, consultantEmail)) {
      return NextResponse.json({ error: 'This email is not authorized to view this agreement.' }, { status: 403 })
    }

    const magicToken = await createMagicToken(token, email.trim())
    const baseUrl = getBaseUrl(request)
    const viewUrl = `${baseUrl}/agreement/view/${token}?access=${magicToken}`

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
    }

    const resend = new Resend(resendKey)
    const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL || 'Fresh Roots Consulting <onboarding@resend.dev>'
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [email.trim()],
      subject: `View your agreement — Fresh Roots Consulting`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5;">
  <h2 style="margin-top:0;">View your executed agreement</h2>
  <p>Click the link below to view and download your agreement with Fresh Roots Consulting, LLC.</p>
  <p style="margin-top:1.5rem;"><a href="${viewUrl}" style="display:inline-block;padding:10px 20px;background:#3a4556;color:white;text-decoration:none;border-radius:6px;font-weight:600;">View agreement</a></p>
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
    console.error('Agreement view POST error:', err)
    return NextResponse.json({ error: 'Failed to send link' }, { status: 500 })
  }
}
