'use client'

import { useState } from 'react'

const CALENDLY_URL = 'https://calendly.com' // Replace with your Calendly link, e.g. https://calendly.com/your-username/30min

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const form = e.currentTarget
    const payload = {
      your_name: (form.elements.namedItem('your_name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      company_name: (form.elements.namedItem('company_name') as HTMLInputElement).value,
      company_website: (form.elements.namedItem('company_website') as HTMLInputElement).value,
      problem: (form.elements.namedItem('problem') as HTMLTextAreaElement).value,
      industry: (form.elements.namedItem('industry') as HTMLInputElement).value || undefined,
      team_size: (form.elements.namedItem('team_size') as HTMLSelectElement).value || undefined,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) setSubmitted(true)
      else {
        setError(data.error || 'Something went wrong. Please try again.')
        setSubmitting(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-content">
          <h2 className="section-title" style={{ color: 'white' }}>How to Engage</h2>
          <p className="contact-tagline" style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>
            We help small businesses with process, technology, data, and automation.
          </p>
          <p style={{ fontSize: '1rem', opacity: 0.95, marginBottom: '2.5rem' }}>
            Ready to build from strength to strength? Here&apos;s how we get started.
          </p>

          <div className="engage-steps">
            <div className="engage-step">
              <span className="engage-step-num">1</span>
              <div>
                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Learn</h3>
                <p style={{ marginBottom: 0 }}>
                  See what we do: <a href="#about">About</a>, <a href="#services">Services</a>, and <a href="#expertise">Expertise</a>.
                </p>
              </div>
            </div>
            <div className="engage-step engage-step-with-form">
              <span className="engage-step-num">2</span>
              <div>
                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Book a conversation</h3>
                <p className="engage-step-choices">
                  Schedule a free 30-minute call <strong>or</strong> fill out the short form below — we&apos;ll reach out to schedule.
                </p>
                <div className="engage-ctas">
                  <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="cta-button cta-primary">
                    Schedule a free 30-min call
                  </a>
                </div>
                {submitted ? (
                  <div className="form-success">
                    <p>Thanks — we&apos;ll be in touch within 1–2 business days to schedule your call.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <p className="form-intro">Or fill out the form below and we&apos;ll reach out to schedule.</p>
                    {error && <p className="form-error" role="alert">{error}</p>}
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="your_name">Your name *</label>
                        <input id="your_name" name="your_name" type="text" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input id="email" name="email" type="email" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="company_name">Company name *</label>
                        <input id="company_name" name="company_name" type="text" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="company_website">Company website *</label>
                        <input id="company_website" name="company_website" type="url" placeholder="https://" required />
                      </div>
                      <div className="form-group form-group-full">
                        <label htmlFor="problem">What problem are you trying to solve? *</label>
                        <textarea id="problem" name="problem" rows={3} required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="industry">Industry (optional)</label>
                        <input id="industry" name="industry" type="text" />
                      </div>
                      <div className="form-group">
                        <label htmlFor="team_size">Team size (optional)</label>
                        <select id="team_size" name="team_size">
                          <option value="">—</option>
                          <option value="1-5">1–5</option>
                          <option value="6-10">6–10</option>
                          <option value="prefer-not">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="cta-button cta-submit" disabled={submitting}>
                      {submitting ? 'Sending…' : 'Send — we\'ll reach out to schedule'}
                    </button>
                  </form>
                )}
              </div>
            </div>
            <div className="engage-step">
              <span className="engage-step-num">3</span>
              <div>
                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>After our first conversation</h3>
                <p style={{ marginBottom: 0 }}>
                  We&apos;ll send a tailored discovery questionnaire so we can better understand your needs and propose next steps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
