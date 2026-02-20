# Prospects & Clients

Simple pipeline for tracking potential prospects and converted clients for Fresh Roots Consulting, LLC.

## Contents

| Item | Purpose |
|------|---------|
| **pipeline.csv** | Single list of everyone in your funnel: prospects (potential) and clients (converted). Use **Status** to filter. |
| **PROMPT-add-prospect.md** | Prompt to add a new prospect: provide details in chat, AI proposes a row and (with your OK) appends to the pipeline. |
| **README.md** | This file — how to use the system |

## Pipeline fields

| Column | Use |
|--------|-----|
| **Date Added** | When they entered your pipeline (YYYY-MM-DD) |
| **Name** | Contact name |
| **Company** | Organization (optional) |
| **Email** | Primary email |
| **Phone** | Phone (optional) |
| **Source** | How you found them (e.g. Referral, Website, LinkedIn, Cold outreach) |
| **Status** | `Prospect` or `Client` |
| **Date Converted** | When they became a client (YYYY-MM-DD). Leave blank for prospects. |
| **Notes** | Free-form notes, next steps, project focus, etc. |

## How to use

### Adding a prospect
- **Option A:** Add a new row in **pipeline.csv** by hand. Set **Status** to `Prospect`, leave **Date Converted** blank, and fill **Source** and **Notes**.
- **Option B:** Use **PROMPT-add-prospect.md**: paste the prompt into your AI chat, give the prospect’s name and any details; the AI will propose a row and, after you say yes, append it to the pipeline.

### Converting a prospect to a client
- Find the row in **pipeline.csv**
- Change **Status** from `Prospect` to `Client`
- Set **Date Converted** to the date they became a client (YYYY-MM-DD)
- Optionally add a note in **Notes** (e.g. project name, engagement type)

### Viewing only prospects or only clients
- In a spreadsheet: filter **Status** by `Prospect` or `Client`
- Sort by **Date Added** or **Date Converted** as needed

## Tips
- Keep **Date Added** and **Date Converted** as YYYY-MM-DD for consistent sorting.
- Use **Source** consistently (e.g. always "Website" not "web" / "site") so you can see where clients come from.
- You can link client revenue to **transactions.csv** by using the same name/company in the income Description field.
