// Import Prisma typings
import { Prisma } from '@prisma/client'

// Currency selection type
export type CurrencySelection = {
  code: string
  name: string
  symbol: string
}

// Month selection type
export type MonthSelection = {
  month: number
  year: number
}

// Base settings that get stored in the database
export type DBSettings = {
  displayCurrency?: CurrencySelection
  theme: 'light' | 'dark' | 'system'
  selectedMonth: MonthSelection
  useGeminiAI: boolean
}

// Full settings used in the app (includes exchange rates)
export type Settings = DBSettings & {
  exchangeRates: Record<string, number>
}

// This helps Prisma understand our Settings type for JSON fields
export type SettingsJson = Prisma.JsonValue & DBSettings
