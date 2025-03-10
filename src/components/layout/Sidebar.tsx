'use client'

import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Coins,
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
import { useState } from 'react'

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  // Dummy user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/images/avatar.png',
  }

  // State for selected date
  const [selectedDate, setSelectedDate] = useState(new Date())
  const currentDate = new Date()
  const [showConfigDialog, setShowConfigDialog] = useState(false)

  // Format the selected date
  const selectedMonth = selectedDate.toLocaleString('en-US', {
    month: 'long',
  })
  const selectedYear = selectedDate.getFullYear()

  // Function to check if selected date is current month
  const isCurrentMonth = () => {
    return (
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    )
  }

  // Function to handle month navigation
  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1)
      )
    } else if (direction === 'next' && !isCurrentMonth()) {
      setSelectedDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1)
      )
    }
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
              <span className="text-xs font-medium mb-2 block text-muted-foreground">
                Quick Settings
              </span>
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
                        {selectedMonth} {selectedYear}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`h-8 w-8 ${
                        isCurrentMonth() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isCurrentMonth()}
                      onClick={() => handleMonthChange('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium">Currency</span>
                  </div>
                  <Select defaultValue="usd">
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                      <SelectItem value="usd">Dollar ($)</SelectItem>
                      <SelectItem value="ils">Shekel (₪)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium">Theme</span>
                  </div>
                  <ThemeToggle />
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
                    <Settings className="mr-2 h-4 w-4" />
                    Categories
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

      {/* Configuration Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Month & Currency Settings</DialogTitle>
            <DialogDescription>
              Configure the month and currency for your expenses.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Month</label>
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
                    {selectedMonth} {selectedYear}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-8 w-8 ${
                    isCurrentMonth() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isCurrentMonth()}
                  onClick={() => handleMonthChange('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Currency</label>
              <Select defaultValue="usd">
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eur">Euro (€)</SelectItem>
                  <SelectItem value="usd">Dollar ($)</SelectItem>
                  <SelectItem value="ils">Shekel (₪)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfigDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowConfigDialog(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
