/**
 * Client-side HTML → PDF.
 * Renders each `.page-break` section via html2canvas and forces a new PDF page
 * between sections so content is never sliced mid-paragraph across boundaries.
 */

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const PAGE_WIDTH_MM = 210
const PAGE_HEIGHT_MM = 297
const MARGIN_MM = 10
const CONTENT_WIDTH_MM = PAGE_WIDTH_MM - MARGIN_MM * 2
const CONTENT_HEIGHT_MM = PAGE_HEIGHT_MM - MARGIN_MM * 2
const RENDER_WIDTH_PX = 794

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

function parseHtml(html: string): Document {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}

function isPageBreak(el: Element): boolean {
  return (
    el.classList.contains('page-break') ||
    el.getAttribute('class')?.split(/\s+/).includes('page-break') === true
  )
}

function buildChunks(body: HTMLElement): HTMLElement[] {
  const chunks: HTMLElement[] = []
  let preamble = document.createElement('div')
  preamble.className = 'pdf-chunk'

  for (const child of Array.from(body.children)) {
    if (isPageBreak(child)) {
      if (preamble.childNodes.length > 0) {
        chunks.push(preamble)
        preamble = document.createElement('div')
        preamble.className = 'pdf-chunk'
      }
      const section = document.createElement('div')
      section.className = 'pdf-chunk'
      for (const node of Array.from(child.childNodes)) {
        section.appendChild(node.cloneNode(true))
      }
      chunks.push(section)
    } else {
      preamble.appendChild(child.cloneNode(true))
    }
  }

  if (preamble.childNodes.length > 0) {
    chunks.push(preamble)
  }

  return chunks
}

function createStyledMount(chunk: HTMLElement, css: string): HTMLDivElement {
  const mount = document.createElement('div')
  mount.className = 'pdf-export-root'
  mount.style.cssText =
    'position:fixed;left:-10000px;top:0;width:794px;background:#fff;'
  const styleEl = document.createElement('style')
  styleEl.textContent = css
  mount.appendChild(styleEl)
  mount.appendChild(chunk)
  return mount
}

async function renderChunkImages(
  chunk: HTMLElement,
  css: string
): Promise<HTMLCanvasElement> {
  const mount = createStyledMount(chunk, css)
  document.body.appendChild(mount)

  try {
    return await html2canvas(mount, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: RENDER_WIDTH_PX,
      windowWidth: RENDER_WIDTH_PX,
    })
  } finally {
    mount.remove()
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
  const doc = parseHtml(html)
  const baseCss = doc.querySelector('style')?.textContent ?? ''
  const css = `${baseCss}\n${PDF_EXPORT_CSS}`

  const chunks = buildChunks(doc.body)
  if (chunks.length === 0) {
    throw new Error('No PDF content found')
  }

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const isFirstPdfPage = { value: true }

  for (const chunk of chunks) {
    const canvas = await renderChunkImages(chunk, css)
    addCanvasSlicesToPdf(pdf, canvas, isFirstPdfPage)
  }

  pdf.save(filename)
}
