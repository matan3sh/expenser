'use client'

import { ExpenseAmount } from '@/components/expenses/ExpenseAmount'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Expense } from '@/types/expense.types'
import { format } from 'date-fns'
import { Clock, FileText, MapPin, Pencil, Receipt, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ExpenseCardProps {
  expense: Expense
  children?: React.ReactNode
}

export function ExpenseCard({ expense, children }: ExpenseCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editForm, setEditForm] = useState({
    description: '',
    amount: 0,
    date: '',
    location: '',
    notes: '',
  })

  const categoryColor = expense.category?.color || '#64748b'

  const handleOpenReceipt = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(true)
  }

  const handleEditClick = () => {
    setIsDeleting(false)
    setEditForm({
      description: expense.description || '',
      amount: expense.amount,
      date: format(new Date(expense.date), 'yyyy-MM-dd'),
      location: expense.location || '',
      notes: expense.notes || '',
    })
    setIsEditing(true)
  }

  const handleDeleteClick = () => {
    setIsEditing(false)
    setIsDeleting(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleCancelDelete = () => {
    setIsDeleting(false)
  }

  const handleUpdateExpense = async () => {
    try {
      // Implement your update logic here
      // await updateExpense(expense.id, editForm)
      console.log('Updating expense:', expense.id, editForm)

      // Reset editing state after successful update
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update expense:', error)
    }
  }

  const handleDeleteExpense = async () => {
    try {
      // Implement your delete logic here
      // await deleteExpense(expense.id)
      console.log('Deleting expense:', expense.id)

      // Close the sheet after deletion
      setIsOpen(false)
      setIsDeleting(false)
    } catch (error) {
      console.error('Failed to delete expense:', error)
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
      {children ? (
        <div onClick={handleOpenReceipt}>{children}</div>
      ) : (
        <Card
          key={expense.id}
          className="w-full overflow-hidden border-0 shadow-md transition-all hover:shadow-lg cursor-pointer"
          onClick={handleOpenReceipt}
        >
          <div className="flex">
            <div className="w-1" style={{ backgroundColor: categoryColor }} />
            <div
              className="flex-1 p-4"
              style={{ backgroundColor: `${categoryColor}10` }}
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
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          className="p-0 flex flex-col h-[90vh] bg-white"
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

          {isEditing ? (
            // Edit Mode
            <div className="h-full flex flex-col">
              {/* Edit Form Header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Edit Expense</h2>
                </div>
              </div>

              {/* Edit Form Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      value={editForm.description}
                      onChange={handleInputChange}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      value={editForm.amount}
                      onChange={handleInputChange}
                      className="h-10"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={editForm.date}
                      onChange={handleInputChange}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={editForm.location}
                      onChange={handleInputChange}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      name="notes"
                      value={editForm.notes}
                      onChange={handleInputChange}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Edit Form Footer */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateExpense} className="flex-1 h-11">
                    Update
                  </Button>
                </div>
              </div>
            </div>
          ) : isDeleting ? (
            // Delete Confirmation Mode
            <div className="h-full flex flex-col">
              {/* Delete Confirmation Header */}
              <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-destructive">
                    Delete Expense
                  </h2>
                </div>
              </div>

              {/* Delete Confirmation Body */}
              <div className="flex-1 p-6">
                <div className="bg-destructive/10 p-4 rounded-lg mb-6 border border-destructive/20">
                  <p className="text-destructive font-medium mb-2">
                    Are you sure you want to delete this expense?
                  </p>
                  <p className="text-sm text-destructive/80">
                    <span className="font-semibold">{expense.description}</span>{' '}
                    - {format(new Date(expense.date), 'MMM d, yyyy')}
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
                  This action cannot be undone. This will permanently delete the
                  expense from your records.
                </p>
              </div>

              {/* Delete Confirmation Footer */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancelDelete}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteExpense}
                    className="flex-1 h-11"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // View Mode
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
                    onClick={handleEditClick}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit expense</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={handleDeleteClick}
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
                    <p className="text-sm uppercase text-gray-500 mb-1">
                      Total Amount
                    </p>
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
                      {format(
                        new Date(expense.date),
                        'EEEE, MMMM d, yyyy • h:mm a'
                      )}
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
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
