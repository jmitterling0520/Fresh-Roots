#!/usr/bin/env node
/**
 * One-off script to seed agreement submissions from local JSON into Redis.
 * Run from Website/ with: KV_REST_API_URL=... KV_REST_API_TOKEN=... node scripts/seed-agreement-redis.mjs
 *
 * Get KV_REST_API_URL and KV_REST_API_TOKEN from Vercel → Project → Settings → Environment Variables.
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const url = process.env.KV_REST_API_URL
const token = process.env.KV_REST_API_TOKEN

if (!url || !token) {
  console.error('Set KV_REST_API_URL and KV_REST_API_TOKEN (from Vercel env vars)')
  process.exit(1)
}

const dataPath = join(__dirname, '..', 'data', 'agreement-submissions.json')
const raw = readFileSync(dataPath, 'utf-8')
const submissions = JSON.parse(raw)

if (!Array.isArray(submissions)) {
  console.error('Expected JSON array in agreement-submissions.json')
  process.exit(1)
}

const prefix = 'agreement:submission:'

async function redisSet(key, value) {
  // Upstash REST API: POST with body ["SET", key, value]
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['SET', key, JSON.stringify(value)]),
  })
  if (!res.ok) throw new Error(`Redis set failed: ${res.status} ${await res.text()}`)
}

let count = 0
for (const sub of submissions) {
  const t = sub.token
  if (!t) continue
  await redisSet(prefix + t, sub)
  count++
  console.log('Set', t)
}

console.log(`Done. Seeded ${count} submission(s) to Redis.`)
