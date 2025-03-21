'use client'

import { Card, CardHeader } from '@/components/ui/card'
import { Sheet } from '@/components/ui/sheet'
import { useSettings } from '@/contexts/SettingsContext'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import { isSameCurrency } from '@/lib/utils/expense.utils'
import { CategoryWithBudget } from '@/types/category.types'
import React, { useMemo, useState } from 'react'
import { BudgetProgress } from '../BudgetProgress'
import { CategoryMenu } from '../CategoryMenu'
import CategorySheetContent from './CategorySheetContent'

interface CategoryCardProps {
  category: CategoryWithBudget
  expenses: CategoryWithBudget['expenses']
  categories: CategoryWithBudget[]
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  expenses,
  categories,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { formatAmount } = useCurrencyFormat()
  const { settings } = useSettings()
  const categoryColor = category.color || '#64748b'

  // Calculate total amount for the selected month with proper currency conversion
  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, expense) => {
      if (isSameCurrency(expense.currency, settings)) {
        return sum + expense.amount
      } else {
        return sum + (expense.converted?.amount || 0)
      }
    }, 0)
  }, [expenses, settings])

  return (
    <>
      <Card
        className="w-full overflow-hidden border-0 shadow-md transition-all hover:shadow-lg cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex">
          <div className="w-1" style={{ backgroundColor: categoryColor }} />
          <div
            className="flex-1"
            style={{ backgroundColor: `${categoryColor}10` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight">
                  {category.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Total:{' '}
                  {formatAmount(totalAmount, settings.displayCurrency?.code)}
                </p>

                {category.budget?.amount && category.budget?.amount > 0 && (
                  <BudgetProgress
                    totalAmount={totalAmount}
                    budget={category.budget?.amount}
                    formatAmount={formatAmount}
                  />
                )}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <CategoryMenu
                  category={category}
                  categories={categories}
                  expenses={expenses}
                />
              </div>
            </CardHeader>
          </div>
        </div>
      </Card>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <CategorySheetContent
          category={category}
          expenses={expenses}
          totalAmount={totalAmount}
          formatAmount={formatAmount}
          displayCurrency={settings.displayCurrency?.code}
        />
      </Sheet>
    </>
  )
}
