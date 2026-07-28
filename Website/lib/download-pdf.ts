/**
 * Client-side HTML → PDF via html2pdf.js.
 * Uses CSS page-break rules only (no duplicate html2pdf "before" selectors).
 */

export async function downloadHtmlAsPdf(
  html: string,
  filename: string
): Promise<void> {
  const html2pdf = (await import('html2pdf.js')).default
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const style = doc.querySelector('style')
  if (style && doc.body) {
    doc.body.insertBefore(style, doc.body.firstChild)
  }

  await html2pdf()
    .set({
      margin: 10,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: {
        mode: 'css',
        avoid: ['.sig-table', 'h1', 'h2', 'h3', 'table'],
      },
    } as any)
    .from(doc.body)
    .save()
}
