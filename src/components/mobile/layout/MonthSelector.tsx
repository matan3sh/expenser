'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface MonthSelectorProps {
  handleMonthChange: (direction: 'prev' | 'next') => void
  isCurrentMonth: () => boolean
  getFormattedDate: () => string
}

export function MonthSelector({
  handleMonthChange,
  isCurrentMonth,
  getFormattedDate,
}: MonthSelectorProps) {
  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => handleMonthChange('prev')}
        className="flex items-center justify-center p-1.5 rounded-full hover:bg-muted transition-colors"
        aria-label="Previous month"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      <span className="text-sm font-medium">{getFormattedDate()}</span>

      <button
        onClick={() => handleMonthChange('next')}
        disabled={isCurrentMonth()}
        className="flex items-center justify-center p-1.5 rounded-full hover:bg-muted transition-colors disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Next month"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
