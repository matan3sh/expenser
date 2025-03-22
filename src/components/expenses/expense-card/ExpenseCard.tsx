'use client'

import { ExpenseAmount } from '@/components/expenses/ExpenseAmount'
import { ExpenseDeleteConfirmation } from '@/components/expenses/expense-card/ExpenseDeleteConfirmation'
import { ExpenseEditForm } from '@/components/expenses/expense-card/ExpenseEditForm'
import { ExpenseReceipt } from '@/components/expenses/expense-card/ExpenseReceipt'
import { Card } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useExpenseCard } from '@/hooks/useExpenseCard'
import { ExpenseCardProps } from '@/types/expense-card.types'
import { format } from 'date-fns'

export function ExpenseCard({ expense, children }: ExpenseCardProps) {
  const { state, handlers } = useExpenseCard({ expense })
  const categoryColor = expense.category?.color || '#64748b'

  return (
    <>
      {children ? (
        <div onClick={handlers.handleOpenReceipt}>{children}</div>
      ) : (
        <Card
          key={expense.id}
          className="w-full overflow-hidden border-0 shadow-md transition-all hover:shadow-lg cursor-pointer bg-background"
          onClick={handlers.handleOpenReceipt}
        >
          <div className="flex">
            <div className="w-1" style={{ backgroundColor: categoryColor }} />
            <div
              className="flex-1 p-4"
              style={{
                backgroundColor: `color-mix(in srgb, ${categoryColor} 10%, var(--background))`,
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {expense.description}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {expense.location}
                  </p>
                </div>

                <div>
                  <ExpenseAmount
                    amount={expense.amount}
                    currency={expense.currency}
                    converted={expense.converted}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Receipt Drawer */}
      <Sheet open={state.isOpen} onOpenChange={handlers.setIsOpen}>
        <SheetContent
          className="p-0 flex flex-col h-[95vh] bg-background"
          side="bottom"
          style={{
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Required for accessibility */}
          <SheetHeader className="sr-only">
            <SheetTitle>Expense Receipt</SheetTitle>
          </SheetHeader>

          {state.isEditing ? (
            <ExpenseEditForm
              editForm={state.editForm}
              onInputChange={handlers.handleInputChange}
              onCancel={handlers.handleCancelEdit}
              onUpdate={handlers.handleUpdateExpense}
            />
          ) : state.isDeleting ? (
            <ExpenseDeleteConfirmation
              expense={expense}
              onCancel={handlers.handleCancelDelete}
              onConfirm={handlers.handleDeleteExpense}
            />
          ) : (
            <ExpenseReceipt
              expense={expense}
              onEdit={handlers.handleEditClick}
              onDelete={handlers.handleDeleteClick}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
