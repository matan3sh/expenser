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
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

export function TopLocations() {
  const { convertAmount, settings } = useSettings()

  const locationSpending = expenses.reduce((acc, exp) => {
    const amount = convertAmount(exp.amount, exp.currency)
    acc[exp.location] = (acc[exp.location] || 0) + amount
    return acc
  }, {} as Record<string, number>)

  const topLocations = Object.entries(locationSpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([location, amount]) => ({
      location,
      amount,
    }))

  const formatValue = (value: number) => formatCurrency(settings, value)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top Spending Locations</CardTitle>
        <p className="text-sm text-muted-foreground">
          Where you spend the most
        </p>
      </CardHeader>
      <CardContent className="h-[calc(100%-theme(spacing.20))]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topLocations} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" tickFormatter={formatValue} />
            <YAxis
              type="category"
              dataKey="location"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              content={(props) => (
                <ChartTooltip {...props} formatValue={formatValue} />
              )}
            />
            {topLocations.map((entry, index) => (
              <Bar
                key={entry.location}
                dataKey="amount"
                fill={CHART_COLORS.location[index]}
                radius={[0, 4, 4, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
