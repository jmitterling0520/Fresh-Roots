export function getBaseUrl(request: Request): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
  if (url) return url.replace(/\/$/, '')
  const vercel = process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  const proto = request.headers.get('x-forwarded-proto') || 'http'
  if (host) return `${proto}://${host}`
  return 'http://localhost:3000'
}
