import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import React from 'react'

export interface BudgetStatus {
  icon: React.ReactNode
  text: string
  textColor: string
}

export const useBudgetProgress = (totalAmount: number, budget: number = 0) => {
  const progressPercentage =
    budget > 0 ? Math.min((totalAmount / budget) * 100, 100) : 0

  const getProgressColor = () => {
    if (progressPercentage >= 90) return 'bg-red-500'
    if (progressPercentage >= 75) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const getBudgetStatus = (): BudgetStatus => {
    if (progressPercentage >= 90) {
      return {
        icon: <ArrowUpCircle className="w-3.5 h-3.5 text-red-500" />,
        text: 'Over budget',
        textColor: 'text-red-500',
      }
    }
    if (progressPercentage >= 75) {
      return {
        icon: <ArrowUpCircle className="w-3.5 h-3.5 text-amber-500" />,
        text: 'Near limit',
        textColor: 'text-amber-500',
      }
    }
    return {
      icon: <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-500" />,
      text: 'Under budget',
      textColor: 'text-emerald-500',
    }
  }
  return {
    progressPercentage,
    progressColor: getProgressColor(),
    status: getBudgetStatus(),
    remaining: Math.max(budget - totalAmount, 0),
  }
}
