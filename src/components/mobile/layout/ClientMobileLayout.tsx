'use client'

import { ReactNode } from 'react'
import { BottomNavigation } from './BottomNavigation'
import { MobileHeader } from './MobileHeader'

interface ClientMobileLayoutProps {
  children: ReactNode
}

export const ClientMobileLayout = ({ children }: ClientMobileLayoutProps) => {
  return (
    <div className="fixed inset-0 flex flex-col">
      <MobileHeader />
      <main className="flex-1 overflow-hidden">{children}</main>
      <BottomNavigation />
    </div>
  )
}
