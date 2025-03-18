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
  const { settings, convertAmount } = useSettings()
  const displayCurrency = settings?.displayCurrency?.code || 'USD'

  // Get values from hook first
  const { progressPercentage, progressColor, status, remaining } =
    useBudgetProgress(totalAmount, budget)

  // Then convert the remaining amount
  const convertedRemaining = convertAmount(remaining, displayCurrency)

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <div className={`h-2 w-2 rounded-full ${progressColor}`} />
          <span className={`font-medium ${status.textColor}`}>
            {formatAmount(convertedRemaining, displayCurrency)} remaining
          </span>
        </div>
        <span className="text-muted-foreground font-medium ml-2">
          {progressPercentage.toFixed(2)}%
        </span>
      </div>

      <div className="relative h-2">
        {/* Background track */}
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-full" />

        {/* Progress bar with gradient and glass effect */}
        <div
          className={`absolute inset-y-0 left-0 ${progressColor} rounded-full 
            transition-all duration-300 ease-out
            backdrop-blur-sm bg-opacity-80
            shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
          style={{
            width: `${Math.min(100, progressPercentage)}%`,
            backgroundImage:
              'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)',
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent animate-shine" />
          </div>
        </div>
      </div>
    </div>
  )
}
