'use client'

import { ExpenseCard } from '@/components/expenses/expense-card/ExpenseCard'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCurrencyByCode } from '@/data/currencies'
import { Expense } from '@/types/expense.types'
import { format } from 'date-fns'

interface RecentExpensesProps {
  expenses: Expense[]
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow
            key={expense.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => {}} // Empty handler to maintain pointer cursor
          >
            <TableCell>
              {format(new Date(expense.date), 'MMM d, yyyy')}
            </TableCell>
            <TableCell>{expense.description}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {expense.category?.title || 'Uncategorized'}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span>
                    {getCurrencyByCode(expense.currency)?.symbol}{' '}
                    {expense.amount.toFixed(2)}
                  </span>
                  {expense.converted && (
                    <span className="text-[10px] text-muted-foreground">
                      ({expense.converted.symbol}
                      {expense.converted.amount.toFixed(2)})
                    </span>
                  )}
                </div>
                <ExpenseCard expense={expense}>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </ExpenseCard>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
