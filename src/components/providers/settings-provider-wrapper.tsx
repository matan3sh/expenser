import { prisma } from '@/db/prisma'
import { auth } from '@clerk/nextjs/server'
import { cache } from 'react'
import { DBSettings, Settings } from '../../types/settings'
import { SettingsProvider } from './settings-provider'

// Cache the settings fetch to prevent multiple fetches (24 hour cache)
const getInitialSettings = cache(async () => {
  console.log('Fetching initial settings from database')
  let initialSettings: Settings | null = null

  try {
    const { userId } = await auth()

    if (userId) {
      console.log('User authenticated, fetching settings for user:', userId)
      const user = await prisma.user.findUnique({
        where: { userId },
        select: { settings: true },
      })

      // Add default exchangeRates if loaded from DB
      if (user?.settings) {
        const dbSettings = user.settings as DBSettings
        console.log('User settings found:', dbSettings)
        initialSettings = {
          ...dbSettings,
          // Always include default exchangeRates since we don't store them in DB
          exchangeRates: { USD: 1, ILS: 3.6 },
        }
      } else {
        console.log('No settings found for user, using defaults')
      }
    } else {
      console.log('No authenticated user found')
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error)
  }

  return initialSettings
})

export async function SettingsProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  // Use React's cache to prevent multiple fetches
  const initialSettings = await getInitialSettings()

  return (
    <SettingsProvider initialSettings={initialSettings}>
      {children}
    </SettingsProvider>
  )
}
