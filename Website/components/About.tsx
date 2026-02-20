'use client'

import { useState } from 'react'

export default function About() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About</h2>
      </div>
      <div className="highlight-box-fullwidth">
        <div className="container">
          <div className="highlight-box about-teaser-box">
            <div className="about-content-wrapper">
              <div className="about-text">
                <h3>Why Fresh Roots</h3>
                <p className="about-teaser">
                  We help small businesses strengthen their operations and technology through incremental improvement—building <em>from strength to strength</em> so you can focus on what you do best.
                </p>
                <p className="about-callout">Our goal is to strengthen ourselves and strengthen our clients by staying focused on helping small businesses develop into a long term sustained business. This reflects our core belief in building <em><span style={{ color: '#FFEB3B' }}>from strength to strength</span></em>&mdash;each improvement compounds and creates the foundation for the next.</p>
                <div className="about-actions">
                  <button
                    type="button"
                    className="about-expand-btn"
                    onClick={() => setExpanded(!expanded)}
                    aria-expanded={expanded}
                  >
                    {expanded ? 'Show less' : 'Expand for more'}
                  </button>
                  <a href="#contact" className="about-direct-link">
                    Get in touch
                  </a>
                </div>
                {expanded && (
                  <div className="about-expanded">
                    {/* <p>&ldquo;Fresh&rdquo; represents our commitment to bringing new perspectives, innovative approaches, and continuous renewal to every engagement. Just as fresh growth brings vitality to a tree, we bring fresh energy and fresh thinking to help businesses grow stronger.</p> */}
                    <div className="about-roots-intro">
                      <img
                        src="/roots-fresh-roots-diagram.png"
                        alt="Fresh Roots: Fresh connects to Perspectives, Innovative Approaches, Continuous Improvement; Roots connects to continuously grow to add strength, build upon each other, add nutrients for the tree"
                        className="about-roots-diagram"
                      />
                   </div>
                    <p>Our goal is to support these small businesses with our passions in business operations and technology, while our clients focus on their passions that got them started in their business in the first place. Just as roots provide unseen support that allows the tree to flourish above ground, we work behind the scenes so you can focus on what you do best.</p>

                    <h3 className="about-subhead">Our Approach</h3>
                    <p>At Fresh Roots, we help small businesses optimize their operations through systematic refinement, leveraging technology to streamline processes and enhance productivity. Every improvement builds upon the last, creating lasting transformation—because we educate you and your team on the reasoning behind each incremental change, ensuring understanding and buy-in at every step.</p>
                    <p>Our approach to process and technology efficiency is methodical, sustainable, and results-driven.</p>
                    <p>From process optimization to technology implementation, we guide you step by step, ensuring each enhancement strengthens your foundation for future growth and sustainability.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
