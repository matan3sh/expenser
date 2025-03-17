'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useSettings } from '@/contexts/SettingsContext'
import { useClerk, useUser } from '@clerk/nextjs'
import { Calendar, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { actionMenuItems, mainMenuItems } from './config'
import { MenuSection } from './MenuSection'
import { MonthSelector } from './MonthSelector'
import { UserProfile } from './UserProfile'

// Remove isOpen and onClose from props since we don't need them anymore
interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
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

  const handleMenuClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      toast.error('Please sign in to access this feature')
    }
  }

  if (!mounted) return null

  return (
    // Hide on mobile, show on md and up screens
    <div
      className={`hidden lg:flex flex-col bg-background border-r w-64 ${className}`}
    >
      {user && (
        <>
          <div className="p-4">
            <UserProfile user={user} isLoaded={isLoaded} />
          </div>
          <Separator />
        </>
      )}

      <ScrollArea className="flex-1">
        <div className="p-4">
          {user && (
            <div className="mb-6">
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Month</span>
                </div>
                <MonthSelector
                  handleMonthChange={handleMonthChange}
                  isCurrentMonth={isCurrentMonth}
                  getFormattedDate={getFormattedDate}
                />
              </div>
            </div>
          )}

          <MenuSection
            title="Menu"
            items={mainMenuItems}
            onItemClick={handleMenuClick}
          />
          <MenuSection
            title="Actions"
            items={actionMenuItems}
            onItemClick={handleMenuClick}
          />
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
  )
}
