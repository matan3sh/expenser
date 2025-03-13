'use client'

import { CurrencySettings } from '@/components/settings/CurrencySettings'
import { ThemeSettings } from '@/components/settings/ThemeSettings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useSettings } from '@/contexts/SettingsContext'

export default function SettingsPage() {
  const { settings, updateUseGeminiAI } = useSettings()

  return (
    <div className="container mx-auto space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application preferences
        </p>
      </header>

      <div className="grid gap-6">
        <CurrencySettings />
        <ThemeSettings />
      </div>

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
    </div>
  )
}
