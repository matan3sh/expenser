export const CURRENCY_MAP: Record<string, string> = {
  '£': 'GBP',
  $: 'USD',
  '€': 'EUR',
}

export const AMOUNT_PATTERNS = [
  /(?:total|amount|sum|due|balance)[:\s]*([£$€])\s*(\d+(?:[.,]\d{2})?)/i,
  /([£$€])\s*(\d+(?:[.,]\d{2})?)\s*$/im,
  /(\d+(?:[.,]\d{2})?)\s*([£$€])/i,
  /(?:total|amount|sum|due|balance)[:\s]*(\d+(?:[.,]\d{2})?)/i,
]
