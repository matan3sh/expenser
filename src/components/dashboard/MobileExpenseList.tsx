'use client'

import { ExpenseAmount } from '@/components/expenses/ExpenseAmount'
import { getCategoryById } from '@/data/categories'
import { getRecentExpenses } from '@/data/expenses'
import { format } from 'date-fns'
import { ExpenseReceiptDialog } from '../expenses/ExpenseReceiptDialog'

export function MobileExpenseList() {
  const recentExpenses = getRecentExpenses(5)

  return (
    <div className="space-y-4 overflow-y-auto px-4 pb-4">
      <div className="space-y-3">
        {recentExpenses.map((expense) => {
          const category = getCategoryById(expense.categoryId)
          return (
            <ExpenseReceiptDialog key={expense.id} expense={expense}>
              <div className="bg-card hover:bg-accent rounded-lg p-4 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{expense.description}</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                      <p className="text-sm text-muted-foreground">
                        {category?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <ExpenseAmount
                      amount={expense.amount}
                      currency={expense.currency}
                      className="font-semibold"
                      originalAmountClassName="text-[10px] text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(expense.date), 'MMM d')}
                    </p>
                  </div>
                </div>
              </div>
            </ExpenseReceiptDialog>
          )
        })}
      </div>
    </div>
  )
}
