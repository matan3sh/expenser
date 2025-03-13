'use client'

import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Expense } from '@/data/expenses'

interface ExpenseEditDialogProps {
  expense: Expense
  children: React.ReactNode
}

export function ExpenseEditDialog({
  expense,
  children,
}: ExpenseEditDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          initialData={{
            amount: expense.amount,
            currency: expense.currency,
            date: expense.date,
            description: expense.description,
            location: expense.location,
            category: expense.categoryId,
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
