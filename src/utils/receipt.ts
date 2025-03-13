import { AMOUNT_PATTERNS, CURRENCY_MAP } from '@/constants/receipt'
import {
  ExtractedData,
  ProcessedReceiptData,
  RawReceiptData,
  ReceiptProcessingError,
} from '@/types/receipt'

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

export const GEMINI_PROMPT = `
Extract the following information from this receipt image and return ONLY a valid JSON object with the following structure:
{
  "amount": "numeric value without currency symbol",
  "currency": "three-letter currency code (e.g., USD, EUR, ILS)",
  "date": "YYYY-MM-DD format",
  "merchant": "store name"
}`

export const convertImageToBase64 = async (file: File): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () =>
        reject(
          new ReceiptProcessingError(
            'Failed to read image file',
            'image_conversion'
          )
        )
      reader.readAsDataURL(file)
    })
  } catch {
    throw new ReceiptProcessingError(
      'Failed to convert image to base64',
      'image_conversion'
    )
  }
}

export const prepareImageData = (base64Image: string, mimeType: string) => {
  if (!base64Image || !mimeType) {
    throw new ReceiptProcessingError(
      'Invalid image data or mime type',
      'image_preparation'
    )
  }

  return {
    inlineData: {
      data: base64Image.split(',')[1],
      mimeType,
    },
  }
}

export const cleanGeminiResponse = (text: string): string => {
  if (!text) {
    throw new ReceiptProcessingError(
      'Empty response from Gemini',
      'response_cleaning'
    )
  }
  return text
    .replace(/```json\n?/, '')
    .replace(/```\n?/, '')
    .trim()
}

export const validateCurrency = (currency: string): string => {
  const validCurrency = currency?.toUpperCase()
  if (!validCurrency || validCurrency.length !== 3) {
    return 'USD'
  }
  return validCurrency
}

export const validateAndFormatData = (
  parsedData: RawReceiptData
): ProcessedReceiptData => {
  if (!parsedData.amount || isNaN(parseFloat(parsedData.amount))) {
    throw new ReceiptProcessingError(
      'Invalid amount in receipt data',
      'data_validation'
    )
  }

  if (!parsedData.date || isNaN(Date.parse(parsedData.date))) {
    throw new ReceiptProcessingError(
      'Invalid date in receipt data',
      'data_validation'
    )
  }

  return {
    amount: parseFloat(parsedData.amount),
    currency: validateCurrency(parsedData.currency),
    date: parsedData.date,
    description: 'Receipt expense',
    location: parsedData.merchant || 'Unknown location',
  }
}
