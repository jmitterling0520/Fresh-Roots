import RootsPattern from './RootsPattern'

export default function Hero() {
  return (
    <section className="hero">
      <RootsPattern />
      <div className="hero-content">
        <h1>Fresh Roots</h1>
        <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          <span style={{ color: 'white', fontSize: '1.2rem' }}>From</span>{' '}
          <span style={{ color: '#FFEB3B' }}>Strength</span>{' '}
          <span style={{ color: 'white', fontSize: '1.2rem' }}>to</span>{' '}
          <span style={{ color: '#FFEB3B' }}>Strength</span>
        </p>
        <p style={{ fontSize: '0.5rem', opacity: 0.9, fontStyle: 'italic', marginBottom: '1.5rem' }}>— Psalm 84:7</p>
        <p>Business Operations and Technology Consulting.
        <br/>Building better systems through incremental improvement, one step at a time.</p>
        <a href="#contact" className="cta-button">Get Started</a>
      </div>
    </section>
  )
}

