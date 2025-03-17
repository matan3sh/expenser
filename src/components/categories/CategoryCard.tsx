'use client'

import { Card, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { expenses } from '@/data/expenses'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import type { Category } from '@/types/category'
import { useMemo, useState } from 'react'
import { EditCategoryDialog } from './EditCategoryDialog'
import { ExpenseList } from './ExpenseList'

interface CategoryCardProps {
  category: Category
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { formatAmount, convertToDisplayCurrency } = useCurrencyFormat()

  // Calculate total expenses for this category
  const totalExpenses = useMemo(() => {
    return expenses
      .filter((expense) => expense.categoryId === category.id)
      .reduce((sum, expense) => {
        return sum + convertToDisplayCurrency(expense.amount, expense.currency)
      }, 0)
  }, [category.id, convertToDisplayCurrency])

  const formattedTotal = formatAmount(totalExpenses)
  const categoryColor = category.color || '#64748b'

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
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Total: {formattedTotal}
                </p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <EditCategoryDialog category={category} />
              </div>
            </CardHeader>
          </div>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: categoryColor }}
              />
              {category.name} Expenses
            </DialogTitle>
          </DialogHeader>
          <ExpenseList categoryId={category.id} />
        </DialogContent>
      </Dialog>
    </>
  )
}
