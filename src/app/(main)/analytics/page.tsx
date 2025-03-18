'use client'

import AnalyticsStats from '@/components/analytics/AnalyticsStats'
import { ExpenseCard } from '@/components/analytics/ExpenseCard'
import { useExpenseData } from '@/hooks/useExpenseData'

export default function AnalyticsPage() {
  const { getCurrentMonthTotal, getPreviousMonthTotal } = useExpenseData()

  return (
    <div className="flex flex-col h-full">
      {/* Desktop View */}
      <div className="hidden lg:block space-y-6">
        <div className="px-6 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Financial overview and trends</p>
        </div>
        <div className="px-6">
          <ExpenseCard
            getCurrentMonthTotal={getCurrentMonthTotal}
            getPreviousMonthTotal={getPreviousMonthTotal}
          />
        </div>
        <div className="px-6">
          <AnalyticsStats />
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
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
