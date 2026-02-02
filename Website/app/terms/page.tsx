import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Use | Fresh Roots Consulting, LLC',
  description: 'Terms of use for the Fresh Roots Consulting, LLC website. Acceptable use and disclaimers.',
}

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main className="privacy-page">
        <div className="container">
          <div className="privacy-content">
            <h1>Terms of Use</h1>
            <p className="privacy-effective">Effective date: February 2, 2026</p>

            <p>
              Welcome to the website of Fresh Roots Consulting, LLC (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Use govern your access to and use of this website. By using this site, you agree to these terms. If you do not agree, please do not use the site.
            </p>

            <h2>1. Use of the Website</h2>
            <p>You may use this website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use of the site. You agree not to:</p>
            <ul>
              <li>Use the site in any way that violates applicable laws or regulations</li>
              <li>Transmit any harmful, offensive, or unlawful content</li>
              <li>Attempt to gain unauthorized access to our systems, other users&apos; accounts, or any data we hold</li>
              <li>Use automated means (e.g., scrapers, bots) to access or collect content without our permission</li>
              <li>Interfere with or disrupt the site or our servers or networks</li>
              <li>Impersonate us, our personnel, or any other person or entity</li>
            </ul>
            <p>We may suspend or terminate your access to the site if we believe you have violated these terms.</p>

            <h2>2. Intellectual Property</h2>
            <p>The content on this website—including text, graphics, logos, images, and design—is owned by Fresh Roots Consulting, LLC or our licensors and is protected by copyright and other intellectual property laws. You may not copy, reproduce, distribute, modify, or create derivative works from our content without our prior written permission, except for brief quotations for purposes such as criticism, comment, or news reporting, to the extent permitted by law.</p>

            <h2>3. No Professional Advice</h2>
            <p>The information on this website is for general informational purposes only. It does not constitute professional, legal, financial, or other advice. No client or consulting relationship is created solely by your use of this site or by your submission of a contact form. Any engagement for our consulting services will be governed by a separate agreement. You should seek appropriate professional advice for your specific situation.</p>

            <h2>4. Disclaimer of Warranties</h2>
            <p>This website and its content are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not warrant that the site will be uninterrupted, error-free, or free of viruses or other harmful components. We disclaim all warranties to the fullest extent permitted by applicable law.</p>

            <h2>5. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Fresh Roots Consulting, LLC and its members, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill, arising out of or related to your use of (or inability to use) this website or any content on it. Our total liability for any claims arising from your use of the site shall not exceed the amount you paid us, if any, in the twelve months preceding the claim, or one hundred dollars ($100), whichever is greater. Some jurisdictions do not allow the exclusion or limitation of certain damages; in those jurisdictions, our liability will be limited to the maximum extent permitted by law.</p>

            <h2>6. Third-Party Links</h2>
            <p>This website may contain links to third-party sites (e.g., Calendly for scheduling). We do not control and are not responsible for the content, privacy practices, or terms of use of those sites. Linking does not imply endorsement. Your use of third-party sites is at your own risk.</p>

            <h2>7. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless Fresh Roots Consulting, LLC and its members, employees, and agents from and against any claims, damages, losses, liabilities, and expenses (including reasonable attorneys&apos; fees) arising out of or related to your use of the website, your violation of these terms, or your violation of any rights of another.</p>

            <h2>8. Governing Law</h2>
            <p>These Terms of Use shall be governed by and construed in accordance with the laws of the State of Michigan, United States, without regard to its conflict of law principles. Any dispute arising from these terms or your use of the site shall be subject to the exclusive jurisdiction of the state and federal courts located in Michigan.</p>

            <h2>9. Changes to These Terms</h2>
            <p>We may update these Terms of Use from time to time. We will post the updated terms on this page and update the &quot;Effective date&quot; at the top. Your continued use of the site after changes constitutes acceptance of the revised terms. We encourage you to review this page periodically.</p>

            <h2>10. Contact Us</h2>
            <p>If you have questions about these Terms of Use, please contact us:</p>
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
