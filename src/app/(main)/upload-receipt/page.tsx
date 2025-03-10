import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Upload } from 'lucide-react'

export default function UploadReceiptPage() {
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
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
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
              />
            </div>
          </div>
        </div>

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
