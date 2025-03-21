'use client'

import { Button } from '@/components/ui/button'
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CategoryWithBudget } from '@/types/category.types'
import { Expense } from '@/types/expense.types'
import { format } from 'date-fns'
import { X } from 'lucide-react'
import React, { useState } from 'react'
import BudgetOverview from './BudgetOverview'
import ExpenseItem from './ExpenseItem'
import ReceiptFooter from './ReceiptFooter'

interface CategorySheetContentProps {
  category: CategoryWithBudget
  expenses: Expense[]
  totalAmount: number
  displayCurrency?: string
  formatAmount: (amount: number, currency?: string) => string
}

const CategorySheetContent = ({
  category,
  expenses,
  totalAmount,
  displayCurrency = 'USD',
  formatAmount,
}: CategorySheetContentProps) => {
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
          <BudgetOverview
            totalAmount={totalAmount}
            budget={category.budget.amount}
            formatAmount={formatAmount}
            displayCurrency={displayCurrency}
          />
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
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  isEditing={editingExpenseId === expense.id}
                  editForm={editForm}
                  onEditClick={handleEditClick}
                  onCancelEdit={handleCancelEdit}
                  onUpdateExpense={handleUpdateExpense}
                  onInputChange={handleInputChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Receipt Footer */}
        <ReceiptFooter
          totalAmount={totalAmount}
          itemCount={expenses.length}
          formatAmount={formatAmount}
          displayCurrency={displayCurrency}
        />
      </div>
    </SheetContent>
  )
}

export default CategorySheetContent
