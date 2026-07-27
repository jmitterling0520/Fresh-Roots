# Prospects & Clients

CRM for Fresh Roots Consulting, LLC: prospects in the funnel and active clients in a separate client database.

## Contents

| Item | Purpose |
|------|---------|
| **pipeline.csv** | Prospect funnel and conversion history. Status: `Prospect` or `Converted`. |
| **clients.csv** | Client database for signed or active engagements. Status: `Active`, `Inactive`, or `Paused`. |
| **PROMPT-add-prospect.md** | Legacy prompt to add a prospect (superseded by the setup-client skill for agent use). |
| **README.md** | This file — how to use the system |

**Preferred AI workflow:** `.cursor/skills/setup-client/` — handles website inquiries, manual clients, prospect conversion, and signed agreements.

## pipeline.csv fields

| Column | Use |
|--------|-----|
| **Date Added** | When they entered your pipeline (YYYY-MM-DD) |
| **Name** | Contact name |
| **Company** | Organization (optional) |
| **Email** | Primary email |
| **Phone** | Phone (optional) |
| **Source** | How you found them (e.g. Referral, Website, LinkedIn, Cold outreach) |
| **Status** | `Prospect` (in funnel) or `Converted` (became a client; see clients.csv) |
| **Date Converted** | When they became a client (YYYY-MM-DD). Leave blank for active prospects. |
| **Notes** | Free-form notes, next steps, project focus, etc. |

## clients.csv fields

| Column | Use |
|--------|-----|
| **Date Added** | When the client row was created (YYYY-MM-DD) |
| **Name** | Primary contact |
| **Company** | Business name |
| **Email** | Primary email |
| **Phone** | Phone (optional) |
| **Source** | How you found them |
| **Status** | `Active`, `Inactive`, or `Paused` |
| **Client Since** | Engagement or signature start date (YYYY-MM-DD) |
| **Company Website** | From contact form when available |
| **Agreement Date** | From `/agreement` flow when applicable (YYYY-MM-DD) |
| **Notes** | Project focus, caps, invoice refs, etc. |

## How to use

### Adding a prospect (website inquiry or outreach)

- **Option A:** Add a row to **pipeline.csv**. Set **Status** to `Prospect`, leave **Date Converted** blank.
- **Option B:** Ask the agent to use the **setup-client** skill with the inquiry details.
- **Option C:** Use **PROMPT-add-prospect.md** (legacy; same outcome as Option B).

Website contact form leads should start as **Prospect** with **Source** = `Website`.

### Adding a client (manual or signed agreement)

- Add a row to **clients.csv** with **Status** = `Active` and **Client Since** set.
- If they were a prospect, also update their **pipeline.csv** row: **Status** → `Converted`, **Date Converted** → client-since date.
- Use the **setup-client** skill to propose and confirm changes.

### Viewing prospects vs clients

- **Active prospects:** filter **pipeline.csv** by `Status` = `Prospect`
- **Conversion history:** filter **pipeline.csv** by `Status` = `Converted`
- **Active clients:** filter **clients.csv** by `Status` = `Active`

## Tips

- Keep dates as YYYY-MM-DD for consistent sorting.
- Use **Source** consistently (e.g. always `Website`, not `web` / `site`).
- Link client revenue to **transactions.csv** by using the same name/company in the income Description field.
- Invoicing register: **Organization/Invoicing/invoices.csv**
