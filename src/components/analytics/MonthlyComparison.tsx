'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings } from '@/contexts/SettingsContext'
import { categories } from '@/data/categories'
import { getMonthlyExpenses } from '@/data/expenses'
import { formatCurrency } from '@/utils/chartHelpers'
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

export function MonthlyComparison() {
  const { convertAmount, settings } = useSettings()
  const monthlyData = getMonthlyExpenses()
  const last3Months = monthlyData.slice(-3)

  const comparisonData = categories.map((category) => {
    const monthlyValues = last3Months.map((month) => {
      const total = month.expenses
        .filter((exp) => exp.categoryId === category.id)
        .reduce((sum, exp) => sum + convertAmount(exp.amount, exp.currency), 0)
      return { month: month.month, total }
    })

    return {
      name: category.name,
      color: category.color,
      ...monthlyValues.reduce((acc, { month, total }) => {
        acc[month] = total
        return acc
      }, {} as Record<string, number>),
    }
  })

  const formatValue = (value: number) => formatCurrency(settings, value)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Monthly Category Comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          Last 3 months by category
        </p>
      </CardHeader>
      <CardContent className="h-[calc(100%-theme(spacing.20))]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatValue} width={80} />
            <Tooltip
              content={(props) => (
                <ChartTooltip {...props} formatValue={formatValue} />
              )}
            />
            {last3Months.map((month, index) => (
              <Bar
                key={month.month}
                dataKey={month.month}
                fill={`hsl(${index * 120}, 70%, 50%)`}
                opacity={0.8}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
