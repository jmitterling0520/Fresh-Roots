#!/usr/bin/env python3
"""Convert Operating Agreement markdown to PDF."""
import markdown
from pathlib import Path
from xhtml2pdf import pisa

base = Path(__file__).resolve().parent
md_path = base / "Operating Agreement - Fresh Roots Consulting LLC.md"
pdf_path = base / "Operating Agreement - Fresh Roots Consulting LLC.pdf"

with open(md_path, "r", encoding="utf-8") as f:
    md_text = f.read()

html_body = markdown.markdown(md_text, extensions=["extra", "nl2br"])

html_doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Operating Agreement - Fresh Roots Consulting, LLC</title>
  <style>
    body {{ font-family: Georgia, serif; font-size: 11pt; line-height: 1.5; margin: 1in; color: #222; }}
    h1 {{ font-size: 14pt; margin-top: 0.5em; margin-bottom: 0.25em; }}
    h2 {{ font-size: 12pt; margin-top: 1em; margin-bottom: 0.35em; }}
    hr {{ border: none; border-top: 1pt solid #ccc; margin: 1em 0; }}
    p {{ margin: 0.4em 0; }}
    ul {{ margin: 0.4em 0; padding-left: 1.5em; }}
    li {{ margin: 0.2em 0; }}
    blockquote {{ margin: 0.5em 0; padding-left: 1em; border-left: 3pt solid #ccc; }}
    strong {{ font-weight: bold; }}
  </style>
</head>
<body>
{html_body}
</body>
</html>
"""

with open(pdf_path, "wb") as pdf_file:
    pisa_status = pisa.CreatePDF(html_doc.encode("utf-8"), dest=pdf_file, encoding="utf-8")
if pisa_status.err:
    raise SystemExit(f"PDF creation had errors: {pisa_status.err}")
print(f"Created: {pdf_path}")
