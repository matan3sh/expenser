'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useSettings } from '@/contexts/SettingsContext'
import { categories, getCategoryById } from '@/data/categories'
import { formatCurrency } from '@/data/currencies'
import { expenses } from '@/data/expenses'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Filter } from 'lucide-react'
import { useState } from 'react'
import { ExpenseEditDialog } from './ExpenseEditDialog'
import { ExpenseReceiptDialog } from './ExpenseReceiptDialog'

export function MobileExpensesView() {
  const { convertAmount, settings } = useSettings()
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  })
  const [page, setPage] = useState(1)
  const pageSize = 10
  const totalPages = Math.ceil(expenses.length / pageSize)

  const paginatedExpenses = expenses.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  // Helper function to safely format currency
  const safeFormatCurrency = (amount: number, currency: string = 'USD') => {
    if (!settings?.displayCurrency?.code) {
      return formatCurrency(amount, currency)
    }
    return formatCurrency(
      convertAmount(amount, currency),
      settings.displayCurrency.code
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Filters Section - Fixed at top */}
      <Card className="mx-4 p-3 mb-3">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="h-9"
          />

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex-1 h-9">
                  <Filter className="w-4 h-4 mr-2" />
                  {filters.category
                    ? getCategoryById(filters.category)?.name
                    : 'Category'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onSelect={() =>
                      setFilters({ ...filters, category: category.id })
                    }
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'justify-start text-left font-normal flex-1 h-9',
                    !filters.dateFrom && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, 'PPP') : 'Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) =>
                    setFilters({ ...filters, dateFrom: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Card>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Scrollable Expenses List */}
        <div className="flex-1 overflow-y-auto space-y-2 px-4 pb-4">
          {paginatedExpenses.map((expense) => {
            const category = getCategoryById(expense.categoryId)
            return (
              <Card key={expense.id} className="p-3">
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                      <h3 className="font-medium text-sm">
                        {expense.description}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {expense.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      {safeFormatCurrency(expense.amount, expense.currency)}
                    </p>
                    {settings?.displayCurrency?.code !== expense.currency && (
                      <p className="text-[10px] text-muted-foreground">
                        ({formatCurrency(expense.amount, expense.currency)})
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                    {expense.notes && (
                      <span className="text-[10px]">• {expense.notes}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <ExpenseReceiptDialog expense={expense}>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        View
                      </Button>
                    </ExpenseReceiptDialog>
                    <ExpenseEditDialog expense={expense}>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        Edit
                      </Button>
                    </ExpenseEditDialog>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Fixed Pagination */}
        <div className="flex items-center justify-between py-3 px-4 border-t bg-background">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-8"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
