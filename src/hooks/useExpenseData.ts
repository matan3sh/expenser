import { useSettings } from '@/contexts/SettingsContext'
import { getMonthlyExpenses } from '@/data/expenses'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'

export function useExpenseData() {
  const { formatAmount } = useCurrencyFormat()
  const { settings } = useSettings()
  const monthlyData = getMonthlyExpenses(settings)

  // Get current and previous month's data
  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]

  // Calculate totals with proper currency conversion
  const getCurrentMonthTotal = () => {
    return currentMonth.expenses.reduce((total, expense) => {
      const amount =
        expense.currency !== settings.displayCurrency?.code
          ? expense.converted?.amount || 0
          : expense.amount
      return total + amount
    }, 0)
  }

  const getPreviousMonthTotal = () => {
    return previousMonth.expenses.reduce((total, expense) => {
      const amount =
        expense.currency !== settings.displayCurrency?.code
          ? expense.converted?.amount || 0
          : expense.amount
      return total + amount
    }, 0)
  }

  // Transform data for the spline chart
  const chartData = monthlyData.map((month) => ({
    month: month.month,
    amount: month.expenses.reduce((total, expense) => {
      const amount =
        expense.currency !== settings.displayCurrency?.code
          ? expense.converted?.amount || 0
          : expense.amount
      return total + amount
    }, 0),
  }))

  return {
    monthlyData,
    currentMonth,
    previousMonth,
    getCurrentMonthTotal,
    getPreviousMonthTotal,
    chartData,
    formatAmount,
  }
}
