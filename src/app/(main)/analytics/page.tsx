'use client'

import AnalyticsStats from '@/components/analytics/AnalyticsStats'
import { ExpenseCard } from '@/components/analytics/ExpenseCard'
import { useExpenseData } from '@/hooks/useExpenseData'

export default function AnalyticsPage() {
  const { getCurrentMonthTotal, getPreviousMonthTotal } = useExpenseData()

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full">
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
