'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef, useCallback } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { downloadHtmlAsPdf } from '@/lib/download-pdf'

export default function SowViewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const token = typeof params.token === 'string' ? params.token : ''
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const accessFromUrl = searchParams.get('access') || ''
  const [html, setHtml] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [signatureDate, setSignatureDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [requireMagicLink, setRequireMagicLink] = useState(false)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const resizeIframe = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentDocument?.body) return
    const height = iframe.contentDocument.documentElement.scrollHeight
    iframe.style.height = `${Math.max(height, 800)}px`
  }, [])

  const fetchSow = useCallback(
    async (accessToken: string | null) => {
      const url = accessToken
        ? `/api/sow-view/${token}?access=${accessToken}`
        : `/api/sow-view/${token}`
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok) {
        if (data.requireMagicLink) {
          setRequireMagicLink(true)
        } else if (data.html) {
          if (slug && data.sow_slug && data.sow_slug !== slug) {
            setError('SOW link mismatch')
            return
          }
          setHtml(data.html)
          setCustomerName(data.customerName || '')
          setSignatureDate(data.signatureDate || '')
        }
        return
      }
      if (res.status === 403 && accessToken) {
        setRequireMagicLink(true)
        return
      }
      setError(data.error || 'Failed to load SOW')
    },
    [token, slug]
  )

  useEffect(() => {
    if (!token) {
      setError('Invalid link')
      setLoading(false)
      return
    }
    fetchSow(accessFromUrl || null)
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [token, accessFromUrl, fetchSow])

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSending(true)
    setSendError(null)
    try {
      const res = await fetch(`/api/sow-view/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setSendSuccess(true)
      } else {
        setSendError(data.error || 'Failed to send link')
      }
    } catch {
      setSendError('Network error')
    } finally {
      setSending(false)
    }
  }

  const handleDownload = useCallback(async () => {
    if (!html) return
    setPdfGenerating(true)
    try {
      const safeName =
        (customerName || 'Customer')
          .replace(/[<>:"/\\|?*]/g, ' ')
          .trim()
          .replace(/\s+/g, ' ') || 'Customer'
      const safeDate =
        (signatureDate || '').replace(/[<>:"/\\|?*]/g, '-').trim() || 'signed'
      const filename = `Fresh Roots and ${safeName} SOW - ${safeDate}.pdf`
      await downloadHtmlAsPdf(html, filename)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setPdfGenerating(false)
    }
  }, [html, customerName, signatureDate])

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="privacy-page">
          <div className="container">
            <div className="privacy-content agreement-content">
              <h1>Loading…</h1>
              <p>Please wait while we load the SOW.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (requireMagicLink) {
    return (
      <>
        <Navigation />
        <main className="privacy-page">
          <div className="container">
            <div className="privacy-content agreement-content">
              <h1>View Statement of Work</h1>
              {sendSuccess ? (
                <>
                  <p>
                    Check your email for a link to view this SOW. The link expires
                    in 24 hours.
                  </p>
                  <p>
                    Didn&apos;t receive it? Check your spam folder or request
                    another link below.
                  </p>
                  <form onSubmit={handleRequestLink} style={{ marginTop: '1.5rem' }}>
                    <label
                      htmlFor="email"
                      className="agreement-cap-label"
                      style={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="agreement-signer-name-input"
                      style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                    />
                    <button
                      type="submit"
                      disabled={sending || !email.trim()}
                      className="agreement-submit-btn"
                    >
                      {sending ? 'Sending…' : 'Send another link'}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <p>
                    Enter the email address used when submitting this SOW to
                    receive a secure link to view it.
                  </p>
                  <form onSubmit={handleRequestLink} style={{ marginTop: '1.5rem' }}>
                    <label
                      htmlFor="email"
                      className="agreement-cap-label"
                      style={{ display: 'block', marginBottom: '0.5rem' }}
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="agreement-signer-name-input"
                      required
                      style={{
                        marginRight: '0.5rem',
                        marginBottom: '0.5rem',
                        minWidth: '240px',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={sending || !email.trim()}
                      className="agreement-submit-btn"
                    >
                      {sending ? 'Sending…' : 'Send view link'}
                    </button>
                  </form>
                  {sendError && (
                    <p
                      className="agreement-submit-error"
                      role="alert"
                      style={{ marginTop: '1rem' }}
                    >
                      {sendError}
                    </p>
                  )}
                </>
              )}
              <p className="privacy-back" style={{ marginTop: '1.5rem' }}>
                <Link href="/">← Back to home</Link>
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !html) {
    return (
      <>
        <Navigation />
        <main className="privacy-page">
          <div className="container">
            <div className="privacy-content agreement-content">
              <h1>Unable to load SOW</h1>
              <p>
                {error ||
                  'The link may be invalid, expired, or the SOW has not been approved yet.'}
              </p>
              <p className="privacy-back" style={{ marginTop: '1rem' }}>
                <Link href="/">← Back to home</Link>
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="privacy-page">
        <div className="container">
          <div className="privacy-content agreement-content">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h1>Executed Statement of Work</h1>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={pdfGenerating}
                  className="agreement-submit-btn"
                >
                  {pdfGenerating ? 'Generating PDF…' : 'Download as PDF'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const w = window.open('', '_blank')
                    if (w) {
                      w.document.write(html)
                      w.document.close()
                    }
                  }}
                  className="agreement-submit-btn"
                  style={{ background: '#4a5568' }}
                >
                  Open in new tab
                </button>
              </div>
            </div>
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                minHeight: '600px',
                background: '#fff',
              }}
            >
              <iframe
                ref={iframeRef}
                srcDoc={html}
                title="Executed Statement of Work"
                onLoad={resizeIframe}
                style={{
                  width: '100%',
                  minHeight: '2400px',
                  border: 'none',
                  display: 'block',
                }}
                sandbox="allow-same-origin"
              />
            </div>
            <p className="privacy-back" style={{ marginTop: '1.5rem' }}>
              <Link href="/">← Back to home</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
