# Prompt: Record an invoice or payment in the register and ledger

**Use this prompt when you have issued an invoice or received payment and want the AI to update **invoices.csv** and/or **transactions.csv** with your permission.**

---

Copy everything below the line and paste it into your AI chat. Describe what happened (sent invoice, partial payment, paid in full, etc.) and name any files if relevant.

---

I want to update Fresh Roots invoicing records using this workflow.

## Paths (this project)

- Invoice register: **Organization/Invoicing/invoices.csv**
- Sent invoice PDFs: **Organization/Invoicing/sent/** (filename must match the **PDF** column in the register)
- Income & expense ledger: **Organization/Transactions/transactions.csv**

## Your task

1. **Understand my intent**  
   I will say whether this is: **(A)** I sent an invoice (register only), **(B)** I received payment (register + income row), or **(C)** corrections to an existing row.

2. **If I sent an invoice (A)**  
   - Propose a new row (or update) for **invoices.csv** with: InvoiceNumber, Client, IssueDate, PeriodStart, PeriodEnd, Amount, Hours (if known), Status=`Sent`, SentDate (if I gave it), PaidDate/PaidAmount blank, PDF (basename in **sent/**), ClockifyReport (if applicable), Notes.  
   - Remind me: the PDF should already be in **Organization/Invoicing/sent/** with that basename.  
   - Do **not** add an **Income** row yet unless I also received payment.

3. **If I received payment (B)**  
   - Update the matching invoice row: **Status** (`Paid` or `Partial`), **PaidDate**, **PaidAmount** (for partials).  
   - Propose an **Income** row for **transactions.csv**: Date (payment date), Type=`Income`, Amount, Tax Category blank, Description (client + invoice #), Receipt = invoice PDF filename in **sent/** (per [Organization/Transactions/README.md](../Transactions/README.md)).

4. **Show proposed changes**  
   - Paste the exact CSV line(s) or a clear before/after for **invoices.csv** and **transactions.csv** as needed.

5. **Ask for permission**  
   Ask: "Apply these updates? (yes / no / edit: …)"  
   Do **not** edit any files until I confirm.

6. **On "yes"**  
   - Write the approved changes to **invoices.csv** and/or **transactions.csv**.  
   - Confirm what was saved.

7. **On "edit: …"**  
   Apply my edits, show the revised proposal, ask again.

8. **On "no"**  
   Acknowledge and stop without changing files.

---

**Now help me record:**  
[Describe: e.g. "Client X paid invoice FR-2026-001 in full on 2026-02-15 by ACH" or "I sent FR-2026-002 yesterday for $500".]
