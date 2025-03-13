'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings } from '@/contexts/SettingsContext'
import { categories } from '@/data/categories'
import { expenses, getMonthlyExpenses } from '@/data/expenses'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function AnalyticsPage() {
  const { convertAmount, settings } = useSettings()
  const monthlyData = getMonthlyExpenses()

  // Calculate monthly comparison data
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

  // Daily spending patterns
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
        day: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ][index],
        average: dayExpenses.length ? total / dayExpenses.length : 0,
      }
    })

  // Location-based spending
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: settings?.displayCurrency?.code || 'USD',
    }).format(value)
  }

  // Add color schemes
  const dayColors = [
    'hsl(var(--primary))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--info))',
    'hsl(var(--error))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
  ]

  const locationColors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--info))',
    'hsl(var(--success))',
  ]

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Advanced insights into your spending habits
        </p>
      </div>
      <div className="grid h-[calc(100%-theme(spacing.24))] gap-6">
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
                <YAxis tickFormatter={formatCurrency} width={80} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="font-medium mb-2">{label}</div>
                          {payload.map((p, i) => (
                            <div key={i} className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">
                                {p.name}
                              </span>
                              <span className="font-medium text-right">
                                {formatCurrency(p.value as number)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
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

        <div className="grid gap-6 md:grid-cols-2">
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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis tickFormatter={formatCurrency} width={80} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="font-medium mb-1">{label}</div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">
                                Average
                              </span>
                              <span className="font-medium text-right">
                                {formatCurrency(payload[0].value as number)}
                              </span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  {dailyAverages.map((entry, index) => (
                    <Bar
                      key={entry.day}
                      dataKey="average"
                      fill={dayColors[index]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

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
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis type="number" tickFormatter={formatCurrency} />
                  <YAxis
                    type="category"
                    dataKey="location"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="font-medium mb-1">{label}</div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">
                                Total
                              </span>
                              <span className="font-medium text-right">
                                {formatCurrency(payload[0].value as number)}
                              </span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  {topLocations.map((entry, index) => (
                    <Bar
                      key={entry.location}
                      dataKey="amount"
                      fill={locationColors[index]}
                      radius={[0, 4, 4, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
