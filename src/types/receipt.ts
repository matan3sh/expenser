export interface ExtractedData {
  amount?: number
  currency: string
  date?: string
  description: string
  location?: string
}

export interface RawReceiptData {
  amount: string
  currency: string
  date: string
  merchant: string
}

export interface ProcessedReceiptData {
  amount: number
  currency: string
  date: string
  description: string
  location: string
}

export type ReceiptErrorStep =
  | 'image_conversion'
  | 'image_preparation'
  | 'api_error'
  | 'data_validation'
  | 'default'
  | 'response_cleaning'

export class ReceiptProcessingError extends Error {
  constructor(message: string, public readonly step: ReceiptErrorStep) {
    super(message)
    this.name = 'ReceiptProcessingError'
  }
}
