'use client'

import { Button } from '@/components/ui/button'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { MonthSelectorProps } from './types'

export function MonthSelector({
  handleMonthChange,
  isCurrentMonth,
  getFormattedDate,
}: MonthSelectorProps) {
  return (
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
          <span className="text-sm font-medium">{getFormattedDate()}</span>
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
  )
}
