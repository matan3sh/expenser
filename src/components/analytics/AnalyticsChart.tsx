'use client'

import { Card } from '@/components/ui/card'
import { useSettings } from '@/contexts/SettingsContext'
import { getMonthlyExpenses } from '@/data/expenses'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/solid'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface ChartData {
  name: string
  activity: number
  goal: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    dataKey: string
  }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload) return null

  return (
    <div className="rounded-xl border bg-white/80 backdrop-blur-sm p-4 shadow-lg">
      <p className="mb-2 font-medium text-sm text-gray-600">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 py-1">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor:
                entry.dataKey === 'activity' ? '#60A5FA' : '#4C1D95',
            }}
          />
          <span className="text-xs text-gray-500">
            {entry.dataKey === 'activity' ? 'Activity' : 'Goal'}:
          </span>
          <span className="text-sm font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const CHART_COLORS = {
  activity: '#60A5FA', // Blue-400
  goal: '#4C1D95', // Purple-900
}

export function AnalyticsChart() {
  const { formatAmount, convertToDisplayCurrency } = useCurrencyFormat()
  const { settings } = useSettings()
  const monthlyData = getMonthlyExpenses(settings)

  // Calculate stats
  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]

  const currentMonthTotal = currentMonth?.expenses.reduce(
    (sum, exp) => sum + convertToDisplayCurrency(exp.amount, exp.currency),
    0
  )
  const previousMonthTotal = previousMonth?.expenses.reduce(
    (sum, exp) => sum + convertToDisplayCurrency(exp.amount, exp.currency),
    0
  )

  const percentageChange = previousMonthTotal
    ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
    : 0

  // Transform data for the bar chart
  const chartData: ChartData[] = monthlyData.slice(-10).map((month) => {
    const total = month.expenses.reduce(
      (sum, exp) => sum + convertToDisplayCurrency(exp.amount, exp.currency),
      0
    )
    return {
      name: month.month,
      activity: total,
      goal: total * 1.2, // Example goal: 20% higher than actual
    }
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-100">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Number of Sales</p>
              <h3 className="text-2xl font-bold">
                {currentMonth?.expenses.length || 0}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <div
                  className={`flex items-center ${
                    percentageChange >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {percentageChange >= 0 ? (
                    <ArrowUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-100">
              <svg
                className="w-6 h-6 text-cyan-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sales Revenue</p>
              <h3 className="text-2xl font-bold">
                {formatAmount(currentMonthTotal)}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <div
                  className={`flex items-center ${
                    percentageChange >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {percentageChange >= 0 ? (
                    <ArrowUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4M20 12a8 8 0 01-8 8m8-8a8 8 0 00-8-8m8 8h4m-4-8a8 8 0 00-8 8"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Price</p>
              <h3 className="text-2xl font-bold">
                {formatAmount(
                  currentMonthTotal / (currentMonth?.expenses.length || 1)
                )}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center text-emerald-600">
                  <ArrowUpIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">12%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-100">
              <svg
                className="w-6 h-6 text-violet-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Operations</p>
              <div className="flex items-center gap-1">
                <h3 className="text-2xl font-bold">
                  {monthlyData.reduce(
                    (sum, month) => sum + month.expenses.length,
                    0
                  )}
                </h3>
                <div className="flex flex-col h-6 justify-between ml-2">
                  <div className="w-1 h-1 rounded-full bg-violet-600"></div>
                  <div className="w-1 h-2 rounded-full bg-violet-600"></div>
                  <div className="w-1 h-1 rounded-full bg-violet-600"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 rounded-2xl">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1">Market Overview</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: CHART_COLORS.activity }}
              />
              <span className="text-sm text-gray-600">Activity</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: CHART_COLORS.goal }}
              />
              <span className="text-sm text-gray-600">Goal</span>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={8}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="activity"
                fill={CHART_COLORS.activity}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="goal"
                fill={CHART_COLORS.goal}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
