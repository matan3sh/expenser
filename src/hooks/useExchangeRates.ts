import { useSettings } from '@/components/providers/settings-provider'
import { getExchangeRates } from '@/lib/actions/settings.actions'
import { useEffect, useRef } from 'react'

// Cache expiry time - 24 hours in milliseconds
const CACHE_EXPIRY = 24 * 60 * 60 * 1000

// Global cache to prevent duplicate fetches across components
const FETCHED_CURRENCIES = new Set<string>()

export function useExchangeRates(currencyCode?: string) {
  const { updateExchangeRates } = useSettings()
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (!currencyCode) return

    // Skip if we've already fetched this currency globally
    if (FETCHED_CURRENCIES.has(currencyCode)) return

    // Skip if we've already fetched in this component
    if (hasFetchedRef.current) return

    const fetchRatesWithCache = async () => {
      try {
        // Check if we have cached rates in localStorage
        if (typeof window !== 'undefined') {
          const cacheKey = `exchange_rates_${currencyCode}`
          const cachedData = localStorage.getItem(cacheKey)

          if (cachedData) {
            try {
              const { rates, timestamp } = JSON.parse(cachedData)
              const now = Date.now()

              // If cache is still valid, use it
              if (now - timestamp < CACHE_EXPIRY) {
                console.log(`Using cached exchange rates for ${currencyCode}`)
                updateExchangeRates(rates)
                FETCHED_CURRENCIES.add(currencyCode)
                hasFetchedRef.current = true
                return
              }
            } catch (e) {
              // Invalid cache, continue to fetch fresh data
              console.warn('Invalid exchange rate cache:', e)
            }
          }
        }

        // Mark as fetched globally
        FETCHED_CURRENCIES.add(currencyCode)
        hasFetchedRef.current = true

        // Fetch fresh rates
        const rates = await getExchangeRates(currencyCode)

        // Update state
        updateExchangeRates(rates)

        // Cache the results
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            `exchange_rates_${currencyCode}`,
            JSON.stringify({
              rates,
              timestamp: Date.now(),
            })
          )
        }
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error)
      }
    }

    fetchRatesWithCache()

    // Cleanup
    return () => {
      hasFetchedRef.current = false
    }
  }, [currencyCode, updateExchangeRates])
}
