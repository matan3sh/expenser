import { useSettings } from '@/contexts/SettingsContext'
import { useBudgetProgress } from '@/hooks/useBudgetProgress'
interface BudgetProgressProps {
  totalAmount: number
  budget: number
  formatAmount: (amount: number, currency: string) => string
}

export const BudgetProgress = ({
  totalAmount,
  budget,
  formatAmount,
}: BudgetProgressProps) => {
  const { progressPercentage, progressColor, status, remaining } =
    useBudgetProgress(totalAmount, budget)
  const { settings } = useSettings()

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className={status.textColor}>
          {formatAmount(remaining, settings.displayCurrency?.code || 'USD')}{' '}
          left
        </span>
      </div>
      <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-300 ease-in-out`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  )
}
