'use client'

import { useSettings } from '@/contexts/SettingsContext'
import { getCurrencyByCode } from '@/data/currencies'
import { CategoryWithBudget } from '@/types/category.types'
import { format } from 'date-fns'

// Types
interface ExpenseListProps {
  categoryId: string
  expenses?: CategoryWithBudget['expenses']
}

interface ExpenseItemProps {
  expense: CategoryWithBudget['expenses'][number]
  displayCurrency: string | undefined
}

// Empty state component
const EmptyState = ({ month, year }: { month: number; year: number }) => (
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
    {format(new Date(year, month), 'MMMM yyyy')}
  </div>
)

// Amount display component
const ExpenseAmount = ({ expense, displayCurrency }: ExpenseItemProps) => {
  const isDisplayCurrency = expense.currency === displayCurrency
  const currencySymbol = getCurrencyByCode(expense.currency)?.symbol

  return (
    <div className="text-right">
      <div className="text-base font-medium">
        {isDisplayCurrency
          ? `${currencySymbol}${expense.amount.toFixed(2)}`
          : `${expense.converted?.symbol} ${expense.converted?.amount.toFixed(
              2
            )} `}
      </div>
      {expense.converted && (
        <div className="text-xs text-gray-500">
          ({expense.converted.symbol}
          {expense.converted.amount.toFixed(2)})
        </div>
      )}
    </div>
  )
}

// Individual expense item component
const ExpenseItem = ({ expense, displayCurrency }: ExpenseItemProps) => (
  <div className="receipt-item px-2 py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1">
        <p className="text-base font-medium">{expense.description}</p>
        <p className="text-xs text-gray-500">{expense.location}</p>
      </div>
      <ExpenseAmount expense={expense} displayCurrency={displayCurrency} />
    </div>
    <div className="flex justify-between items-center text-xs text-gray-500">
      <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
    </div>
  </div>
)

// Main ExpenseList component
export const ExpenseList: React.FC<ExpenseListProps> = ({
  categoryId,
  expenses: providedExpenses = [],
}) => {
  const { settings } = useSettings()
  const displayCurrency = settings.displayCurrency?.code

  // Filter expenses for the current category
  const categoryExpenses = providedExpenses.filter(
    (expense) => expense.category?.id === categoryId
  )

  if (categoryExpenses.length === 0) {
    return (
      <EmptyState
        month={settings.selectedMonth.month}
        year={settings.selectedMonth.year}
      />
    )
  }

  return (
    <div className="space-y-4">
      {categoryExpenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          displayCurrency={displayCurrency}
        />
      ))}
    </div>
  )
}
