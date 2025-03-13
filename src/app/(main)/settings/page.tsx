'use client'

import { CurrencySettings } from '@/components/settings/CurrencySettings'
import ReceiptProcessingSwitcher from '@/components/settings/ReceiptProcessingSwitcher'
import { ThemeSettings } from '@/components/settings/ThemeSettings'
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
        <ReceiptProcessingSwitcher
          settings={settings}
          updateUseGeminiAI={updateUseGeminiAI}
        />
      </div>
    </div>
  )
}
