import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface UploadPromptProps {
  onFileUpload: (file: File) => void
  isProcessing: boolean
}

export const UploadPrompt = ({
  onFileUpload,
  isProcessing,
}: UploadPromptProps) => (
  <>
    <div className="bg-primary-50 p-3 rounded-full">
      <Upload className="h-8 w-8 text-primary" />
    </div>
    <div>
      <p className="text-lg font-medium">Drag and drop your receipt here</p>
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
          if (file) onFileUpload(file)
        }}
        disabled={isProcessing}
      />
    </div>
  </>
)
