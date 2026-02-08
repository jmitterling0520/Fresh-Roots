# Prompt: Process a receipt and add to the transactions log

**Use this prompt when you have uploaded a receipt to the receipts folder and want the AI to analyze it, suggest a category, and (with your permission) add it to the ledger and file the receipt.**

---

Copy everything below the line and paste it into your AI chat. Attach or reference the receipt file (e.g. the file you just added to `Organization/Transactions/receipts/`).

---

I've uploaded a receipt to **Organization/Transactions/receipts/** and want you to process it using this workflow:

## Your task

1. **Identify the receipt**  
   I will specify the filename or attach the file. If I only say "process my receipt," use the most recently added file in `Organization/Transactions/receipts/` (excluding `.gitkeep`).

2. **Analyze the receipt**  
   Read the receipt (image or PDF). Extract:
   - **Date** of the transaction (use YYYY-MM-DD)
   - **Amount** (total charged)
   - **Vendor / payee name**
   - **Short description** of what was purchased (for the Description column)

3. **Recommend a tax category**  
   Using **Organization/Transactions/tax-categories.md**, pick the best-matching Schedule C expense category for this receipt. If unclear, suggest the closest option and mention why, or suggest "Other expenses" and a note.

4. **Propose a transaction row**  
   Show me exactly what would be added to **Organization/Transactions/transactions.csv**:
   - Date, Type=Expense, Amount, Tax Category (your recommendation), Description, Receipt=<filename>

5. **Ask for permission**  
   Ask: "Add this expense to the transactions log and move the receipt to **processed/**? (yes / no / edit: …)"  
   Do **not** append to the CSV or move the file until I confirm.

6. **On confirmation (yes)**  
   - Append the approved row to **Organization/Transactions/transactions.csv** (same columns: Date, Type, Amount, Tax Category, Description, Receipt).  
   - Move the receipt file from **Organization/Transactions/receipts/** to **Organization/Transactions/processed/** (keep the same filename).  
   - Confirm: "Done. Expense added and receipt moved to processed/."

7. **If I say "edit: …"**  
   Apply my edits to the proposed row, show the revised row, and ask again for permission (then do step 6 if I say yes).

8. **If I say "no"**  
   Do not change the CSV or move the file. Acknowledge and stop.

## Paths (this project)

- Receipts inbox: `Organization/Transactions/receipts/`
- Ledger: `Organization/Transactions/transactions.csv`
- Tax categories: `Organization/Transactions/tax-categories.md`
- After processing: `Organization/Transactions/processed/` (same filename; Receipt column stores only the filename)

---

**Now process my receipt.**  
[If you haven’t already, attach the receipt file or tell the AI which file in receipts/ to use.]
