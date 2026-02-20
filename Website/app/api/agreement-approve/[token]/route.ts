import { NextResponse } from 'next/server'
import { getSubmissionByToken } from '@/lib/agreement-storage'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const sub = await getSubmissionByToken(token)
    if (!sub) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    if (sub.approved) {
      return NextResponse.json({ error: 'Agreement already approved' }, { status: 400 })
    }

    return NextResponse.json({
      email: sub.email,
      client_name: sub.client_name,
      cap_hours: sub.cap_hours,
      cap_dollars: sub.cap_dollars,
      signer_name: sub.signer_name,
      signer_title: sub.signer_title,
      signature_image: sub.signature_image,
      client_signer_date: sub.client_signer_date,
    })
  } catch (err) {
    console.error('Agreement approve GET error:', err)
    return NextResponse.json({ error: 'Failed to load submission' }, { status: 500 })
  }
}
