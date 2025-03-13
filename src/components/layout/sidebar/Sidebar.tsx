'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useSettings } from '@/contexts/SettingsContext'
import { useClerk, useUser } from '@clerk/nextjs'
import { LogOut, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { actionMenuItems, mainMenuItems } from './config'
import { MenuSection } from './MenuSection'
import { MonthSelector } from './MonthSelector'
import { SidebarProps } from './types'
import { UserProfile } from './UserProfile'

export function Sidebar({ className, isOpen, onClose }: SidebarProps) {
  const { settings, updateSelectedMonth, isCurrentMonth } = useSettings()
  const [mounted, setMounted] = useState(false)
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const getFormattedDate = () => {
    const date = new Date(
      settings.selectedMonth.year,
      settings.selectedMonth.month
    )
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  }

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const { month: currentMonth, year: currentYear } = settings.selectedMonth

    if (direction === 'prev') {
      const newMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const newYear = currentMonth === 0 ? currentYear - 1 : currentYear
      updateSelectedMonth(newMonth, newYear)
    } else if (direction === 'next' && !isCurrentMonth()) {
      const newMonth = currentMonth === 11 ? 0 : currentMonth + 1
      const newYear = currentMonth === 11 ? currentYear + 1 : currentYear
      updateSelectedMonth(newMonth, newYear)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/sign-in')
  }

  if (!mounted) return null

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-background border-r 
          transform transition-transform duration-200 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 w-64 ${className}`}
      >
        <div className="p-4 flex items-center justify-between">
          <UserProfile user={user} isLoaded={isLoaded} />
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Separator />

        <ScrollArea className="flex-1">
          <div className="p-4">
            {user && (
              <div className="mb-6">
                <MonthSelector
                  handleMonthChange={handleMonthChange}
                  isCurrentMonth={isCurrentMonth}
                  getFormattedDate={getFormattedDate}
                />
              </div>
            )}

            <MenuSection title="Menu" items={mainMenuItems} />
            {user && <MenuSection title="Actions" items={actionMenuItems} />}
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-4">
          {user ? (
            <Button
              variant="outline"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/sign-in">
                <LogOut className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
