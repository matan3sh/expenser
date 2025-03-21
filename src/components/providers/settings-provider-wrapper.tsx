import { getUserSettings } from '@/lib/actions/settings.actions'
import { serverLog } from '@/lib/logging'
import { DBSettings, Settings } from '../../types/settings.types'
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
      // Type guard to ensure settings is an object
      if (typeof result.settings === 'object' && result.settings !== null) {
        // Cast the settings to DBSettings type
        const dbSettings = result.settings as DBSettings

        initialSettings = {
          ...dbSettings,
          // Always include default exchangeRates since we don't store them in DB
          exchangeRates: { USD: 1, ILS: 3.6 },
          // Ensure all required properties are included with defaults if missing
          theme: dbSettings.theme || 'system',
          selectedMonth: dbSettings.selectedMonth || {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
          },
          useGeminiAI: dbSettings.useGeminiAI ?? true,
        }
      } else {
        // Handle the case where settings is not an object
        initialSettings = {
          // Set default values for all required properties
          exchangeRates: { USD: 1, ILS: 3.6 },
          theme: 'system',
          selectedMonth: {
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
          },
          useGeminiAI: true,
        }
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
