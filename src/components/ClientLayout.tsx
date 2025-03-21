'use client'

import { SettingsProvider } from '@/contexts/SettingsContext'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return <SettingsProvider>{children}</SettingsProvider>
}
