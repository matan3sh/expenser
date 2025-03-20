import { getCurrencyByCode } from '@/data/currencies'
import { Expense } from '@/types/expense'
import { DBSettings } from '@/types/settings'

export const PAGE_SIZE = 10

export const convertExpense = (
  expense: Expense,
  settings: DBSettings,
  exchangeRates: Record<string, number>
): Expense => {
  const isDifferentCurrency =
    expense.currency !== settings.displayCurrency?.code
  const targetCurrency = settings.displayCurrency?.code || 'USD'

  if (!isDifferentCurrency) {
    return expense as Expense
  }

  const convertedAmount =
    Number(expense.amount) / (exchangeRates[expense.currency] || 1)
  const originalCurrencySymbol =
    getCurrencyByCode(expense.currency || 'USD')?.symbol || '$'

  return {
    ...expense,
    converted: {
      amount: Number(expense.amount),
      currency: expense.currency,
      symbol: originalCurrencySymbol,
    },
    amount: convertedAmount,
    currency: targetCurrency,
  } as Expense
}
