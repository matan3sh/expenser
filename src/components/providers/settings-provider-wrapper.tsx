import { getUserSettings } from '@/lib/actions/settings.actions'
import { serverLog } from '@/lib/logging'
import { Settings } from '../../types/settings.types'
import { SettingsProvider } from './settings-provider'

export async function SettingsProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  let initialSettings: Settings | null = null

  try {
    // Fetch settings using the server action
    const result = await getUserSettings()

    if (result.success && result.settings) {
      initialSettings = {
        ...result.settings,
        // Always include default exchangeRates since we don't store them in DB
        exchangeRates: { USD: 1, ILS: 3.6 },
      }
    } else {
      serverLog('No settings found or error fetching settings, using defaults')
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error)
  }

  return (
    <SettingsProvider initialSettings={initialSettings}>
      {children}
    </SettingsProvider>
  )
}
