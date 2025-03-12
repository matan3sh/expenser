import { AMOUNT_PATTERNS, CURRENCY_MAP } from '@/constants/receipt'
import { ExtractedData } from '@/types/receipt'

export const extractAmount = (text: string) => {
  let amountMatch = null

  for (const pattern of AMOUNT_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      if (pattern === AMOUNT_PATTERNS[3]) {
        amountMatch = [null, '$', match[1]]
      } else if (pattern === AMOUNT_PATTERNS[2]) {
        amountMatch = [null, match[2], match[1]]
      } else {
        amountMatch = match
      }
      break
    }
  }

  return { amountMatch, currencySymbol: amountMatch?.[1] || '$' }
}

export const parseDate = (dateMatch: RegExpMatchArray) => {
  const [, day, month, year] = dateMatch
  const fullYear = year.length === 2 ? '20' + year : year
  try {
    const date = new Date(
      `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    )
    return !isNaN(date.getTime()) ? date.toISOString() : undefined
  } catch {
    console.warn('Invalid date found in receipt:', dateMatch[0])
    return undefined
  }
}

export const cleanAmount = (amount: string) => {
  const cleaned = amount.replace(/[^\d.]/g, '')
  const parts = cleaned.split('.')
  return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned
}

export const extractReceiptData = (text: string): ExtractedData => {
  const { amountMatch, currencySymbol } = extractAmount(text)
  const dateMatch = text.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/)
  const merchant = text.match(/^([A-Za-z0-9\s&]+)(?:\n|$)/m)?.[1]?.trim()

  const currency = CURRENCY_MAP[currencySymbol] || 'USD'
  let amount = amountMatch?.[2]?.replace(',', '.')
  amount = amount ? cleanAmount(amount) : undefined

  return {
    amount: amount ? parseFloat(amount) : undefined,
    currency,
    date: dateMatch ? parseDate(dateMatch) : undefined,
    description: 'Receipt expense',
    location: merchant,
  }
}
