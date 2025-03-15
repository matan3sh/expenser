'use client'

import { categories } from '@/data/categories'
import { formatCurrency } from '@/data/currencies'
import { getCategoryTotals, getMonthlyExpenses } from '@/data/expenses'
import { useState } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface TooltipProps {
  active?: boolean
  payload?: {
    name: string
    value: number
    color: string
    dataKey: string
  }[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload) return null

  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md">
      <p className="mb-2 font-medium">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.name}:</span>
            <span className="text-sm font-medium">
              {formatCurrency(entry.value, 'ILS')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ActiveCategoriesState {
  [key: string]: boolean
}

export function CategoryTrendChart() {
  const [activeCategories, setActiveCategories] =
    useState<ActiveCategoriesState>(
      categories.reduce(
        (acc, category) => ({
          ...acc,
          [category.id]: true,
        }),
        {}
      )
    )

  const monthlyData = getMonthlyExpenses()
  const chartData = monthlyData.map((month) => {
    const categoryTotals = getCategoryTotals(month.expenses, (amount) => amount)

    return {
      month: month.month,
      ...categories.reduce(
        (acc, category) => ({
          ...acc,
          [category.name]: categoryTotals[category.id] || 0,
        }),
        {}
      ),
    }
  })

  const toggleCategory = (categoryId: string) => {
    setActiveCategories((prev) => {
      // Count how many categories are currently active
      const activeCount = Object.values(prev).filter(Boolean).length

      // If trying to deactivate and it's the last active category, prevent the change
      if (prev[categoryId] && activeCount === 1) {
        return prev
      }

      // Otherwise, proceed with the toggle
      return {
        ...prev,
        [categoryId]: !prev[categoryId],
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm transition-colors
              ${
                activeCategories[category.id]
                  ? 'bg-secondary'
                  : 'bg-background hover:bg-secondary/50'
              }`}
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            {category.name}
          </button>
        ))}
      </div>

      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              {categories.map((category) => (
                <linearGradient
                  key={`gradient-${category.id}`}
                  id={`gradient-${category.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={category.color}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={category.color}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              ))}
            </defs>
            <XAxis
              dataKey="month"
              className="text-muted-foreground text-xs"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-muted-foreground text-xs"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value, 'ILS')}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'hsl(var(--muted))',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />
            {categories.map(
              (category) =>
                activeCategories[category.id] && (
                  <Area
                    key={category.id}
                    type="monotone"
                    dataKey={category.name}
                    stroke={category.color}
                    strokeWidth={2}
                    fill={`url(#gradient-${category.id})`}
                    dot={false}
                    activeDot={{
                      r: 4,
                      strokeWidth: 2,
                      fill: 'hsl(var(--background))',
                    }}
                  />
                )
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
