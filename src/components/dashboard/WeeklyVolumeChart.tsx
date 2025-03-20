'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSettings } from '@/contexts/SettingsContext'
import { formatCurrency } from '@/data/currencies'
import { Expense } from '@/types/expense.types'
import { format, subDays } from 'date-fns'

interface WeeklyVolumeChartProps {
  expenses: Expense[]
}

export function WeeklyVolumeChart({ expenses }: WeeklyVolumeChartProps) {
  const { convertAmount, settings } = useSettings()

  // Get last 7 days including today
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i) // Start from 6 days ago
    const dayExpenses = expenses.filter(
      (exp) =>
        format(new Date(exp.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )

    const totalAmount = dayExpenses.reduce(
      (sum, exp) => sum + convertAmount(exp.amount, exp.currency),
      0
    )

    return {
      date,
      dayName: format(date, 'EEE'),
      formattedDate: format(date, 'MMM d'),
      amount: totalAmount,
      formattedAmount: formatCurrency(
        totalAmount,
        settings?.displayCurrency?.code || 'ILS'
      ),
    }
  })

  // Find max amount for scaling
  const maxAmount = Math.max(...days.map((d) => d.amount))

  return (
    <Card className="h-[300px]">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Last 7 Days Volume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between h-[200px] px-2">
          {days.map((day) => (
            <TooltipProvider key={day.dayName}>
              <div className="flex flex-col items-center gap-1 w-[10%]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="w-full max-w-[20px] bg-primary/30 rounded-t-md transition-all duration-500 cursor-pointer hover:bg-primary/40"
                      style={{
                        height: `${(day.amount / maxAmount) * 150}px`,
                        minHeight: '4px',
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{day.formattedAmount}</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex flex-col items-center gap-0.5">
                  <div
                    className={`text-[10px] ${
                      format(day.date, 'yyyy-MM-dd') ===
                      format(new Date(), 'yyyy-MM-dd')
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {day.dayName}
                  </div>
                  <div className="text-[8px] text-muted-foreground">
                    {day.formattedDate}
                  </div>
                </div>
              </div>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
