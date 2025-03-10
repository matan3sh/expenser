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
import { format } from 'date-fns'

// This would come from your database in a real app
const dummyExpenses = [
  {
    id: '1',
    amount: 42.5,
    currency: 'USD',
    date: new Date('2024-03-20'),
    category: { name: 'Food & Dining', color: '#FF6B6B' },
    description: 'Lunch at Downtown Cafe',
    location: 'Downtown Cafe',
  },
  {
    id: '2',
    amount: 25.0,
    currency: 'USD',
    date: new Date('2024-03-19'),
    category: { name: 'Transportation', color: '#4ECDC4' },
    description: 'Uber ride to work',
    location: 'Uber',
  },
  {
    id: '3',
    amount: 89.99,
    currency: 'USD',
    date: new Date('2024-03-18'),
    category: { name: 'Shopping', color: '#45B7D1' },
    description: 'New headphones',
    location: 'Electronics Store',
  },
]

export function RecentExpenses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>Your latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {dummyExpenses.map((expense) => (
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
                          style={{ backgroundColor: expense.category.color }}
                        />
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>{expense.category.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div>
                  <h4 className="font-medium">{expense.description}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{expense.category.name}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {expense.location} • {format(expense.date, 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {expense.currency} {expense.amount.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(expense.date, 'h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
