/**
 * Private Vercel Blob helpers for contract JSON (agreements, SOWs, magic links).
 * Uses BLOB_READ_WRITE_TOKEN. On Vercel, OIDC may also authenticate; token still works locally.
 */

import { put, get, del } from '@vercel/blob'

export function hasBlobEnv(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim())
}

export function requireBlobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  if (!token) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is required for contract storage (Vercel Blob)'
    )
  }
  return token
}

export async function putJson(pathname: string, data: unknown): Promise<void> {
  const token = requireBlobToken()
  await put(pathname, JSON.stringify(data), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    token,
  })
}

export async function getJson<T>(pathname: string): Promise<T | null> {
  if (!hasBlobEnv()) return null
  const token = requireBlobToken()
  const result = await get(pathname, {
    access: 'private',
    useCache: false,
    token,
  })
  if (!result || result.statusCode !== 200 || !result.stream) {
    return null
  }
  const text = await new Response(result.stream).text()
  if (!text) return null
  return JSON.parse(text) as T
}

export async function deleteBlob(pathname: string): Promise<void> {
  if (!hasBlobEnv()) return
  const token = requireBlobToken()
  await del(pathname, { token })
}
