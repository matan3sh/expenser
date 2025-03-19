'use client'

import { settingsService } from '@/lib/services/settingsService'
import { createContext, useContext, useEffect, useState } from 'react'

// Types
type CurrencySelection = {
  code: string
  name: string
  symbol: string
}

type MonthSelection = {
  month: number
  year: number
}

export interface Settings {
  displayCurrency?: CurrencySelection
  exchangeRates: Record<string, number>
  theme: 'light' | 'dark' | 'system'
  selectedMonth: MonthSelection
  useGeminiAI: boolean
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

// Default values
const defaultSettings: Settings = {
  displayCurrency: { code: 'USD', name: 'US Dollar', symbol: '$' },
  exchangeRates: { USD: 1, ILS: 3.6 }, // Add default rates
  theme: 'system',
  selectedMonth: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  useGeminiAI: true,
}

// Context
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
)

// Helper functions
const loadSettingsFromStorage = (): Settings => {
  try {
    const savedSettings = localStorage.getItem('user-settings')
    if (!savedSettings) return defaultSettings

    const parsed = JSON.parse(savedSettings)
    return {
      ...defaultSettings,
      ...parsed,
      exchangeRates: {
        ...defaultSettings.exchangeRates,
        ...(parsed.exchangeRates || {}),
      },
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
    return defaultSettings
  }
}

const saveSettingsToStorage = (settings: Settings) => {
  try {
    localStorage.setItem('user-settings', JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

// Provider Component
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize settings
  useEffect(() => {
    const loadedSettings = loadSettingsFromStorage()
    setSettings(loadedSettings)
    setIsInitialized(true)
  }, [])

  // Save settings changes
  useEffect(() => {
    if (isInitialized) {
      saveSettingsToStorage(settings)
      // Sync with service
      settingsService.updateSettings(settings)
    }
  }, [settings, isInitialized])

  // Currency conversion
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

  // Context value
  const contextValue: SettingsContextType = {
    settings,
    updateDisplayCurrency: (currency) =>
      setSettings((prev) => ({ ...prev, displayCurrency: currency })),
    updateExchangeRates: (rates) =>
      setSettings((prev) => ({ ...prev, exchangeRates: rates })),
    updateTheme: (theme) => setSettings((prev) => ({ ...prev, theme })),
    updateSelectedMonth: (month, year) =>
      setSettings((prev) => ({
        ...prev,
        selectedMonth: { month, year },
      })),
    updateUseGeminiAI: (enabled) =>
      setSettings((prev) => ({ ...prev, useGeminiAI: enabled })),
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

// Hook
export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
