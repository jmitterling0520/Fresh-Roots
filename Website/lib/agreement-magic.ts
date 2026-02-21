/**
 * Magic link tokens for viewing approved agreements.
 * Requires Redis; no file-storage fallback.
 */

import { randomBytes } from 'crypto'

const MAGIC_PREFIX = 'agreement:magic:'
const MAGIC_TTL_SECONDS = 24 * 60 * 60 // 24 hours

function hasRedisEnv(): boolean {
  return Boolean(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
      (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  )
}

function getRedisUrl(): string {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
}

function getRedisToken(): string {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''
}

export function generateMagicToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createMagicToken(
  agreementToken: string,
  _email: string
): Promise<string> {
  if (!hasRedisEnv()) {
    throw new Error('Magic links require Redis (KV_REST_API_URL and KV_REST_API_TOKEN)')
  }
  const magicToken = generateMagicToken()
  const { Redis } = await import('@upstash/redis')
  const redis = new Redis({
    url: getRedisUrl(),
    token: getRedisToken(),
  })
  await redis.set(
    `${MAGIC_PREFIX}${magicToken}`,
    agreementToken,
    { ex: MAGIC_TTL_SECONDS }
  )
  return magicToken
}

export async function verifyMagicToken(
  magicToken: string
): Promise<string | null> {
  if (!hasRedisEnv()) return null
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({
      url: getRedisUrl(),
      token: getRedisToken(),
    })
    const agreementToken = await redis.get<string>(`${MAGIC_PREFIX}${magicToken}`)
    return agreementToken as string | null
  } catch {
    return null
  }
}
