import {
  ProcessedReceiptData,
  RawReceiptData,
  ReceiptProcessingError,
} from '@/types/receipt'

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
