'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings } from '@/contexts/SettingsContext'
import { formatCurrency } from '@/data/currencies'
import { Expense } from '@/types/expense.types'
import {
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  subWeeks,
} from 'date-fns'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

interface MonthlyVolumeChartProps {
  expenses: Expense[]
}

export function WeeklyVolumeChart({ expenses }: MonthlyVolumeChartProps) {
  const { settings, convertAmount } = useSettings()
  const displayCurrency = settings?.displayCurrency?.code || 'USD'

  const monthInterval = {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  }

  const extendedInterval = {
    start: subWeeks(monthInterval.start, 0),
    end: addWeeks(monthInterval.end, 0),
  }

  const monthlyData = eachDayOfInterval(extendedInterval).map((date) => {
    const dayExpenses = expenses.filter((expense) =>
      isSameDay(new Date(expense.date), date)
    )

    const dailyTotal = dayExpenses.reduce((total, expense) => {
      const amount =
        expense.currency === displayCurrency
          ? expense.amount
          : expense.converted?.amount ??
            convertAmount(expense.amount, displayCurrency)
      return total + amount
    }, 0)

    const isCurrentMonth =
      date >= monthInterval.start && date <= monthInterval.end

    return {
      date,
      amount: dailyTotal,
      formattedDate: format(date, 'EEEE, MMM dd'),
      formattedAmount: formatCurrency(dailyTotal, displayCurrency),
      isCurrentMonth,
    }
  })

  return (
    <Card className="h-[300px] bg-gradient-to-br from-primary/5 via-background to-background border-primary/10">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium text-foreground/70">
            Monthly Volume
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {format(monthInterval.start, 'MMMM yyyy')}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.55 0.2 250)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.55 0.2 250)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg bg-background/95 border p-2 shadow-lg backdrop-blur-sm">
                        <p className="text-sm font-medium text-muted-foreground">
                          {data.formattedDate}
                        </p>
                        <p className="text-sm text-primary font-semibold mt-1">
                          {data.formattedAmount}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
                cursor={{
                  stroke: 'hsl(var(--primary))',
                  strokeWidth: 1,
                  strokeDasharray: '4 4',
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="none"
                strokeWidth={0}
                fillOpacity={0.3}
                className="[&.recharts-area-area]:data-[current-month=true]:opacity-100"
                fill="url(#colorVolume)"
                animationDuration={2000}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: 'oklch(0.55 0.2 250)',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2,
                  opacity: 1,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
