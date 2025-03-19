'use client'

import { ExpensesCharts } from '@/components/expenses/ExpensesCharts'
import { ExpensesDataTable } from '@/components/expenses/ExpensesDataTable'
import { MobileExpensesView } from '@/components/expenses/MobileExpensesView'
import { useExpenses } from '@/hooks/useExpenses'

export default function ExpensesPage() {
  const expenses = useExpenses()

  return (
    <div className="flex flex-col h-full">
      {/* Desktop View */}
      <div className="hidden lg:block p-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Expenses Overview
          </h1>
          <p className="text-muted-foreground">
            Comprehensive view of all your expenses with analytics and filtering
            options.
          </p>
        </div>
        <ExpensesCharts />
        <ExpensesDataTable expenses={expenses} />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="px-2 py-4">
          <MobileExpensesView expenses={expenses} />
        </div>
      </div>
    </div>
  )
}
