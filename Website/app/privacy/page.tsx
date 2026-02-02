import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Fresh Roots Consulting, LLC',
  description: 'Privacy policy for Fresh Roots Consulting, LLC. How we collect, use, and protect your information.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="privacy-page">
        <div className="container">
          <div className="privacy-content">
            <h1>Privacy Policy</h1>
            <p className="privacy-effective">Effective date: February 2, 2026</p>

            <p>
              Fresh Roots Consulting, LLC (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates this website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our site or submit information through our contact form. Please read it carefully.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We may collect information you provide directly:</p>
            <ul>
              <li><strong>Contact form.</strong> When you use the &quot;How to Engage&quot; form, we collect your name, email address, company name, company website, a description of the problem you&apos;re trying to solve, and optionally industry and team size. We use this to respond to your inquiry and to schedule or follow up on conversations.</li>
              <li><strong>Other communications.</strong> If you contact us by email or through a third-party service (e.g., Calendly), we may keep a record of that correspondence.</li>
            </ul>
            <p>We may also automatically collect certain technical information when you visit our site (e.g., IP address, browser type, pages visited). We do not currently use cookies or similar technologies for tracking or advertising.</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your inquiries and provide the services you request</li>
              <li>Schedule and manage calls or meetings</li>
              <li>Send follow-up communications related to your inquiry</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations or protect our rights</li>
            </ul>
            <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>

            <h2>3. How We Store Your Information</h2>
            <p>Contact form submissions are stored on our servers in a structured format. We retain this information for as long as needed to fulfill the purposes above (e.g., responding to you and conducting our business relationship) and as required by law. You may request deletion of your data at any time (see &quot;Your Rights&quot; below).</p>

            <h2>4. Third-Party Services</h2>
            <p>Our site may link to or integrate with third-party services:</p>
            <ul>
              <li><strong>Calendly.</strong> If you use the link to schedule a call, you will be directed to Calendly&apos;s website. Calendly has its own privacy policy governing the data you provide there.</li>
              <li><strong>Hosting and infrastructure.</strong> Our website is hosted by providers that process traffic and server logs. We choose providers that follow industry standards for security and confidentiality.</li>
            </ul>
            <p>We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.</p>

            <h2>5. Security</h2>
            <p>We take reasonable steps to protect your personal information from unauthorized access, use, or disclosure. No method of transmission over the internet or electronic storage is 100% secure; we cannot guarantee absolute security.</p>

            <h2>6. Your Rights</h2>
            <p>Depending on where you live, you may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict certain processing</li>
              <li>Withdraw consent where we rely on consent</li>
            </ul>
            <p>To exercise any of these rights, or if you have questions about your data, please contact us using the details in the &quot;Contact Us&quot; section below. We will respond within a reasonable time and in accordance with applicable law.</p>
            <p>If you are in the European Economic Area or the United Kingdom, you may also have the right to lodge a complaint with a supervisory authority.</p>

            <h2>7. Children</h2>
            <p>Our website is not directed at children under 16. We do not knowingly collect personal information from children under 16. If you believe we have collected such information, please contact us so we can delete it.</p>

            <h2>8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will post the updated policy on this page and update the &quot;Effective date&quot; at the top. Your continued use of the site after changes constitutes acceptance of the revised policy. We encourage you to review this page periodically.</p>

            <h2>9. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
            <ul className="no-bullets">
              <li>Fresh Roots Consulting, LLC</li>
              <li>By email or through the contact form on our <Link href="/#contact">website</Link></li>
            </ul>

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
