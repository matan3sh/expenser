'use client'

// This file provides backward compatibility for components that import from this path
// It re-exports everything from the new settings provider

import {
  SettingsProvider as NewSettingsProvider,
  useSettings as useNewSettings,
} from '../components/providers/settings-provider'
import { CurrencySelection, Settings } from '../types/settings'

// Re-export the Settings type for backward compatibility
export type { CurrencySelection, Settings }

// Re-export the SettingsProvider
export const SettingsProvider = NewSettingsProvider

// Re-export the useSettings hook
export const useSettings = useNewSettings
