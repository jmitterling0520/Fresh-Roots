---
name: setup-client
description: >-
  Sets up Fresh Roots prospects and clients in CRM CSV files. Adds website
  contact leads as prospects in pipeline.csv, adds manual or signed clients
  to clients.csv, and converts prospects to clients. Use when adding a new
  client, processing a website inquiry, converting a prospect, or setting up
  the client database.
---

# Setup Client

Add prospects and clients to Fresh Roots CRM files. Always **propose first**, ask permission, then write.

## Paths (this project)

| File | Role |
|------|------|
| `Organization/Prospects-Clients/pipeline.csv` | Prospects and converted history (`Prospect`, `Converted`) |
| `Organization/Prospects-Clients/clients.csv` | Active client database (`Active`, `Inactive`, `Paused`) |

For column definitions and field mappings, see [reference.md](reference.md).

## Determine the path

| Trigger | Action |
|---------|--------|
| Website contact form / new inquiry | Add **Prospect** to `pipeline.csv` |
| Manual new client (no prior prospect row) | Add **Active** client to `clients.csv` |
| Prospect signs or you convert them | Add to `clients.csv` + set pipeline row to `Converted` |
| Signed agreement from `/agreement` | Add **Active** client to `clients.csv` (and convert matching prospect if found) |

## Workflow

### 1. Gather data

Use what the user provides. If missing required fields, ask.

**Website contact form** — read local file when present:

- `Website/data/submissions.json` (gitignored; local dev only)

Production contact submissions are emailed via Resend (no repo file). Ask the user to paste the notification email or submission details.

**Signed agreement** — read local file when present:

- `Website/data/agreement-submissions.json` (gitignored; local dev only)

Production agreement data is in Upstash Redis on Vercel. Ask the user to paste agreement details or approval email content.

**Manual setup** — collect from chat:

- **Name** (required)
- **Company** (required for clients)
- **Email**, **Phone** (optional but encouraged)
- **Source** (e.g. Referral, Website, LinkedIn, Manual)
- **Client Since** (YYYY-MM-DD; default today for new clients)
- **Notes** (project focus, caps, etc.)

### 2. Dedup check

Before proposing, read both CSV files and check for duplicates:

1. **Email** (case-insensitive, trimmed) — strongest match
2. **Company + Name** (case-insensitive) — fallback

If a match exists:

- **pipeline.csv** with `Status=Prospect` → propose conversion instead of a new prospect row
- **clients.csv** with same person → propose update to existing row, not a duplicate append
- **pipeline.csv** with `Status=Converted` → client likely already exists; verify `clients.csv`

### 3. Propose the row(s)

Show the exact CSV line(s) as a table or list. Use today's date (YYYY-MM-DD) for **Date Added** when not specified.

**Website inquiry → pipeline.csv (Prospect):**

- **Status:** `Prospect`
- **Date Converted:** blank
- **Source:** `Website`
- Summarize `problem`, `company_website`, `industry`, `team_size`, and `received_at` in **Notes**

**Manual or signed client → clients.csv:**

- **Status:** `Active` (unless user specifies otherwise)
- **Client Since:** engagement or signature date
- **Agreement Date:** from agreement flow when applicable

**Conversion (Prospect → Client):**

- Append new row to `clients.csv`
- Update matching `pipeline.csv` row: **Status** → `Converted`, **Date Converted** → client-since date

### 4. Ask for permission

Ask exactly:

> Add this prospect/client to the database? (yes / no / edit: …)

Do **not** write any file until the user confirms.

### 5. On confirmation

**yes:**

- Append or update the approved row(s)
- Use exact column order from [reference.md](reference.md)
- Wrap values containing commas in double quotes
- Confirm what was saved

**edit: …**

- Apply edits, show revised proposal, ask again

**no:**

- Acknowledge and stop without changing files

## CSV column order

**pipeline.csv:** Date Added, Name, Company, Email, Phone, Source, Status, Date Converted, Notes

**clients.csv:** Date Added, Name, Company, Email, Phone, Source, Status, Client Since, Company Website, Agreement Date, Notes

## Examples

**Website inquiry:** User says "new contact form from Jane at Acme Corp" with pasted email fields → propose Prospect row in `pipeline.csv`.

**Manual client:** User says "add John Smith at Smith LLC as a client, referral, started today" → propose Active row in `clients.csv` only.

**Conversion:** User says "Acme Corp signed, convert the prospect" → propose `clients.csv` row + pipeline status `Converted`.

**Agreement:** User pastes signed agreement details for "Beta Inc" → propose `clients.csv` row; if Beta Inc is in pipeline as Prospect, include pipeline conversion in the same proposal.
