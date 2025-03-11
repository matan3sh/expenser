'use client'

import { useSettings } from '@/contexts/SettingsContext'
import { formatCurrency } from '@/data/currencies'
import { StatCard } from './StatCard'

const CURRENT_MONTH_TEXT = 'For current month'

export function DashboardStats() {
  const { convertAmount, settings } = useSettings()
  const totalAmount = 1234.56 // This should come from your actual data
  const formattedAmount = formatCurrency(
    convertAmount(totalAmount),
    settings.targetCurrency.code
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Expenses"
        value={formattedAmount}
        subtitle={CURRENT_MONTH_TEXT}
      />
      <StatCard
        title="Receipts Uploaded"
        value={12}
        subtitle={CURRENT_MONTH_TEXT}
      />
      <StatCard title="Categories" value={8} subtitle="Active categories" />
    </div>
  )
}
