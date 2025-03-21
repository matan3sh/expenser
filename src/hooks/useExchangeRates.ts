import { useSettings } from '@/components/providers/settings-provider'
import { getExchangeRates } from '@/lib/actions/settings.actions'
import { useEffect, useRef } from 'react'

// Track which currencies we've already fetched to avoid duplicate requests
const FETCHED_CURRENCIES = new Set<string>()

export function useExchangeRates() {
  const { settings, updateExchangeRates } = useSettings()
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    const currencyCode = settings.displayCurrency?.code || 'USD'

    // Skip if we've already fetched for this currency globally
    if (FETCHED_CURRENCIES.has(currencyCode)) return

    // Skip if we've already fetched in this component
    if (hasFetchedRef.current) return

    const fetchRates = async () => {
      try {
        // Fetch directly from API using server action
        const rates = await getExchangeRates(currencyCode)

        // Update settings with new rates
        updateExchangeRates(rates)

        // Mark as fetched
        FETCHED_CURRENCIES.add(currencyCode)
        hasFetchedRef.current = true
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error)
      }
    }

    fetchRates()

    // Clean up function
    return () => {
      hasFetchedRef.current = false
    }
  }, [settings.displayCurrency?.code, updateExchangeRates])
}
