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
import { useExpenses } from '@/hooks/useExpenses'
import { format } from 'date-fns'

export function RecentExpenses() {
  const expenses = useExpenses()

  // Get only the 5 most recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

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
        {recentExpenses.map((expense) => (
          <ExpenseReceiptDialog key={expense.id} expense={expense}>
            <TableRow className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                {format(new Date(expense.date), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>{getCategoryById(expense.categoryId)?.name}</TableCell>
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
