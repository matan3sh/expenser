'use client'

import { UploadArea } from '@/components/receipt/UploadArea'
import { Separator } from '@/components/ui/separator'
import { ReceiptErrorStep, ReceiptProcessingError } from '@/types/receipt'
import {
  GEMINI_PROMPT,
  cleanGeminiResponse,
  convertImageToBase64,
  prepareImageData,
  validateAndFormatData,
} from '@/utils/receipt'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ERROR_MESSAGES: Record<ReceiptErrorStep, string> = {
  image_conversion:
    'Failed to process the image. Please try a different image.',
  image_preparation: 'Invalid image format. Please try a different image.',
  api_error: 'Failed to analyze the receipt. Please try again.',
  data_validation:
    'Could not extract valid data from the receipt. Please check the image quality.',
  response_cleaning:
    'Failed to process the receipt response. Please try again.',
  default:
    'Failed to process receipt. Please try again or enter details manually.',
} as const

export default function UploadReceiptPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Step 1: Convert image to base64
      const base64Image = await convertImageToBase64(file)

      // Step 2: Initialize Gemini AI
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!
      )
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      // Step 3: Prepare and process image
      const imageData = prepareImageData(base64Image, file.type)
      const result = await model.generateContent([GEMINI_PROMPT, imageData])

      // Step 4: Parse and validate response
      const response = await result.response
      const cleanedText = cleanGeminiResponse(response.text())
      const parsedData = JSON.parse(cleanedText)

      // Step 5: Format and validate data
      const extractedData = validateAndFormatData(parsedData)

      // Step 6: Navigate to add expense page
      router.push(
        `/add-expense?data=${encodeURIComponent(JSON.stringify(extractedData))}`
      )
    } catch (err) {
      console.error('Receipt processing error:', err)

      if (err instanceof ReceiptProcessingError) {
        setError(ERROR_MESSAGES[err.step] || ERROR_MESSAGES.default)
      } else if (err instanceof SyntaxError) {
        setError(ERROR_MESSAGES.data_validation)
      } else {
        setError(ERROR_MESSAGES.default)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Upload Receipt</h1>
        <p className="text-muted-foreground">
          Upload a receipt image to automatically extract expense details.
        </p>
      </header>

      <Separator />

      <div className="space-y-6">
        <UploadArea
          isProcessing={isProcessing}
          onFileUpload={handleFileUpload}
        />

        {error && (
          <div className="bg-destructive/10 text-destructive rounded-lg p-4">
            {error}
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Tips for better results:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>
              Ensure the receipt is well-lit and the text is clearly visible
            </li>
            <li>Capture the entire receipt in the image</li>
            <li>Make sure the receipt is flat and not crumpled</li>
            <li>For best results, take the photo directly above the receipt</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
