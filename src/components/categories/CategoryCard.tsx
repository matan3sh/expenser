'use client'

import { ExpenseAmount } from '@/components/expenses/ExpenseAmount'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useSettings } from '@/contexts/SettingsContext'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import { isSameCurrency } from '@/lib/utils/expense.utils'
import { CategoryWithBudget } from '@/types/category.types'
import { Expense } from '@/types/expense.types'
import { format } from 'date-fns'
import { Pencil, X } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { BudgetProgress } from './BudgetProgress'
import { CategoryMenu } from './CategoryMenu'

interface CategoryCardProps {
  category: CategoryWithBudget
  expenses: CategoryWithBudget['expenses']
  categories: CategoryWithBudget[]
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  expenses,
  categories,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { formatAmount } = useCurrencyFormat()
  const { settings } = useSettings()
  const categoryColor = category.color || '#64748b'
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    description: string
    amount: number
    date: string
    location?: string
  }>({
    description: '',
    amount: 0,
    date: '',
    location: '',
  })

  // Calculate total amount for the selected month with proper currency conversion
  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, expense) => {
      if (isSameCurrency(expense.currency, settings)) {
        return sum + expense.amount
      } else {
        return sum + (expense.converted?.amount || 0)
      }
    }, 0)
  }, [expenses, settings])

  const handleEditClick = (expense: Expense) => {
    setEditingExpenseId(expense.id)
    setEditForm({
      description: expense.description || '',
      amount: expense.amount,
      date: format(new Date(expense.date), 'yyyy-MM-dd'),
      location: expense.location || '',
    })
  }

  const handleCancelEdit = () => {
    setEditingExpenseId(null)
  }

  const handleUpdateExpense = async () => {
    if (!editingExpenseId) return

    try {
      // Implement your update logic here
      // await updateExpense(editingExpenseId, editForm)
      console.log('Updating expense:', editingExpenseId, editForm)

      // Reset editing state after successful update
      setEditingExpenseId(null)
    } catch (error) {
      console.error('Failed to update expense:', error)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }))
  }

  return (
    <>
      <Card
        className="w-full overflow-hidden border-0 shadow-md transition-all hover:shadow-lg cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex">
          <div className="w-1" style={{ backgroundColor: categoryColor }} />
          <div
            className="flex-1"
            style={{ backgroundColor: `${categoryColor}10` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight">
                  {category.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Total:{' '}
                  {formatAmount(totalAmount, settings.displayCurrency?.code)}
                </p>

                {category.budget?.amount && category.budget?.amount > 0 && (
                  <BudgetProgress
                    totalAmount={totalAmount}
                    budget={category.budget?.amount}
                    formatAmount={formatAmount}
                  />
                )}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <CategoryMenu
                  category={category}
                  categories={categories}
                  expenses={expenses}
                />
              </div>
            </CardHeader>
          </div>
        </div>
      </Card>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          className="h-[85vh] max-h-screen p-0 bg-gray-50"
          side="bottom"
        >
          <div className="receipt-container flex flex-col h-full overflow-hidden bg-white rounded-t-xl shadow-top">
            {/* Custom close button */}
            <div className="absolute right-4 top-4 z-20">
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </div>

            {/* Pull indicator - mobile app style */}
            <div className="w-full flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Receipt Header */}
            <SheetHeader className="border-b border-dashed border-gray-200 py-4 px-6 bg-white sticky top-0 z-10">
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${categoryColor}30` }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: categoryColor }}
                  />
                </div>
                <SheetTitle className="text-xl font-bold">
                  {category.title || 'Uncategorized'}
                </SheetTitle>
                <SheetDescription className="text-sm mt-1">
                  {format(new Date(), 'MMMM yyyy')} • {expenses.length} expense
                  {expenses.length !== 1 ? 's' : ''}
                </SheetDescription>
              </div>
            </SheetHeader>

            {/* Budget Overview Section */}
            {category.budget?.amount && category.budget?.amount > 0 && (
              <div className="budget-section p-4 pb-5 border-b border-dashed border-gray-200 bg-white">
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium text-gray-700">
                      Monthly Budget
                    </h3>
                    <span className="text-sm font-medium">
                      {formatAmount(
                        category.budget.amount,
                        settings.displayCurrency?.code
                      )}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 mb-2">
                    <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${
                          totalAmount / category.budget.amount > 0.9
                            ? 'bg-red-500'
                            : totalAmount / category.budget.amount > 0.7
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (totalAmount / category.budget.amount) * 100
                          )}%`,
                          transition: 'width 0.5s ease-out',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1) inset',
                        }}
                      />
                      {/* Percentage Label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-700">
                          {Math.round(
                            (totalAmount / category.budget.amount) * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amounts Info */}
                  <div className="flex justify-between mt-3 text-sm">
                    <div className="flex flex-col items-start">
                      <span className="text-gray-500 text-xs">Spent</span>
                      <span className="font-semibold text-gray-900">
                        {formatAmount(
                          totalAmount,
                          settings.displayCurrency?.code
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-gray-500 text-xs">Remaining</span>
                      <span
                        className={`font-semibold ${
                          category.budget.amount - totalAmount < 0
                            ? 'text-red-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {formatAmount(
                          Math.max(0, category.budget.amount - totalAmount),
                          settings.displayCurrency?.code
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Receipt Body */}
            <div className="flex-1 overflow-auto bg-gray-50">
              {expenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No expenses in this category
                </div>
              ) : (
                <div className="space-y-2 p-3">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className={`rounded-lg border border-gray-100 transition-all ${
                        editingExpenseId === expense.id
                          ? 'bg-accent/10 p-4'
                          : 'p-4 bg-white shadow-sm hover:shadow'
                      }`}
                    >
                      {editingExpenseId === expense.id ? (
                        // Editing mode
                        <div className="space-y-3">
                          <div className="flex flex-col space-y-2">
                            <Label
                              htmlFor="description"
                              className="text-xs font-medium"
                            >
                              Description
                            </Label>
                            <Input
                              id="description"
                              name="description"
                              value={editForm.description}
                              onChange={handleInputChange}
                              className="h-10 text-base"
                              placeholder="What did you spend on?"
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <Label
                              htmlFor="amount"
                              className="text-xs font-medium"
                            >
                              Amount
                            </Label>
                            <Input
                              id="amount"
                              name="amount"
                              type="number"
                              value={editForm.amount}
                              onChange={handleInputChange}
                              className="h-10 text-base"
                              step="0.01"
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <Label
                              htmlFor="date"
                              className="text-xs font-medium"
                            >
                              Date
                            </Label>
                            <Input
                              id="date"
                              name="date"
                              type="date"
                              value={editForm.date}
                              onChange={handleInputChange}
                              className="h-10 text-base"
                            />
                          </div>

                          <div className="flex flex-col space-y-2">
                            <Label
                              htmlFor="location"
                              className="text-xs font-medium"
                            >
                              Location (Optional)
                            </Label>
                            <Input
                              id="location"
                              name="location"
                              value={editForm.location || ''}
                              onChange={handleInputChange}
                              className="h-10 text-base"
                              placeholder="Where did you spend?"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleCancelEdit}
                              className="h-10 px-4"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleUpdateExpense}
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
                                  handleEditClick(expense)
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
                  ))}
                </div>
              )}
            </div>

            {/* Receipt Footer */}
            <SheetFooter className="border-t border-dashed border-gray-200 py-4 px-6 sticky bottom-0 bg-white shadow-lg">
              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-500">Total Items</div>
                  <div className="font-medium">{expenses.length}</div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <div className="text-base font-semibold text-gray-700">
                    TOTAL
                  </div>
                  <div className="text-xl font-bold font-mono text-gray-900">
                    {formatAmount(totalAmount, settings.displayCurrency?.code)}
                  </div>
                </div>
              </div>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
