import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import type { AgreementSubmission } from '@/app/api/agreement-submit/route'

function getSubmissionsPath(): string {
  const dir = path.join(process.cwd(), 'data')
  return path.join(dir, 'agreement-submissions.json')
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    const filePath = getSubmissionsPath()
    const raw = await readFile(filePath, 'utf-8')
    const submissions: AgreementSubmission[] = JSON.parse(raw)
    if (!Array.isArray(submissions)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 500 })
    }

    const submission = submissions.find((s) => (s as AgreementSubmission & { token?: string }).token === token)
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    const sub = submission as AgreementSubmission & { token?: string }
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
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }
    console.error('Agreement approve GET error:', err)
    return NextResponse.json({ error: 'Failed to load submission' }, { status: 500 })
  }
}
