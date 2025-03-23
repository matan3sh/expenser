'use client'

import { ExpenseAmount } from '@/components/expenses/ExpenseAmount'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Expense } from '@/types/expense.types'
import { format } from 'date-fns'
import { Pencil } from 'lucide-react'
import React, { memo } from 'react'

interface ExpenseItemProps {
  expense: Expense
  isEditing: boolean
  editForm: {
    description: string
    amount: number
    date: string
    location?: string
  }
  onEditClick: (expense: Expense) => void
  onCancelEdit: () => void
  onUpdateExpense: () => void
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
}

const ExpenseItem = ({
  expense,
  isEditing,
  editForm,
  onEditClick,
  onCancelEdit,
  onUpdateExpense,
  onInputChange,
}: ExpenseItemProps) => {
  return (
    <div
      className={`rounded-lg border border-border transition-all ${
        isEditing ? 'bg-accent/10 p-4' : 'p-4 bg-card shadow-sm hover:shadow'
      }`}
    >
      {isEditing ? (
        // Editing mode
        <div className="space-y-3">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="description" className="text-xs font-medium">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              value={editForm.description}
              onChange={onInputChange}
              className="h-10 text-base"
              placeholder="What did you spend on?"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="amount" className="text-xs font-medium">
              Amount
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={editForm.amount}
              onChange={onInputChange}
              className="h-10 text-base"
              step="0.01"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="date" className="text-xs font-medium">
              Date
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={editForm.date}
              onChange={onInputChange}
              className="h-10 text-base"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="location" className="text-xs font-medium">
              Location (Optional)
            </Label>
            <Input
              id="location"
              name="location"
              value={editForm.location || ''}
              onChange={onInputChange}
              className="h-10 text-base"
              placeholder="Where did you spend?"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancelEdit}
              className="h-10 px-4"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onUpdateExpense}
              className="h-10 px-4"
            >
              Update
            </Button>
          </div>
        </div>
      ) : (
        // View mode - Receipt item style
        <div className="receipt-item">
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-2">
              <p className="text-base font-medium">
                {expense.description || 'Untitled Expense'}
              </p>
              {expense.location && (
                <p className="text-xs text-muted-foreground">
                  {expense.location}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </p>
            </div>

            <div className="flex items-center">
              <div className="text-right mr-2 font-mono">
                <ExpenseAmount
                  amount={expense.amount}
                  currency={expense.currency}
                  converted={expense.converted}
                  className="font-medium"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditClick(expense)
                }}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit expense</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ExpenseItem)
