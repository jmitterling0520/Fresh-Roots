/**
 * Client-side HTML → PDF.
 * Splits the document at `.page-break` markers, renders each section with
 * html2canvas, and starts every section on a new PDF page.
 */

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const PAGE_WIDTH_MM = 210
const PAGE_HEIGHT_MM = 297
const MARGIN_MM = 10
const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2
const CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - MARGIN_MM * 2
const RENDER_WIDTH_PX = 794
const PAGE_BREAK_RE = /<div class="page-break[^"]*">/gi

const PDF_EXPORT_CSS = `
.pdf-export-root, .pdf-chunk {
  font-family: 'Times New Roman', Times, serif;
  font-size: 11pt;
  line-height: 1.4;
  margin: 0 !important;
  padding: 0 !important;
  max-width: none !important;
  color: #000;
  background: #fff;
}
.pdf-export-root h1, .pdf-chunk h1 {
  font-size: 14pt;
  text-align: center;
  margin-bottom: 0.5em;
  margin-top: 2.25em;
}
.pdf-export-root h2, .pdf-chunk h2 {
  font-size: 12pt;
  font-weight: bold;
  margin-top: 0.75em;
  margin-bottom: 0.25em;
}
.pdf-export-root h3, .pdf-chunk h3 {
  font-size: 11pt;
  font-weight: bold;
  margin-top: 0.75em;
  margin-bottom: 0.2em;
}
.pdf-export-root p, .pdf-chunk p { margin: 0.5em 0; text-align: justify; }
.pdf-export-root ul, .pdf-chunk ul,
.pdf-export-root ol, .pdf-chunk ol {
  margin: 0.25em 0;
  padding-left: 1.5em;
}
.pdf-export-root li, .pdf-chunk li { margin: 0.15em 0; }
.pdf-export-root table, .pdf-chunk table {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5em 0;
}
.pdf-export-root th, .pdf-chunk th,
.pdf-export-root td, .pdf-chunk td {
  border: 1px solid #000;
  padding: 0.35em 0.5em;
  text-align: left;
  vertical-align: top;
}
.pdf-export-root th, .pdf-chunk th { font-weight: bold; }
.pdf-export-root .sig-table, .pdf-chunk .sig-table { border: none; }
.pdf-export-root .sig-table td, .pdf-chunk .sig-table td { border: none; }
.pdf-export-root code, .pdf-chunk code {
  font-family: ui-monospace, monospace;
  font-size: 10pt;
}
.pdf-export-root .agreement-logo, .pdf-chunk .agreement-logo {
  display: block;
  position: static;
  max-width: 180px;
  max-height: 60px;
  margin-bottom: 0.75em;
}
`

function extractBodyHtml(html: string): string {
  const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  return match?.[1] ?? html
}

function stripClosingWrapperDiv(sectionHtml: string): string {
  const trimmed = sectionHtml.trim()
  if (trimmed.endsWith('</div>')) {
    return trimmed.slice(0, trimmed.lastIndexOf('</div>')).trim()
  }
  return trimmed
}

/** Split on explicit page-break markers in the HTML we generate. */
function splitHtmlIntoSections(html: string): string[] {
  const bodyHtml = extractBodyHtml(html)
  const breaks: Array<{ start: number; contentStart: number }> = []

  for (const match of bodyHtml.matchAll(PAGE_BREAK_RE)) {
    if (match.index == null) continue
    breaks.push({
      start: match.index,
      contentStart: match.index + match[0].length,
    })
  }

  if (breaks.length === 0) {
    return [`<div class="pdf-chunk">${bodyHtml}</div>`]
  }

  const sections: string[] = []
  const preamble = bodyHtml.slice(0, breaks[0].start).trim()
  if (preamble) {
    sections.push(`<div class="pdf-chunk">${preamble}</div>`)
  }

  for (let i = 0; i < breaks.length; i++) {
    const contentStart = breaks[i].contentStart
    const contentEnd =
      i + 1 < breaks.length ? breaks[i + 1].start : bodyHtml.length
    const sectionHtml = stripClosingWrapperDiv(
      bodyHtml.slice(contentStart, contentEnd)
    )
    if (sectionHtml) {
      sections.push(`<div class="pdf-chunk">${sectionHtml}</div>`)
    }
  }

  return sections
}

async function loadHtmlInIframe(html: string): Promise<{
  iframe: HTMLIFrameElement
  doc: Document
}> {
  const iframe = document.createElement('iframe')
  iframe.setAttribute('sandbox', 'allow-same-origin')
  iframe.style.cssText =
    'position:fixed;left:-10000px;top:0;width:794px;height:10px;border:0;visibility:hidden'
  document.body.appendChild(iframe)

  await new Promise<void>((resolve, reject) => {
    iframe.onload = () => resolve()
    iframe.onerror = () => reject(new Error('Failed to load SOW HTML'))
    iframe.srcdoc = html
  })

  const doc = iframe.contentDocument
  if (!doc?.body) {
    iframe.remove()
    throw new Error('Failed to parse SOW HTML')
  }

  await Promise.all(
    Array.from(doc.images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve()
            return
          }
          img.onload = () => resolve()
          img.onerror = () => resolve()
        })
    )
  )

  return { iframe, doc }
}

async function renderSectionToCanvas(
  sectionHtml: string,
  css: string,
  doc: Document
): Promise<HTMLCanvasElement> {
  const exportStyle = doc.createElement('style')
  exportStyle.textContent = css
  doc.head.appendChild(exportStyle)

  const wrapper = doc.createElement('div')
  wrapper.className = 'pdf-export-root'
  wrapper.style.width = `${RENDER_WIDTH_PX}px`
  wrapper.style.background = '#fff'
  wrapper.innerHTML = sectionHtml
  doc.body.appendChild(wrapper)

  try {
    return await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: RENDER_WIDTH_PX,
      windowWidth: RENDER_WIDTH_PX,
    })
  } finally {
    wrapper.remove()
    exportStyle.remove()
  }
}

function addCanvasSlicesToPdf(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  isFirstPdfPage: { value: boolean }
): void {
  const imgWidthMm = CONTENT_WIDTH_MM
  const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width
  const sliceHeightPx = (CONTENT_HEIGHT_MM / imgHeightMm) * canvas.height

  let yOffsetPx = 0
  while (yOffsetPx < canvas.height) {
    if (!isFirstPdfPage.value) {
      pdf.addPage()
    }
    isFirstPdfPage.value = false

    const remainingPx = canvas.height - yOffsetPx
    const currentSlicePx = Math.min(sliceHeightPx, remainingPx)
    const currentSliceMm = (currentSlicePx * imgWidthMm) / canvas.width

    const sliceCanvas = document.createElement('canvas')
    sliceCanvas.width = canvas.width
    sliceCanvas.height = currentSlicePx
    const ctx = sliceCanvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to create PDF slice')
    }
    ctx.drawImage(
      canvas,
      0,
      yOffsetPx,
      canvas.width,
      currentSlicePx,
      0,
      0,
      canvas.width,
      currentSlicePx
    )

    pdf.addImage(
      sliceCanvas.toDataURL('image/jpeg', 0.92),
      'JPEG',
      MARGIN_MM,
      MARGIN_MM,
      imgWidthMm,
      currentSliceMm
    )

    yOffsetPx += currentSlicePx
  }
}

export async function downloadHtmlAsPdf(
  html: string,
  filename: string
): Promise<void> {
  const sections = splitHtmlIntoSections(html)
  if (sections.length === 0) {
    throw new Error('No PDF content found')
  }

  const { iframe, doc } = await loadHtmlInIframe(html)
  const baseCss = doc.querySelector('style')?.textContent ?? ''
  const css = `${baseCss}\n${PDF_EXPORT_CSS}`

  try {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    const isFirstPdfPage = { value: true }

    for (const sectionHtml of sections) {
      const canvas = await renderSectionToCanvas(sectionHtml, css, doc)
      addCanvasSlicesToPdf(pdf, canvas, isFirstPdfPage)
    }

    pdf.save(filename)
  } finally {
    iframe.remove()
  }
}
