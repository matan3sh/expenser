'use client'

import { MobileExpensesView } from '@/components/expenses/MobileExpensesView'
import { useExpenses } from '@/hooks/useExpenses'

export default function ExpensesPage() {
  const expenses = useExpenses()

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full">
        <div className="px-2 py-4">
          <MobileExpensesView expenses={expenses} />
        </div>
      </div>
    </div>
  )
}
