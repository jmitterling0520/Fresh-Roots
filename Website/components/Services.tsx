import RootSystem from './RootSystem'

type ServiceSection = {
  subHeader: string
  items: string[]
}

type Service = 
  | { title: string; sections: ServiceSection[] }
  | { title: string; items: string[] }

export default function Services() {
  const services: Service[] = [
    {
      title: 'Operations Optimization',
      sections: [
        {
          subHeader: 'Planning',
          items: [
            'Process Assessment & Analysis',
            'Efficiency Improvement Roadmaps',
          ],
        },
        {
          subHeader: 'Discerning',
          items: [
            'Gap Analysis & Opportunity Identification',
            'Solution Evaluation & Priority Assessment',
          ],
        },
        {
          subHeader: 'Executing',
          items: [
            'Workflow Streamlining',
            'Process Refinement',
          ],
        },
      ],
    },
    {
      title: 'Technology Efficiency',
      sections: [
        {
          subHeader: 'Planning',
          items: [
            'Technology Stack Assessment and Analysis',
            'Technology improvement roadmaps & education plans',
          ],
        },
        {
          subHeader: 'Discerning',
          items: [
            'Solution Evaluation & Technology Selection',
            'ROI Analysis & Implementation Planning',
          ],
        },
        {
          subHeader: 'Executing',
          items: [
            'System Integrations, Automations, and AI assistants',
            'Technology Platform Improvements',
          ],
        },
      ],
    },
  ]

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">Services</h2>
        <p className="section-subtitle">Operations and technology efficiency solutions designed for incremental, sustainable improvement</p>
        <div className="services-content-wrapper">
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <h3>{service.title}</h3>
                {'sections' in service ? (
                  <div>
                    {service.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: sectionIndex > 0 ? '1.5rem' : '0', marginBottom: '0.5rem' }}>
                          {section.subHeader}
                        </h4>
                        <ul>
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul>
                    {service.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="services-visual">
            <RootSystem />
          </div>
        </div>
      </div>
    </section>
  )
}

