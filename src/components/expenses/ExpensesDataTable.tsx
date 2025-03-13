'use client'

import { ExpenseReceiptDialog } from '@/components/expenses/ExpenseReceiptDialog'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSettings } from '@/contexts/SettingsContext'
import { categories, getCategoryById } from '@/data/categories'
import { formatCurrency } from '@/data/currencies'
import { expenses } from '@/data/expenses'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useState } from 'react'

export function ExpensesDataTable() {
  const { convertAmount, settings } = useSettings()
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  })
  const [page, setPage] = useState(1)
  const pageSize = 5
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
    <Card className="p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Search expenses..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="max-w-xs"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
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
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !filters.dateFrom && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFrom ? format(filters.dateFrom, 'PPP') : 'From date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateFrom}
              onSelect={(date) => setFilters({ ...filters, dateFrom: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal',
                !filters.dateTo && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateTo ? format(filters.dateTo, 'PPP') : 'To date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateTo}
              onSelect={(date) => setFilters({ ...filters, dateTo: date })}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedExpenses.map((expense) => {
            const category = getCategoryById(expense.categoryId)
            return (
              <ExpenseReceiptDialog key={expense.id} expense={expense}>
                <TableRow className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    {format(new Date(expense.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                      {category?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>
                        {safeFormatCurrency(expense.amount, expense.currency)}
                      </span>
                      {settings?.displayCurrency?.code !== expense.currency && (
                        <span className="text-sm text-muted-foreground">
                          ({formatCurrency(expense.amount, expense.currency)})
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              </ExpenseReceiptDialog>
            )
          })}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </Card>
  )
}
