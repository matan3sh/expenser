'use client'

import { updateUserSettings } from '@/lib/actions/settings.actions'
import { deepEqual } from '@/lib/utils'
import { useTheme } from 'next-themes'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'
import { CurrencySelection, Settings } from '../../types/settings.types'

// Default settings
const defaultSettings: Settings = {
  displayCurrency: { code: 'USD', name: 'US Dollar', symbol: '$' },
  exchangeRates: { USD: 1, ILS: 3.6 },
  theme: 'system',
  selectedMonth: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  useGeminiAI: true,
}

type SettingsContextType = {
  settings: Settings
  updateDisplayCurrency: (currency: CurrencySelection) => void
  updateExchangeRates: (rates: Record<string, number>) => void
  updateTheme: (theme: Settings['theme']) => void
  updateSelectedMonth: (month: number, year: number) => void
  updateUseGeminiAI: (enabled: boolean) => void
  isCurrentMonth: () => boolean
  convertAmount: (amount: number, fromCurrency: string) => number
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
)

type SettingsProviderProps = {
  children: React.ReactNode
  initialSettings?: Settings | null
}

export function SettingsProvider({
  children,
  initialSettings,
}: SettingsProviderProps) {
  const { setTheme } = useTheme()

  // State and refs setup
  const initialLoadRef = useRef(true)
  const isSavingRef = useRef(false)
  const originalSettingsRef = useRef<Settings | null>(initialSettings)
  const hasServerSettingsRef = useRef(!!initialSettings)

  // Initialize settings from server
  const [settings, setSettings] = useState<Settings>(
    initialSettings || defaultSettings
  )

  // Create a properly typed save function
  const saveSettings = useRef<(settingsToSave: Settings) => Promise<void>>(
    async (settingsToSave: Settings) => {
      if (isSavingRef.current) return

      isSavingRef.current = true
      const toastId = toast.loading('Saving settings...')

      try {
        const result = await updateUserSettings(settingsToSave)

        if (result.success) {
          toast.success('Settings saved successfully', {
            id: toastId,
            duration: 2000,
          })
          originalSettingsRef.current = { ...settingsToSave }
        } else {
          toast.error(`Failed to save settings: ${result.error}`, {
            id: toastId,
            duration: 3000,
          })
        }
      } catch (err) {
        toast.error(`Error saving settings: ${(err as Error).message}`, {
          id: toastId,
          duration: 3000,
        })
        console.error('Failed to save settings:', err)
      } finally {
        isSavingRef.current = false
      }
    }
  ).current

  // Save to database when settings change
  useEffect(() => {
    // Skip on initial load
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      return
    }

    // Skip if not authenticated
    if (!hasServerSettingsRef.current) return

    // Extract everything except exchange rates for comparison
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exchangeRates, ...currentSettings } = settings
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exchangeRates: _, ...originalSettings } =
      originalSettingsRef.current || defaultSettings

    // Skip if no actual settings changed
    if (
      originalSettingsRef.current &&
      deepEqual(currentSettings, originalSettings)
    )
      return

    // Call save function directly instead of using debounce
    saveSettings(settings)
  }, [settings, saveSettings])

  // Currency conversion helper
  const convertAmount = useCallback(
    (amount: number, fromCurrency: string = 'USD'): number => {
      if (
        !settings.displayCurrency?.code ||
        fromCurrency === settings.displayCurrency?.code
      ) {
        return amount
      }

      const rate = settings.exchangeRates[fromCurrency]
      return rate ? amount * rate : amount
    },
    [settings.displayCurrency?.code, settings.exchangeRates]
  )

  // Check if current month is selected
  const isCurrentMonth = useCallback((): boolean => {
    const now = new Date()
    return (
      settings.selectedMonth.month === now.getMonth() &&
      settings.selectedMonth.year === now.getFullYear()
    )
  }, [settings.selectedMonth])

  // Create memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo<SettingsContextType>(
    () => ({
      settings,
      updateDisplayCurrency: (currency) => {
        setSettings((prev) => ({ ...prev, displayCurrency: currency }))
      },
      updateExchangeRates: (rates) => {
        setSettings((prev) => ({ ...prev, exchangeRates: rates }))
      },
      updateTheme: (theme) => {
        setSettings((prev) => ({ ...prev, theme }))
        setTheme(theme)
      },
      updateSelectedMonth: (month, year) => {
        setSettings((prev) => ({ ...prev, selectedMonth: { month, year } }))
      },
      updateUseGeminiAI: (enabled) => {
        setSettings((prev) => ({ ...prev, useGeminiAI: enabled }))
      },
      isCurrentMonth,
      convertAmount,
    }),
    [settings, isCurrentMonth, convertAmount, setTheme]
  )

  // Sync initial theme
  useEffect(() => {
    if (settings.theme) {
      setTheme(settings.theme)
    }
  }, [settings.theme, setTheme])

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  )
}

// Custom hook to use settings
export function useSettings() {
  const context = useContext(SettingsContext)

  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }

  return context
}
