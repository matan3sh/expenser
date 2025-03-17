import { getMonthlyExpenses } from '@/data/expenses'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'

export function useExpenseData() {
  const { formatAmount, convertToDisplayCurrency } = useCurrencyFormat()
  const monthlyData = getMonthlyExpenses()

  // Get current and previous month's data
  const currentMonth = monthlyData[monthlyData.length - 1]
  const previousMonth = monthlyData[monthlyData.length - 2]

  // Calculate totals
  const getCurrentMonthTotal = () => {
    return currentMonth.expenses.reduce((total, expense) => {
      return total + convertToDisplayCurrency(expense.amount, expense.currency)
    }, 0)
  }

  const getPreviousMonthTotal = () => {
    return previousMonth.expenses.reduce((total, expense) => {
      return total + convertToDisplayCurrency(expense.amount, expense.currency)
    }, 0)
  }

  // Transform data for the spline chart
  const chartData = monthlyData.map((month) => ({
    month: month.month,
    amount: month.expenses.reduce((total, expense) => {
      return total + convertToDisplayCurrency(expense.amount, expense.currency)
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
