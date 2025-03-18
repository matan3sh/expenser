import { useSettings } from '@/contexts/SettingsContext'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { ReactNode } from 'react'

export interface BudgetStatus {
  icon: ReactNode
  text: string
  textColor: string
}

interface BudgetProgressReturn {
  progressPercentage: number
  progressColor: string
  status: BudgetStatus
  remaining: number
}

export function useBudgetProgress(
  totalAmount: number,
  budget: number
): BudgetProgressReturn {
  const { settings, convertAmount } = useSettings()
  const displayCurrency = settings?.displayCurrency?.code || 'USD'

  // Convert budget to display currency if needed
  const convertedBudget = convertAmount(budget, displayCurrency)
  const convertedTotal = convertAmount(totalAmount, displayCurrency)

  const progressPercentage = (convertedTotal / convertedBudget) * 100
  const remaining = convertedBudget - convertedTotal

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
    remaining,
  }
}
