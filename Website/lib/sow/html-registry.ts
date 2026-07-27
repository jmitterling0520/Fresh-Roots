import type { SowHtmlBuilder } from '@/lib/sow/registry'
import { buildDeerConnectionSowHtml } from '@/content/sow/deer-connection-phase-one-html'
import { deerConnectionMeta } from '@/content/sow/deer-connection-phase-one-meta'

const htmlBuilders: Record<string, SowHtmlBuilder> = {
  [deerConnectionMeta.slug]: buildDeerConnectionSowHtml,
}

export function getSowHtmlBuilder(slug: string): SowHtmlBuilder | null {
  return htmlBuilders[slug] ?? null
}
