import { NextResponse } from 'next/server'
import {
  getSowSubmissionByToken,
  updateSowSubmission,
} from '@/lib/sow/sow-storage'
import { getSow } from '@/lib/sow/registry'
import { getSowHtmlBuilder } from '@/lib/sow/html-registry'
import { createSowMagicToken } from '@/lib/sow/sow-magic'
import { getBaseUrl } from '@/lib/sow/base-url'

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
    if (
      !consultantName?.trim() ||
      !consultantTitle?.trim() ||
      !consultantSignature
    ) {
      return NextResponse.json(
        { error: 'Consultant name, title, and signature are required' },
        { status: 400 }
      )
    }

    const sub = await getSowSubmissionByToken(token)
    if (!sub) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    if (sub.approved) {
      return NextResponse.json({ error: 'SOW already approved' }, { status: 400 })
    }

    const sow = getSow(sub.sow_slug)
    const buildHtml = getSowHtmlBuilder(sub.sow_slug)
    if (!sow || !buildHtml) {
      return NextResponse.json({ error: 'SOW not found' }, { status: 404 })
    }

    const approvalDate =
      consultantDate?.trim() ||
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    await updateSowSubmission(token, {
      approved: true,
      consultant_name: consultantName.trim(),
      consultant_title: consultantTitle.trim(),
      consultant_signature: consultantSignature,
      consultant_date: approvalDate,
    })

    const effectiveDate = approvalDate
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
      accessToken = await createSowMagicToken(token, sub.email)
    } catch {
      // Magic links require Redis; continue without if unavailable
    }

    return NextResponse.json({
      ok: true,
      html,
      accessToken,
      sow_slug: sub.sow_slug,
    })
  } catch (err) {
    const e = err as NodeJS.ErrnoException & { message?: string }
    console.error('SOW approve error:', e?.message || err)
    return NextResponse.json({ error: 'Failed to approve SOW' }, { status: 500 })
  }
}
