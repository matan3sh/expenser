'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings } from '@/contexts/SettingsContext'
import { expenses } from '@/data/expenses'
import { CHART_COLORS, formatCurrency } from '@/utils/chartHelpers'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts'
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent'
import { ChartTooltip } from './ChartTooltip'

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export function DailyPatterns() {
  const { convertAmount, settings } = useSettings()

  const dailyAverages = Array(7)
    .fill(0)
    .map((_, index) => {
      const dayExpenses = expenses.filter(
        (exp) => new Date(exp.date).getDay() === index
      )
      const total = dayExpenses.reduce(
        (sum, exp) => sum + convertAmount(exp.amount, exp.currency),
        0
      )
      return {
        day: DAYS[index],
        average: dayExpenses.length ? total / dayExpenses.length : 0,
      }
    })

  const formatValue = (value: number) => formatCurrency(settings, value)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Daily Spending Patterns</CardTitle>
        <p className="text-sm text-muted-foreground">
          Average spending by day of week
        </p>
      </CardHeader>
      <CardContent className="h-[calc(100%-theme(spacing.20))]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyAverages}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickFormatter={formatValue} width={80} />
            <Tooltip
              content={(props) => (
                <ChartTooltip
                  {...(props as TooltipProps<ValueType, NameType>)}
                  formatValue={formatValue}
                  valueLabel="Average"
                />
              )}
            />
            <Bar
              dataKey="average"
              fill={CHART_COLORS.day[0]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
