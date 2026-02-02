import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      <div className="nav-container">
        <Link href="/" className="logo">Fresh Roots</Link>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#expertise">Expertise</a></li>
          <li><a href="#contact">How to Engage</a></li>
        </ul>
      </div>
    </nav>
  )
}

