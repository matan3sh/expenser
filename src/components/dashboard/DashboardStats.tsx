'use client'

import { useSettings } from '@/contexts/SettingsContext'
import { formatCurrency } from '@/data/currencies'
import { expenses } from '@/data/expenses'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import { StatCard } from './StatCard'

const CURRENT_MONTH_TEXT = 'For current month'

export function DashboardStats() {
  const { formatAmount, convertToDisplayCurrency } = useCurrencyFormat()
  const { settings } = useSettings()

  // Calculate total expenses for current month
  const currentDate = new Date()
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (
      expenseDate.getMonth() === currentDate.getMonth() &&
      expenseDate.getFullYear() === currentDate.getFullYear()
    )
  })

  const totalAmount = currentMonthExpenses.reduce((total, expense) => {
    return total + convertToDisplayCurrency(expense.amount, expense.currency)
  }, 0)

  // Format the amount, falling back to USD if settings aren't loaded yet
  const formattedAmount = formatCurrency(
    totalAmount,
    settings?.displayCurrency?.code || 'USD'
  )

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Expenses"
        value={formatAmount(totalAmount)}
        subtitle={CURRENT_MONTH_TEXT}
      />
      <StatCard
        title="Receipts Uploaded"
        value={currentMonthExpenses.length}
        subtitle={CURRENT_MONTH_TEXT}
      />
      <StatCard
        title="Categories"
        value={new Set(currentMonthExpenses.map((e) => e.categoryId)).size}
        subtitle="Active categories"
      />
    </div>
  )
}
