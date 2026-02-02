import { NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import path from 'path'

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
  // Use project root (Website/) so data lives in Website/data/
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
