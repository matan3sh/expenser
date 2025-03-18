'use client'

import AnalyticsStats from '@/components/analytics/AnalyticsStats'
import { ExpenseCard } from '@/components/analytics/ExpenseCard'
import { useExpenseData } from '@/hooks/useExpenseData'

export default function AnalyticsPage() {
  const { getCurrentMonthTotal, getPreviousMonthTotal } = useExpenseData()

  return (
    <div className="flex flex-col h-full">
      {/* Desktop View */}
      <div className="hidden lg:block p-6 space-y-6">
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

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="px-4 py-3 mt-14">
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Financial overview and trends
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          <ExpenseCard
            getCurrentMonthTotal={getCurrentMonthTotal}
            getPreviousMonthTotal={getPreviousMonthTotal}
          />
          <div className="mt-4">
            <AnalyticsStats />
          </div>
        </div>
      </div>
    </div>
  )
}
