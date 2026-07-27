import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SowForm from '@/components/sow/SowForm'
import { getSow } from '@/lib/sow/registry'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const sow = getSow(slug)
  if (!sow) {
    return { title: 'SOW Not Found | Fresh Roots Consulting, LLC' }
  }
  return {
    title: `${sow.meta.title} | Fresh Roots Consulting, LLC`,
    description: `Statement of Work for ${sow.meta.customer} — ${sow.meta.engagement || sow.meta.product || 'engagement'}.`,
  }
}

export default async function SowPage({ params }: PageProps) {
  const { slug } = await params
  const sow = getSow(slug)
  if (!sow || sow.meta.status !== 'active') {
    notFound()
  }

  const activeSow = sow!
  const effectiveDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <Navigation />
      <main className="privacy-page">
        <div className="container">
          <SowForm slug={activeSow.meta.slug} effectiveDate={effectiveDate} />
        </div>
      </main>
      <Footer />
    </>
  )
}
