import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import AgreementContent from '@/components/AgreementContent'

export const metadata = {
  title: 'Month to Month Agreement | Fresh Roots Consulting, LLC',
  description: 'Technology and Process Efficiency Consulting - Month to Month Retainer Agreement. Standard terms and Exhibit A.',
}

export const dynamic = 'force-dynamic'

export default function AgreementPage() {
  const effectiveDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  return (
    <>
      <Navigation />
      <main className="privacy-page">
        <div className="container">
          <AgreementContent effectiveDate={effectiveDate} />
        </div>
      </main>
      <Footer />
    </>
  )
}
