import { getCurrencyByCode } from '@/data/currencies'
import { Convertible, DatabaseExpense, Expense } from '@/types/expense'
import { DBSettings } from '@/types/settings'

export const PAGE_SIZE = 10

export const convertAmount = (
  item: Convertible,
  settings: DBSettings,
  exchangeRates: Record<string, number>
): {
  amount: number
  currency: string
  converted?: {
    amount: number
    currency: string
    symbol: string
  }
} => {
  const isDifferentCurrency = item.currency !== settings.displayCurrency?.code
  const targetCurrency = settings.displayCurrency?.code || 'USD'

  if (!isDifferentCurrency) {
    return {
      amount: item.amount,
      currency: item.currency,
    }
  }

  const convertedAmount =
    Number(item.amount) / (exchangeRates[item.currency] || 1)
  const originalCurrencySymbol =
    getCurrencyByCode(item.currency || 'USD')?.symbol || '$'

  return {
    amount: convertedAmount,
    currency: targetCurrency,
    converted: {
      amount: Number(item.amount),
      currency: item.currency,
      symbol: originalCurrencySymbol,
    },
  }
}

export const convertExpense = (
  expense: Expense,
  settings: DBSettings,
  exchangeRates: Record<string, number>
): Expense => {
  const converted = convertAmount(expense, settings, exchangeRates)
  return {
    ...expense,
    ...converted,
  } as Expense
}

// Helper function to serialize dates in expenses
export function serializeExpenses(dbExpenses: DatabaseExpense[]): Expense[] {
  return dbExpenses.map((expense) => ({
    id: expense.id,
    date: expense.date.toISOString(),
    description: expense.description,
    amount: Number(expense.amount),
    currency: expense.currency,
    location: expense.location,
    notes: expense.notes,
    receipt: expense.receipt,
    categoryId: expense.categoryId,
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
    converted: expense.converted,
  }))
}
