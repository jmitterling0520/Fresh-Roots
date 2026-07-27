import { NextResponse } from 'next/server'
import { getSowSubmissionByToken } from '@/lib/sow/sow-storage'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const sub = await getSowSubmissionByToken(token)
    if (!sub) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    if (sub.approved) {
      return NextResponse.json({ error: 'SOW already approved' }, { status: 400 })
    }

    return NextResponse.json({
      sow_slug: sub.sow_slug,
      email: sub.email,
      customer_name: sub.customer_name,
      signer_name: sub.signer_name,
      signer_title: sub.signer_title,
      signature_image: sub.signature_image,
      client_signer_date: sub.client_signer_date,
    })
  } catch (err) {
    console.error('SOW approve GET error:', err)
    return NextResponse.json(
      { error: 'Failed to load submission' },
      { status: 500 }
    )
  }
}
