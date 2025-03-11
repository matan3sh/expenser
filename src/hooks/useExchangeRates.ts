import { useSettings } from '@/contexts/SettingsContext'
import { useEffect } from 'react'

export function useExchangeRates(currencyCode?: string) {
  const { updateExchangeRates } = useSettings()

  useEffect(() => {
    const fetchExchangeRates = async (displayCurrency: string) => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${displayCurrency}`
        )
        const data = await response.json()
        updateExchangeRates(data.rates)
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error)
      }
    }

    if (currencyCode) {
      fetchExchangeRates(currencyCode)
    }
  }, [currencyCode, updateExchangeRates])
}
