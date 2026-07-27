# Invoicing

Invoice register and copies of **sent** invoice PDFs for Fresh Roots Consulting, LLC. Pairs with Clockify-generated invoices and [transactions.csv](../Transactions/transactions.csv) when payment is received.

## Contents

| Item | Purpose |
|------|---------|
| **invoices.csv** | Register: invoice number, client, period, amounts, status (Draft / Sent / Paid / Partial / Void), PDF filename, link to Clockify report |
| **sent/** | Canonical copy of each issued invoice PDF. The **PDF** column in `invoices.csv` is the basename of the file in this folder. |

## Workflow

1. **Generate PDFs** from Clockify using [Organization/Clockify/generate_invoice.py](../Clockify/generate_invoice.py). For exports that cover more than one billing month, pass **`--month YYYY-MM`** so each run only includes that month’s rows.
2. **Copy or save** the client PDF into **sent/** with a stable name tied to your invoice number, e.g. `FR-2026-001_Client_Short_Name.pdf`.
3. **Add or update** a row in **invoices.csv** when you send an invoice (`Status=Sent`, set **SentDate** when known).
4. When the client pays, set **Status** to `Paid` (or `Partial`), fill **PaidDate** / **PaidAmount**, and add an **Income** row to [Transactions/transactions.csv](../Transactions/transactions.csv) (see that folder’s README).

## Invoice numbers

Use a stable scheme such as **`FR-YYYY-NNN`** (e.g. `FR-2026-001`) and never reuse a number.

## Relationship to Clockify output

PDFs are first written to `Organization/Clockify/{year}/{month}/` by the generator. Copy the relevant file into **sent/** with the invoice-number filename for bookkeeping; the register’s **ClockifyReport** column notes which export backed the invoice.
