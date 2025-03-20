'use client'

import { ExpenseAmount } from '@/components/expenses/ExpenseAmount'
import { Card } from '@/components/ui/card'
import { getCategoryById } from '@/data/categories'
import { Expense } from '@/types/expense.types'
import { format } from 'date-fns'
import { ExpenseReceiptDialog } from '../expenses/ExpenseReceiptDialog'

interface MobileExpenseListProps {
  expenses: Expense[]
}

export function MobileExpenseList({ expenses }: MobileExpenseListProps) {
  return (
    <div className="space-y-4">
      {expenses.map((expense) => {
        const category = getCategoryById(expense.categoryId ?? 'uncategorized')
        return (
          <Card key={expense.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category?.color }}
                  />
                  <h3 className="font-medium">{expense.description}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {expense.location}
                </p>
              </div>
              <ExpenseAmount
                amount={expense.amount}
                currency={expense.currency}
                className="font-medium"
                originalAmountClassName="text-[10px] text-muted-foreground"
              />
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
              <ExpenseReceiptDialog expense={expense}>
                <button className="text-sm text-primary hover:underline">
                  View Receipt
                </button>
              </ExpenseReceiptDialog>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
