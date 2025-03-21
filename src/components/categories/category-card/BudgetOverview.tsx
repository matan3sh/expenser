'use client'

import { memo } from 'react'

interface BudgetOverviewProps {
  totalAmount: number
  budget: number
  formatAmount: (amount: number, currency?: string) => string
  displayCurrency?: string
}

const BudgetOverview = ({
  totalAmount,
  budget,
  formatAmount,
  displayCurrency = 'USD',
}: BudgetOverviewProps) => {
  // Calculate budget related metrics
  const percentage = Math.round((totalAmount / budget) * 100)
  const remaining = Math.max(0, budget - totalAmount)
  const isOverBudget = totalAmount > budget

  return (
    <div className="budget-section p-4 pb-5 border-b border-dashed border-gray-200 bg-white">
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium text-gray-700">Monthly Budget</h3>
          <span className="text-sm font-medium">
            {formatAmount(budget, displayCurrency)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 mb-2">
          <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full ${
                percentage > 90
                  ? 'bg-red-500'
                  : percentage > 70
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, percentage)}%`,
                transition: 'width 0.5s ease-out',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1) inset',
              }}
            />
            {/* Percentage Label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-700">
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Amounts Info */}
        <div className="flex justify-between mt-3 text-sm">
          <div className="flex flex-col items-start">
            <span className="text-gray-500 text-xs">Spent</span>
            <span className="font-semibold text-gray-900">
              {formatAmount(totalAmount, displayCurrency)}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-500 text-xs">Remaining</span>
            <span
              className={`font-semibold ${
                isOverBudget ? 'text-red-600' : 'text-emerald-600'
              }`}
            >
              {formatAmount(remaining, displayCurrency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(BudgetOverview)
