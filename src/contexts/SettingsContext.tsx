'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type CurrencySelection = {
  code: string
  name: string
}

type Settings = {
  displayCurrency: CurrencySelection
  exchangeRates: Record<string, number>
  theme: 'light' | 'dark' | 'system'
  selectedMonth: {
    month: number
    year: number
  }
}

type SettingsContextType = {
  settings: Settings
  updateDisplayCurrency: (currency: CurrencySelection) => void
  updateExchangeRates: (rates: Record<string, number>) => void
  updateTheme: (theme: 'light' | 'dark' | 'system') => void
  updateSelectedMonth: (month: number, year: number) => void
  isCurrentMonth: () => boolean
  convertAmount: (amount: number, fromCurrency: string) => number
}

const defaultSettings: Settings = {
  displayCurrency: { code: 'USD', name: 'US Dollar' },
  exchangeRates: {},
  theme: 'system',
  selectedMonth: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('user-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        // Validate that we have the required fields
        if (parsed?.displayCurrency?.code) {
          setSettings(parsed)
        }
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('user-settings', JSON.stringify(settings))
    }
  }, [settings, isInitialized])

  const updateDisplayCurrency = (currency: CurrencySelection) => {
    setSettings((prev) => ({ ...prev, displayCurrency: currency }))
  }

  const updateExchangeRates = (rates: Record<string, number>) => {
    setSettings((prev) => ({ ...prev, exchangeRates: rates }))
  }

  const updateTheme = (theme: 'light' | 'dark' | 'system') => {
    setSettings((prev) => ({ ...prev, theme }))
  }

  const updateSelectedMonth = (month: number, year: number) => {
    setSettings((prev) => ({
      ...prev,
      selectedMonth: { month, year },
    }))
  }

  const isCurrentMonth = () => {
    const now = new Date()
    return (
      settings.selectedMonth.month === now.getMonth() &&
      settings.selectedMonth.year === now.getFullYear()
    )
  }

  const convertAmount = (amount: number, fromCurrency: string = 'USD') => {
    // If settings aren't initialized yet, return the original amount
    if (!settings?.displayCurrency?.code) {
      return amount
    }

    // If the currencies are the same, no conversion needed
    if (fromCurrency === settings.displayCurrency.code) {
      return amount
    }

    // Get the exchange rate for the currency pair
    const rate = settings.exchangeRates[fromCurrency || 'USD']
    if (!rate) {
      console.warn(`No exchange rate found for ${fromCurrency}, using 1:1 rate`)
      return amount
    }

    // Convert to display currency
    return amount * rate
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateDisplayCurrency,
        updateExchangeRates,
        updateTheme,
        updateSelectedMonth,
        isCurrentMonth,
        convertAmount,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
