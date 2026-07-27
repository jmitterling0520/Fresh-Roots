#!/usr/bin/env python3
"""Generate invoice PDFs from a Clockify CSV report."""

import argparse
import csv
import re
import sys
from pathlib import Path

try:
    from fpdf import FPDF
    from fpdf.fonts import FontFace
except ImportError:
    print("Installing fpdf2...")
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "install", "fpdf2", "-q"])
    from fpdf import FPDF
    from fpdf.fonts import FontFace

DEFAULT_CSV_NAME = "Clockify_Time_Report_Detailed_01_01_2026-31_12_2026.csv"


def sanitize_filename(name: str) -> str:
    """Make client name safe for filesystem."""
    s = re.sub(r"[^\w\s\-]", "", name)  # Remove special chars except hyphen
    s = re.sub(r"\s+", "_", s.strip())
    return s or "Unknown_Client"


def parse_dd_mm_yyyy(s: str) -> tuple[int, int, int]:
    """Parse DD/MM/YYYY to (day, month, year)."""
    parts = s.strip().split("/")
    if len(parts) == 3:
        return int(parts[0]), int(parts[1]), int(parts[2])
    return 0, 0, 0


def parse_month_arg(s: str) -> tuple[int, int]:
    """Parse YYYY-MM to (year, month)."""
    m = re.match(r"^(\d{4})-(\d{2})$", s.strip())
    if not m:
        print("Error: --month must be YYYY-MM (e.g. 2026-01)", file=sys.stderr)
        sys.exit(1)
    y, mo = int(m.group(1)), int(m.group(2))
    if mo < 1 or mo > 12:
        print("Error: invalid month in --month", file=sys.stderr)
        sys.exit(1)
    return y, mo


def row_in_calendar_month(start_date: str, year: int, month: int) -> bool:
    _, m, y = parse_dd_mm_yyyy(start_date)
    return y == year and m == month


def main() -> None:
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent.parent
    logo_path = (project_root / "Website" / "public" / "Fresh-roots-Logo-transparent.png").resolve()

    parser = argparse.ArgumentParser(
        description="Generate one invoice PDF per client from a Clockify detailed export."
    )
    parser.add_argument(
        "csv_file",
        nargs="?",
        default=None,
        help=f"Path to Clockify CSV (default: {DEFAULT_CSV_NAME} in this folder). "
        "Relative paths are resolved from the Clockify folder.",
    )
    parser.add_argument(
        "--month",
        metavar="YYYY-MM",
        help="Only include rows whose Start Date falls in this calendar month. "
        "Recommended when the CSV spans multiple billing periods.",
    )
    args = parser.parse_args()

    if args.csv_file:
        csv_path = Path(args.csv_file)
        if not csv_path.is_absolute():
            csv_path = (script_dir / csv_path).resolve()
    else:
        csv_path = script_dir / DEFAULT_CSV_NAME

    if not csv_path.exists():
        print(f"Error: {csv_path} not found", file=sys.stderr)
        sys.exit(1)

    filter_ym: tuple[int, int] | None = None
    if args.month:
        filter_ym = parse_month_arg(args.month)

    # Parse CSV and group by client (optionally filter by month)
    clients: dict[str, list[dict]] = {}
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            client = (row.get("Client") or "").strip()
            if not client:
                continue
            if filter_ym:
                fy, fm = filter_ym
                if not row_in_calendar_month(row.get("Start Date", ""), fy, fm):
                    continue
            if client not in clients:
                clients[client] = []
            clients[client].append(row)

    if not clients:
        if filter_ym:
            print(
                f"No billable rows found for {args.month} in {csv_path}. "
                "Check --month or CSV contents.",
                file=sys.stderr,
            )
        else:
            print("No client data found in CSV", file=sys.stderr)
        sys.exit(1)

    # Output folder: explicit month filter wins; else latest Start Date in data
    if filter_ym:
        year, month = filter_ym
    else:
        year, month = 2026, 1
        for rows in clients.values():
            for r in rows:
                d, m, y = parse_dd_mm_yyyy(r.get("Start Date", ""))
                if y and m:
                    if y > year or (y == year and m > month):
                        year, month = y, m

    out_dir = script_dir / str(year) / f"{month:02d}"
    out_dir.mkdir(parents=True, exist_ok=True)

    for client_name, rows in clients.items():
        # Sort by Start Date, then Start Time
        rows.sort(key=lambda r: (r.get("Start Date", ""), r.get("Start Time", "")))

        total_hours = sum(float(r.get("Duration (decimal)", 0) or 0) for r in rows)
        total_amount = sum(float(r.get("Billable Amount (USD)", 0) or 0) for r in rows)

        dates = [r.get("Start Date", "") for r in rows if r.get("Start Date")]
        report_start = min(dates) if dates else ""
        report_end = max(dates) if dates else ""

        # Format report period for display (DD/MM/YYYY -> Mon DD, YYYY)
        def fmt_date(s: str) -> str:
            d, m, y = parse_dd_mm_yyyy(s)
            if not (d and m and y):
                return s
            months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split()
            return f"{months[m-1]} {d}, {y}"

        period_str = f"{fmt_date(report_start)} - {fmt_date(report_end)}" if report_start and report_end else ""

        pdf = FPDF()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        # Add logo at top if available
        if logo_path.exists():
            pdf.image(str(logo_path), x=10, y=10, h=22)
            pdf.set_y(35)  # Move below logo for text
        else:
            pdf.set_y(10)

        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 8, "Fresh Roots Consulting, LLC", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 11)
        pdf.cell(0, 6, "Time & Invoice Summary", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 6, f"Client: {client_name}", new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 6, f"Report period: {period_str}", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)

        # Build table data - full content, no truncation (table() wraps text automatically)
        table_data = [
            ("Date", "Project", "Description", "Duration", "Amount ($)"),
        ]
        for r in rows:
            table_data.append((
                r.get("Start Date", ""),
                r.get("Project", "") or "",
                r.get("Description", "") or "",
                r.get("Duration (h)", ""),
                r.get("Billable Amount (USD)", ""),
            ))
        table_data.append(("", "", "Total", f"{total_hours:.2f}", f"{total_amount:.2f}"))

        # Use table() for automatic text wrapping - all content visible
        pdf.set_font("Helvetica", size=9)
        bold_style = FontFace(emphasis="BOLD")
        with pdf.table(
            col_widths=(22, 38, 75, 22, 28),
            line_height=pdf.font_size * 1.2,
            first_row_as_headings=True,
        ) as table:
            for i, row_data in enumerate(table_data):
                row = table.row()
                style = bold_style if i == len(table_data) - 1 else None
                for cell_text in row_data:
                    row.cell(str(cell_text), style=style)

        pdf.ln(8)
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 6, "Thank you for your business.", new_x="LMARGIN", new_y="NEXT")

        safe_name = sanitize_filename(client_name)
        out_file = out_dir / f"Invoice_{safe_name}_{year}-{month:02d}.pdf"
        pdf.output(str(out_file))
        print(f"Created: {out_file}")

    print(f"\nDone. Created {len(clients)} invoice(s) in {out_dir}")


if __name__ == "__main__":
    main()
