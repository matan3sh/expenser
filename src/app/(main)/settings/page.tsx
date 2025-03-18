'use client'

import { CurrencySettings } from '@/components/settings/CurrencySettings'
import ReceiptProcessingSwitcher from '@/components/settings/ReceiptProcessingSwitcher'
import { ThemeSettings } from '@/components/settings/ThemeSettings'
import { useSettings } from '@/contexts/SettingsContext'

export default function SettingsPage() {
  const { settings, updateUseGeminiAI } = useSettings()

  return (
    <div className="flex flex-col h-full">
      {/* Desktop View */}
      <div className="hidden lg:block p-6 space-y-6">
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

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col h-full">
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
