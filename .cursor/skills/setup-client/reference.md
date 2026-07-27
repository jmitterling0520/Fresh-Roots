# Setup Client — Reference

## pipeline.csv

Prospect funnel and conversion history. Active clients live in `clients.csv`, not here.

| Column | Required | Values / format |
|--------|----------|-----------------|
| Date Added | Yes | YYYY-MM-DD |
| Name | Yes | Contact name |
| Company | No | Organization |
| Email | No | Primary email |
| Phone | No | Phone |
| Source | No | `Website`, `Referral`, `LinkedIn`, `Cold outreach`, `Manual`, etc. |
| Status | Yes | `Prospect` or `Converted` |
| Date Converted | No | YYYY-MM-DD when they became a client; blank for active prospects |
| Notes | No | Problem summary, next steps, website URL, intake date |

## clients.csv

Client database for signed or active engagements.

| Column | Required | Values / format |
|--------|----------|-----------------|
| Date Added | Yes | YYYY-MM-DD when row was created |
| Name | Yes | Primary contact |
| Company | Yes | Business name |
| Email | No | Primary email |
| Phone | No | Phone |
| Source | No | `Website`, `Referral`, `LinkedIn`, `Manual`, etc. |
| Status | Yes | `Active` (default), `Inactive`, `Paused` |
| Client Since | Yes | YYYY-MM-DD engagement or signature start |
| Company Website | No | From contact form when available |
| Agreement Date | No | YYYY-MM-DD from `/agreement` when applicable |
| Notes | No | Project focus, monthly caps, invoice refs |

## Website field mappings

### Contact form → pipeline.csv (Prospect)

Source: `Website/app/api/contact/route.ts`

| Submission field | Maps to |
|------------------|---------|
| `your_name` | Name |
| `email` | Email |
| `company_name` | Company |
| `company_website` | Notes |
| `problem` | Notes |
| `industry` | Notes |
| `team_size` | Notes |
| `received_at` | Notes (intake timestamp) |
| — | Source = `Website` |
| — | Status = `Prospect` |
| — | Date Converted = blank |

### Agreement form → clients.csv (Active client)

Source: `Website/app/api/agreement-submit/route.ts`

| Submission field | Maps to |
|------------------|---------|
| `signer_name` | Name |
| `email` | Email |
| `client_name` | Company |
| `client_signer_date` | Agreement Date, Client Since |
| `cap_hours` | Notes |
| `cap_dollars` | Notes |
| `received_at` | Notes |
| — | Source = `Website` |
| — | Status = `Active` |

When an agreement is approved, also check `pipeline.csv` for a matching Prospect (by email or company) and convert if found.

## Dedup rules

1. Normalize email: lowercase, trim whitespace
2. If email matches a row in `clients.csv` → update, do not duplicate
3. If email matches `pipeline.csv` with `Status=Prospect` → conversion path, not new prospect
4. If no email: match on normalized **Company** + **Name**
5. If `pipeline.csv` has `Status=Converted` but no `clients.csv` row → flag inconsistency and propose client row

## Source values (use consistently)

`Website`, `Referral`, `LinkedIn`, `Cold outreach`, `Manual`

## Example rows

**Prospect (website inquiry):**

```
2026-03-15,Jane Doe,Acme Corp,jane@acme.com,,Website,Prospect,,"Problem: need process automation. Website: https://acme.com. Industry: manufacturing. Team size: 6-10. Received: 2026-03-15T14:30:00.000Z"
```

**Active client (manual):**

```
2026-03-20,John Smith,Smith LLC,john@smithllc.com,555-0100,Referral,Active,2026-03-20,,,Operations consulting — month-to-month
```

**Converted pipeline row (after conversion):**

```
2026-03-15,Jane Doe,Acme Corp,jane@acme.com,,Website,Converted,2026-04-01,"Signed agreement 2026-04-01. Problem: need process automation."
```

## Related workflows

- Invoicing: `Organization/Invoicing/PROMPT-record-invoice.md`
- Time billing: `Organization/Clockify/PROMPT-process-clockify-report.md`
- Legacy prospect prompt: `Organization/Prospects-Clients/PROMPT-add-prospect.md` (superseded by this skill for agent use)
