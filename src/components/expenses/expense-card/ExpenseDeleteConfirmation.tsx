import { ExpenseAmount } from '@/components/expenses/ExpenseAmount'
import { Button } from '@/components/ui/button'
import { Expense } from '@/types/expense.types'
import { format } from 'date-fns'

interface ExpenseDeleteConfirmationProps {
  expense: Expense
  onCancel: () => void
  onConfirm: () => void
}

export function ExpenseDeleteConfirmation({
  expense,
  onCancel,
  onConfirm,
}: ExpenseDeleteConfirmationProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Delete Confirmation Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-destructive">Delete Expense</h2>
        </div>
      </div>

      {/* Delete Confirmation Body */}
      <div className="flex-1 p-6">
        <div className="bg-destructive/10 p-4 rounded-lg mb-6 border border-destructive/20">
          <p className="text-destructive font-medium mb-2">
            Are you sure you want to delete this expense?
          </p>
          <p className="text-sm text-destructive/80">
            <span className="font-semibold">{expense.description}</span> -{' '}
            {format(new Date(expense.date), 'MMM d, yyyy')}
          </p>
          <div className="text-sm text-destructive/80 mt-1">
            <ExpenseAmount
              amount={expense.amount}
              currency={expense.currency}
              converted={expense.converted}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          This action cannot be undone. This will permanently delete the expense
          from your records.
        </p>
      </div>

      {/* Delete Confirmation Footer */}
      <div className="border-t border-border p-6">
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 h-11">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex-1 h-11"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
