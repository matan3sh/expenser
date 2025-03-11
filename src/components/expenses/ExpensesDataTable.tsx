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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { categories, getCategoryById } from '@/data/categories'
import { formatCurrency } from '@/data/currencies'
import { expenses } from '@/data/expenses'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useState } from 'react'

export function ExpensesDataTable() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
  })

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
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.date}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{getCategoryById(expense.categoryId)?.name}</TableCell>
              <TableCell>
                {formatCurrency(expense.amount, expense.currency)}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
