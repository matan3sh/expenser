import { ProcessingIndicator } from './ProcessingIndicator'
import { UploadPrompt } from './UploadPrompt'

interface UploadAreaProps {
  isProcessing: boolean
  onFileUpload: (file: File) => void
}

export const UploadArea = ({ isProcessing, onFileUpload }: UploadAreaProps) => (
  <div
    className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center 
    ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
  >
    <div className="flex flex-col items-center justify-center space-y-4">
      {isProcessing ? (
        <ProcessingIndicator />
      ) : (
        <UploadPrompt onFileUpload={onFileUpload} isProcessing={isProcessing} />
      )}
    </div>
  </div>
)
