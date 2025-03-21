'use client'

import { MonthSelector } from '@/components/mobile/layout/MonthSelector'
import { useSettings } from '@/contexts/SettingsContext'
import { UserButton } from '@clerk/nextjs'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export const MobileHeader = () => {
  const { settings, updateSelectedMonth, isCurrentMonth } = useSettings()

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left side - MonthSelector */}
        <div className="flex items-center gap-2">
          <MonthSelector
            handleMonthChange={handleMonthChange}
            isCurrentMonth={isCurrentMonth}
            getFormattedDate={getFormattedDate}
          />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="flex items-center justify-center p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            aria-label="Settings"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </Link>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
