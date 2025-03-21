import { ExpenseAmount } from '@/components/expenses/ExpenseAmount'
import { Button } from '@/components/ui/button'
import { Expense } from '@/types/expense.types'
import { format } from 'date-fns'
import { Clock, FileText, MapPin, Pencil, Receipt, Trash2 } from 'lucide-react'

interface ExpenseReceiptProps {
  expense: Expense
  onEdit: () => void
  onDelete: () => void
}

export function ExpenseReceipt({
  expense,
  onEdit,
  onDelete,
}: ExpenseReceiptProps) {
  const categoryColor = expense.category?.color || '#64748b'

  return (
    <>
      {/* Receipt top edge with perforation */}
      <div className="flex items-center justify-center w-full h-6 relative">
        <div className="absolute top-2 left-0 right-0 border-b border-dashed border-gray-200"></div>
        <div className="w-12 h-4 bg-white rounded-b-lg relative z-10 drop-shadow-sm"></div>
      </div>

      {/* Receipt Logo/Header */}
      <div className="px-6 pt-3 pb-4 flex flex-col items-center border-b border-dashed border-gray-200 relative">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <Receipt className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-1 text-center">
          {expense.description}
        </h2>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {expense.location}
        </p>

        {/* Action Buttons - positioned absolutely */}
        <div className="absolute right-4 top-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit expense</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete expense</span>
          </Button>
        </div>
      </div>

      {/* Receipt Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
        <div className="space-y-6">
          {/* Amount Section */}
          <div className="flex flex-col items-center py-4 border-b border-dashed border-gray-200">
            <p className="text-sm uppercase text-gray-500 mb-1">Total Amount</p>
            <div className="scale-125 mb-1">
              <ExpenseAmount
                amount={expense.amount}
                currency={expense.currency}
                converted={expense.converted}
                className="font-bold"
              />
            </div>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {format(new Date(expense.date), 'EEEE, MMMM d, yyyy • h:mm a')}
            </div>
          </div>

          {/* Category Section */}
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-gray-200">
            <div className="text-sm text-gray-500">Category</div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryColor }}
              />
              <p className="font-medium">
                {expense.category?.title || 'Uncategorized'}
              </p>
            </div>
          </div>

          {/* Notes Section (if present) */}
          {expense.notes && (
            <div className="pb-3 border-b border-dashed border-gray-200">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                <FileText className="w-4 h-4" />
                <span>Notes</span>
              </div>
              <p className="text-sm bg-gray-50 p-3 rounded-lg italic">
                &ldquo;{expense.notes}&rdquo;
              </p>
            </div>
          )}

          {/* Receipt Image (if present) */}
          {expense.receipt && (
            <div className="pb-3 border-b border-dashed border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Receipt className="w-4 h-4" />
                  <span>Receipt Image</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <img
                  src={expense.receipt}
                  alt="Receipt"
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Payment Method (placeholder - if you have this data) */}
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-gray-200">
            <div className="text-sm text-gray-500">Payment Method</div>
            <p className="font-medium">Credit Card</p>
          </div>

          {/* Transaction ID (placeholder - if you have this data) */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Transaction ID</div>
            <p className="font-mono text-xs text-gray-600">
              {expense.id.substring(0, 12).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Receipt Footer */}
      <div className="flex-shrink-0 bg-white">
        <div className="pt-2 pb-6 border-t border-dashed border-gray-200 flex flex-col items-center">
          <div className="flex flex-col items-center mt-3">
            <div className="flex gap-1 mb-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-1 bg-gray-300 rounded-full opacity-70"
                ></div>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Expenser • {format(new Date(), 'yyyy')}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
