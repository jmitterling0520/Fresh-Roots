import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <p>
        &copy; 2026 Fresh Roots Consulting, LLC. All rights reserved. | From Strength to Strength
        {' · '}
        <Link href="/privacy">Privacy Policy</Link>
        {' · '}
        <Link href="/terms">Terms of Use</Link>
      </p>
    </footer>
  )
}

