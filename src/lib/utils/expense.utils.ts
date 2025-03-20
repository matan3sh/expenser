import { getCurrencyByCode } from '@/data/currencies'
import { DatabaseExpense, Expense } from '@/types/expense.types'
import { DBSettings } from '@/types/settings.types'

export const PAGE_SIZE = 10

export const convertAmount = (
  item: { amount: number; currency: string },
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

  const rate = exchangeRates[item.currency] || 1
  const convertedAmount = Number(item.amount) / rate
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

/**
 * Simple function to convert an amount from one currency to the display currency
 * @param amount Amount to convert
 * @param fromCurrency Source currency code
 * @param settings User settings containing display currency and exchange rates
 * @param exchangeRates Exchange rates record
 * @returns Converted amount in the display currency
 */
export const convertSimpleAmount = (
  amount: number,
  fromCurrency: string,
  settings: DBSettings,
  exchangeRates: Record<string, number>
): number => {
  if (
    !settings.displayCurrency?.code ||
    fromCurrency === settings.displayCurrency?.code
  ) {
    return amount
  }

  const rate = exchangeRates[fromCurrency] || 1
  return amount / rate
}

/**
 * Checks if an expense's currency matches the display currency
 * @param currency Currency code to check
 * @param settings User settings
 * @returns Boolean indicating if currencies match
 */
export const isSameCurrency = (
  currency: string,
  settings: DBSettings
): boolean => {
  return currency === settings.displayCurrency?.code
}

export const convertExpense = (
  expense: Expense,
  settings: DBSettings,
  exchangeRates: Record<string, number>
): Expense => {
  const converted = convertAmount(
    { amount: expense.amount, currency: expense.currency },
    settings,
    exchangeRates
  )
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
    category: expense.category
      ? {
          id: expense.category.id,
          title: expense.category.title,
          color: expense.category.color,
          description: expense.category.description,
        }
      : null,
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
    converted: expense.converted,
  }))
}
