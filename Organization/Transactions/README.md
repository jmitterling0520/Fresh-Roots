# Income & Expense Tracking

Transaction-level ledger for Fresh Roots Consulting, LLC income and expenses, with receipt matching and tax-category tagging for Schedule C.

## Contents

| Item | Purpose |
|------|---------|
| **transactions.csv** | Main ledger: every income and expense with date, amount, tax category, description, and optional receipt link |
| **tax-categories.md** | Reference list of expense categories aligned to IRS Schedule C (Form 1040) |
| **receipts/** | Inbox: drop receipt files (PDF, images) here. Use **PROMPT-process-receipt.md** to have AI analyze, categorize, and (with your OK) add to the ledger and move to **processed/** |
| **processed/** | Receipts that have been logged and filed. The **Receipt** column in the ledger stores the filename; the file lives here. |
| **PROMPT-process-receipt.md** | Prompt to run the “analyze receipt → recommend category → ask permission → write to ledger and move to processed” workflow |

## How to use

### Recording income
- Add a row in **transactions.csv**
- **Type:** `Income`
- **Date**, **Amount**, **Description** (e.g. client name, project, invoice #)
- Leave **Tax Category** and **Receipt** blank

### Recording expenses
- Add a row in **transactions.csv**
- **Type:** `Expense`
- **Date**, **Amount**, **Description** (vendor, what it was for)
- **Tax Category:** use a category from **tax-categories.md** (e.g. `Office expense`, `Travel`)
- **Receipt:** if you have a receipt, save it in **receipts/** and put the filename here (e.g. `2026-02-05_Staples.pdf`)

### Matching receipts to expenses (manual)
1. Save the receipt file in **receipts/** with a clear name (e.g. `YYYY-MM-DD_Vendor_short-description.pdf`).
2. In **transactions.csv**, in the **Receipt** column for that expense, enter exactly that filename (e.g. `2026-02-05_Staples.pdf`).
3. Processed receipts are stored in **processed/**; the **Receipt** column stores only the filename, so look in `processed/<filename>` for filed receipts.

### AI-assisted receipt processing
1. Save the receipt in **receipts/**.
2. Open **PROMPT-process-receipt.md**, copy the prompt (from "I've uploaded a receipt..." to the end), and paste it into your AI chat. Attach the receipt or name the file.
3. The AI will analyze the receipt, recommend a tax category, and propose a ledger row. It will ask for your permission before writing to **transactions.csv** or moving the file to **processed/**.
4. Reply **yes** to confirm, **no** to cancel, or **edit: …** to change the row and try again.

### Tax categories
Expense categories in **tax-categories.md** follow IRS Schedule C Part II so you can sum by category at tax time. Use the exact category name (or the short code) in the **Tax Category** column.

## Tips
- Keep **Date** as `YYYY-MM-DD` for sorting.
- Use positive numbers for **Amount**; Type (Income/Expense) indicates direction.
- Review and categorize expenses at least monthly so receipts don’t pile up unmatched.
