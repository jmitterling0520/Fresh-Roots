'use client'

type ChallengeCard = {
  problem: string
  quotes: string[]
  solutionSummary: string
  linkHref: string
  linkLabel: string
}

type ChallengeGroup = {
  title: string
  description: string
  challenges: ChallengeCard[]
}

const challengeGroups: ChallengeGroup[] = [
  {
    title: 'Operations & Process',
    description: 'Common struggles when running the day-to-day',
    challenges: [
      {
        problem: 'Everything depends on one or two people',
        quotes: ['"If I\'m out, things stop."', '"Only Sarah knows how that works."'],
        solutionSummary: 'Process documentation, dependency analysis, and sustainable practice building so your business can run without a single point of failure.',
        linkHref: '#expertise',
        linkLabel: 'Process Analysis',
      },
      {
        problem: 'No written procedures',
        quotes: ['"We just know how we do it."', '"Training new people takes forever."'],
        solutionSummary: 'Process documentation, service standardization, and workflow assessment so you have clear steps and consistent quality.',
        linkHref: '#expertise',
        linkLabel: 'Process Analysis',
      },
      {
        problem: 'Constant firefighting',
        quotes: ['"We\'re always putting out fires."', '"Same issues keep coming back."'],
        solutionSummary: 'Bottleneck identification, capacity planning, and workflow streamlining so you fix root causes instead of repeating the same fixes.',
        linkHref: '#services',
        linkLabel: 'Operations Optimization',
      },
      {
        problem: "Can't tell what's profitable",
        quotes: ['"We\'re busy but not sure we\'re making money on each job or service."'],
        solutionSummary: 'Revenue tracking, profitability analysis, and financial metrics so you know which offerings to grow and which to change.',
        linkHref: '#expertise',
        linkLabel: 'Data & Analytics',
      },
      {
        problem: 'Unclear who does what',
        quotes: ['"Things fall through the cracks."', '"We duplicate work or miss steps."'],
        solutionSummary: 'Resource allocation optimization, service standardization, and process documentation so roles and handoffs are clear.',
        linkHref: '#expertise',
        linkLabel: 'Process Analysis',
      },
      {
        problem: 'Scaling feels chaotic',
        quotes: ['"Adding one more client would break us."', '"We don\'t know our real capacity."'],
        solutionSummary: 'Capacity planning, scalability assessment, and service expansion planning so you can grow without guessing.',
        linkHref: '#expertise',
        linkLabel: 'Process Analysis',
      },
    ],
  },
  {
    title: 'Technology & Systems',
    description: 'Tech pains that slow small teams down',
    challenges: [
      {
        problem: 'Too many disconnected tools',
        quotes: ['"Nothing talks to each other."', '"We re-enter the same data everywhere."'],
        solutionSummary: 'System selection, integration planning, and platform architecture so your tools work together instead of against each other.',
        linkHref: '#expertise',
        linkLabel: 'System Integrations',
      },
      {
        problem: 'Manual, repetitive work',
        quotes: ['"We send the same reports every week by hand."', '"Invoicing and follow-ups take forever."'],
        solutionSummary: 'Workflow automation, reporting automation, and efficiency tools so you spend less time on copy-paste and more on what matters.',
        linkHref: '#expertise',
        linkLabel: 'Automation',
      },
      {
        problem: 'Decisions based on gut, not data',
        quotes: ['"We don\'t have good numbers on revenue by service, margin, or utilization."'],
        solutionSummary: 'Revenue tracking, dashboards, and business intelligence so you can see the numbers and make informed decisions.',
        linkHref: '#expertise',
        linkLabel: 'Data & Analytics',
      },
      {
        problem: 'Outgrown current software',
        quotes: ['"Our system worked when we were smaller."', '"We need to move but don\'t know to what."'],
        solutionSummary: 'Technology stack assessment, CRM or PM migration planning, and incremental implementation so you grow without a risky big bang.',
        linkHref: '#services',
        linkLabel: 'Technology Efficiency',
      },
      {
        problem: 'No single view of customers or jobs',
        quotes: ['"Customer info is in email, spreadsheets, and our old system."', '"We can\'t easily see history or status."'],
        solutionSummary: 'CRM implementation, documentation systems, and operational dashboards so you have one place to see clients and work.',
        linkHref: '#expertise',
        linkLabel: 'System Integrations',
      },
      {
        problem: 'Unclear or costly tech stack',
        quotes: ['"We\'re not sure we\'re using the right tools."', '"Subscriptions add up and we don\'t know what we need."'],
        solutionSummary: 'Platform architecture review, technology stack assessment, and ROI analysis so your tools fit your size and goals.',
        linkHref: '#services',
        linkLabel: 'Technology Efficiency',
      },
    ],
  },
]

export default function Challenges() {
  return (
    <section id="challenges" className="challenges">
      <div className="container">
        <h2 className="section-title">Challenges We Help With</h2>
        <p className="section-subtitle challenges-subtitle">
          Many small and family-owned businesses run into the same operational and technology issues. If any of these sound familiar, we can connect you to concrete solutions—process, systems, and incremental improvement.
        </p>
        <div className="challenges-groups">
          {challengeGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="challenges-group">
              <h3 className="challenges-group-title">{group.title}</h3>
              <p className="challenges-group-description">{group.description}</p>
              <div className="challenges-grid">
                {group.challenges.map((card, cardIndex) => (
                  <div key={cardIndex} className="challenge-card">
                    <h4 className="challenge-problem">{card.problem}</h4>
                    <div className="challenge-quote">
                      {card.quotes.map((q, i) => (
                        <p key={i} className="challenge-quote-line">{q}</p>
                      ))}
                    </div>
                    <p className="challenge-solution">{card.solutionSummary}</p>
                    <a href={card.linkHref} className="challenge-link">
                      {card.linkLabel} →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="challenges-cta">
          <p>See how we organize our work: our <a href="#services">Services</a> and <a href="#expertise">Areas of Expertise</a>.</p>
          <a href="#contact" className="cta-button">
            Let&apos;s Discuss Your Situation
          </a>
        </div>
      </div>
    </section>
  )
}
