'use client'

import { ReactNode } from 'react'
import { Sidebar } from './sidebar/Sidebar'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto lg:p-6">{children}</main>
    </div>
  )
}
