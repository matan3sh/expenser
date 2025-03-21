'use client'

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
import { useRef, useState } from 'react'
import { createWorker } from 'tesseract.js'

export interface UploadData {
  amount?: number
  currency?: string
  date?: string
  description?: string
  location?: string
  category?: string
}

export const useReceiptProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadInitialData, setUploadInitialData] = useState<
    UploadData | undefined
  >(undefined)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { settings } = useSettings()

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
      amount: processedData.amount,
      currency: processedData.currency,
      date: processedData.date,
      description: processedData.description,
      location: processedData.location,
    }
  }

  // Process receipt using Tesseract.js
  const processWithTesseract = async (file: File) => {
    try {
      // Create worker with default settings
      const worker = await createWorker('eng')

      // Recognize text from image
      const { data } = await worker.recognize(file)

      // Clean up worker
      await worker.terminate()

      console.log('Raw text extracted by Tesseract:', data.text)

      const extractedData = extractReceiptData(data.text)
      console.log('Tesseract extracted data:', extractedData)

      if (!extractedData.amount) {
        throw new Error('Could not extract amount from receipt')
      }

      return {
        amount: extractedData.amount,
        currency: extractedData.currency,
        date: extractedData.date || new Date().toISOString().split('T')[0],
        description: extractedData.description || 'Receipt expense',
        location: extractedData.location || 'Unknown location',
      }
    } catch (error) {
      console.error('Tesseract processing error:', error)
      throw error
    }
  }

  // File upload handler
  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true)
      setUploadError(null)

      console.log('Processing file:', file.name, file.type)

      const params = await (settings?.useGeminiAI
        ? processWithGeminiAI(file)
        : processWithTesseract(file))

      console.log('Processed params:', params)
      setUploadInitialData(params)
      return params
    } catch (error) {
      console.error('Receipt processing failed:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to process receipt'
      setUploadError(errorMessage)
      throw error
    } finally {
      setIsProcessing(false)
      // Reset the file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const resetUpload = () => {
    setUploadInitialData(undefined)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return {
    isProcessing,
    uploadInitialData,
    uploadError,
    fileInputRef,
    handleFileUpload,
    resetUpload,
    setUploadError,
  }
}
