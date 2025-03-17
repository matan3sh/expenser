'use client'

import { Card } from '@/components/ui/card'
import { expenses } from '@/data/expenses'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import {
  CreditCard,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'

interface StatCardProps {
  title: string
  amount: string
  trend: number
  icon: React.ReactNode
  subtitle?: string
}

function StatCard({ title, amount, trend, icon, subtitle }: StatCardProps) {
  const isPositive = trend >= 0
  const gradients: Record<string, string> = {
    'Monthly Spending': 'from-blue-500 to-blue-600',
    'Year to Date': 'from-violet-500 to-violet-600',
    'Average Monthly': 'from-emerald-500 to-emerald-600',
    'Largest Expense': 'from-amber-500 to-amber-600',
  }

  return (
    <Card
      className={`p-6 hover:shadow-lg transition-all bg-gradient-to-br ${
        gradients[title] || 'from-blue-500 to-blue-600'
      } text-white`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/10">{icon}</div>
        <div
          className={`flex items-center gap-1 text-sm ${
            isPositive ? 'text-emerald-300' : 'text-red-300'
          }`}
        >
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{Math.abs(trend).toFixed(1)}%</span>
        </div>
      </div>

      <h3 className="text-sm text-white/70 font-medium mb-1">{title}</h3>
      <p className="text-2xl font-semibold mb-1">{amount}</p>
      {subtitle && <p className="text-xs text-white/70">{subtitle}</p>}
    </Card>
  )
}

export function DashboardStats() {
  const { formatAmount, convertToDisplayCurrency } = useCurrencyFormat()

  // Helper function to get expenses for a specific month
  const getMonthExpenses = (monthsAgo: number) => {
    const date = new Date()
    date.setMonth(date.getMonth() - monthsAgo)
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return (
        expenseDate.getMonth() === date.getMonth() &&
        expenseDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Calculate current and previous month expenses
  const currentMonthExpenses = getMonthExpenses(0)
  const previousMonthExpenses = getMonthExpenses(1)

  // Calculate totals
  const getCurrentTotal = (expenses: typeof currentMonthExpenses) =>
    expenses.reduce(
      (total, expense) =>
        total + convertToDisplayCurrency(expense.amount, expense.currency),
      0
    )

  const currentMonthTotal = getCurrentTotal(currentMonthExpenses)
  const previousMonthTotal = getCurrentTotal(previousMonthExpenses)

  // Calculate trend percentage
  const calculateTrend = (current: number, previous: number) =>
    previous === 0 ? 0 : ((current - previous) / previous) * 100

  // Calculate year-to-date total
  const yearToDateExpenses = expenses.filter(
    (expense) =>
      new Date(expense.date).getFullYear() === new Date().getFullYear()
  )
  const yearToDateTotal = getCurrentTotal(yearToDateExpenses)

  // Calculate average monthly spending
  const monthsInYear = new Date().getMonth() + 1
  const averageMonthly = yearToDateTotal / monthsInYear

  const stats = [
    {
      title: 'Monthly Spending',
      amount: formatAmount(currentMonthTotal),
      trend: calculateTrend(currentMonthTotal, previousMonthTotal),
      icon: <CreditCard className="text-primary" size={20} />,
      subtitle: 'vs last month',
    },
    {
      title: 'Year to Date',
      amount: formatAmount(yearToDateTotal),
      trend: calculateTrend(
        yearToDateTotal,
        yearToDateTotal - currentMonthTotal
      ),
      icon: <DollarSign className="text-primary" size={20} />,
      subtitle: 'total expenses',
    },
    {
      title: 'Average Monthly',
      amount: formatAmount(averageMonthly),
      trend: calculateTrend(currentMonthTotal, averageMonthly),
      icon: <Wallet className="text-primary" size={20} />,
      subtitle: `${monthsInYear} months average`,
    },
    {
      title: 'Largest Expense',
      amount: formatAmount(
        Math.max(
          ...currentMonthExpenses.map((e) =>
            convertToDisplayCurrency(e.amount, e.currency)
          )
        )
      ),
      trend: 0,
      icon: <TrendingUp className="text-primary" size={20} />,
      subtitle: 'this month',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}
