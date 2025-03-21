'use client'

import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { memo } from 'react'

interface ExpenseSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ExpenseSheet = memo(
  ({ open, onOpenChange }: ExpenseSheetProps) => {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          className="w-full sm:w-[540px] overflow-y-auto p-0"
          side="right"
        >
          <SheetHeader className="p-6 pb-2">
            <SheetTitle className="text-2xl font-bold">Add Expense</SheetTitle>
          </SheetHeader>
          <div className="p-6 pt-2">
            <ExpenseForm
              onSuccess={() => onOpenChange(false)}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    )
  }
)

ExpenseSheet.displayName = 'ExpenseSheet'
