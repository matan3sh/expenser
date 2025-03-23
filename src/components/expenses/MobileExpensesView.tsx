'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Expense } from '@/types/expense.types'
import { Filter } from 'lucide-react'
import { ExpenseCard } from './expense-card/ExpenseCard'
import { FilterSheet } from './filter-sheet/FilterSheet'
import { useExpensesView } from './hooks/useExpensesView'

interface MobileExpensesViewProps {
  initialExpenses: {
    expenses: Expense[]
    totalPages: number
    totalExpenses: number
  }
}

export function MobileExpensesView({
  initialExpenses,
}: MobileExpensesViewProps) {
  const {
    filters,
    searchInput,
    isFilterSheetOpen,
    page,
    expenses,
    totalPages,
    handleSearchChange,
    handleFilterClick,
    handleFilterClose,
    handleFilterApply,
    handleFilterReset,
    handlePageChange,
  } = useExpensesView(initialExpenses)

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] w-full">
      {/* Fixed Header - Search and Filter */}
      <div className="flex-none w-full">
        <div className="flex gap-2 w-full px-4 py-2">
          <div className="flex-1">
            <Input
              placeholder="Search expenses..."
              value={searchInput}
              onChange={handleSearchChange}
              className="h-9 w-full"
            />
          </div>
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={handleFilterClick}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Scrollable Expenses List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-2">
            {expenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </div>
        </div>

        {/* Fixed Pagination */}
        <div className="flex-none border-t bg-background mt-2">
          <div className="flex items-center justify-between mt-2 px-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="h-8"
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="h-8"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <FilterSheet
        open={isFilterSheetOpen}
        filters={filters}
        onClose={handleFilterClose}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
      />
    </div>
  )
}
