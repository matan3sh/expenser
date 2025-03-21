'use server'

import { prisma } from '@/db/prisma'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { Settings } from '../../types/settings.types'
import { serverError, serverLog } from '../logging'

// Track if we're currently in the middle of an update
let isUpdating = false

export async function updateUserSettings(settings: Settings) {
  try {
    // If we're already updating, don't start another update
    if (isUpdating) {
      serverLog('Skipping update because another update is in progress')
      return { success: false, error: 'Another update is in progress' }
    }

    // Set the flag to true to indicate we're updating
    isUpdating = true

    const { userId } = await auth()

    if (!userId) {
      isUpdating = false
      serverLog('No user ID found during settings update')
      return { success: false, error: 'Unauthorized' }
    }

    // Extract only the DB-relevant settings (exclude exchangeRates)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exchangeRates, ...dbSettings } = settings

    serverLog('Updating settings for user:', userId)
    serverLog('Settings to save:', dbSettings)

    // Update the settings in the database
    await prisma.user.update({
      where: { userId },
      data: {
        settings: dbSettings,
        updatedAt: new Date(),
      },
    })

    // Revalidate related paths to update UI
    revalidatePath('/dashboard')
    revalidatePath('/settings')

    serverLog('Settings updated successfully')

    // Reset the update flag
    isUpdating = false

    return { success: true }
  } catch (error) {
    serverError('Failed to update settings:', error)
    // Reset the update flag in case of error
    isUpdating = false
    return {
      success: false,
      error: (error as Error).message || 'Failed to update settings',
    }
  }
}

/**
 * Fetches exchange rates for a given currency
 */
export async function getExchangeRates(
  baseCurrency: string = 'USD'
): Promise<Record<string, number>> {
  try {
    serverLog(`Fetching exchange rates for ${baseCurrency}`)
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`)
    }

    const data = await response.json()
    serverLog(`Exchange rates fetched successfully for ${baseCurrency}`)
    return data.rates as Record<string, number>
  } catch (error) {
    serverError('Error fetching exchange rates:', error)
    // Return at least the base currency rate in case of error
    return { [baseCurrency]: 1 }
  }
}

/**
 * Fetches the current user's settings from the database
 */
export async function getUserSettings() {
  try {
    serverLog('Fetching user settings')
    const { userId } = await auth()

    if (!userId) {
      serverLog('No user ID found during settings fetch')
      return {
        success: false,
        error: 'Unauthorized',
        settings: null,
      }
    }

    // Get the user and their settings from the database
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        settings: true,
      },
    })

    if (!user) {
      serverLog(`User not found for ID: ${userId}`)
      return {
        success: false,
        error: 'User not found',
        settings: null,
      }
    }

    serverLog('Settings fetched successfully')
    return {
      success: true,
      settings: user.settings || {},
    }
  } catch (error) {
    serverError('Failed to fetch user settings:', error)
    return {
      success: false,
      error: (error as Error).message || 'Failed to fetch settings',
      settings: null,
    }
  }
}
