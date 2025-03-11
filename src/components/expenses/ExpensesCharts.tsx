'use client'

import { Card } from '@/components/ui/card'
import { categories } from '@/data/categories'
import { monthlyExpenses } from '@/data/expenses'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
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

export function ExpensesCharts() {
  // Transform categories data for the pie chart
  const categoryData = categories.map((category) => ({
    name: category.name,
    value: 1500, // This should come from your actual data aggregation
    color: category.color,
  }))

  // Transform categories data for the bar chart
  const topCategoriesData = categories.map((category) => ({
    category: category.name,
    amount: 1200, // This should come from your actual data aggregation
    color: category.color,
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Monthly Trend Chart */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Monthly Expenses Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyExpenses}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-muted-foreground text-xs" />
            <YAxis
              className="text-muted-foreground text-xs"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Distribution Chart */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Categories Chart */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Top Spending Categories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topCategoriesData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="category"
              className="text-muted-foreground text-xs"
            />
            <YAxis
              className="text-muted-foreground text-xs"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Bar
              dataKey="amount"
              fill={CHART_COLORS[2]}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
