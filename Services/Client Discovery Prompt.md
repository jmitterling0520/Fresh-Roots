## Prompt: Generate About Client, Aligned Service, and Leadership Questionnaire

You are a consultant helping a small business (1–10 employees) understand how my company can support them using my existing service offerings. 

Use the inputs below to produce:
1. An **“About Client”** markdown brief.
2. **One tailored service concept** that my company could offer this specific client, **aligned to the service offerings list** provided in this prompt.
3. A **questionnaire** for the company leadership/owner to clarify needs, priorities, and readiness.

---

### Inputs

- **Company Name**: `{{company_name}}`
- **Company Website**: `{{company_website}}`

Assume this is a **small business with 1–10 employees**. If the website is sparse, use reasonable assumptions but clearly label them as assumptions.

---

### My Service Offerings (Context You Must Use)

Use and reference the following service areas when designing the tailored service. You do **not** need to use all areas; choose what best fits the client.

#### 1. Process Analysis  
*Workflow assessment, optimization, and continuous improvement*

- Service Standardization: Document processes, SLAs, and deliverables for each service offering  
- Capacity Planning: Current capacity assessment, utilization rate analysis, and bottleneck identification  
- Resource Allocation Optimization: Skills mapping, workload distribution, and scheduling efficiency improvements  
- Quality Assurance Programs: Quality check implementation, client feedback mechanisms, and error rate tracking  
- Service Level Agreement (SLA) Development: Define SLAs for response times, resolution times, and availability  
- Bottleneck Identification & Resolution: Current constraint analysis and process optimization  
- Scalability Assessment: Process scalability evaluation and automation opportunity identification  
- Service Expansion Planning: New service development, market demand analysis, and resource requirement planning  
- Workflow Assessment: Comprehensive analysis of current workflows and identification of improvement opportunities  
- Process Documentation: Standard operating procedures and knowledge base creation  
- Sustainable Practice Building: Long-term process sustainability and continuous improvement culture  
- Dependency Analysis: Single point of failure identification and bottleneck resolution  

#### 2. System Integrations  
*Platform connections, migrations, and infrastructure optimization*

- CRM Implementation: Requirements gathering, timeline development, and data migration planning  
- Project Management System Migration: Migration planning, training programs, and adoption strategy development  
- Documentation Systems: Knowledge base development, SOP creation, and template standardization  
- System Selection & Integration: Platform evaluation, selection criteria development, and integration planning  
- Platform Architecture Design: System architecture planning and technology stack optimization  
- Cloud Migration Consulting: Assessment, planning, and execution of cloud migration strategies  
- Cloud Architecture Design: Infrastructure planning and cloud-native solution development  
- Infrastructure Optimization: Cloud resource optimization and cost management strategies  

#### 3. Data, Analytics and AI Agents  
*Analytics efficiency, reporting automation, data strategy, and intelligent automation*

- Revenue Tracking & Reporting: Implement systems for tracking revenue by service line, client, and individual contributor  
- Profitability Analysis: Margin analysis for all services with time-based profitability measurement  
- Operational Metrics Dashboard: Utilization rates, billable hours tracking, and project completion time analysis  
- Financial Metrics Reporting: Revenue tracking, margin analysis, and profitability reporting by service  
- Client Metrics Analysis: Satisfaction score tracking, retention rate monitoring, and referral rate optimization  
- Employee Performance Metrics: Productivity measurement, utilization tracking, and satisfaction monitoring  
- Data Strategy Development: Analytics implementation, reporting automation, and data governance  
- AI Agent Implementation: Intelligent agent development for task automation, data processing, and decision support  
- Predictive Analytics: Forecasting models and predictive insights for business planning  
- Business Intelligence Solutions: Advanced analytics and visualization for strategic decision-making  

#### 4. Automation  
*Process automation, workflow streamlining, and efficiency tools*

- Workflow Automation: Process automation opportunities identification and implementation  
- Reporting Automation: Automated report generation and distribution systems  
- Efficiency Tools: Automation solution selection and implementation  
- Task Automation: Automated task execution and workflow streamlining  
- Integration Automation: Automated data synchronization and system-to-system workflows  

---

### Required Outputs

Produce all three sections in **one response**, clearly separated with markdown headings.

#### 1. About Client (Markdown file content)

Create a concise but insightful markdown brief with the following structure:

```markdown
# About {{company_name}}

## Overview
- Industry: ...
- Size: 1–10 employees (small business)
- Location(s): ...
- Website: {{company_website}}

## What They Do
- Core products/services
- Primary customer types
- How they likely deliver their service or product today

## Current Strengths
- Observable or inferred strengths from their website, brand, or positioning

## Likely Challenges for a Small Team (1–10 employees)
- Operational/process challenges
- Technology/integration challenges
- Data/visibility challenges
- Capacity and bandwidth constraints

## Key Assumptions
- List any assumptions you made due to limited public information
```

Tailor all content to this specific company using their website. Make it concrete and business-specific, not generic.

#### 2. Tailored Service Concept (Aligned to My Offerings)

Propose **ONE** primary service my company could offer this client, explicitly tied to my existing service offerings.

Include:

- **Service Name** (clear, value-focused for this client)  
- **Relevant Service Areas** (reference specific bullets from the service offerings list above)  
- **Who This Helps** (owner, operations lead, team)  
- **Core Outcomes for a 1–10 Employee Business** (2–5 bullet points, very practical and results-focused)  
- **High-Level Approach** (3–6 steps, referencing Process Analysis, System Integrations, Data/Analytics/AI, and/or Automation as appropriate)  
- **Example Deliverables** (e.g., dashboards, SOPs, automations, integrations, training, etc.)  
- **Why This is a Good Fit Now** (tie to pains or growth stage implied by the website)  

Keep scope realistic for a small business with limited budget and lean staff.

#### 3. Leadership/Owner Questionnaire

Create a list of **10–20 questions** I can send to the owner or leadership team.

Structure:

- Group questions under 3–5 short headings (e.g., “Business Model & Goals”, “Operations & Capacity”, “Systems & Tools”, “Data & Reporting”, “Automation & AI Readiness”).  
- Use a mix of:
  - **Open-ended questions** (e.g., “What would success look like 6–12 months from now?”)  
  - **Scale / rating questions** (e.g., “On a scale of 1–5, how confident are you in your current reporting?”)  
- Make sure at least a few questions explicitly connect to:
  - Process bottlenecks and repeatable workflows  
  - Current tools/systems and integrations  
  - Reporting, metrics, and decision-making  
  - Appetite for automation and AI support  

Keep language simple, friendly, and non-technical, suitable for a small business owner.

---

### Style Guidelines

- Focus on **clarity, practicality, and small-business realities** (limited time, budget, and people).  
- Avoid heavy jargon; explain any necessary technical concepts in plain language.  
- Be specific and concrete, not generic. Use examples that match the client’s industry where possible.  
- Do **not** invent complex enterprise-scale solutions; keep everything lean and implementable for a team of 1–10 people.

