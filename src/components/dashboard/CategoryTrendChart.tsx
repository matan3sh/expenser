'use client'

import { categories } from '@/data/categories'
import { formatCurrency } from '@/data/currencies'
import { getCategoryTotals, getMonthlyExpenses } from '@/data/expenses'
import {
  Legend,
  Line,
  LineChart,
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

export function CategoryTrendChart() {
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

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 5, left: 5, bottom: 5 }}
        >
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
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{
              paddingBottom: '20px',
              marginTop: '-15px',
            }}
            formatter={(value) => (
              <span className="text-sm text-muted-foreground">{value}</span>
            )}
          />
          {categories.map((category) => (
            <Line
              key={category.id}
              type="monotone"
              dataKey={category.name}
              stroke={category.color}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                fill: 'hsl(var(--background))',
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
