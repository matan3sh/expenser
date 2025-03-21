'use client'

import { SettingsProvider } from '@/contexts/SettingsContext'

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>
}
