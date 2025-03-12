'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSettings } from '@/contexts/SettingsContext'
import { getCategoryById } from '@/data/categories'
import { formatCurrency } from '@/data/currencies'
import { getRecentExpenses } from '@/data/expenses'
import { format } from 'date-fns'

export function RecentExpenses() {
  const { convertAmount, settings } = useSettings()
  const recentExpenses = getRecentExpenses(5)

  // Helper function to safely format currency
  const safeFormatCurrency = (amount: number, currency: string = 'USD') => {
    if (!settings?.displayCurrency?.code) {
      // Fallback to original currency if settings aren't loaded
      return formatCurrency(amount, currency)
    }
    return formatCurrency(
      convertAmount(amount, currency),
      settings.displayCurrency.code
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell className="w-[50%]">Description</TableCell>
          <TableCell>Category</TableCell>
          <TableCell className="text-right">Amount</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentExpenses.map((expense) => {
          const category = getCategoryById(expense.categoryId)
          return (
            <TableRow key={expense.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            style={{ backgroundColor: category?.color }}
                            className="text-primary-foreground text-xs"
                          >
                            {category?.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>{category?.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="flex flex-col">
                    <span className="font-medium truncate">
                      {expense.description}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(expense.date), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="whitespace-nowrap">
                  {category?.name}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium">
                    {safeFormatCurrency(expense.amount, expense.currency)}
                  </span>
                  {settings?.displayCurrency?.code !== expense.currency && (
                    <span className="text-xs text-muted-foreground">
                      ({formatCurrency(expense.amount, expense.currency)})
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
