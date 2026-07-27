'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SignaturePad from '@/components/sow/SignaturePad'

type SubmissionData = {
  sow_slug: string
  email: string
  customer_name: string
  signer_name: string
  signer_title: string
  signature_image: string | null
  client_signer_date: string
}

type SowApprovalFormProps = {
  token: string
  submission: SubmissionData
}

export default function SowApprovalForm({
  token,
  submission,
}: SowApprovalFormProps) {
  const [consultantName, setConsultantName] = useState('James Mitterling')
  const [consultantTitle, setConsultantTitle] = useState('Owner')
  const [consultantSignature, setConsultantSignature] = useState<string | null>(
    null
  )
  const [consultantDate, setConsultantDate] = useState(() =>
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  )
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [error, setError] = useState<string | null>(null)
  const [completedHtml, setCompletedHtml] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (
      !consultantName.trim() ||
      !consultantTitle.trim() ||
      !consultantSignature
    ) {
      setError('Name, title, and signature are required.')
      setStatus('error')
      return
    }
    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch('/api/sow-approve', {
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
        setAccessToken(data.accessToken || null)
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

  const openCompletedSow = () => {
    if (completedHtml) {
      const w = window.open('', '_blank')
      if (w) {
        w.document.write(completedHtml)
        w.document.close()
      }
    }
  }

  const viewHref = accessToken
    ? `/sow/${submission.sow_slug}/view/${token}?access=${accessToken}`
    : `/sow/${submission.sow_slug}/view/${token}`

  if (status === 'success') {
    return (
      <>
        <Navigation />
        <main className="privacy-page">
          <div className="container">
            <div className="privacy-content agreement-content">
              <h1>SOW Approved</h1>
              <p>
                Your signature has been applied. The completed Statement of Work
                includes both the customer and Fresh Roots Consulting signatures.
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginTop: '1rem',
                }}
              >
                <Link
                  href={viewHref}
                  className="agreement-submit-btn"
                  style={{
                    display: 'inline-block',
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  View and download SOW
                </Link>
                <button
                  type="button"
                  onClick={openCompletedSow}
                  className="agreement-submit-btn"
                  style={{ background: '#4a5568' }}
                >
                  Open in new tab
                </button>
              </div>
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
      <Navigation />
      <main className="privacy-page">
        <div className="container">
          <div className="privacy-content agreement-content">
            <h1>Approve Statement of Work</h1>
            <p>
              Add your signature below to approve this SOW on behalf of Fresh Roots
              Consulting, LLC.
            </p>

            <div
              className="agreement-client-field"
              style={{ marginBottom: '1.5rem' }}
            >
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Customer submission summary
              </h2>
              <p>
                <strong>Customer:</strong> {submission.customer_name}
              </p>
              <p>
                <strong>Signer:</strong> {submission.signer_name} (
                {submission.signer_title})
              </p>
              <p>
                <strong>Email:</strong> {submission.email}
              </p>
              <p>
                <strong>Client signer date:</strong>{' '}
                {submission.client_signer_date}
              </p>
            </div>

            <div className="agreement-client-field">
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
            </div>

            <SignaturePad
              signerName={consultantName}
              signatureImage={consultantSignature}
              onSignatureChange={setConsultantSignature}
              label="Consultant (Fresh Roots) signature *"
            />

            {error && (
              <p className="agreement-submit-error" role="alert">
                {error}
              </p>
            )}

            <div className="agreement-submit-section">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  status === 'submitting' ||
                  !consultantName.trim() ||
                  !consultantTitle.trim() ||
                  !consultantSignature
                }
                className="agreement-submit-btn"
              >
                {status === 'submitting'
                  ? 'Approving…'
                  : 'Approve and generate SOW'}
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
