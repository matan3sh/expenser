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
    id: 'exp_1',
    date: '2024-03-15',
    description: 'Weekly Groceries',
    amount: 150.75,
    currency: 'ILS',
    categoryId: 'groceries',
    location: 'Shufersal',
  },
  {
    id: 'exp_2',
    date: '2024-03-14',
    description: 'Electricity Bill',
    amount: 85.5,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Electric Company',
  },
  {
    id: 'exp_3',
    date: '2024-03-13',
    description: 'Movie Night',
    amount: 120.0,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Cinema City',
  },
  {
    id: 'exp_4',
    date: '2024-03-12',
    description: 'Gas',
    amount: 250.0,
    currency: 'ILS',
    categoryId: 'transport',
    location: 'Paz Gas Station',
  },
  // February Data
  {
    id: 'exp_5',
    date: '2024-02-28',
    description: 'Monthly Groceries',
    amount: 420.3,
    currency: 'ILS',
    categoryId: 'groceries',
    location: 'Rami Levy',
  },
  {
    id: 'exp_6',
    date: '2024-02-25',
    description: 'Water Bill',
    amount: 95.0,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Water Corp',
  },
  {
    id: 'exp_7',
    date: '2024-02-20',
    description: 'Concert Tickets',
    amount: 180.0,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Ticketmaster',
  },
  {
    id: 'exp_8',
    date: '2024-02-15',
    description: 'Bus Pass',
    amount: 200.0,
    currency: 'ILS',
    categoryId: 'transport',
    location: 'Public Transport',
  },
  // January Data
  {
    id: 'exp_9',
    date: '2024-01-30',
    description: 'Groceries Shopping',
    amount: 380.25,
    currency: 'ILS',
    categoryId: 'groceries',
    location: 'Victory',
  },
  {
    id: 'exp_10',
    date: '2024-01-25',
    description: 'Internet Bill',
    amount: 110.0,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Internet Provider',
  },
  {
    id: 'exp_11',
    date: '2024-01-20',
    description: 'Gaming Subscription',
    amount: 60.0,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Steam',
  },
  {
    id: 'exp_12',
    date: '2024-01-15',
    description: 'Taxi Rides',
    amount: 150.0,
    currency: 'ILS',
    categoryId: 'transport',
    location: 'Gett',
  },
  // December 2023 Data
  {
    id: 'exp_13',
    date: '2023-12-30',
    description: 'Holiday Groceries',
    amount: 550.8,
    currency: 'ILS',
    categoryId: 'groceries',
    location: 'Mega',
  },
  {
    id: 'exp_14',
    date: '2023-12-25',
    description: 'Heating Bill',
    amount: 180.0,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Gas Company',
  },
  {
    id: 'exp_15',
    date: '2023-12-20',
    description: 'New Year Party',
    amount: 300.0,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Event Hall',
  },
  {
    id: 'exp_16',
    date: '2023-12-15',
    description: 'Car Maintenance',
    amount: 800.0,
    currency: 'ILS',
    categoryId: 'transport',
    location: 'Auto Shop',
  },
  // November 2023 Data
  {
    id: 'exp_17',
    date: '2023-11-30',
    description: 'Thanksgiving Groceries',
    amount: 480.9,
    currency: 'ILS',
    categoryId: 'groceries',
    location: 'Shufersal',
  },
  {
    id: 'exp_18',
    date: '2023-11-25',
    description: 'Phone Bill',
    amount: 90.0,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Cellcom',
  },
  {
    id: 'exp_19',
    date: '2023-11-20',
    description: 'Theater Show',
    amount: 200.0,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Habima',
  },
  {
    id: 'exp_20',
    date: '2023-11-15',
    description: 'Fuel',
    amount: 280.0,
    currency: 'ILS',
    categoryId: 'transport',
    location: 'Delek',
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
