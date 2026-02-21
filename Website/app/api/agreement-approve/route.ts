import { NextResponse } from 'next/server'
import { getSubmissionByToken, updateSubmission } from '@/lib/agreement-storage'
import { buildCompletedAgreementHtml } from '@/lib/agreement-html'
import { createMagicToken } from '@/lib/agreement-magic'

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

    const sub = await getSubmissionByToken(token)
    if (!sub) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    if (sub.approved) {
      return NextResponse.json({ error: 'Agreement already approved' }, { status: 400 })
    }

    const approvalDate = consultantDate?.trim() || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    await updateSubmission(token, {
      approved: true,
      consultant_name: consultantName.trim(),
      consultant_title: consultantTitle.trim(),
      consultant_signature: consultantSignature,
      consultant_date: approvalDate,
    })

    const effectiveDate = approvalDate
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
        consultant_name: consultantName.trim(),
        consultant_title: consultantTitle.trim(),
        consultant_signature: consultantSignature,
        consultant_date: approvalDate,
      },
      effectiveDate,
      baseUrl
    )

    let accessToken: string | undefined
    try {
      accessToken = await createMagicToken(token, sub.email)
    } catch {
      // Magic links require Redis; continue without if unavailable
    }

    return NextResponse.json({ ok: true, html, accessToken })
  } catch (err) {
    const e = err as NodeJS.ErrnoException & { message?: string }
    console.error('Agreement approve POST error:', e)
    const msg = e.code === 'EACCES' || e.code === 'EROFS'
      ? 'Cannot save approval (read-only filesystem). If deployed on Vercel, file storage is not supported.'
      : e.message || 'Failed to approve'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
