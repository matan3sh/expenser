'use client'

import { ReactNode } from 'react'
import { BottomNavigation } from './BottomNavigation'
import { MobileHeader } from './MobileHeader'

interface ClientMobileLayoutProps {
  children: ReactNode
}

export const ClientMobileLayout = ({ children }: ClientMobileLayoutProps) => {
  return (
    <div className="flex flex-col h-full">
      <MobileHeader />
      <main className="flex-1 overflow-auto pb-16">{children}</main>
      <BottomNavigation />
    </div>
  )
}
