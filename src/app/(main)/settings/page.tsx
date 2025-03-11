'use client'

import { CurrencySettings } from '@/components/settings/CurrencySettings'
import { ThemeSettings } from '@/components/settings/ThemeSettings'
import { useSettings } from '@/contexts/SettingsContext'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'

export default function SettingsPage() {
  const { settings } = useSettings()
  const { setTheme } = useTheme()

  // Sync theme with next-themes
  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme)
    }
  }, [settings?.theme, setTheme])

  return (
    <div className="space-y-6">
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
    </div>
  )
}
