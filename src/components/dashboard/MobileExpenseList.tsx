'use client'

import { ExpenseAmount } from '@/components/expenses/ExpenseAmount'
import { Card } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Expense } from '@/types/expense.types'
import { format } from 'date-fns'
import { useState } from 'react'

interface MobileExpenseListProps {
  expenses: Expense[]
}

export function MobileExpenseList({ expenses }: MobileExpenseListProps) {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenReceipt = (expense: Expense, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedExpense(expense)
    setIsOpen(true)
  }

  return (
    <>
      <div className="space-y-4 py-2">
        {expenses.map((expense) => {
          const categoryColor = expense.category?.color || '#64748b'

          return (
            <Card
              key={expense.id}
              className="w-full overflow-hidden border-0 shadow-md transition-all hover:shadow-lg"
            >
              <div className="flex">
                <div
                  className="w-1"
                  style={{ backgroundColor: categoryColor }}
                />
                <div
                  className="flex-1 p-4"
                  style={{ backgroundColor: `${categoryColor}10` }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold tracking-tight">
                          {expense.description}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {expense.location}
                      </p>
                    </div>
                    <ExpenseAmount
                      amount={expense.amount}
                      currency={expense.currency}
                      converted={expense.converted}
                      className="font-medium"
                      originalAmountClassName="text-[10px] text-muted-foreground"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
                      onClick={(e) => handleOpenReceipt(expense, e)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"></path>
                        <line x1="16" x2="16" y1="4" y2="6"></line>
                        <line x1="8" x2="8" y1="4" y2="6"></line>
                        <line x1="3" x2="21" y1="11" y2="11"></line>
                      </svg>
                      View
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Receipt Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[80vh] h-[80vh] overflow-hidden rounded-t-xl p-0 bg-white"
        >
          {selectedExpense && (
            <div className="receipt-container flex flex-col h-full">
              <div className="flex-shrink-0">
                <div className="w-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-100 to-gray-100 zigzag"></div>
                  <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2"></div>
                </div>

                <SheetHeader className="text-center pt-4 pb-2 border-b border-dashed border-gray-200 w-full px-6">
                  <SheetTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                    <div
                      className="h-5 w-5 rounded-full"
                      style={{
                        backgroundColor:
                          selectedExpense.category?.color || '#64748b',
                      }}
                    />
                    {selectedExpense.description}
                  </SheetTitle>
                  <ExpenseAmount
                    amount={selectedExpense.amount}
                    currency={selectedExpense.currency}
                    converted={selectedExpense.converted}
                    className="text-xl font-semibold text-gray-700 mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(selectedExpense.date), 'MMMM d, yyyy')}
                  </p>
                </SheetHeader>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="receipt-body">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Location
                    </h3>
                    <p className="text-base">{selectedExpense.location}</p>
                  </div>

                  {selectedExpense.notes && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Notes
                      </h3>
                      <p className="text-base">{selectedExpense.notes}</p>
                    </div>
                  )}

                  {selectedExpense.receipt && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Receipt Image
                      </h3>
                      <div className="border border-dashed border-gray-200 rounded-lg p-2">
                        <img
                          src={selectedExpense.receipt}
                          alt="Receipt"
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="receipt-footer mt-4 pt-4 border-t border-dashed border-gray-200 flex flex-col items-center">
                  <p className="text-sm text-gray-500 text-center mb-4">
                    Thank you for tracking your expenses
                  </p>
                  <div className="w-24 h-1 bg-gray-200 rounded-full mb-4"></div>
                  <p className="text-xs text-gray-400 mb-4">Expenser App</p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
