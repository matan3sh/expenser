'use client'

import { Card } from '@/components/ui/card'
import { useSettings } from '@/contexts/SettingsContext'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import { format } from 'date-fns'
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts'

interface ExpenseCardProps {
  getCurrentMonthTotal: () => number
  getPreviousMonthTotal: () => number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: {
      date: string
    }
  }>
  formatAmount: (value: number) => string
}

function CustomTooltip({ active, payload, formatAmount }: CustomTooltipProps) {
  if (!active || !payload?.[0]) return null

  return (
    <div className="rounded-lg bg-white/10 backdrop-blur-md px-3 py-2 shadow-lg border border-white/20">
      <p className="text-white/70 text-xs mb-1">{payload[0].payload.date}</p>
      <p className="text-white font-medium">{formatAmount(payload[0].value)}</p>
    </div>
  )
}

// Helper function to get last 3 months of data
function getLastThreeMonthsData(): { date: string; amount: number }[] {
  const today = new Date()
  const last3Months = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today)
    d.setMonth(d.getMonth() - i)
    return format(d, 'MMM')
  }).reverse()

  // Create dummy data for demonstration
  return last3Months.map((month) => ({
    date: month,
    amount: Math.random() * 1000 + 500, // Random amount between 500 and 1500
  }))
}

export function ExpenseCard({
  getCurrentMonthTotal,
  getPreviousMonthTotal,
}: ExpenseCardProps) {
  const { settings } = useSettings()
  const { formatAmount } = useCurrencyFormat()
  const splineData = getLastThreeMonthsData()

  const currentTotal = getCurrentMonthTotal()
  const previousTotal = getPreviousMonthTotal()
  const percentageChange =
    previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0

  return (
    <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-24 -translate-x-24" />

      <div className="relative">
        <CardHeader />
        <CardContent
          currentMonthTotal={currentTotal}
          percentageChange={percentageChange}
          formatAmount={formatAmount}
        />

        {/* Spline Chart */}
        <div className="mt-6 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={splineData}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={<CustomTooltip formatAmount={formatAmount} />}
                cursor={false}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#fff"
                strokeWidth={2}
                fill="url(#colorAmount)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <CardFooter
          currencyCode={settings?.displayCurrency?.code || 'USD'}
          splineData={splineData}
        />
      </div>
    </Card>
  )
}

function CardHeader() {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-6 bg-yellow-300/90 rounded-md" />
        <div className="text-xs text-white/70">****4242</div>
      </div>
      <svg
        className="w-8 h-8 text-white/90"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    </div>
  )
}

interface CardContentProps {
  currentMonthTotal: number
  percentageChange: number
  formatAmount: (value: number) => string
}

function CardContent({
  currentMonthTotal,
  percentageChange,
  formatAmount,
}: CardContentProps) {
  return (
    <div className="space-y-4 text-white">
      <div>
        <div className="flex items-center space-x-2">
          <p className="text-3xl font-bold tracking-tight">
            {formatAmount(currentMonthTotal)}
          </p>
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              percentageChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
          >
            {percentageChange >= 0 ? '↑' : '↓'}{' '}
            {Math.abs(percentageChange).toFixed(1)}%
          </span>
        </div>
        <p className="text-sm font-medium text-white/70 mt-1">Total Expenses</p>
      </div>
    </div>
  )
}

interface CardFooterProps {
  currencyCode: string
  splineData: Array<{ date: string; amount: number }>
}

function CardFooter({ currencyCode, splineData }: CardFooterProps) {
  return (
    <div className="mt-4 flex justify-between items-end text-xs">
      <div className="grid grid-cols-3 gap-4 w-full">
        {splineData.map((data) => (
          <div key={data.date} className="text-white/80">
            <div className="font-medium">{data.date}</div>
          </div>
        ))}
      </div>
      <div className="text-white/80 ml-4">{currencyCode}</div>
    </div>
  )
}
