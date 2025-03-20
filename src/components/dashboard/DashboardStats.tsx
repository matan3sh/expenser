'use client'

import { Card } from '@/components/ui/card'
import { useSettings } from '@/contexts/SettingsContext'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import { Expense } from '@/types/expense.types'
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

interface DashboardStatsProps {
  expenses: Expense[]
}

export function DashboardStats({ expenses }: DashboardStatsProps) {
  const { formatAmount } = useCurrencyFormat()
  const { settings } = useSettings()

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

  // Calculate totals with proper currency conversion
  const getCurrentTotal = (expenses: Expense[]) =>
    expenses.reduce((total, expense) => {
      const amount =
        expense.currency !== settings.displayCurrency?.code
          ? expense.converted?.amount || 0
          : expense.amount
      return total + amount
    }, 0)

  const currentMonthTotal = getCurrentTotal(currentMonthExpenses)
  const previousMonthTotal = getCurrentTotal(previousMonthExpenses)

  // Calculate trend percentage
  const calculateTrend = (current: number, previous: number) =>
    previous === 0 ? 0 : ((current - previous) / previous) * 100

  // Calculate year-to-date total based on selected month
  const yearToDateExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (
      expenseDate.getFullYear() === settings.selectedMonth.year &&
      expenseDate.getMonth() <= settings.selectedMonth.month
    )
  })
  const yearToDateTotal = getCurrentTotal(yearToDateExpenses)

  // Calculate average monthly spending based on selected month range
  const monthsInRange = settings.selectedMonth.month + 1
  const averageMonthly = yearToDateTotal / monthsInRange

  // Find largest expense
  const largestExpense = expenses.reduce((max, expense) => {
    const amount =
      expense.currency !== settings.displayCurrency?.code
        ? expense.converted?.amount || 0
        : expense.amount
    return amount > max ? amount : max
  }, 0)

  const stats = [
    {
      title: 'Monthly Spending',
      amount: formatAmount(currentMonthTotal),
      trend: calculateTrend(currentMonthTotal, previousMonthTotal),
      icon: <CreditCard className="w-6 h-6" />,
      subtitle: 'vs last month',
    },
    {
      title: 'Year to Date',
      amount: formatAmount(yearToDateTotal),
      trend: 12.5, // This should be calculated based on previous year
      icon: <Wallet className="w-6 h-6" />,
      subtitle: `as of ${new Date(
        settings.selectedMonth.year,
        settings.selectedMonth.month
      ).toLocaleString('default', { month: 'long', year: 'numeric' })}`,
    },
    {
      title: 'Average Monthly',
      amount: formatAmount(averageMonthly),
      trend: 8.2, // This should be calculated based on previous period
      icon: <DollarSign className="w-6 h-6" />,
      subtitle: `based on ${monthsInRange} months`,
    },
    {
      title: 'Largest Expense',
      amount: formatAmount(largestExpense),
      trend: 5.4, // This should be calculated based on previous period
      icon: <DollarSign className="w-6 h-6" />,
      subtitle: 'single transaction',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
