'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AgreementApprovalForm from '@/components/AgreementApprovalForm'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'

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

export default function AgreementApprovePage() {
  const params = useParams()
  const token = typeof params.token === 'string' ? params.token : ''
  const [submission, setSubmission] = useState<SubmissionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setError('Invalid link')
      setLoading(false)
      return
    }
    fetch(`/api/agreement-approve/${token}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('Submission not found')
          if (res.status === 400) throw new Error('Agreement already approved')
          throw new Error('Failed to load')
        }
        return res.json()
      })
      .then((data) => {
        setSubmission(data)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load submission')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="privacy-page">
          <div className="container">
            <div className="privacy-content agreement-content">
              <h1>Loading…</h1>
              <p>Please wait while we load the agreement.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !submission) {
    return (
      <>
        <Navigation />
        <main className="privacy-page">
          <div className="container">
            <div className="privacy-content agreement-content">
              <h1>Unable to load agreement</h1>
              <p>{error || 'The approval link may be invalid or expired.'}</p>
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

  return <AgreementApprovalForm token={token} submission={submission} />
}
