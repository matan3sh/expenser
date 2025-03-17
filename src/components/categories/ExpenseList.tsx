'use client'

import { useSettings } from '@/contexts/SettingsContext'
import { expenses } from '@/data/expenses'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import { format } from 'date-fns'

interface ExpenseListProps {
  categoryId: string
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ categoryId }) => {
  const { formatAmount } = useCurrencyFormat()
  const { settings } = useSettings()

  // Filter expenses for the current category and selected month
  const categoryExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date)
      return (
        expense.categoryId === categoryId &&
        expenseDate.getMonth() === settings.selectedMonth.month &&
        expenseDate.getFullYear() === settings.selectedMonth.year
      )
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (categoryExpenses.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        No expenses found for this category in{' '}
        {format(
          new Date(settings.selectedMonth.year, settings.selectedMonth.month),
          'MMMM yyyy'
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {categoryExpenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium">{expense.description}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
              <span>•</span>
              <span>{expense.location}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              {formatAmount(expense.amount, expense.currency)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
