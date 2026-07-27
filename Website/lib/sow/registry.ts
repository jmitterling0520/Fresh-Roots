import type { ComponentType } from 'react'
import type {
  SowBodyProps,
  SowClientFields,
  SowConsultantFields,
  SowMeta,
} from '@/lib/sow/types'
import { DeerConnectionSowBody } from '@/content/sow/deer-connection-phase-one'
import { deerConnectionMeta } from '@/content/sow/deer-connection-phase-one-meta'

export type SowUiModule = {
  meta: SowMeta
  Body: ComponentType<SowBodyProps>
}

export type SowHtmlBuilder = (
  client: SowClientFields,
  consultant: SowConsultantFields,
  effectiveDate: string,
  baseUrl?: string
) => string

const registry: Record<string, SowUiModule> = {
  [deerConnectionMeta.slug]: {
    meta: deerConnectionMeta,
    Body: DeerConnectionSowBody,
  },
}

export function getSow(slug: string): SowUiModule | null {
  return registry[slug] ?? null
}

export function listSows(): SowUiModule[] {
  return Object.values(registry)
}

export function listActiveSows(): SowUiModule[] {
  return listSows().filter((m) => m.meta.status === 'active')
}
