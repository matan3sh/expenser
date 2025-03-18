'use client'

import { useSettings } from '@/contexts/SettingsContext'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import type { Expense } from '@/types/expense'
import { format } from 'date-fns'

interface ExpenseListProps {
  categoryId: string
  expenses?: Expense[]
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  categoryId,
  expenses: providedExpenses,
}) => {
  const { formatAmount } = useCurrencyFormat()
  const { settings } = useSettings()

  // Filter expenses for the current category and selected month
  const categoryExpenses = providedExpenses
    ? providedExpenses.filter((expense) => expense.categoryId === categoryId)
    : []

  if (categoryExpenses.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground flex flex-col items-center">
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-3 text-gray-300"
        >
          <path
            d="M9 14L15 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 9.4V4.2C4 3.0799 4 2.51984 4.21799 2.09202C4.40973 1.71569 4.71569 1.40973 5.09202 1.21799C5.51984 1 6.0799 1 7.2 1H16.8C17.9201 1 18.4802 1 18.908 1.21799C19.2843 1.40973 19.5903 1.71569 19.782 2.09202C20 2.51984 20 3.0799 20 4.2V17.8C20 18.9201 20 19.4802 19.782 19.908C19.5903 20.2843 19.2843 20.5903 18.908 20.782C18.4802 21 17.9201 21 16.8 21H10.4M16 5H8M16 9H8M9 17.5C9 18.8807 7.88071 20 6.5 20C5.11929 20 4 18.8807 4 17.5C4 16.1193 5.11929 15 6.5 15C7.88071 15 9 16.1193 9 17.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        No expenses found for this category in{' '}
        {format(
          new Date(settings.selectedMonth.year, settings.selectedMonth.month),
          'MMMM yyyy'
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categoryExpenses.map((expense) => (
        <div
          key={expense.id}
          className="receipt-item px-2 py-3 border-b border-gray-100 last:border-b-0"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <p className="text-base font-medium">{expense.description}</p>
              <p className="text-xs text-gray-500">{expense.location}</p>
            </div>
            <p className="text-base font-medium text-right">
              {formatAmount(expense.amount, expense.currency)}
            </p>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
