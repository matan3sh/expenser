'use client'

import AnalyticsStats from '@/components/analytics/AnalyticsStats'
import { ExpenseCard } from '@/components/analytics/ExpenseCard'
import { useExpenseData } from '@/hooks/useExpenseData'

export default function AnalyticsPage() {
  const { getCurrentMonthTotal, getPreviousMonthTotal } = useExpenseData()

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] p-6 space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Financial overview and trends</p>
      </div>

      <ExpenseCard
        getCurrentMonthTotal={getCurrentMonthTotal}
        getPreviousMonthTotal={getPreviousMonthTotal}
      />

      <AnalyticsStats />
    </div>
  )
}
