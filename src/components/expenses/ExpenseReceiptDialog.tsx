'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useSettings } from '@/contexts/SettingsContext'
import { getCategoryById } from '@/data/categories'
import { formatCurrency } from '@/data/currencies'
import { Expense } from '@/types/expense.types'
import { format } from 'date-fns'
import { Receipt } from 'lucide-react'

interface ExpenseReceiptDialogProps {
  expense: Expense
  children: React.ReactNode
}

export function ExpenseReceiptDialog({
  expense,
  children,
}: ExpenseReceiptDialogProps) {
  const { settings } = useSettings()
  const category = getCategoryById(expense.categoryId)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-4 border-b">
          <DialogTitle className="flex items-center justify-center gap-2">
            <Receipt className="h-5 w-5" />
            Expense Receipt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date and ID */}
          <div className="text-center space-y-1">
            <div className="text-sm text-muted-foreground">
              {format(new Date(expense.date), 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="text-xs text-muted-foreground">
              Receipt #{expense.id.slice(0, 8)}
            </div>
          </div>

          {/* Main Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Description</span>
              <span className="text-sm font-medium text-right">
                {expense.description}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Category</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category?.color }}
                />
                <span className="text-sm font-medium">{category?.name}</span>
              </div>
            </div>

            {expense.location && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="text-sm font-medium">{expense.location}</span>
              </div>
            )}

            {expense.notes && (
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">Notes</span>
                <span className="text-sm font-medium max-w-[60%] text-right">
                  {expense.notes}
                </span>
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount</span>
              <div className="text-right">
                <div className="font-semibold">
                  {settings?.displayCurrency?.code
                    ? formatCurrency(
                        expense.amount,
                        settings.displayCurrency.code
                      )
                    : formatCurrency(expense.amount, expense.currency)}
                </div>
                {expense.converted && (
                  <div className="text-sm text-muted-foreground">
                    ({expense.converted.symbol}
                    {expense.converted.amount})
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
