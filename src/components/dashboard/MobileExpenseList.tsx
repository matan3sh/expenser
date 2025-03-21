'use client'

import { ExpenseCard } from '@/components/expenses/expense-card/ExpenseCard'
import { Expense } from '@/types/expense.types'

interface MobileExpenseListProps {
  expenses: Expense[]
}

export function MobileExpenseList({ expenses }: MobileExpenseListProps) {
  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  )
}
