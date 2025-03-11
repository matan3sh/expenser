'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSettings } from '@/contexts/SettingsContext'
import { getCategoryById } from '@/data/categories'
import { formatCurrency } from '@/data/currencies'
import { expenses } from '@/data/expenses'
import { format } from 'date-fns'
import Link from 'next/link'

export function RecentExpenses() {
  const { convertAmount, settings } = useSettings()

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

  // Get only the 5 most recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Expenses</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/expenses">All Expenses</Link>
        </Button>
      </CardHeader>
      <CardContent>
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
              <TableRow key={expense.id}>
                <TableCell>
                  {format(new Date(expense.date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  {getCategoryById(expense.categoryId)?.name}
                </TableCell>
                <TableCell>
                  {safeFormatCurrency(expense.amount, expense.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
