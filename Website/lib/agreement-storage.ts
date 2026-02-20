/**
 * Agreement submission storage.
 * Uses Upstash Redis in production (Vercel) when env vars are set,
 * falls back to file storage for local development.
 */

import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import type { AgreementSubmission } from '@/app/api/agreement-submit/route'

export type StoredSubmission = AgreementSubmission & {
  token: string
  received_at: string
  approved?: boolean
  consultant_name?: string
  consultant_title?: string
  consultant_signature?: string
  consultant_date?: string
}

const REDIS_KEY_PREFIX = 'agreement:submission:'

function getSubmissionsPath(): string {
  const dir = path.join(process.cwd(), 'data')
  return path.join(dir, 'agreement-submissions.json')
}

function hasRedisEnv(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
  )
}

export async function getSubmissionByToken(
  token: string
): Promise<StoredSubmission | null> {
  if (hasRedisEnv()) {
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
      const raw = await redis.get<string>(`${REDIS_KEY_PREFIX}${token}`)
      if (!raw) return null
      return typeof raw === 'string' ? (JSON.parse(raw) as StoredSubmission) : (raw as StoredSubmission)
    } catch (err) {
      console.error('Redis get error:', err)
      throw err
    }
  }

  try {
    const filePath = getSubmissionsPath()
    const raw = await readFile(filePath, 'utf-8')
    const submissions: unknown[] = JSON.parse(raw)
    if (!Array.isArray(submissions)) return null
    const sub = submissions.find(
      (s) => (s as { token?: string }).token === token
    ) as StoredSubmission | undefined
    return sub ?? null
  } catch {
    return null
  }
}

export async function saveSubmission(
  submission: StoredSubmission
): Promise<void> {
  if (hasRedisEnv()) {
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
      await redis.set(
        `${REDIS_KEY_PREFIX}${submission.token}`,
        JSON.stringify(submission)
      )
      return
    } catch (err) {
      console.error('Redis set error:', err)
      throw err
    }
  }

  const filePath = getSubmissionsPath()
  const dir = path.dirname(filePath)
  let existing: StoredSubmission[] = []
  try {
    const raw = await readFile(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    existing = Array.isArray(parsed) ? parsed : []
  } catch {
    await mkdir(dir, { recursive: true })
  }
  existing.push(submission)
  await writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8')
}

export async function updateSubmission(
  token: string,
  updates: Partial<StoredSubmission>
): Promise<StoredSubmission | null> {
  const current = await getSubmissionByToken(token)
  if (!current) return null

  const updated = { ...current, ...updates }

  if (hasRedisEnv()) {
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
      await redis.set(
        `${REDIS_KEY_PREFIX}${token}`,
        JSON.stringify(updated)
      )
      return updated
    } catch (err) {
      console.error('Redis update error:', err)
      throw err
    }
  }

  const filePath = getSubmissionsPath()
  const raw = await readFile(filePath, 'utf-8')
  const submissions: StoredSubmission[] = JSON.parse(raw)
  const idx = submissions.findIndex((s) => s.token === token)
  if (idx < 0) return null
  submissions[idx] = updated
  await writeFile(filePath, JSON.stringify(submissions, null, 2), 'utf-8')
  return updated
}
