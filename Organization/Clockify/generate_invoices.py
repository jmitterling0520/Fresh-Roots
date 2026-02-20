#!/usr/bin/env python3
"""
Generate one invoice PDF per client from a Clockify detailed report CSV.
Usage: python generate_invoices.py <path-to-csv> <output-dir>
Example: python generate_invoices.py "Clockify_Time_Report_Detailed_01_01_2026-31_12_2026.csv" "2026/01"
"""
import csv
import os
import re
import sys
from collections import defaultdict
from datetime import datetime

try:
    from fpdf import FPDF
except ImportError:
    print("Installing fpdf2...", file=sys.stderr)
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "fpdf2", "-q"])
    from fpdf import FPDF


def parse_date(s):
    """Parse DD/MM/YYYY to datetime."""
    if not s or not s.strip():
        return None
    try:
        return datetime.strptime(s.strip(), "%d/%m/%Y")
    except ValueError:
        return None


def sanitize_filename(name):
    """Safe filename: replace spaces and problematic chars."""
    return re.sub(r'[^\w\-.]', '_', name or "Unknown").strip('_')


def load_clockify_csv(path):
    """Load CSV and group rows by Client. Returns dict client_name -> list of row dicts."""
    groups = defaultdict(list)
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            client = (row.get("Client") or "").strip()
            if not client:
                client = "Unknown Client"
            groups[client].append(row)
    return dict(groups)


def build_invoice_pdf(client_name, rows, report_start, report_end, output_path):
    """Write one PDF invoice for a client."""
    total_decimal = 0.0
    total_amount = 0.0
    for r in rows:
        try:
            total_decimal += float((r.get("Duration (decimal)") or "0").replace(",", "."))
        except ValueError:
            pass
        try:
            total_amount += float((r.get("Billable Amount (USD)") or "0").replace(",", "."))
        except ValueError:
            pass

    period_str = f"{report_start.strftime('%b %d, %Y')} - {report_end.strftime('%b %d, %Y')}"

    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "Fresh Roots Consulting, LLC", ln=True)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, "Time & Invoice Summary", ln=True)
    pdf.ln(8)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 8, f"Client: {client_name}", ln=True)
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, f"Report period: {period_str}", ln=True)
    pdf.ln(6)

    # Table header
    pdf.set_font("Helvetica", "B", 9)
    col_w = (28, 42, 70, 22, 28)
    pdf.cell(col_w[0], 7, "Date", border=1)
    pdf.cell(col_w[1], 7, "Project", border=1)
    pdf.cell(col_w[2], 7, "Description", border=1)
    pdf.cell(col_w[3], 7, "Duration", border=1)
    pdf.cell(col_w[4], 7, "Amount ($)", border=1)
    pdf.ln()
    pdf.set_font("Helvetica", "", 9)

    for r in rows:
        date = (r.get("Start Date") or "").strip()
        project = (r.get("Project") or "")[:25]
        desc = (r.get("Description") or "")[:55]
        dur = (r.get("Duration (h)") or r.get("Duration (decimal)") or "0").strip()
        amt = (r.get("Billable Amount (USD)") or "0").strip()
        pdf.cell(col_w[0], 6, date, border=1)
        pdf.cell(col_w[1], 6, project, border=1)
        pdf.cell(col_w[2], 6, desc, border=1)
        pdf.cell(col_w[3], 6, dur, border=1)
        pdf.cell(col_w[4], 6, amt, border=1)
        pdf.ln()

    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(col_w[0] + col_w[1] + col_w[2], 7, "Total", border=1)
    pdf.cell(col_w[3], 7, f"{total_decimal:.2f}", border=1)
    pdf.cell(col_w[4], 7, f"{total_amount:.2f}", border=1)
    pdf.ln(10)
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 6, "Thank you for your business.", ln=True)

    pdf.output(output_path)


def main():
    if len(sys.argv) < 3:
        print("Usage: generate_invoices.py <csv_path> <output_dir_rel>", file=sys.stderr)
        sys.exit(1)
    csv_path = sys.argv[1]
    out_rel = sys.argv[2].strip("/")

    base_dir = os.path.dirname(os.path.abspath(csv_path))
    out_dir = os.path.join(base_dir, out_rel)
    os.makedirs(out_dir, exist_ok=True)

    groups = load_clockify_csv(csv_path)
    if not groups:
        print("No data found in CSV.", file=sys.stderr)
        sys.exit(1)

    # Report period from data (min/max Start Date)
    all_dates = []
    for rows in groups.values():
        for r in rows:
            d = parse_date(r.get("Start Date"))
            if d:
                all_dates.append(d)
    report_start = min(all_dates) if all_dates else datetime.now()
    report_end = max(all_dates) if all_dates else datetime.now()
    year_month = report_end.strftime("%Y-%m")

    for client_name, rows in groups.items():
        safe_name = sanitize_filename(client_name)
        filename = f"Invoice_{safe_name}_{year_month}.pdf"
        out_path = os.path.join(out_dir, filename)
        build_invoice_pdf(client_name, rows, report_start, report_end, out_path)
        print(out_path)


if __name__ == "__main__":
    main()
