#!/usr/bin/env node
/**
 * Reset approval status so the flow can be run again.
 * Usage: TOKEN=uuid node scripts/unapprove-agreement-redis.mjs
 * Default: 1cca49f8-bbbe-4543-9cd3-ae1e1fa82232
 */

const url = process.env.KV_REST_API_URL
const token = process.env.KV_REST_API_TOKEN
const targetToken = process.env.TOKEN || '1cca49f8-bbbe-4543-9cd3-ae1e1fa82232'

if (!url || !token) {
  console.error('Set KV_REST_API_URL and KV_REST_API_TOKEN')
  process.exit(1)
}

const prefix = 'agreement:submission:'
const key = prefix + targetToken

async function redisGet(k) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['GET', k]),
  })
  if (!res.ok) throw new Error(`Redis get failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.result
}

async function redisSet(k, value) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['SET', k, JSON.stringify(value)]),
  })
  if (!res.ok) throw new Error(`Redis set failed: ${res.status} ${await res.text()}`)
}

const raw = await redisGet(key)
if (!raw) {
  console.error('Submission not found for token', targetToken)
  process.exit(1)
}

const sub = typeof raw === 'string' ? JSON.parse(raw) : raw
sub.approved = false
delete sub.consultant_name
delete sub.consultant_title
delete sub.consultant_signature
delete sub.consultant_date

await redisSet(key, sub)
console.log('Reset approval for', targetToken)
