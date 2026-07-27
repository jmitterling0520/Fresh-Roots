# Prompt: Process a receipt or mileage documentation and add to the transactions log

**Use this prompt when you have uploaded a file to the receipts folder and want the AI to classify it, analyze it, suggest a category, and (with your permission) add a row to the ledger and move the file to processed.**

---

Copy everything below the line and paste it into your AI chat. Attach or reference the file (e.g. the file you just added to `Organization/Transactions/receipts/`).

---

I've uploaded a file to **Organization/Transactions/receipts/** and want you to process it using this workflow:

## Your task

1. **Identify the file**  
   I will specify the filename or attach the file. If I only say “process my receipt” or “process this,” use the most recently added file in `Organization/Transactions/receipts/` (excluding `.gitkeep`).

2. **Classify the file**  
   Decide which path applies:
   - **Transaction receipt** — invoice, email receipt, register receipt, payment confirmation, etc. (money paid to a vendor).
   - **Mileage / route documentation** — driving directions, Google Maps (or similar) route printouts or PDFs, mileage logs, or other evidence of **business miles** (not a purchase receipt).

   If both appear in one file, follow the path that matches the main purpose (e.g. a map PDF → mileage path).

---

### Path A — Transaction receipt (unchanged)

3a. **Analyze the receipt**  
   Read the receipt (image, PDF, or `.eml`). Extract:
   - **Date** of the transaction (YYYY-MM-DD)
   - **Amount** (total charged)
   - **Vendor / payee name**
   - **Short description** for the Description column

4a. **Recommend a tax category**  
   Using **Organization/Transactions/tax-categories.md**, pick the best-matching Schedule C expense category.

5a. **Propose a transaction row**  
   Show exactly what would be added to **Organization/Transactions/transactions.csv**:  
   `Date,Type,Amount,Tax Category,Description,Receipt`  
   with `Type=Expense` and `Receipt=<filename>`.

6a. **Ask for permission**  
   Ask: “Add this expense to the transactions log and move the file to **processed/**? (yes / no / edit: …)”  
   Do **not** append to the CSV or move the file until I confirm.

---

### Path B — Mileage / route documentation (maps, logs)

3b. **Analyze the documentation**  
   Read the file. Extract or infer:
   - **Miles** for the documented route (prefer the **primary / fastest** route total if multiple routes are shown). Note whether the map is **one-way** or **round trip**; if only one-way is shown and the trip was a round trip for the same business purpose, **ask** whether to count **round-trip miles** (double one-way) before calculating.
   - **Trip purpose** (from my message or context, e.g. “client travel,” “drive to GRR for business flight”).
   - **Date of the business trip** (YYYY-MM-DD). If the file only shows an export/print date, **ask me** for the actual trip date used for the deduction.

4b. **Look up the federal business mileage rate**  
   Use the **IRS standard mileage rate for business** for the **calendar year of the trip date** (rates usually update each January 1). Look up the current published rate (e.g. via IRS newsroom / *Standard mileage rates*) and state the **cents-per-mile** you used.

5b. **Recommend a tax category**  
   **Car and truck expenses** (Schedule C line 9 — mileage). Do **not** use Travel for local driving; see **Organization/Transactions/tax-categories.md**.

6b. **Compute the expense amount**  
   `Amount = business miles × (business rate / 100)`, rounded to two decimal places. Show the math in your message (miles × $/mile).

7b. **Propose a transaction row**  
   Same CSV columns as Path A. Suggested Description pattern (adjust as needed):  
   `Standard mileage — <X> mi × <rate>¢/mi (IRS <year> business) — <route or purpose> — see <filename>`  
   so the ledger ties to the supporting PDF/map in **processed/**.

8b. **Ask for permission**  
   Ask: “Add this mileage expense to the transactions log and move the file to **processed/**? (yes / no / edit: …)”  
   Do **not** append to the CSV or move the file until I confirm.

---

### After I confirm (both paths)

9. **On “yes”**  
   - Append the approved row to **Organization/Transactions/transactions.csv**.  
   - Move the file from **Organization/Transactions/receipts/** to **Organization/Transactions/processed/** (same filename).  
   - Confirm: “Done. Expense added and file moved to processed/.”

10. **On “edit: …”**  
    Apply my edits, show the revised row, ask again for permission (then step 9 if I say yes).

11. **On “no”**  
    Do not change the CSV or move the file. Acknowledge and stop.

---

## Paths (this project)

- Receipts inbox: `Organization/Transactions/receipts/`
- Ledger: `Organization/Transactions/transactions.csv`
- Tax categories: `Organization/Transactions/tax-categories.md`
- After processing: `Organization/Transactions/processed/` (same filename; Receipt column stores only the filename)

---

**Now process my file.**  
[Attach the file or name the file in receipts/.]
