/**
 * SOW submission storage.
 * Uses private Vercel Blob when BLOB_READ_WRITE_TOKEN is set,
 * falls back to file storage for local development.
 */

import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import type { SowSubmission } from '@/lib/sow/types'
import { getJson, hasBlobEnv, putJson } from '@/lib/blob-store'

export type StoredSowSubmission = SowSubmission & {
  token: string
  received_at: string
  approved?: boolean
  consultant_name?: string
  consultant_title?: string
  consultant_signature?: string
  consultant_date?: string
}

function blobPath(token: string): string {
  return `contracts/sows/${token}.json`
}

function getSubmissionsPath(): string {
  const dir = path.join(process.cwd(), 'data')
  return path.join(dir, 'sow-submissions.json')
}

export async function getSowSubmissionByToken(
  token: string
): Promise<StoredSowSubmission | null> {
  if (hasBlobEnv()) {
    try {
      return await getJson<StoredSowSubmission>(blobPath(token))
    } catch (err) {
      console.error('SOW Blob get error:', err)
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
    ) as StoredSowSubmission | undefined
    return sub ?? null
  } catch {
    return null
  }
}

export async function saveSowSubmission(
  submission: StoredSowSubmission
): Promise<void> {
  if (hasBlobEnv()) {
    try {
      await putJson(blobPath(submission.token), submission)
      return
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('SOW Blob set error:', msg)
      throw err
    }
  }

  const filePath = getSubmissionsPath()
  const dir = path.dirname(filePath)
  let existing: StoredSowSubmission[] = []
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

export async function updateSowSubmission(
  token: string,
  updates: Partial<StoredSowSubmission>
): Promise<StoredSowSubmission | null> {
  const current = await getSowSubmissionByToken(token)
  if (!current) return null

  const updated = { ...current, ...updates }

  if (hasBlobEnv()) {
    try {
      await putJson(blobPath(token), updated)
      return updated
    } catch (err) {
      console.error('SOW Blob update error:', err)
      throw err
    }
  }

  const filePath = getSubmissionsPath()
  const raw = await readFile(filePath, 'utf-8')
  const submissions: StoredSowSubmission[] = JSON.parse(raw)
  const idx = submissions.findIndex((s) => s.token === token)
  if (idx < 0) return null
  submissions[idx] = updated
  await writeFile(filePath, JSON.stringify(submissions, null, 2), 'utf-8')
  return updated
}
