'use client'

import Link from 'next/link'
import { useState } from 'react'
import SignaturePad from '@/components/sow/SignaturePad'
import { getSow } from '@/lib/sow/registry'

type SowFormProps = {
  slug: string
  effectiveDate: string
}

export default function SowForm({ slug, effectiveDate }: SowFormProps) {
  const sow = getSow(slug)
  const meta = sow?.meta
  const Body = sow?.Body

  const [signerName, setSignerName] = useState(
    () => meta?.customerContact?.name || ''
  )
  const [signerTitle, setSignerTitle] = useState('')
  const [signerEmail, setSignerEmail] = useState(
    () => meta?.customerContact?.email || ''
  )
  const [signatureImage, setSignatureImage] = useState<string | null>(null)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!sow || !meta || !Body) {
    return (
      <div className="privacy-content agreement-content">
        <h1>SOW not found</h1>
        <p className="privacy-back">
          <Link href="/">← Back to home</Link>
        </p>
      </div>
    )
  }

  const clientSignerDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleSubmitForReview = async () => {
    if (!signerEmail.trim()) {
      setSubmitError('Email is required to submit for review.')
      setSubmitStatus('error')
      return
    }
    if (!signerName.trim()) {
      setSubmitError('Signer name is required.')
      setSubmitStatus('error')
      return
    }
    if (!signerTitle.trim()) {
      setSubmitError('Title is required.')
      setSubmitStatus('error')
      return
    }
    if (!signatureImage) {
      setSubmitError(
        'Signature is required. Use the proposed signature or draw your signature.'
      )
      setSubmitStatus('error')
      return
    }
    setSubmitStatus('submitting')
    setSubmitError(null)
    try {
      const res = await fetch('/api/sow-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sow_slug: meta.slug,
          email: signerEmail.trim(),
          signer_name: signerName.trim(),
          signer_title: signerTitle.trim(),
          signature_image: signatureImage,
          client_signer_date: clientSignerDate,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setSubmitStatus('success')
      } else {
        setSubmitError(data.error || 'Something went wrong. Please try again.')
        setSubmitStatus('error')
      }
    } catch {
      setSubmitError('Network error. Please try again.')
      setSubmitStatus('error')
    }
  }

  return (
    <div className="privacy-content agreement-content">
      <div className="agreement-instructions">
        <h2 className="agreement-instructions-title">Complete the fields below</h2>
        <p className="agreement-instructions-intro">
          Review this Statement of Work for <strong>{meta.customer}</strong>. Your
          signature appears in the Customer signature block. The effective date is
          set to today when you submit.
        </p>
        <ul className="agreement-instructions-list">
          <li>
            <strong>Your name (as signer)</strong> — appears in the Customer
            signature block
          </li>
          <li>
            <strong>Your title *</strong> — required; appears in the Customer
            signature block
          </li>
          <li>
            <strong>Signature *</strong> — type your name and click &quot;Use this
            signature&quot; or draw below and click &quot;Accept signature&quot;
          </li>
          <li>
            <strong>Your email *</strong> — required; we&apos;ll use it to follow
            up and confirm receipt
          </li>
        </ul>
      </div>

      <div className="agreement-client-fields">
        <div className="agreement-client-field">
          <label>Customer (fixed for this SOW)</label>
          <input type="text" value={meta.customer} disabled readOnly />
        </div>
        <div className="agreement-client-field">
          <label htmlFor="sow-signer-name">Your name (as signer) *</label>
          <input
            id="sow-signer-name"
            type="text"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            placeholder="Full name of person signing for the customer"
            className="agreement-signer-name-input"
          />
        </div>
        <div className="agreement-client-field">
          <label htmlFor="sow-signer-title">Your title *</label>
          <input
            id="sow-signer-title"
            type="text"
            value={signerTitle}
            onChange={(e) => setSignerTitle(e.target.value)}
            placeholder="e.g. CEO, Manager, Authorized Representative"
            className="agreement-signer-name-input"
          />
        </div>
        <div className="agreement-client-field">
          <label htmlFor="sow-signer-email">Your email *</label>
          <input
            id="sow-signer-email"
            type="email"
            value={signerEmail}
            onChange={(e) => setSignerEmail(e.target.value)}
            placeholder="For follow-up when you submit for review"
            className="agreement-signer-name-input"
          />
        </div>
        <SignaturePad
          signerName={signerName}
          signatureImage={signatureImage}
          onSignatureChange={setSignatureImage}
          label="Customer signature *"
        />
      </div>

      <Body
        effectiveDate={effectiveDate}
        signerName={signerName}
        signerTitle={signerTitle}
        signatureImage={signatureImage}
        clientSignerDate={clientSignerDate}
      />

      <div className="agreement-submit-section">
        {submitStatus === 'success' ? (
          <p className="agreement-submit-success">
            Thanks — we&apos;ve received your signed SOW and will review it shortly.
            We&apos;ll reach out at the email you provided.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={
                submitStatus === 'submitting' ||
                !signerName.trim() ||
                !signerEmail.trim() ||
                !signerTitle.trim() ||
                !signatureImage
              }
              className="agreement-submit-btn"
            >
              {submitStatus === 'submitting' ? 'Sending…' : 'Submit for review'}
            </button>
            {submitError && (
              <p className="agreement-submit-error" role="alert">
                {submitError}
              </p>
            )}
          </>
        )}
      </div>

      <p className="privacy-back">
        <Link href="/">← Back to home</Link>
      </p>
    </div>
  )
}
