# Prompt: Process a Clockify report and create client invoices

**Use this prompt when you have a Clockify export CSV in the root of the Clockify folder and want to generate one invoice PDF per client, save PDFs to **{year}/{month}/**, and move the report to processed.**

---

Copy everything below the line and paste it into your AI chat. Specify the filename if more than one CSV is in the folder, or say "process the Clockify report" to use the only unprocessed file in the root.

---

I have a Clockify time report CSV in **Organization/Clockify/** and want you to process it with this workflow:

## Your task

1. **Identify the report file**  
   - Consider only files in the **root** of `Organization/Clockify/` (not in subfolders).  
   - I will specify the filename or say "process the Clockify report." If unspecified, use the only CSV in the root whose name does not already appear in **processed/** (see step 2).  
   - If there are multiple unprocessed CSVs, list them and ask which to process.

2. **Verify it has not been processed**  
   - Check whether a file with the **same filename** already exists in `Organization/Clockify/processed/`.  
   - If it **does** exist: stop and say "This file has already been processed. It is in Organization/Clockify/processed/." Do not create PDFs or move anything.  
   - If it **does not** exist: continue.

3. **Parse the CSV and plan invoices**  
   - Read the Clockify detailed report. Typical columns: Project, Client, Description, Task, User, Start Date, Start Time, End Date, End Time, Duration (h), Duration (decimal), Billable Rate (USD), Billable Amount (USD).  
   - Group all rows by **Client** (ignore empty client).  
   - Determine which **billing month(s)** the data covers (from **Start Date**, DD/MM/YYYY).  
   - **If the CSV spans more than one calendar month**, plan **separate runs** of `generate_invoice.py` with **`--month YYYY-MM`** for each month you are invoicing (one PDF set per month per client), so you do not create one mega-invoice for the whole file.  
   - For a **single-month** export, you may use one run with **`--month YYYY-MM`** matching that month (recommended) or omit `--month` if the file only contains that month’s rows.  
   - Target folder for PDFs: `Organization/Clockify/{year}/{month}/` (e.g. `Organization/Clockify/2026/01/`).

4. **Propose what you will do**  
   - Tell me: (a) the report filename, (b) that it was not already processed, (c) the list of clients (and count of entries per client **per billing month** if splitting), (d) each planned command, e.g.  
     `python3 generate_invoice.py <path-to-csv> --month 2026-01`  
     (use the CSV in the root until moved; after moving, path is `processed/<filename>` if re-running from processed).  
   - Each invoice must include: **Fresh Roots Consulting, LLC**; client name; report period (date range from filtered data); line items (Date, Project, Description, Duration, Billable Amount); totals.  
   - Remind me: copy each client PDF to **Organization/Invoicing/sent/** with the invoice-number filename and add/update **Organization/Invoicing/invoices.csv**.  
   - Ask: "Create these invoice PDFs and move the report to **processed/**? (yes / no)"  
   - Do **not** create files or move the report until I confirm.

5. **On confirmation (yes)**  
   - **Create the invoice PDFs** by running **Organization/Clockify/generate_invoice.py** with the agreed CSV path and **`--month`** flags as planned. Install `fpdf2` if the script requests it.  
   - **Move the report:**  
     - Move the Clockify CSV from `Organization/Clockify/{filename}.csv` to `Organization/Clockify/processed/{filename}.csv`.  
   - Confirm: "Done. Created [N] invoice(s) in Organization/Clockify/{year}/{month}/ (per run) and moved the report to processed/."

6. **If I say "no"**  
   Do not create PDFs or move the file. Acknowledge and stop.

## Paths (this project)

- Clockify root (reports to process): `Organization/Clockify/`
- Processed reports: `Organization/Clockify/processed/`
- Invoice output: `Organization/Clockify/{year}/{month}/` (e.g. `Organization/Clockify/2026/01/`)
- Sent invoice copies (register): `Organization/Invoicing/sent/` and `Organization/Invoicing/invoices.csv`

## Notes

- Clockify CSV dates are often in **DD/MM/YYYY** format; use them consistently for the invoice table and report period.
- If a client has no name (blank), skip or group under "Unknown Client" at your discretion.
- One PDF per client **per `generate_invoice.py` run**; when using `--month`, each run includes only that month’s rows for each client.
- Script reference: `python3 Organization/Clockify/generate_invoice.py [csv_path] [--month YYYY-MM]`

---

**Now process my Clockify report.**  
[If needed, specify the filename, e.g. "Clockify_Time_Report_Detailed_01_01_2026-31_12_2026.csv", and the month(s) to invoice, e.g. "January 2026 only".]
