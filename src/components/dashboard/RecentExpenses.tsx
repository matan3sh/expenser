'use client'

import { ExpenseReceiptDialog } from '@/components/expenses/ExpenseReceiptDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCategoryById } from '@/data/categories'
import { getCurrencyByCode } from '@/data/currencies'
import { Expense } from '@/types/expense'
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
          <ExpenseReceiptDialog key={expense.id} expense={expense}>
            <TableRow className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                {format(new Date(expense.date), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>
                {getCategoryById(expense.categoryId ?? 'uncategorized')?.name}
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          </ExpenseReceiptDialog>
        ))}
      </TableBody>
    </Table>
  )
}
