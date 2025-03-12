'use client'

import { UploadArea } from '@/components/receipt/UploadArea'
import { Separator } from '@/components/ui/separator'
import { extractReceiptData } from '@/utils/receipt'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createWorker } from 'tesseract.js'

export default function UploadReceiptPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    setError(null)

    try {
      const worker = await createWorker('eng')
      const {
        data: { text },
      } = await worker.recognize(file)
      await worker.terminate()

      const extractedData = extractReceiptData(text)
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
