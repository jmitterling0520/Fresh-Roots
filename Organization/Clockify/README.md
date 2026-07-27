# Clockify time reporting

Time reports exported from [Clockify](https://clockify.me) for Fresh Roots Consulting, LLC. Use this folder to store and track time-by-project and client for billing, capacity, and records.

## Contents

| Item | Purpose |
|------|---------|
| **Root** | Drop Clockify detailed export CSVs here. Only files in the root are considered for processing. |
| **generate_invoice.py** | Builds one invoice PDF per client from a detailed export. See **CLI usage** below. |
| **PROMPT-process-clockify-report.md** | Prompt to process a report: verify not already processed → run the generator → save PDFs to **{year}/{month}/** → move the CSV to **processed/** |
| **processed/** | Clockify reports that have been processed. The original CSV is moved here so it is not run again. |
| **{year}/{month}/** | Invoice PDFs per client (e.g. `2026/01/Invoice_Client_Name_2026-01.pdf`). |

## CLI usage (`generate_invoice.py`)

```bash
cd Organization/Clockify
python3 generate_invoice.py [path/to/report.csv] [--month YYYY-MM]
```

- **`path/to/report.csv`** (optional): Clockify detailed CSV. Defaults to `Clockify_Time_Report_Detailed_01_01_2026-31_12_2026.csv` in this folder. Relative paths are resolved from the Clockify folder (e.g. `processed/Clockify_Time_Report_Detailed_01_01_2026-31_12_2026.csv`).
- **`--month YYYY-MM`** (optional but recommended for wide exports): Only rows whose **Start Date** falls in that month are included. Output goes to **`{year}/{month}/`** for that month. Use this when the CSV spans a full year or multiple billing periods so you do not produce one combined invoice for all months.

If **`--month` is omitted**, all rows in the file are included and the output folder is chosen from the **latest Start Date** in the data (legacy behavior).

After generating, copy the client PDF to [Organization/Invoicing/sent/](../Invoicing/sent/) with your invoice-number filename and update [Organization/Invoicing/invoices.csv](../Invoicing/invoices.csv).

**Workflow (prompt):** Put a Clockify CSV in the root → run the prompt (paste **PROMPT-process-clockify-report.md** into your AI chat) → AI checks it isn’t already in processed/, runs `generate_invoice.py` with the correct **`--month`** when needed, then moves the CSV to processed/.

**Tip:** Export regularly (e.g. monthly or per project) so you have a local history. Keep filenames clear (e.g. include date range: `Clockify_Time_Report_Detailed_01_01_2026-31_12_2026.csv`).
