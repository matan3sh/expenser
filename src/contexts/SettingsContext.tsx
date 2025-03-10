'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Currency = {
  label: string
  value: string
}

type Settings = {
  currency: Currency
  theme: 'light' | 'dark' | 'system'
  selectedMonth: {
    month: number
    year: number
  }
}

type SettingsContextType = {
  settings: Settings
  updateCurrency: (currency: Currency) => void
  updateTheme: (theme: 'light' | 'dark' | 'system') => void
  updateSelectedMonth: (month: number, year: number) => void
  isCurrentMonth: () => boolean
}

const defaultSettings: Settings = {
  currency: { label: 'USD - US Dollar', value: 'USD' },
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

  const updateCurrency = (currency: Currency) => {
    setSettings((prev) => ({ ...prev, currency }))
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

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateCurrency,
        updateTheme,
        updateSelectedMonth,
        isCurrentMonth,
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
