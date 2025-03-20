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
import { categories, getCategoryById } from '@/data/categories'
import { cn } from '@/lib/utils'
import { Expense } from '@/types/expense.types'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Filter } from 'lucide-react'
import { useState } from 'react'
import { ExpenseAmount } from './ExpenseAmount'

interface MobileExpensesViewProps {
  expenses: Expense[]
}

export function MobileExpensesView({ expenses }: MobileExpensesViewProps) {
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

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Fixed Header - Filters */}
      <div className="flex-none">
        <Card className="mx-4 p-3 mb-3">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Search expenses..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
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
                    {filters.dateFrom
                      ? format(filters.dateFrom, 'PPP')
                      : 'Date'}
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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Scrollable Expenses List */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-2">
            {paginatedExpenses.map((expense) => {
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

                      <div className="mt-2 text-sm text-muted-foreground">
                        {format(new Date(expense.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Fixed Pagination */}
        <div className="flex-none border-t bg-background mt-2">
          <div className="flex items-center justify-between mt-2 px-4">
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
    </div>
  )
}
