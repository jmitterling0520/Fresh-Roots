'use client'

import { useState } from 'react'

export default function Expertise() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const expertiseItems = [
    {
      title: 'Process Analysis',
      description: 'Workflow assessment, optimization, and continuous improvement',
      services: [
        { name: 'Service Standardization', detail: 'Document processes, SLAs, and deliverables for each service offering' },
        { name: 'Capacity Planning', detail: 'Current capacity assessment, utilization rate analysis, and bottleneck identification' },
        { name: 'Resource Allocation Optimization', detail: 'Skills mapping, workload distribution, and scheduling efficiency improvements' },
        { name: 'Quality Assurance Programs', detail: 'Quality check implementation, client feedback mechanisms, and error rate tracking' },
        { name: 'Service Level Agreement (SLA) Development', detail: 'Define SLAs for response times, resolution times, and availability' },
        { name: 'Bottleneck Identification & Resolution', detail: 'Current constraint analysis and process optimization' },
        { name: 'Scalability Assessment', detail: 'Process scalability evaluation and automation opportunity identification' },
        { name: 'Service Expansion Planning', detail: 'New service development, market demand analysis, and resource requirement planning' },
        { name: 'Workflow Assessment', detail: 'Comprehensive analysis of current workflows and identification of improvement opportunities' },
        { name: 'Process Documentation', detail: 'Standard operating procedures and knowledge base creation' },
        { name: 'Sustainable Practice Building', detail: 'Long-term process sustainability and continuous improvement culture' },
        { name: 'Dependency Analysis', detail: 'Single point of failure identification and bottleneck resolution' },
      ],
    },
    {
      title: 'System Integrations',
      description: 'Platform connections, migrations, and infrastructure optimization',
      services: [
        { name: 'CRM Implementation', detail: 'Requirements gathering, timeline development, and data migration planning' },
        { name: 'Project Management System Migration', detail: 'Migration planning, training programs, and adoption strategy development' },
        { name: 'Documentation Systems', detail: 'Knowledge base development, SOP creation, and template standardization' },
        { name: 'System Selection & Integration', detail: 'Platform evaluation, selection criteria development, and integration planning' },
        { name: 'Platform Architecture Design', detail: 'System architecture planning and technology stack optimization' },
        { name: 'Cloud Migration Consulting', detail: 'Assessment, planning, and execution of cloud migration strategies' },
        { name: 'Cloud Architecture Design', detail: 'Infrastructure planning and cloud-native solution development' },
        { name: 'Infrastructure Optimization', detail: 'Cloud resource optimization and cost management strategies' },
      ],
    },
    {
      title: 'Data, Analytics and AI Agents',
      description: 'Analytics efficiency, reporting automation, data strategy, and intelligent automation',
      services: [
        { name: 'Revenue Tracking & Reporting', detail: 'Implement systems for tracking revenue by service line, client, and individual contributor' },
        { name: 'Profitability Analysis', detail: 'Margin analysis for all services with time-based profitability measurement' },
        { name: 'Operational Metrics Dashboard', detail: 'Utilization rates, billable hours tracking, and project completion time analysis' },
        { name: 'Financial Metrics Reporting', detail: 'Revenue tracking, margin analysis, and profitability reporting by service' },
        { name: 'Client Metrics Analysis', detail: 'Satisfaction score tracking, retention rate monitoring, and referral rate optimization' },
        { name: 'Employee Performance Metrics', detail: 'Productivity measurement, utilization tracking, and satisfaction monitoring' },
        { name: 'Data Strategy Development', detail: 'Analytics implementation, reporting automation, and data governance' },
        { name: 'AI Agent Implementation', detail: 'Intelligent agent development for task automation, data processing, and decision support' },
        { name: 'Predictive Analytics', detail: 'Forecasting models and predictive insights for business planning' },
        { name: 'Business Intelligence Solutions', detail: 'Advanced analytics and visualization for strategic decision-making' },
      ],
    },
    {
      title: 'Automation',
      description: 'Process automation, workflow streamlining, and efficiency tools',
      services: [
        { name: 'Workflow Automation', detail: 'Process automation opportunities identification and implementation' },
        { name: 'Reporting Automation', detail: 'Automated report generation and distribution systems' },
        { name: 'Efficiency Tools', detail: 'Automation solution selection and implementation' },
        { name: 'Task Automation', detail: 'Automated task execution and workflow streamlining' },
        { name: 'Integration Automation', detail: 'Automated data synchronization and system-to-system workflows' },
      ],
    },
  ]

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section id="expertise" className="expertise">
      <div className="container">
        <h2 className="section-title">Areas of Expertise</h2>
        <p className="section-subtitle">Click on any area below to explore detailed services and identify solutions for your business challenges</p>
        <div className="expertise-grid">
          {expertiseItems.map((item, index) => (
            <div 
              key={index} 
              className={`expertise-item ${expandedIndex === index ? 'expanded' : ''}`}
              onClick={() => toggleExpanded(index)}
            >
              <div className="expertise-item-header">
                <div>
                  <h4>{item.title}</h4>
                  <p className="expertise-description">{item.description}</p>
                </div>
                <span className="expand-icon">▼</span>
              </div>
              <div className="expertise-details">
                <ul>
                  {item.services.map((service, serviceIndex) => (
                    <li key={serviceIndex}>
                      <strong>{service.name}</strong>
                      <span> {service.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>
            Found services that address your business challenges?
          </p>
          <a href="#contact" className="cta-button" style={{ display: 'inline-block' }}>
            Let&apos;s Discuss Your Needs
          </a>
        </div>
      </div>
    </section>
  )
}

