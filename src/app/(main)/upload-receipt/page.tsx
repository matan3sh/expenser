'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Spinner from '@/components/ui/spinner'
import { Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createWorker } from 'tesseract.js'

export default function UploadReceiptPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const extractReceiptData = (text: string) => {
    // Look for total amount with currency anywhere in the text
    const amountPattern =
      /(?:total|amount|sum|due)[:\s]*([£$€])\s*(\d+(?:[.,]\d{2})?)/i
    const datePattern = /(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/
    const merchantPattern = /^([A-Za-z0-9\s&]+)(?:\n|$)/m

    const amountMatch = text.match(amountPattern)
    const dateMatch = text.match(datePattern)
    const merchant = text.match(merchantPattern)?.[1]?.trim()

    // Handle currency and amount
    const currencyMap: { [key: string]: string } = {
      '£': 'GBP',
      $: 'USD',
      '€': 'EUR',
    }
    const currencySymbol = amountMatch?.[1] || '$'
    const currency = currencyMap[currencySymbol] || 'USD'
    const amount = amountMatch?.[2]?.replace(',', '.')

    // Handle date properly
    let formattedDate
    if (dateMatch) {
      const [, day, month, year] = dateMatch
      const fullYear = year.length === 2 ? '20' + year : year
      formattedDate = new Date(`${fullYear}-${month}-${day}`).toISOString()
    }

    return {
      amount: amount ? parseFloat(amount) : undefined,
      currency: currency,
      date: formattedDate,
      description: 'Receipt expense',
      location: merchant || undefined,
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Initialize Tesseract worker
      const worker = await createWorker('eng')

      // Perform OCR
      const {
        data: { text },
      } = await worker.recognize(file)
      await worker.terminate()

      // Extract structured data
      const extractedData = extractReceiptData(text)
      console.log('Extracted text:', text)
      console.log('Structured data:', extractedData)

      // Redirect to add-expense with extracted data
      router.push(
        `/add-expense?data=${encodeURIComponent(JSON.stringify(extractedData))}`
      )
    } catch (err) {
      setError(
        'Failed to process receipt. Please try again or enter details manually.'
      )
      console.error('Receipt processing error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Receipt</h1>
        <p className="text-muted-foreground">
          Upload a receipt image to automatically extract expense details.
        </p>
      </div>
      <Separator />
      <div className="space-y-6">
        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center 
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            {isProcessing ? (
              <div className="flex flex-col items-center space-y-2">
                <Spinner className="h-8 w-8" />
                <p className="text-sm text-muted-foreground">
                  Processing receipt...
                </p>
              </div>
            ) : (
              <>
                <div className="bg-primary-50 p-3 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    Drag and drop your receipt here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports JPG, PNG and PDF files up to 10MB
                  </p>
                </div>
                <div className="relative">
                  <Button className="mt-2">Browse Files</Button>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                    disabled={isProcessing}
                  />
                </div>
              </>
            )}
          </div>
        </div>

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

        <div className="rounded-lg border bg-card p-6 hidden">
          <h3 className="text-lg font-medium mb-4">Extracted Information</h3>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Merchant
                </p>
                <p className="font-medium">Store Name</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Date
                </p>
                <p className="font-medium">MM/DD/YYYY</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </p>
                <p className="font-medium">$XX.XX</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <p className="font-medium">Auto-detected Category</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Edit Details</Button>
              <Button>Save Receipt</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
