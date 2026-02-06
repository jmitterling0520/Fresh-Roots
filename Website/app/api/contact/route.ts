import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'
import { Resend } from 'resend'

export type ContactSubmission = {
  your_name: string
  email: string
  company_name: string
  company_website: string
  problem: string
  industry?: string
  team_size?: string
}

const REQUIRED = ['your_name', 'email', 'company_name', 'company_website', 'problem'] as const

function getSubmissionsPath(): string {
  const dir = path.join(process.cwd(), 'data')
  return path.join(dir, 'submissions.json')
}

function validate(body: Record<string, unknown>): { ok: true; data: ContactSubmission } | { ok: false; error: string } {
  for (const key of REQUIRED) {
    const val = body[key]
    if (val == null || typeof val !== 'string' || val.trim() === '') {
      return { ok: false, error: `Missing or invalid: ${key}` }
    }
  }
  return {
    ok: true,
    data: {
      your_name: String(body.your_name).trim(),
      email: String(body.email).trim(),
      company_name: String(body.company_name).trim(),
      company_website: String(body.company_website).trim(),
      problem: String(body.problem).trim(),
      industry: body.industry != null ? String(body.industry).trim() : undefined,
      team_size: body.team_size != null ? String(body.team_size).trim() : undefined,
    },
  }
}

function buildEmailHtml(submission: ContactSubmission & { received_at: string }): string {
  const rows = [
    ['Name', submission.your_name],
    ['Email', submission.email],
    ['Company', submission.company_name],
    ['Company website', submission.company_website],
    ['Problem', submission.problem],
    ...(submission.industry ? [['Industry', submission.industry]] : []),
    ...(submission.team_size ? [['Team size', submission.team_size]] : []),
    ['Received at', submission.received_at],
  ]
  const body = rows
    .map(([label, value]) => `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;">${label}</td><td style="padding:6px 0;">${String(value).replace(/</g, '&lt;')}</td></tr>`)
    .join('')
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.5;">
  <h2 style="margin-top:0;">New contact form submission</h2>
  <table style="border-collapse: collapse;">${body}</table>
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

    const resendKey = process.env.RESEND_API_KEY
    const toEmail = process.env.CONTACT_FORM_TO_EMAIL

    if (resendKey && toEmail) {
      const resend = new Resend(resendKey)
      const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL || 'Fresh Roots Contact <onboarding@resend.dev>'
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: [toEmail],
        subject: `Fresh Roots: New inquiry from ${submission.your_name} (${submission.company_name})`,
        html: buildEmailHtml(submission),
      })
      if (error) {
        console.error('Resend error:', JSON.stringify(error))
        return NextResponse.json(
          { error: 'Failed to send notification' },
          { status: 500 }
        )
      }
      return NextResponse.json({ ok: true })
    }

    const filePath = getSubmissionsPath()
    const dir = path.dirname(filePath)
    let existing: unknown[] = []
    try {
      const raw = await readFile(filePath, 'utf-8')
      existing = JSON.parse(raw)
      if (!Array.isArray(existing)) existing = []
    } catch {
      await mkdir(dir, { recursive: true })
    }
    existing.push(submission)
    await writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    )
  }
}
