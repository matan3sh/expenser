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
      {/* Fixed Header - Search, Filter, and Pagination */}
      <div className="flex-none w-full border-b">
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

        {/* Minimalistic Pagination */}
        <div className="flex items-center justify-between px-4 py-1 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="h-7 px-2"
          >
            ←
          </Button>
          <span className="text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="h-7 px-2"
          >
            →
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-2">
          {expenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
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
