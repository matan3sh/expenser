import { Settings, useSettings } from '@/contexts/SettingsContext'
import { getCurrencyByCode } from '@/data/currencies'
import { expenses } from '@/data/expenses'
import { Expense } from '@/types/expense'
import { useMemo } from 'react'

type ConvertedExpense = Expense & {
  converted?: {
    amount: number
    currency: string
    symbol: string
  }
}

// Separate the conversion logic into a pure function
const convertExpense = (
  expense: Expense,
  settings: Settings
): ConvertedExpense => {
  const isDifferentCurrency =
    expense.currency !== settings.displayCurrency?.code
  const targetCurrency = settings.displayCurrency?.code || 'USD'

  if (!isDifferentCurrency) {
    return expense
  }

  const convertedAmount =
    expense.amount / settings.exchangeRates[expense.currency]
  const originalCurrencySymbol =
    getCurrencyByCode(expense.currency || 'USD')?.symbol || '$'

  return {
    ...expense,
    converted: {
      amount: expense.amount,
      currency: expense.currency,
      symbol: originalCurrencySymbol,
    },
    amount: convertedAmount,
    currency: targetCurrency,
  }
}
export const useExpenses = () => {
  const { settings } = useSettings()

  const parsedExpenses = useMemo(() => {
    return expenses.map((expense) => convertExpense(expense, settings))
  }, [settings])

  return parsedExpenses
}
