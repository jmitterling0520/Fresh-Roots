'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const SIGNATURE_FONT = '"Dancing Script", cursive'

type SubmissionData = {
  email: string
  client_name: string
  cap_hours: string
  cap_dollars: string
  signer_name: string
  signer_title: string
  signature_image: string | null
  client_signer_date: string
}

type AgreementApprovalFormProps = {
  token: string
  submission: SubmissionData
}

export default function AgreementApprovalForm({ token, submission }: AgreementApprovalFormProps) {
  const [consultantName, setConsultantName] = useState('James Mitterling')
  const [consultantTitle, setConsultantTitle] = useState('Owner')
  const [consultantSignature, setConsultantSignature] = useState<string | null>(null)
  const [consultantDate, setConsultantDate] = useState(() =>
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  )
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [completedHtml, setCompletedHtml] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  const getCanvasPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      const touch = e.touches[0]
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY }
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }, [])

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      const point = getCanvasPoint(e)
      if (point) {
        isDrawingRef.current = true
        lastPointRef.current = point
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
          }
        }
      }
    },
    [getCanvasPoint]
  )

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      if (!isDrawingRef.current) return
      const point = getCanvasPoint(e)
      if (!point) return
      const canvas = canvasRef.current
      if (canvas && lastPointRef.current) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.lineTo(point.x, point.y)
          ctx.stroke()
        }
        lastPointRef.current = point
      }
    },
    [getCanvasPoint]
  )

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false
    lastPointRef.current = null
  }, [])

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    setConsultantSignature(null)
  }, [])

  const acceptDrawnSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const hasContent = ctx.getImageData(0, 0, canvas.width, canvas.height).data.some((v, i) => i % 4 === 3 && v > 0)
    if (hasContent) setConsultantSignature(canvas.toDataURL('image/png'))
  }, [])

  const acceptTypedSignature = useCallback(async () => {
    const name = consultantName.trim()
    if (!name) return
    const canvas = document.createElement('canvas')
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = Math.round(280 * dpr)
    canvas.height = Math.round(80 * dpr)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.fillStyle = '#1a1a1a'
    ctx.font = `700 36px ${SIGNATURE_FONT}`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    try {
      await document.fonts.load(`36px ${SIGNATURE_FONT}`)
    } catch {
      /* ignore */
    }
    ctx.fillText(name, 8, 40)
    setConsultantSignature(canvas.toDataURL('image/png'))
  }, [consultantName])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }
  }, [])

  const handleSubmit = async () => {
    if (!consultantName.trim() || !consultantTitle.trim() || !consultantSignature) {
      setError('Name, title, and signature are required.')
      setStatus('error')
      return
    }
    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch('/api/agreement-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          consultant_name: consultantName.trim(),
          consultant_title: consultantTitle.trim(),
          consultant_signature: consultantSignature,
          consultant_date: consultantDate.trim(),
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setCompletedHtml(data.html)
        setStatus('success')
      } else {
        setError(data.error || 'Failed to approve')
        setStatus('error')
      }
    } catch {
      setError('Network error')
      setStatus('error')
    }
  }

  const openCompletedAgreement = () => {
    if (completedHtml) {
      const w = window.open('', '_blank')
      if (w) {
        w.document.write(completedHtml)
        w.document.close()
      }
    }
  }

  if (status === 'success') {
    return (
      <>
        <Navigation />
        <main className="privacy-page">
          <div className="container">
            <div className="privacy-content agreement-content">
              <h1>Agreement Approved</h1>
              <p>Your signature has been applied. The completed agreement includes both the client and Fresh Roots Consulting signatures.</p>
              <button type="button" onClick={openCompletedAgreement} className="agreement-submit-btn">
                Open completed agreement
              </button>
              <p style={{ marginTop: '1rem' }}>
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
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
      <Navigation />
      <main className="privacy-page">
        <div className="container">
          <div className="privacy-content agreement-content">
            <h1>Approve Agreement</h1>
            <p>Add your signature below to approve this agreement on behalf of Fresh Roots Consulting, LLC.</p>

            <div className="agreement-client-field" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Client submission summary</h2>
              <p><strong>Client:</strong> {submission.client_name}</p>
              <p><strong>Signer:</strong> {submission.signer_name} ({submission.signer_title})</p>
              <p><strong>Email:</strong> {submission.email}</p>
              <p><strong>Client signer date:</strong> {submission.client_signer_date}</p>
            </div>

            <div className="agreement-client-field agreement-signature-field">
              <span className="agreement-cap-label">Consultant (Fresh Roots) signature *</span>
              <label htmlFor="consultant-name">Your name</label>
              <input
                id="consultant-name"
                type="text"
                value={consultantName}
                onChange={(e) => setConsultantName(e.target.value)}
                className="agreement-signer-name-input"
              />
              <label htmlFor="consultant-title">Your title</label>
              <input
                id="consultant-title"
                type="text"
                value={consultantTitle}
                onChange={(e) => setConsultantTitle(e.target.value)}
                className="agreement-signer-name-input"
              />
              <label htmlFor="consultant-date">Date</label>
              <input
                id="consultant-date"
                type="text"
                value={consultantDate}
                onChange={(e) => setConsultantDate(e.target.value)}
                placeholder="e.g. February 20, 2026"
                className="agreement-signer-name-input"
              />
              {consultantName.trim() && (
                <div className="agreement-proposed-signature" style={{ marginTop: '1rem' }}>
                  <p className="agreement-signature-pad-label">Proposed signature</p>
                  <div className="agreement-proposed-signature-preview" style={{ fontFamily: SIGNATURE_FONT }}>{consultantName.trim()}</div>
                  <button type="button" onClick={acceptTypedSignature} className="agreement-sig-btn agreement-sig-accept">Use this signature</button>
                </div>
              )}
              <div className="agreement-signature-pad-wrap">
                <p className="agreement-signature-pad-label">Or draw your signature</p>
                <canvas
                  ref={canvasRef}
                  className="agreement-signature-pad"
                  width={400}
                  height={120}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <div className="agreement-signature-actions">
                  <button type="button" onClick={clearSignature} className="agreement-sig-btn agreement-sig-clear">Clear</button>
                  <button type="button" onClick={acceptDrawnSignature} className="agreement-sig-btn agreement-sig-accept">Accept signature</button>
                </div>
              </div>
            </div>

            {error && <p className="agreement-submit-error" role="alert">{error}</p>}

            <div className="agreement-submit-section">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={status === 'submitting' || !consultantName.trim() || !consultantTitle.trim() || !consultantSignature}
                className="agreement-submit-btn"
              >
                {status === 'submitting' ? 'Approving…' : 'Approve and generate agreement'}
              </button>
            </div>

            <p className="privacy-back">
              <Link href="/">← Back to home</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
