'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type CurrencySelection = {
  code: string
  name: string
}

type Settings = {
  sourceCurrency: CurrencySelection
  targetCurrency: CurrencySelection
  exchangeRate: number
  theme: 'light' | 'dark' | 'system'
  selectedMonth: {
    month: number
    year: number
  }
}

type SettingsContextType = {
  settings: Settings
  updateSourceCurrency: (currency: CurrencySelection) => void
  updateTargetCurrency: (currency: CurrencySelection) => void
  updateExchangeRate: (rate: number) => void
  updateTheme: (theme: 'light' | 'dark' | 'system') => void
  updateSelectedMonth: (month: number, year: number) => void
  isCurrentMonth: () => boolean
  convertAmount: (amount: number) => number
}

const defaultSettings: Settings = {
  sourceCurrency: { code: 'ILS', name: 'Israeli Shekel' },
  targetCurrency: { code: 'USD', name: 'US Dollar' },
  exchangeRate: 1,
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

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('user-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('user-settings', JSON.stringify(settings))
  }, [settings])

  const updateSourceCurrency = (currency: CurrencySelection) => {
    setSettings((prev) => ({ ...prev, sourceCurrency: currency }))
  }

  const updateTargetCurrency = (currency: CurrencySelection) => {
    setSettings((prev) => ({ ...prev, targetCurrency: currency }))
  }

  const updateExchangeRate = (rate: number) => {
    setSettings((prev) => ({ ...prev, exchangeRate: rate }))
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

  const convertAmount = (amount: number) => {
    return amount * settings.exchangeRate
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSourceCurrency,
        updateTargetCurrency,
        updateExchangeRate,
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
