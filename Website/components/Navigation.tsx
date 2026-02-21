import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      <div className="nav-container">
        <Link href="/" className="logo">
          <img src="/Fresh-roots-Logo-transparent.png" alt="" className="nav-logo" aria-hidden />
          Fresh Roots
        </Link>

        <ul className="nav-links">
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/#services">Services</Link></li>
          <li><Link href="/#expertise">Expertise</Link></li>
          <li><Link href="/#contact">How to Engage</Link></li>
        </ul>
      </div>
    </nav>
  )
}

