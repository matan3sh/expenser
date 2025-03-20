import { Settings, useSettings } from '@/contexts/SettingsContext'
import { expenses } from '@/data/expenses'
import { convertAmount } from '@/lib/utils/expense.utils'
import { Expense } from '@/types/expense.types'
import { DBSettings } from '@/types/settings.types'
import { useMemo } from 'react'

type ConvertedExpense = Expense & {
  converted?: {
    amount: number
    currency: string
    symbol: string
  }
}

// Replace the duplicate convertExpense function with a wrapper that uses our utility
const convertExpense = (
  expense: Expense,
  settings: Settings
): ConvertedExpense => {
  const result = convertAmount(
    { amount: expense.amount, currency: expense.currency },
    settings as DBSettings,
    settings.exchangeRates
  )

  // Keep the same return structure as before
  return {
    ...expense,
    amount: result.amount,
    currency: result.currency,
    converted: result.converted,
  }
}

export const useExpenses = () => {
  const { settings } = useSettings()

  const parsedExpenses = useMemo(() => {
    return expenses.map((expense) => convertExpense(expense, settings))
  }, [settings])

  return parsedExpenses
}
