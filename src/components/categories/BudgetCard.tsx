'use client'

import { Card } from '@/components/ui/card'
import { useSettings } from '@/contexts/SettingsContext'
import { useBudgetProgress } from '@/hooks/useBudgetProgress'
import { useExpenses } from '@/hooks/useExpenses'
import { useMemo } from 'react'

export const BudgetCard = () => {
  const { settings } = useSettings()
  const parsedExpenses = useExpenses()

  const monthlyExpenses = useMemo(() => {
    return parsedExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return (
        expenseDate.getMonth() === settings.selectedMonth.month &&
        expenseDate.getFullYear() === settings.selectedMonth.year
      )
    })
  }, [
    parsedExpenses,
    settings.selectedMonth.month,
    settings.selectedMonth.year,
  ])

  const totalExpenses = useMemo(() => {
    return monthlyExpenses.reduce((sum, expense) => {
      const amount =
        expense.currency !== settings.displayCurrency?.code
          ? expense.converted?.amount || 0
          : expense.amount
      return sum + amount
    }, 0)
  }, [monthlyExpenses, settings.displayCurrency?.code])

  const { progressPercentage, progressColor, status, remaining } =
    useBudgetProgress(totalExpenses, 1500) // Using default budget of 1500

  return (
    <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60 backdrop-blur-lg border-white/20 shadow-xl">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-24 -translate-x-24" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

      <div className="relative">
        {/* Card Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-6 bg-yellow-300/90 rounded-md" />
            <div className="text-xs text-white/70">****4242</div>
          </div>
          <div className="text-white/90">{status.icon}</div>
        </div>

        {/* Card Content */}
        <div className="space-y-4 text-white">
          <div>
            <p className="text-sm font-medium text-white/70">Monthly Budget</p>
            <div className="flex items-center space-x-2">
              <p className="text-3xl font-bold tracking-tight">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: settings.displayCurrency?.code || 'USD',
                }).format(1500)}
              </p>
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  progressPercentage >= 90
                    ? 'bg-red-500/20'
                    : progressPercentage >= 75
                    ? 'bg-amber-500/20'
                    : 'bg-emerald-500/20'
                }`}
              >
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-2">
            <div className="absolute inset-0 bg-white/10 rounded-full" />
            <div
              className={`absolute inset-y-0 left-0 ${progressColor} rounded-full transition-all duration-300 ease-out backdrop-blur-sm bg-opacity-80`}
              style={{
                width: `${Math.min(100, progressPercentage)}%`,
                backgroundImage:
                  'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)',
              }}
            >
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent animate-shine" />
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-end text-xs">
            <div className="space-y-1">
              <p className="text-white/70">Remaining</p>
              <p className="font-medium">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: settings.displayCurrency?.code || 'USD',
                }).format(remaining)}
              </p>
            </div>
            <div className="text-white/70">
              {settings.displayCurrency?.code || 'USD'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
