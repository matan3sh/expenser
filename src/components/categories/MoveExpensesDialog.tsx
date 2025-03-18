'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Category } from '@/types/category'
import type { Expense } from '@/types/expense'
import { useState } from 'react'

interface MoveExpensesDialogProps {
  category: Category
  categories: Category[]
  expenses: Expense[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const MoveExpensesDialog: React.FC<MoveExpensesDialogProps> = ({
  category,
  categories,
  expenses,
  open,
  onOpenChange,
}) => {
  const [selectedExpenses, setSelectedExpenses] = useState<Set<string>>(
    new Set()
  )
  const [targetCategoryId, setTargetCategoryId] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetCategoryId || selectedExpenses.size === 0) return

    try {
      // Add your move logic here
      console.log(
        `Moving ${selectedExpenses.size} expenses to category ${targetCategoryId}`
      )
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to move expenses:', error)
    }
  }

  const toggleExpense = (expenseId: string) => {
    const newSelected = new Set(selectedExpenses)
    if (newSelected.has(expenseId)) {
      newSelected.delete(expenseId)
    } else {
      newSelected.add(expenseId)
    }
    setSelectedExpenses(newSelected)
  }

  const toggleAll = () => {
    if (selectedExpenses.size === expenses.length) {
      setSelectedExpenses(new Set())
    } else {
      setSelectedExpenses(new Set(expenses.map((e) => e.id)))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Move Expenses</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedExpenses.size === expenses.length}
                onCheckedChange={toggleAll}
              />
              <label
                htmlFor="select-all"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Select all expenses
              </label>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={expense.id}
                    checked={selectedExpenses.has(expense.id)}
                    onCheckedChange={() => toggleExpense(expense.id)}
                  />
                  <label
                    htmlFor={expense.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {expense.description} - {expense.amount} {expense.currency}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Move to category</label>
            <Select
              value={targetCategoryId}
              onValueChange={setTargetCategoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => c.id !== category.id)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={selectedExpenses.size === 0 || !targetCategoryId}
            >
              Move {selectedExpenses.size} expenses
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
