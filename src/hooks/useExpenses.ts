import { useSettings } from '@/contexts/SettingsContext'
import { getCurrencyByCode } from '@/data/currencies'
import { expenses } from '@/data/expenses'
import { useMemo } from 'react'

export const useExpenses = () => {
  const { settings } = useSettings()

  const parsedExpenses = useMemo(() => {
    return expenses.map((expense) => {
      return {
        ...expense,
        ...(expense.currency !== settings.displayCurrency?.code && {
          converted: {
            amount: expense.amount / settings.exchangeRates[expense.currency],
            currency: settings.displayCurrency?.code || 'USD',
            symbol:
              getCurrencyByCode(settings.displayCurrency?.code || 'USD')
                ?.symbol || '$',
          },
        }),
      }
    })
  }, [settings.displayCurrency?.code, settings.exchangeRates])

  return parsedExpenses
}
