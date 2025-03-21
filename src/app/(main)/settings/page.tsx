'use client'

import { useSettings } from '@/components/providers/settings-provider'
import { CurrencySettings } from '@/components/settings/CurrencySettings'
import ReceiptProcessingSwitcher from '@/components/settings/ReceiptProcessingSwitcher'
import { ThemeSettings } from '@/components/settings/ThemeSettings'

export default function SettingsPage() {
  const { settings, updateUseGeminiAI } = useSettings()

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full">
        <div className="px-4 py-3">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your application preferences
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-4">
            <CurrencySettings />
            <ThemeSettings />
            <ReceiptProcessingSwitcher
              settings={settings}
              updateUseGeminiAI={updateUseGeminiAI}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
