'use client'

import { Card } from '@/components/ui/card'
import { useSettings } from '@/contexts/SettingsContext'
import { categories } from '@/data/categories'
import { getCategoryTotals, getMonthlyExpenses } from '@/data/expenses'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

// These colors are from your theme (src/app/globals.css)
const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
    payload: {
      name: string
      value: number
      color: string
    }
  }>
  label?: string
}

const CustomBarChartTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload) return null

  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md">
      <p className="mb-2 font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: CHART_COLORS[0] }}
        />
        <span className="text-sm text-muted-foreground">Amount:</span>
        <span className="text-sm font-medium">{payload[0]?.value}</span>
      </div>
    </div>
  )
}

const CustomPieChartTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.[0]) return null

  const data = payload[0]
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md">
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="font-medium">{data.name}</span>
      </div>
      <div className="mt-1.5 text-sm text-muted-foreground">
        Amount:{' '}
        <span className="font-medium text-foreground">{data.value}</span>
      </div>
    </div>
  )
}

export function ExpensesCharts() {
  const { formatAmount, convertToDisplayCurrency } = useCurrencyFormat()
  const { settings } = useSettings()
  const monthlyData = getMonthlyExpenses()

  // Transform monthly data for the line chart
  const monthlyChartData = monthlyData.map((month) => ({
    month: month.month,
    amount: month.expenses.reduce((total, expense) => {
      return total + convertToDisplayCurrency(expense.amount, expense.currency)
    }, 0),
  }))

  // Calculate category totals for all expenses
  const allExpenses = monthlyData.flatMap((month) => month.expenses)
  const categoryTotals = getCategoryTotals(
    allExpenses,
    convertToDisplayCurrency,
    settings?.displayCurrency?.code
  )

  // Transform categories data for the pie chart
  const categoryData = categories.map((category) => ({
    name: category.name,
    value: categoryTotals[category.id] || 0,
    color: category.color,
  }))

  const formatValue = (value: number) => {
    return formatAmount(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Monthly Trend Chart */}
      <Card className="p-3">
        <h3 className="font-semibold mb-2">Monthly Expenses Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyChartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-muted-foreground text-xs"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              className="text-muted-foreground text-xs"
              tickFormatter={formatValue}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomBarChartTooltip />}
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
            />
            <Bar
              dataKey="amount"
              fill={CHART_COLORS[0]}
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Distribution Chart */}
      <Card className="p-3">
        <h3 className="font-semibold mb-2">Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieChartTooltip />} />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
              wrapperStyle={{
                paddingLeft: '24px',
              }}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
