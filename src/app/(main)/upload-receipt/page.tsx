'use client'

import { UploadArea } from '@/components/receipt/UploadArea'
import { Separator } from '@/components/ui/separator'
import { useSettings } from '@/contexts/SettingsContext'
import {
  GEMINI_PROMPT,
  cleanGeminiResponse,
  convertImageToBase64,
  extractReceiptData,
  prepareImageData,
  validateAndFormatData,
} from '@/helpers/receipt'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createWorker } from 'tesseract.js'

// Types
interface ReceiptParams {
  amount: string
  currency: string
  date: string
  description: string
  location: string
}

export default function UploadReceiptPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { settings } = useSettings()

  // Helper function to navigate to add-expense page with params
  const navigateToAddExpense = (params: ReceiptParams) => {
    const url = `/add-expense?data=${encodeURIComponent(
      JSON.stringify(params)
    )}`
    router.push(url)
  }

  // Process receipt using Gemini AI
  const processWithGeminiAI = async (file: File) => {
    const base64Image = await convertImageToBase64(file)
    const imageData = prepareImageData(base64Image, file.type)

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY!
    )
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent([GEMINI_PROMPT, imageData])
    const response = await result.response
    const text = response.text()

    const cleanedResponse = cleanGeminiResponse(text)
    const parsedData = JSON.parse(cleanedResponse)
    const processedData = validateAndFormatData(parsedData)

    return {
      amount: processedData.amount.toString(),
      currency: processedData.currency,
      date: processedData.date,
      description: processedData.description,
      location: processedData.location,
    }
  }

  // Process receipt using Tesseract.js
  const processWithTesseract = async (file: File) => {
    const worker = await createWorker('eng')
    const {
      data: { text },
    } = await worker.recognize(file)
    await worker.terminate()

    const extractedData = extractReceiptData(text)
    console.log('Tesseract extracted data:', extractedData)

    if (!extractedData.amount) {
      throw new Error('Could not extract amount from receipt')
    }

    return {
      amount: extractedData.amount.toString(),
      currency: extractedData.currency,
      date: extractedData.date || new Date().toISOString(),
      description: extractedData.description,
      location: extractedData.location || 'Unknown location',
    }
  }

  // Main file upload handler
  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true)
      setError(null)

      const params = await (settings?.useGeminiAI
        ? processWithGeminiAI(file)
        : processWithTesseract(file))

      console.log('Processed params:', params)
      navigateToAddExpense(params)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to process receipt'
      )
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
