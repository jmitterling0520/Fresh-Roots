import type { ComponentType } from 'react'

export type SowMeta = {
  slug: string
  title: string
  customer: string
  customerContact?: {
    name: string
    email: string
    phone?: string
  }
  product?: string
  engagement?: string
  fixedFee: string
  provider: string
  status: 'active' | 'archived'
}

export type SowBodyProps = {
  effectiveDate: string
  signerName: string
  signerTitle: string
  signatureImage: string | null
  clientSignerDate: string
}

export type SowClientFields = {
  email: string
  signer_name: string
  signer_title: string
  signature_image: string | null
  client_signer_date: string
}

export type SowConsultantFields = {
  consultant_name: string
  consultant_title: string
  consultant_signature: string
  consultant_date: string
}

export type SowSubmission = SowClientFields & {
  token: string
  sow_slug: string
  customer_name: string
  approved?: boolean
}

export type SowModule = {
  meta: SowMeta
  Body: ComponentType<SowBodyProps>
  buildHtml: (
    client: SowClientFields,
    consultant: SowConsultantFields,
    effectiveDate: string,
    baseUrl?: string
  ) => string
}
