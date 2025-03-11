import { useSettings } from '@/contexts/SettingsContext'
import { formatCurrency } from '@/data/currencies'

export function useCurrencyFormat() {
  const { convertAmount, settings } = useSettings()

  const formatAmount = (amount: number, currency: string = 'USD') => {
    if (!settings?.displayCurrency?.code) {
      return formatCurrency(amount, currency)
    }
    return formatCurrency(
      convertAmount(amount, currency),
      settings.displayCurrency.code
    )
  }

  const getDisplayCurrency = () => {
    return settings?.displayCurrency?.code || 'USD'
  }

  const convertToDisplayCurrency = (
    amount: number,
    fromCurrency: string = 'USD'
  ) => {
    if (!settings?.displayCurrency?.code) {
      return amount
    }
    return convertAmount(amount, fromCurrency)
  }

  return {
    formatAmount,
    getDisplayCurrency,
    convertToDisplayCurrency,
  }
}
