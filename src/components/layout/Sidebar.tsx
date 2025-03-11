'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useSettings } from '@/contexts/SettingsContext'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  HomeIcon,
  LineChart,
  LogOut,
  Palette,
  PlusCircle,
  Settings,
  Upload,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const { settings, updateSelectedMonth, isCurrentMonth } = useSettings()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Dummy user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/images/avatar.png',
  }

  // Format the selected date
  const getFormattedDate = () => {
    const date = new Date(
      settings.selectedMonth.year,
      settings.selectedMonth.month
    )
    return date.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const currentMonth = settings.selectedMonth.month
    const currentYear = settings.selectedMonth.year

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

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-background border-r transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 ${className}`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="mb-6">
              <div className="space-y-2">
                <div className="rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium">Month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleMonthChange('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center">
                      <span className="text-sm font-medium">
                        {getFormattedDate()}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={isCurrentMonth()}
                      onClick={() => handleMonthChange('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-xs font-medium mb-2 block text-muted-foreground">
                Menu
              </span>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/expenses">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Expenses
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/analytics">
                    <LineChart className="mr-2 h-4 w-4" />
                    Analytics
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/categories">
                    <Palette className="mr-2 h-4 w-4" />
                    Categories
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-xs font-medium mb-2 block text-muted-foreground">
                Actions
              </span>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/add-expense">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Expense
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/upload-receipt">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Receipt
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  )
}
