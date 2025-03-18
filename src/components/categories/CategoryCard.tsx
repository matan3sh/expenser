'use client'

import { Card, CardHeader } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import type { Category } from '@/types/category'
import { useState } from 'react'
import { EditCategoryDialog } from './EditCategoryDialog'
import { ExpenseList } from './ExpenseList'

interface CategoryCardProps {
  category: Category & { totalExpenses?: number }
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { formatAmount } = useCurrencyFormat()
  const categoryColor = category.color || '#64748b'
  const formattedTotal = formatAmount(category.totalExpenses || 0)

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

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[66vh] h-[66vh] overflow-hidden rounded-t-xl p-0 bg-white"
        >
          <div className="receipt-container flex flex-col h-full">
            {/* Fixed header */}
            <div className="flex-shrink-0">
              <div className="w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-100 to-gray-100 zigzag"></div>
                <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2"></div>
              </div>

              <SheetHeader className="text-center pt-4 pb-2 border-b border-dashed border-gray-200 w-full px-6">
                <SheetTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <div
                    className="h-5 w-5 rounded-full"
                    style={{ backgroundColor: categoryColor }}
                  />
                  {category.name}
                </SheetTitle>
                <p className="text-xl font-semibold text-gray-700 mt-1">
                  {formattedTotal}
                </p>
              </SheetHeader>
            </div>

            {/* Scrollable expenses list */}
            <div className="flex-1 overflow-y-auto">
              <div className="receipt-body">
                <div className="receipt-expenses pb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 px-2">
                    Expense Details
                  </h3>
                  <ExpenseList categoryId={category.id} />
                </div>
              </div>
            </div>

            {/* Fixed footer */}
            <div className="flex-shrink-0">
              <div className="receipt-footer mt-4 pt-4 border-t border-dashed border-gray-200 flex flex-col items-center">
                <p className="text-sm text-gray-500 text-center mb-4">
                  Thank you for tracking your expenses
                </p>
                <div className="w-24 h-1 bg-gray-200 rounded-full mb-4"></div>
                <p className="text-xs text-gray-400 mb-2">Expenser App</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
