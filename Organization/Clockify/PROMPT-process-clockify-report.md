# Prompt: Process a Clockify report and create client invoices

**Use this prompt when you have a Clockify export CSV in the root of the Clockify folder and want to generate one invoice PDF per client, save them in year/month folders, and move the report to processed.**

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
   - For each client, you will generate one invoice PDF.  
   - Determine **year** and **month** for the output folder:  
     - Prefer the report’s **end date** (e.g. from the filename, e.g. `01_01_2026-31_12_2026` → end 2026-12 → use **2026/12**).  
     - If the filename has no clear range, use the latest **Start Date** in the data.  
     - If still unclear, use the current date’s year and month.  
   - Create the folder `Organization/Clockify/{year}/{month}/` if it does not exist (e.g. `Organization/Clockify/2026/02/`).

4. **Propose what you will do**  
   - Tell me: (a) the report filename, (b) that it was not already processed, (c) the list of clients (and count of entries per client), (d) the target folder for PDFs (e.g. `Organization/Clockify/2026/02/`), and (e) the planned PDF filenames (e.g. `Invoice_Airey_Financial_2026-01.pdf`).  
   - Each invoice must include: **Fresh Roots Consulting, LLC**; client name; report period (or date range from data); a table of line items (at least: Date, Project, Description, Duration (h), Billable Amount (USD)); and totals (total hours, total billable amount).  
   - Ask: "Create these invoice PDFs and move the report to **processed/**? (yes / no)"  
   - Do **not** create files or move the report until I confirm.

5. **On confirmation (yes)**  
   - **Create the invoice PDFs:**  
     - Write a script (e.g. Python using `fpdf2` or `reportlab`, or another method you have available) that: reads the CSV, groups by Client, and for each client generates one PDF with the content above, saved to `Organization/Clockify/{year}/{month}/`.  
     - Use a safe filename per client (e.g. `Invoice_Client_Name_YYYY-MM.pdf`, sanitizing the client name for the filesystem).  
     - Run the script (install the library if needed) so that the PDFs appear in the year/month folder.  
   - **Move the report:**  
     - Move the Clockify CSV from `Organization/Clockify/{filename}.csv` to `Organization/Clockify/processed/{filename}.csv`.  
   - Confirm: "Done. Created [N] invoice(s) in Organization/Clockify/{year}/{month}/ and moved the report to processed/."

6. **If I say "no"**  
   Do not create PDFs or move the file. Acknowledge and stop.

## Paths (this project)

- Clockify root (reports to process): `Organization/Clockify/`
- Processed reports: `Organization/Clockify/processed/`
- Invoice output: `Organization/Clockify/{year}/{month}/` (e.g. `Organization/Clockify/2026/02/`)

## Notes

- Clockify CSV dates are often in **DD/MM/YYYY** format; use them consistently for the invoice table and report period.
- If a client has no name (blank), skip or group under "Unknown Client" at your discretion.
- One PDF per client only; include all that client’s entries in that report.

---

**Now process my Clockify report.**  
[If needed, specify the filename, e.g. "Clockify_Time_Report_Detailed_01_01_2026-31_12_2026.csv".]
