/**
 * Magic link tokens for viewing approved SOWs.
 * Stored as private Vercel Blob JSON with a 24-hour expiresAt.
 */

import { randomBytes } from 'crypto'
import { deleteBlob, getJson, hasBlobEnv, putJson } from '@/lib/blob-store'

const MAGIC_TTL_MS = 24 * 60 * 60 * 1000

type MagicPayload = {
  submissionToken: string
  expiresAt: string
}

function magicPath(magicToken: string): string {
  return `contracts/magic/sows/${magicToken}.json`
}

export function generateSowMagicToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createSowMagicToken(
  sowToken: string,
  _email: string
): Promise<string> {
  if (!hasBlobEnv()) {
    throw new Error(
      'Magic links require BLOB_READ_WRITE_TOKEN (Vercel Blob)'
    )
  }
  const magicToken = generateSowMagicToken()
  const expiresAt = new Date(Date.now() + MAGIC_TTL_MS).toISOString()
  await putJson(magicPath(magicToken), {
    submissionToken: sowToken,
    expiresAt,
  } satisfies MagicPayload)
  return magicToken
}

export async function verifySowMagicToken(
  magicToken: string
): Promise<string | null> {
  if (!hasBlobEnv()) return null
  try {
    const payload = await getJson<MagicPayload>(magicPath(magicToken))
    if (!payload?.submissionToken || !payload.expiresAt) return null
    if (Date.now() > new Date(payload.expiresAt).getTime()) {
      try {
        await deleteBlob(magicPath(magicToken))
      } catch {
        /* ignore cleanup errors */
      }
      return null
    }
    return payload.submissionToken
  } catch {
    return null
  }
}
