import { useBudgetProgress } from '@/hooks/useBudgetProgress'

interface DetailedBudgetViewProps {
  totalAmount: number
  budget: number
  formatAmount: (amount: number) => string
}

export const DetailedBudgetView = ({
  totalAmount,
  budget,
  formatAmount,
}: DetailedBudgetViewProps) => {
  const { progressPercentage, progressColor, status, remaining } =
    useBudgetProgress(totalAmount, budget)

  return (
    <div className="mt-6 max-w-[250px] mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Monthly Budget</span>
          {status.icon}
        </div>
        <span className={`text-sm font-medium ${status.textColor}`}>
          {Math.round(progressPercentage)}%
        </span>
      </div>
      <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-300 ease-in-out`}
          style={{
            width: `${progressPercentage}%`,
            boxShadow: '0 0 4px rgba(0,0,0,0.05)',
          }}
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Spent</p>
          <p className="text-sm font-medium">{formatAmount(totalAmount)}</p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs text-gray-500">Budget</p>
          <p className="text-sm font-medium">{formatAmount(budget)}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs text-gray-500">Remaining</p>
          <p className={`text-sm font-medium ${status.textColor}`}>
            {formatAmount(remaining)}
          </p>
        </div>
      </div>
    </div>
  )
}
