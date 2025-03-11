'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>Your latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentExpenses.map((expense) => {
            const category = getCategoryById(expense.categoryId)
            return (
              <div
                key={expense.id}
                className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar>
                          <AvatarFallback
                            style={{ backgroundColor: category?.color }}
                          />
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>{category?.name}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div>
                    <h4 className="font-medium">{expense.description}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{category?.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {expense.location} •{' '}
                        {format(new Date(expense.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {safeFormatCurrency(expense.amount, expense.currency)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(expense.date), 'h:mm a')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
