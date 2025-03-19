'use client'

import { updateUserSettings } from '@/lib/actions/settings.actions'
import { deepEqual } from '@/lib/utils'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { CurrencySelection, Settings } from '../../types/settings'

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
  // Track if this is the initial load
  const initialLoadRef = useRef(true)
  // Track saving state
  const isSavingRef = useRef(false)
  // Timer for debouncing
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  // Store original settings from the server for comparison
  const originalSettingsRef = useRef<Settings | null>(initialSettings)
  // Flag to track if we've received settings from the server
  const hasServerSettingsRef = useRef(!!initialSettings)

  // Initialize with DB values if available, otherwise use localStorage or defaults
  const [settings, setSettings] = useState<Settings>(() => {
    // If we have initial settings from the server, use those
    if (initialSettings) {
      console.log('Using initial settings from server')
      return initialSettings
    }

    // Otherwise check localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('settings')
      if (savedSettings) {
        try {
          console.log('Using settings from localStorage')
          return JSON.parse(savedSettings)
        } catch (e) {
          console.error('Failed to parse settings from localStorage', e)
        }
      }
    }

    // Fallback to defaults
    console.log('Using default settings')
    return defaultSettings
  })

  // Update localStorage when settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('settings', JSON.stringify(settings))
    }
  }, [settings])

  // Save settings to database when they change
  useEffect(() => {
    // Skip if this is the initial load
    if (initialLoadRef.current) {
      console.log('Skipping settings update on initial load')
      initialLoadRef.current = false
      return
    }

    // Skip if we're already saving
    if (isSavingRef.current) {
      return
    }

    // Skip if we never got settings from the server (likely not authenticated)
    if (!hasServerSettingsRef.current) {
      console.log('Skipping settings update - no server settings available')
      return
    }

    // Don't save if only exchange rates changed
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exchangeRates, ...currentSettings } = settings
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exchangeRates: exchangeRatesOriginal, ...originalSettings } =
      originalSettingsRef.current || defaultSettings

    // Skip if no actual settings changed (excluding exchange rates)
    if (
      originalSettingsRef.current &&
      deepEqual(currentSettings, originalSettings)
    ) {
      console.log('Skipping settings update - no changes detected')
      return
    }

    console.log('Settings changed, preparing to save', currentSettings)

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // Set a new timer for debouncing
    timerRef.current = setTimeout(() => {
      // Save settings to database
      const save = async () => {
        // Set saving flag
        isSavingRef.current = true

        // Show loading toast
        const toastId = toast.loading('Saving settings...')

        try {
          // Save settings to database
          const result = await updateUserSettings(settings)

          if (result.success) {
            toast.success('Settings saved successfully', {
              id: toastId,
              duration: 2000,
            })
            // Update original settings reference after successful save
            originalSettingsRef.current = { ...settings }
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
          // Reset saving flag
          isSavingRef.current = false
          // Clear timer ref
          timerRef.current = null
        }
      }

      // Execute save function
      save()
    }, 500)

    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [settings])

  // Currency conversion helper
  const convertAmount = (
    amount: number,
    fromCurrency: string = 'USD'
  ): number => {
    if (
      !settings.displayCurrency?.code ||
      fromCurrency === settings.displayCurrency?.code
    ) {
      return amount
    }

    const rate = settings.exchangeRates[fromCurrency]
    if (!rate) {
      console.warn(`No exchange rate found for ${fromCurrency}`)
      return amount
    }

    return amount * rate
  }

  // Context value with all required updaters
  const contextValue: SettingsContextType = {
    settings,
    updateDisplayCurrency: (currency) => {
      toast.info(`Display currency changed to ${currency.code}`)
      setSettings((prev) => ({ ...prev, displayCurrency: currency }))
    },
    updateExchangeRates: (rates) => {
      // Don't toast for exchange rates updates as they happen silently
      setSettings((prev) => ({ ...prev, exchangeRates: rates }))
    },
    updateTheme: (theme) => {
      toast.info(`Theme changed to ${theme}`)
      setSettings((prev) => ({ ...prev, theme }))
    },
    updateSelectedMonth: (month, year) => {
      const date = new Date(year, month, 1)
      const monthName = date.toLocaleString('default', { month: 'long' })
      toast.info(`Selected month changed to ${monthName} ${year}`)

      setSettings((prev) => ({
        ...prev,
        selectedMonth: { month, year },
      }))
    },
    updateUseGeminiAI: (enabled) => {
      toast.info(`Receipt processing ${enabled ? 'enabled' : 'disabled'}`)
      setSettings((prev) => ({ ...prev, useGeminiAI: enabled }))
    },
    isCurrentMonth: () => {
      const now = new Date()
      return (
        settings.selectedMonth.month === now.getMonth() &&
        settings.selectedMonth.year === now.getFullYear()
      )
    },
    convertAmount,
  }

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
