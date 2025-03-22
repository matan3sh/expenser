'use client'

import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface NativeCalendarProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string
  icon?: boolean
}

const NativeCalendar = forwardRef<HTMLInputElement, NativeCalendarProps>(
  ({ className, containerClassName, icon = true, ...props }, ref) => {
    return (
      <div className={cn('relative', containerClassName)}>
        <input
          type="date"
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            icon && 'pl-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && (
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
        )}
      </div>
    )
  }
)
NativeCalendar.displayName = 'NativeCalendar'

export { NativeCalendar }
