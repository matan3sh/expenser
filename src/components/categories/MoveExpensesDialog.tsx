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
import { useSettings } from '@/contexts/SettingsContext'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import { CategoryWithBudget } from '@/types/category.types'
import { format } from 'date-fns'
import { useState } from 'react'

interface MoveExpensesDialogProps {
  category: CategoryWithBudget
  categories: CategoryWithBudget[]
  expenses: CategoryWithBudget['expenses']
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
  const { settings } = useSettings()
  const { formatAmount } = useCurrencyFormat()
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])
  const [targetCategoryId, setTargetCategoryId] = useState<string>('')
  const availableCategories = categories.filter((c) => c.id !== category.id)

  const handleSelectExpense = (expenseId: string) => {
    setSelectedExpenses((prev) =>
      prev.includes(expenseId)
        ? prev.filter((id) => id !== expenseId)
        : [...prev, expenseId]
    )
  }

  const handleSelectAll = () => {
    if (!expenses) return

    if (selectedExpenses.length === expenses.length) {
      setSelectedExpenses([])
    } else {
      setSelectedExpenses(expenses.map((expense) => expense.id))
    }
  }

  const handleMove = async () => {
    if (!targetCategoryId || selectedExpenses.length === 0) return

    try {
      // Add your move expenses logic here
      // await moveExpenses(selectedExpenses, targetCategoryId)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to move expenses:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="p-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl">Move Expenses</DialogTitle>
          </DialogHeader>
        </div>

        <div className="flex flex-col h-[66vh]">
          <div className="p-6 space-y-4 border-b">
            <Select
              value={targetCategoryId}
              onValueChange={setTargetCategoryId}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select target category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSelectAll}
                >
                  {selectedExpenses.length === (expenses?.length || 0)
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedExpenses.length} selected
                </span>
              </div>

              <div className="space-y-2">
                {expenses?.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => handleSelectExpense(expense.id)}
                  >
                    <Checkbox
                      checked={selectedExpenses.includes(expense.id)}
                      onCheckedChange={() => handleSelectExpense(expense.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {expense.description || 'Untitled Expense'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(expense.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatAmount(
                          expense.currency === settings.displayCurrency?.code
                            ? expense.amount
                            : expense.converted?.amount || 0,
                          settings.displayCurrency?.code
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleMove}
                disabled={!targetCategoryId || selectedExpenses.length === 0}
                className="flex-1 h-12"
              >
                Move Selected
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
