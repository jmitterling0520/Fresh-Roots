# Clockify time reporting

Time reports exported from [Clockify](https://clockify.me) for Fresh Roots Consulting, LLC. Use this folder to store and track time-by-project and client for billing, capacity, and records.

## Contents

| Item | Purpose |
|------|---------|
| **Root** | Drop Clockify detailed export CSVs here. Only files in the root are considered for processing. |
| **PROMPT-process-clockify-report.md** | Prompt to process a report: verify not already processed → create one invoice PDF per client → save PDFs to **{year}/{month}/** → move the CSV to **processed/** |
| **processed/** | Clockify reports that have been processed. The original CSV is moved here so it is not run again. |
| **{year}/{month}/** | Invoice PDFs per client (e.g. `2026/02/Invoice_Client_Name_2026-01.pdf`). Created when you run the process prompt. |

**Workflow:** Put a Clockify CSV in the root → run the prompt (paste **PROMPT-process-clockify-report.md** into your AI chat) → AI checks it isn’t already in processed/, then creates one PDF per client in year/month, then moves the CSV to processed/.

**Tip:** Export regularly (e.g. monthly or per project) so you have a local history. Keep filenames clear (e.g. include date range: `Clockify_Time_Report_Detailed_01_01_2026-31_12_2026.csv`).
