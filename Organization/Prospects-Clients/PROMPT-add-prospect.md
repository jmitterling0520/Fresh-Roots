# Prompt: Add a new prospect

**Use this prompt when you want to add a new prospect to your pipeline. Paste it into your AI chat and provide the prospect’s details (in your message or when the AI asks).**

---

Copy everything below the line and paste it into your AI chat. Then give the prospect’s name and any details you have (company, email, phone, source, notes).

---

I want to add a new **prospect** to my pipeline. Use this workflow:

## Your task

1. **Get prospect details**  
   Use what I provide in this chat. If I don’t give everything, ask for:
   - **Name** (required)
   - **Company** (optional)
   - **Email** (optional)
   - **Phone** (optional)
   - **Source** (how I found them: e.g. Referral, Website, LinkedIn, Cold outreach — optional)
   - **Notes** (any context, next steps, or focus area — optional)

2. **Propose a pipeline row**  
   Build one row for **Organization/Prospects-Clients/pipeline.csv** with:
   - **Date Added:** today’s date (YYYY-MM-DD)
   - **Name**, **Company**, **Email**, **Phone**, **Source** as above
   - **Status:** `Prospect`
   - **Date Converted:** leave blank
   - **Notes:** what I provided or a short summary

   Show me the row (as a table or list) so I can confirm.

3. **Ask for permission**  
   Ask: "Add this prospect to the pipeline? (yes / no / edit: …)"  
   Do **not** write to the CSV until I confirm.

4. **On confirmation (yes)**  
   - Append the approved row to **Organization/Prospects-Clients/pipeline.csv**.  
   - Use the exact column order: Date Added, Name, Company, Email, Phone, Source, Status, Date Converted, Notes.  
   - If a value contains a comma, wrap it in double quotes.  
   - Confirm: "Done. Prospect added to the pipeline."

5. **If I say "edit: …"**  
   Apply my edits to the row, show the revised row, and ask again for permission (then do step 4 if I say yes).

6. **If I say "no"**  
   Do not change the CSV. Acknowledge and stop.

## Path

- Pipeline file: `Organization/Prospects-Clients/pipeline.csv`

---

**Now add this prospect.**  
[In your next message, provide the prospect’s name and any details you have.]
