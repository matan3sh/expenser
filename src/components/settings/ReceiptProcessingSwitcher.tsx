import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Settings } from '@/contexts/SettingsContext'

const ReceiptProcessingSwitcher = ({
  settings,
  updateUseGeminiAI,
}: {
  settings: Settings
  updateUseGeminiAI: (useGeminiAI: boolean) => void
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receipt Processing</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Use Gemini AI</h3>
          <p className="text-sm text-muted-foreground">
            Toggle between Gemini AI and Tesseract.js for receipt processing
          </p>
        </div>
        <Switch
          checked={settings?.useGeminiAI ?? true}
          onCheckedChange={updateUseGeminiAI}
        />
      </CardContent>
    </Card>
  )
}

export default ReceiptProcessingSwitcher
