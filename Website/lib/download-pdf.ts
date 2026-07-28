/**
 * Client-side HTML → PDF.
 * Renders each `.page-break` section as its own PDF page chunk so html2canvas
 * does not slice through forced page boundaries.
 */

import { jsPDF } from 'jspdf'

const PDF_EXPORT_CSS = `
body.pdf-export, .pdf-chunk {
  font-family: 'Times New Roman', Times, serif;
  font-size: 11pt;
  line-height: 1.4;
  margin: 0 !important;
  padding: 0 !important;
  max-width: none !important;
  color: #000;
}
body.pdf-export h1, .pdf-chunk h1 {
  font-size: 14pt;
  text-align: center;
  margin-bottom: 0.5em;
  margin-top: 2.25em;
}
body.pdf-export h2, .pdf-chunk h2 {
  font-size: 12pt;
  font-weight: bold;
  margin-top: 0.75em;
  margin-bottom: 0.25em;
}
body.pdf-export h3, .pdf-chunk h3 {
  font-size: 11pt;
  font-weight: bold;
  margin-top: 0.75em;
  margin-bottom: 0.2em;
}
body.pdf-export p, .pdf-chunk p { margin: 0.5em 0; text-align: justify; }
body.pdf-export ul, .pdf-chunk ul,
body.pdf-export ol, .pdf-chunk ol {
  margin: 0.25em 0;
  padding-left: 1.5em;
}
body.pdf-export li, .pdf-chunk li { margin: 0.15em 0; }
body.pdf-export table, .pdf-chunk table {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5em 0;
}
body.pdf-export th, .pdf-chunk th,
body.pdf-export td, .pdf-chunk td {
  border: 1px solid #000;
  padding: 0.35em 0.5em;
  text-align: left;
  vertical-align: top;
}
body.pdf-export th, .pdf-chunk th { font-weight: bold; }
body.pdf-export .sig-table, .pdf-chunk .sig-table { border: none; }
body.pdf-export .sig-table td, .pdf-chunk .sig-table td { border: none; }
body.pdf-export code, .pdf-chunk code {
  font-family: ui-monospace, monospace;
  font-size: 10pt;
}
body.pdf-export .agreement-logo, .pdf-chunk .agreement-logo {
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

function buildChunks(body: HTMLElement): HTMLElement[] {
  const chunks: HTMLElement[] = []
  let preamble = document.createElement('div')
  preamble.className = 'pdf-chunk'

  for (const child of Array.from(body.children)) {
    if (child.classList.contains('page-break')) {
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
  mount.style.cssText =
    'position:fixed;left:-10000px;top:0;width:794px;background:#fff;'
  const styleEl = document.createElement('style')
  styleEl.textContent = css
  mount.appendChild(styleEl)
  mount.appendChild(chunk)
  return mount
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
  const mounts: HTMLDivElement[] = []

  try {
    for (let i = 0; i < chunks.length; i++) {
      if (i > 0) {
        pdf.addPage()
      }
      const mount = createStyledMount(chunks[i], css)
      mounts.push(mount)
      document.body.appendChild(mount)
      await pdf.html(mount, {
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 794,
        html2canvas: { scale: 2, useCORS: true, logging: false },
        autoPaging: 'text',
      })
      mount.remove()
      mounts.pop()
    }
    pdf.save(filename)
  } finally {
    for (const mount of mounts) {
      mount.remove()
    }
  }
}
