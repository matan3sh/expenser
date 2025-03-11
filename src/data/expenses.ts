export interface Expense {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  categoryId: string
  location: string
}

export const expenses: Expense[] = [
  {
    id: '1',
    date: '2024-03-15',
    description: 'Grocery Shopping',
    amount: 150.75,
    currency: 'USD',
    categoryId: '1',
    location: 'Whole Foods Market',
  },
  {
    id: '2',
    date: '2024-03-14',
    description: 'Gas',
    amount: 45.3,
    currency: 'USD',
    categoryId: '2',
    location: 'Shell Gas Station',
  },
  {
    id: 'exp_2',
    date: '2024-03-14',
    description: 'Electricity Bill',
    amount: 85.5,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Power Company',
  },
  {
    id: 'exp_3',
    date: '2024-03-13',
    description: 'Movie Tickets',
    amount: 30.0,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Cinema Complex',
  },
  {
    id: 'exp_4',
    date: '2024-03-12',
    description: 'Gas',
    amount: 45.0,
    currency: 'ILS',
    categoryId: 'transport',
    location: 'Shell Gas Station',
  },
  {
    id: 'exp_5',
    date: '2024-03-11',
    description: 'Internet Bill',
    amount: 60.0,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Internet Provider',
  },
]

export function getRecentExpenses(limit: number = 5): Expense[] {
  return [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export interface MonthlyExpense {
  month: string
  expenses: Expense[]
  total: number
}

export function getMonthlyExpenses(): MonthlyExpense[] {
  // Group expenses by month
  const monthlyGroups = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString('default', {
      month: 'short',
    })
    if (!acc[month]) {
      acc[month] = {
        month,
        expenses: [],
        total: 0,
      }
    }
    acc[month].expenses.push(expense)
    return acc
  }, {} as Record<string, MonthlyExpense>)

  // Sort months chronologically
  return Object.values(monthlyGroups).sort((a, b) => {
    const monthA = new Date(a.expenses[0].date)
    const monthB = new Date(b.expenses[0].date)
    return monthA.getTime() - monthB.getTime()
  })
}

// Helper function to get category totals with currency conversion
export function getCategoryTotals(
  expenses: Expense[],
  convertAmount: (amount: number, currency: string) => number,
  displayCurrencyCode?: string
): Record<string, number> {
  return expenses.reduce((acc, expense) => {
    const amount = displayCurrencyCode
      ? convertAmount(expense.amount, expense.currency)
      : expense.amount
    acc[expense.categoryId] = (acc[expense.categoryId] || 0) + amount
    return acc
  }, {} as Record<string, number>)
}
