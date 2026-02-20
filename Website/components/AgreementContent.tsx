'use client'

import Link from 'next/link'
import { useState, useRef, useCallback, useEffect } from 'react'

type AgreementContentProps = { effectiveDate: string }

const HOURLY_RATE = 150
const SIGNATURE_FONT = '"Dancing Script", cursive'

export default function AgreementContent({ effectiveDate }: AgreementContentProps) {
  const [clientName, setClientName] = useState('')
  const [capHours, setCapHours] = useState('')
  const [capDollars, setCapDollars] = useState('')
  const [signerName, setSignerName] = useState('')
  const [signerTitle, setSignerTitle] = useState('')
  const [signerEmail, setSignerEmail] = useState('')
  const [signatureImage, setSignatureImage] = useState<string | null>(null)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [submitError, setSubmitError] = useState<string | null>(null)
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

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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
  }, [getCanvasPoint])

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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
  }, [getCanvasPoint])

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false
    lastPointRef.current = null
  }, [])

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    setSignatureImage(null)
  }, [])

  const acceptSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const hasContent = canvas.width > 0 && canvas.height > 0 && ctx.getImageData(0, 0, canvas.width, canvas.height).data.some((v, i) => i % 4 === 3 && v > 0)
    if (hasContent) {
      setSignatureImage(canvas.toDataURL('image/png'))
    }
  }, [])

  const acceptTypedSignature = useCallback(async () => {
    const name = signerName.trim()
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
      // use fallback if font load fails
    }
    ctx.fillText(name, 8, 40)
    setSignatureImage(canvas.toDataURL('image/png'))
  }, [signerName])

  const handleSubmitForReview = async () => {
    if (!clientName.trim()) {
      setSubmitError('Business name is required.')
      setSubmitStatus('error')
      return
    }
    if (!signerEmail.trim()) {
      setSubmitError('Email is required to submit for review.')
      setSubmitStatus('error')
      return
    }
    if (!signerTitle.trim()) {
      setSubmitError('Title is required.')
      setSubmitStatus('error')
      return
    }
    if (!signatureImage) {
      setSubmitError('Signature is required. Use the proposed signature or draw your signature.')
      setSubmitStatus('error')
      return
    }
    setSubmitStatus('submitting')
    setSubmitError(null)
    try {
      const res = await fetch('/api/agreement-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signerEmail.trim(),
          client_name: clientName.trim(),
          cap_hours: capHours.trim(),
          cap_dollars: capDollars.trim(),
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

  const displayName = clientName.trim() || '_______________________________________'
  const displayCapHours = capHours.trim() || '__________'
  const displayCapDollars = capDollars.trim() || '__________'
  const clientSignerDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const handleCapHoursChange = (value: string) => {
    setCapHours(value)
    const num = parseFloat(value.replace(/,/g, ''))
    if (!Number.isNaN(num) && num >= 0) {
      setCapDollars(String(Math.round(num * HOURLY_RATE)))
    } else {
      setCapDollars('')
    }
  }

  const handleCapDollarsChange = (value: string) => {
    setCapDollars(value)
    const num = parseFloat(value.replace(/,/g, ''))
    if (!Number.isNaN(num) && num >= 0) {
      const hours = num / HOURLY_RATE
      setCapHours(hours % 1 === 0 ? String(Math.round(hours)) : String(Math.round(hours * 10) / 10))
    } else {
      setCapHours('')
    }
  }

  return (
    <div className="privacy-content agreement-content">
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
      <div className="agreement-instructions">
        <h2 className="agreement-instructions-title">Complete the fields below</h2>
        <p className="agreement-instructions-intro">Your entries will appear in the agreement as shown. The effective date and client signer date are automatically set to today.</p>
        <ul className="agreement-instructions-list">
          <li><strong>Your business name *</strong> — required; appears in the opening paragraph and in the Client signature block</li>
          <li><strong>Monthly cap (optional)</strong> — hours or dollar amount for a &quot;will not exceed&quot; limit, if elected; appears in Section 2 (Payment Terms)</li>
          <li><strong>Your name (as signer)</strong> — appears in the Client signature block (Name line)</li>
          <li><strong>Your title *</strong> — required; appears in the Client signature block (Title line)</li>
          <li><strong>Signature *</strong> — required; type your name and click &quot;Use this signature&quot; or draw below and click &quot;Accept signature&quot;; appears in the Client signature block (Signed line)</li>
          <li><strong>Your email *</strong> — required; we&apos;ll use it to follow up and confirm receipt</li>
        </ul>
      </div>
      <div className="agreement-client-fields">
        <div className="agreement-client-field">
          <label htmlFor="client-business-name">Your business name *</label>
          <input
            id="client-business-name"
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. Acme Corp, LLC"
            aria-label="Your business name"
          />
        </div>
        <div className="agreement-client-field agreement-cap-fields">
          <span className="agreement-cap-label">Monthly cap (if elected)</span>
          <div className="agreement-cap-inputs">
            <label htmlFor="cap-hours">Hours</label>
            <input
              id="cap-hours"
              type="text"
              inputMode="numeric"
              value={capHours}
              onChange={(e) => handleCapHoursChange(e.target.value)}
              placeholder="e.g. 8"
              aria-label="Monthly cap in hours"
            />
            <span className="agreement-cap-or">or</span>
            <label htmlFor="cap-dollars">$</label>
            <input
              id="cap-dollars"
              type="text"
              inputMode="numeric"
              value={capDollars}
              onChange={(e) => handleCapDollarsChange(e.target.value)}
              placeholder="e.g. 1200"
              aria-label="Monthly cap in dollars"
            />
          </div>
          <span className="agreement-cap-hint">Leave both blank if no cap</span>
        </div>
        <div className="agreement-client-field agreement-signature-field">
          <span className="agreement-cap-label">Client signature *</span>
          <label htmlFor="signer-name">Your name (as signer)</label>
          <input
            id="signer-name"
            type="text"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            placeholder="Full name of person signing for the client"
            aria-label="Your name as signer"
            className="agreement-signer-name-input"
          />
          <label htmlFor="signer-title">Your title *</label>
          <input
            id="signer-title"
            type="text"
            value={signerTitle}
            onChange={(e) => setSignerTitle(e.target.value)}
            placeholder="e.g. CEO, Manager, Authorized Representative"
            aria-label="Your title"
            className="agreement-signer-name-input"
          />
          <label htmlFor="signer-email">Your email *</label>
          <input
            id="signer-email"
            type="email"
            value={signerEmail}
            onChange={(e) => setSignerEmail(e.target.value)}
            placeholder="For follow-up when you submit for review"
            aria-label="Your email (required to submit)"
            className="agreement-signer-name-input"
          />
          {signerName.trim() && (
            <div className="agreement-proposed-signature">
              <p className="agreement-signature-pad-label">Proposed signature</p>
              <div className="agreement-proposed-signature-preview" style={{ fontFamily: SIGNATURE_FONT }}>
                {signerName.trim()}
              </div>
              <button type="button" onClick={acceptTypedSignature} className="agreement-sig-btn agreement-sig-accept">
                Use this signature
              </button>
            </div>
          )}
          <div className="agreement-signature-pad-wrap">
            <p className="agreement-signature-pad-label">Or draw your signature below, then click Accept</p>
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
              aria-label="Signature pad"
            />
            <div className="agreement-signature-actions">
              <button type="button" onClick={clearSignature} className="agreement-sig-btn agreement-sig-clear">Clear</button>
              <button type="button" onClick={acceptSignature} className="agreement-sig-btn agreement-sig-accept">Accept signature</button>
            </div>
          </div>
        </div>
      </div>

      <h1>Fresh Roots Consulting<br />Technology and Process Efficiency<br />Month to Month Agreement</h1>

      <p>This Month to Month Retainer Agreement (&quot;Agreement&quot;) is entered into as of {effectiveDate} (the &quot;Effective Date&quot;) between <strong>Fresh Roots Consulting, LLC</strong> (&quot;Consultant&quot;) and {displayName} (&quot;Client&quot;).</p>

      <p>This is a standalone agreement. The Standard Terms and Conditions in <strong>Exhibit A</strong> are incorporated by reference and apply to this Agreement.</p>

      <p><strong>WHEREAS</strong>, Consultant is engaged in operations optimization and technology efficiency consulting (the &quot;Services&quot;), and Client desires to engage Consultant to provide such Services on a month-to-month retainer basis.</p>

      <p><strong>NOW THEREFORE</strong>, Consultant and Client agree as follows:</p>

      <h2>1. Scope of Services</h2>

      <p>Consultant will provide professional services consisting of operations optimization and technology efficiency consulting, delivered remotely via web conference, phone, and email. No on-site travel is included unless separately agreed in writing. Services are organized as follows:</p>

      <div className="agreement-scope-columns">
        <div>
          <p><strong>Operations Optimization</strong></p>
          <ul>
            <li>Process Inefficiencies Analysis</li>
            <li>Process Assessment &amp; Analysis</li>
            <li>Efficiency Improvement Roadmaps</li>
            <li>Gap Analysis &amp; Opportunity Identification</li>
            <li>Solution Evaluation &amp; Priority Assessment</li>
            <li>Workflow Streamlining</li>
            <li>Process Refinement</li>
          </ul>
        </div>
        <div>
          <p><strong>Technology Efficiency</strong></p>
          <ul>
            <li>Technology Inefficiencies Analysis</li>
            <li>Technology Stack Assessment and Analysis</li>
            <li>Technology improvement roadmaps &amp; education plans</li>
            <li>Solution Evaluation &amp; Technology Selection</li>
            <li>ROI Analysis &amp; Implementation Planning</li>
            <li>System Integrations, Automations, and AI assistants</li>
            <li>Technology Platform Improvements</li>
          </ul>
        </div>
      </div>

      <p>Services for platforms, tools, or technologies outside the areas described above may be provided on a best-effort basis as agreed by the parties.</p>

      <h2>2. Service Plan, Rate, and Payment Terms</h2>

      <p>Consultant&apos;s rate for Services under this Agreement is <strong>$150.00 (one hundred fifty dollars) per hour</strong>. Client will be invoiced at the <strong>end of each month for Services performed during the prior month</strong>. Each invoice will describe the Services provided, hours worked, and the amount due.</p>
      <div className="agreement-table-wrap">
        <table className="agreement-table">
          <thead>
            <tr>
              <th>Invoice Component</th>
              <th>Invoice Period</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Consulting Services (prior month)</td>
              <td>End of each month</td>
              <td>$150/hour; total per invoice = hours × $150</td>
            </tr>
          </tbody>
        </table>
      </div>


      <p><strong>Optional monthly cap.</strong> Client may elect a &quot;will not exceed&quot; amount for any month (e.g., a maximum number of hours or dollar amount). If Client has elected a monthly cap, Consultant will not bill in excess of that cap for that month unless Client has approved the excess in writing (email sufficient) before the excess hours are incurred. If Client wishes to exceed the cap in a given month, Client may request approval by email; Consultant may approve the excess by email, and such approved excess will be invoiced in the following month&apos;s invoice.</p>
      <p><em>Monthly cap (if elected): {displayCapHours} hours or ${displayCapDollars} (leave blank if no cap)</em></p>

      <p>Consultant will track time and activities performed under this Agreement and will provide Client with a summary consistent with the invoicing period. Payment terms are as set forth in Exhibit A.</p>

      <h2>3. Service Hours and Response Time</h2>

      <p>Services will be provided Monday through Friday between the hours of <strong>9:00 a.m. and 5:00 p.m. Eastern Time</strong>, except for holidays. Consultant will respond to Client requests by the <strong>next business day</strong>.</p>

      <h2>4. Term and Termination</h2>

      <p>The initial term of this Agreement is <strong>month to month</strong>, beginning on the Effective Date. This Agreement will <strong>automatically renew at the end of each calendar month</strong> for an additional one (1) month unless either party provides written notice of termination.</p>

      <p><strong>Termination by Client.</strong> Client may avoid automatic renewal and terminate this Agreement by providing written notice at the <strong>beginning of the last week of the then-current month</strong>. Upon such notice, the Agreement will end at the conclusion of that month.</p>

      <p><strong>Termination for breach.</strong> Either party may terminate this Agreement upon written notice for a material breach, provided that the terminating party has given the other party at least fourteen (14) days&apos; written notice of the breach and an opportunity to cure. Termination for breach does not affect any other remedies available to the terminating party.</p>

      <h2>5. Terms in This Agreement Prevail</h2>

      <p>In the event of any conflict between this Agreement and any other agreement between the parties, the terms of this Agreement will control with respect to the Services and subject matter described herein.</p>

      <div className="agreement-signature">
        <p><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement by their duly authorized representatives.</p>
        <table className="agreement-sig-table">
          <tbody>
            <tr><td><strong>Client:</strong></td><td>{clientName.trim() || ''}</td></tr>
            <tr><td>Name: {signerName.trim() || '__________________________'}</td><td></td></tr>
            <tr><td>Title: {signerTitle.trim() || '__________________________'}</td><td></td></tr>
            <tr><td>Signed: {signatureImage ? <img src={signatureImage} alt="Client signature" className="agreement-sig-image" /> : '__________________________'}</td><td>Date: {clientSignerDate}</td></tr>
            <tr><td colSpan={2} style={{ height: '1.5em' }}></td></tr>
            <tr><td><strong>Fresh Roots Consulting, LLC</strong></td><td></td></tr>
            <tr><td>Name: __________________________</td><td></td></tr>
            <tr><td>Title: Owner</td><td></td></tr>
            <tr><td>Signed: __________________________</td><td>Date: __________</td></tr>
          </tbody>
        </table>
      </div>

      <hr className="agreement-divider" />

      <h1 className="agreement-exhibit-title">EXHIBIT A – STANDARD TERMS AND CONDITIONS</h1>

      <p>The following Standard Terms and Conditions are incorporated by reference into the Month to Month Agreement (the &quot;Agreement&quot;) between Fresh Roots Consulting, LLC, a Michigan limited liability company (&quot;Consultant&quot;), and Client (together with its affiliates, &quot;Client&quot;). Capitalized terms used in this Exhibit A have the same meaning as in the Agreement unless defined here.</p>

      <h2>1. No Additional Terms; Amendments.</h2>
      <p>No additional or different terms proposed by Client will become part of the Agreement or any related agreement, and any such terms are rejected. The Agreement and these Standard Terms may be amended only by a written amendment signed by both parties.</p>

      <h2>2. Payment Terms; Acceptance of Deliverables.</h2>
      <p><strong>Payment.</strong> Client will be invoiced as described in the Agreement. All invoices are due upon receipt. If Client disputes any invoice, Client shall pay the undisputed portion promptly, give Consultant written notice of the disputed amount, and work with Consultant to resolve the dispute within fifteen (15) days. Consultant may suspend work without prejudice if undisputed amounts are not paid when due. Past-due amounts will bear interest at the rate of one percent (1%) per month (or the maximum rate permitted by law, if lower) and will be subject to reasonable costs of collection, including attorneys&apos; fees.</p>
      <p><strong>Acceptance.</strong> Any deliverable will be deemed accepted when it conforms to the descriptions and specifications in the Agreement. Client will have fourteen (14) days from delivery to notify Consultant in writing if a deliverable does not conform. If Client does not notify Consultant within that period, the deliverable is deemed accepted. If Client notifies Consultant of non-conformance within that period, Consultant will use commercially reasonable efforts to correct the non-conformance at no additional charge; redelivery will restart the acceptance period for that deliverable.</p>

      <h2>3. Ownership of Intellectual Property; License.</h2>
      <p><strong>Client materials.</strong> Client retains all rights in its trademarks, service marks, copyrighted works, confidential and proprietary information, and other intellectual property that it provides to Consultant for the Services.</p>
      <p><strong>Consultant work product.</strong> Except for Client materials and the license below, Consultant retains all rights in its work product, including methods, processes, templates, tools, and other pre-existing or developed materials (&quot;Consultant IP&quot;).</p>
      <p><strong>License to Client.</strong> Consultant grants to Client a worldwide, perpetual, irrevocable, fully paid, non-exclusive (and, where applicable, transferable) license to use all Consultant IP included in deliverables solely for Client&apos;s internal business use in connection with the engagement, and not for resale or other commercial exploitation.</p>

      <h2>4. Confidentiality; Non-Solicitation.</h2>
      <p><strong>Confidentiality.</strong> Each party will keep confidential all non-public information received from the other and will use it only to perform or receive the Services or use the work product under the Agreement.</p>
      <p><strong>Non-solicitation.</strong> For two (2) years after the Effective Date, neither party will, without the other&apos;s prior written consent, directly or indirectly solicit for employment or hire any person who is then (or was during the term) an employee or contractor of the other party. This does not prohibit: (a) hiring a person who contacts the hiring party on his or her own initiative without solicitation, or (b) general recruitment (e.g., advertisements, search firms) not targeted at the other party&apos;s personnel.</p>

      <h2>5. Limitation of Liability.</h2>
      <p className="agreement-caps">CONSULTANT WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS OR DATA, ARISING OUT OF OR RELATED TO THE AGREEMENT OR THE SERVICES. CONSULTANT&apos;S TOTAL LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATED TO THE AGREEMENT OR THE SERVICES WILL NOT EXCEED THE AMOUNT PAID BY CLIENT TO CONSULTANT IN THE SIX (6) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO LIABILITY.</p>

      <h2>6. Dispute Resolution; Arbitration.</h2>
      <p>Any dispute arising under the Agreement will be resolved by binding arbitration administered by the American Arbitration Association (&quot;AAA&quot;) under its Commercial Arbitration Rules. The arbitration will be conducted by a single arbitrator familiar with technology or consulting services. The arbitration will be held in Michigan (location to be agreed or as determined by the AAA). The arbitrator&apos;s award will be final and binding and may be entered in any court of competent jurisdiction. The non-prevailing party will pay the prevailing party&apos;s reasonable attorneys&apos; fees and costs incurred in connection with the arbitration.</p>

      <h2>7. Miscellaneous.</h2>
      <p>Neither party may assign the Agreement without the other&apos;s prior written consent. A waiver of any breach is not a waiver of any other or subsequent breach; waivers must be in writing. The Agreement is governed by the laws of the State of Michigan, without regard to conflict of laws. The Agreement and Exhibit A (and any attachments) constitute the entire agreement and supersede all prior agreements and communications relating to the subject matter. If any provision is held invalid or unenforceable, the remainder remains in effect. Persons signing on behalf of an entity represent that they are authorized to do so. The Agreement may be executed in counterparts and by PDF or electronic signature, each of which will be an original.</p>

      <div className="agreement-submit-section">
        {submitStatus === 'success' ? (
          <p className="agreement-submit-success">
            Thanks — we&apos;ve received your agreement and will review it shortly. We&apos;ll reach out at the email you provided.
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={submitStatus === 'submitting' || !clientName.trim() || !signerEmail.trim() || !signerTitle.trim() || !signatureImage}
              className="agreement-submit-btn"
            >
              {submitStatus === 'submitting' ? 'Sending…' : 'Submit for review'}
            </button>
            {submitError && <p className="agreement-submit-error" role="alert">{submitError}</p>}
          </>
        )}
      </div>

      <p className="privacy-back">
        <Link href="/">← Back to home</Link>
      </p>
    </div>
  )
}
