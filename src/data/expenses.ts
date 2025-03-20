import { Settings } from '@/contexts/SettingsContext'
import { getCurrencyByCode } from '@/data/currencies'
import { Expense, MonthlyExpense } from '@/types/expense.types'

export const expenses: Expense[] = [
  {
    id: 'exp_1',
    date: new Date().toISOString(), // Today
    description: 'Groceries',
    amount: 150.75,
    currency: 'ILS',
    categoryId: 'groceries',
    location: 'Shufersal',
    userIds: ['default_user_id'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp_2',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    description: 'Electricity Bill',
    amount: 285.5,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Electric Company',
    userIds: ['default_user_id'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'exp_3',
    date: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    description: 'Movie Night',
    amount: 120.0,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Cinema City',
    userIds: ['default_user_id'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'exp_4',
    date: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    description: 'Gas',
    amount: 350.0,
    currency: 'ILS',
    categoryId: 'transport',
    location: 'Paz Gas Station',
    userIds: ['default_user_id'],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'exp_5',
    date: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
    description: 'Restaurant',
    amount: 220.3,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Local Restaurant',
    userIds: ['default_user_id'],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'exp_6',
    date: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
    description: 'Water Bill',
    amount: 195.0,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Water Corp',
    userIds: ['default_user_id'],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'exp_7',
    date: new Date(Date.now() - 6 * 86400000).toISOString(), // 6 days ago
    description: 'Groceries',
    amount: 180.0,
    currency: 'ILS',
    categoryId: 'groceries',
    location: 'Rami Levy',
    userIds: ['default_user_id'],
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  // February Data
  {
    id: 'exp_8',
    date: '2024-02-28',
    description: 'Monthly Groceries',
    amount: 420.3,
    currency: 'ILS',
    categoryId: 'groceries',
    location: 'Rami Levy',
    userIds: ['default_user_id'],
    createdAt: new Date('2024-02-28').toISOString(),
    updatedAt: new Date('2024-02-28').toISOString(),
  },
  {
    id: 'exp_9',
    date: '2024-02-25',
    description: 'Water Bill',
    amount: 95.0,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Water Corp',
    userIds: ['default_user_id'],
    createdAt: new Date('2024-02-25').toISOString(),
    updatedAt: new Date('2024-02-25').toISOString(),
  },
  {
    id: 'exp_10',
    date: '2024-02-20',
    description: 'Concert Tickets',
    amount: 180.0,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Ticketmaster',
    userIds: ['default_user_id'],
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: 'exp_11',
    date: '2024-02-15',
    description: 'Bus Pass',
    amount: 200.0,
    currency: 'ILS',
    categoryId: 'transport',
    location: 'Public Transport',
    userIds: ['default_user_id'],
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-15').toISOString(),
  },
  // January Data
  {
    id: 'exp_12',
    date: '2024-01-30',
    description: 'Groceries Shopping',
    amount: 380.25,
    currency: 'ILS',
    categoryId: 'groceries',
    location: 'Victory',
    userIds: ['default_user_id'],
    createdAt: new Date('2024-01-30').toISOString(),
    updatedAt: new Date('2024-01-30').toISOString(),
  },
  {
    id: 'exp_13',
    date: '2024-01-25',
    description: 'Internet Bill',
    amount: 110.0,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Internet Provider',
    userIds: ['default_user_id'],
    createdAt: new Date('2024-01-25').toISOString(),
    updatedAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: 'exp_14',
    date: '2024-01-20',
    description: 'Gaming Subscription',
    amount: 60.0,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Steam',
    userIds: ['default_user_id'],
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'exp_15',
    date: '2024-01-15',
    description: 'Taxi Rides',
    amount: 150.0,
    currency: 'ILS',
    categoryId: 'transport',
    location: 'Gett',
    userIds: ['default_user_id'],
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  // December 2023 Data
  {
    id: 'exp_16',
    date: '2023-12-30',
    description: 'Holiday Groceries',
    amount: 550.8,
    currency: 'ILS',
    categoryId: 'groceries',
    location: 'Mega',
    userIds: ['default_user_id'],
    createdAt: new Date('2023-12-30').toISOString(),
    updatedAt: new Date('2023-12-30').toISOString(),
  },
  {
    id: 'exp_17',
    date: '2023-12-25',
    description: 'Heating Bill',
    amount: 180.0,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Gas Company',
    userIds: ['default_user_id'],
    createdAt: new Date('2023-12-25').toISOString(),
    updatedAt: new Date('2023-12-25').toISOString(),
  },
  {
    id: 'exp_18',
    date: '2023-12-20',
    description: 'New Year Party',
    amount: 300.0,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Event Hall',
    userIds: ['default_user_id'],
    createdAt: new Date('2023-12-20').toISOString(),
    updatedAt: new Date('2023-12-20').toISOString(),
  },
  {
    id: 'exp_19',
    date: '2023-12-15',
    description: 'Car Maintenance',
    amount: 800.0,
    currency: 'ILS',
    categoryId: 'transport',
    location: 'Auto Shop',
    userIds: ['default_user_id'],
    createdAt: new Date('2023-12-15').toISOString(),
    updatedAt: new Date('2023-12-15').toISOString(),
  },
  // November 2023 Data
  {
    id: 'exp_20',
    date: '2023-11-30',
    description: 'Thanksgiving Groceries',
    amount: 480.9,
    currency: 'ILS',
    categoryId: 'groceries',
    location: 'Shufersal',
    userIds: ['default_user_id'],
    createdAt: new Date('2023-11-30').toISOString(),
    updatedAt: new Date('2023-11-30').toISOString(),
  },
  {
    id: 'exp_21',
    date: '2023-11-25',
    description: 'Phone Bill',
    amount: 90.0,
    currency: 'ILS',
    categoryId: 'utilities',
    location: 'Cellcom',
    userIds: ['default_user_id'],
    createdAt: new Date('2023-11-25').toISOString(),
    updatedAt: new Date('2023-11-25').toISOString(),
  },
  {
    id: 'exp_22',
    date: '2023-11-20',
    description: 'Theater Show',
    amount: 200.0,
    currency: 'ILS',
    categoryId: 'entertainment',
    location: 'Habima',
    userIds: ['default_user_id'],
    createdAt: new Date('2023-11-20').toISOString(),
    updatedAt: new Date('2023-11-20').toISOString(),
  },
  {
    id: 'exp_23',
    date: '2023-11-15',
    description: 'Fuel',
    amount: 280.0,
    currency: 'ILS',
    categoryId: 'transport',
    location: 'Delek',
    userIds: ['default_user_id'],
    createdAt: new Date('2023-11-15').toISOString(),
    updatedAt: new Date('2023-11-15').toISOString(),
  },
]

export function getMonthlyExpenses(settings?: Settings): MonthlyExpense[] {
  // Convert expenses to display currency if settings are provided
  const convertedExpenses = expenses.map((expense) => {
    if (!settings?.displayCurrency?.code || !settings.exchangeRates) {
      return expense
    }

    const displayCurrency = settings.displayCurrency.code
    if (expense.currency === displayCurrency) {
      return expense
    }

    const rate = settings.exchangeRates[expense.currency] || 1
    const currency = getCurrencyByCode(displayCurrency)
    if (!currency) {
      return expense
    }

    return {
      ...expense,
      amount: expense.amount * rate,
      currency: displayCurrency,
    }
  })

  // Group by month
  const monthlyGroups = convertedExpenses.reduce((acc, expense) => {
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

  // Sort months chronologically and calculate totals
  return Object.values(monthlyGroups)
    .sort((a, b) => {
      const monthA = new Date(a.expenses[0].date)
      const monthB = new Date(b.expenses[0].date)
      return monthA.getTime() - monthB.getTime()
    })
    .map((month) => ({
      ...month,
      total: month.expenses.reduce((sum, expense) => {
        // If the expense currency matches the display currency, use the original amount
        // Otherwise, use the converted amount if available
        const amount =
          expense.currency === settings?.displayCurrency?.code
            ? expense.amount
            : expense.converted?.amount ?? 0
        return sum + amount
      }, 0),
    }))
}

// Helper function to get category totals with currency conversion
export function getCategoryTotals(
  expenses: Expense[],
  convertAmount: (amount: number, currency: string) => number,
  displayCurrencyCode?: string
): Record<string, number> {
  return expenses.reduce((acc, expense) => {
    const amount =
      expense.currency !== displayCurrencyCode
        ? expense.converted?.amount || 0
        : expense.amount
    // Use category.id instead of categoryId
    if (expense.category) {
      acc[expense.category.id] = (acc[expense.category.id] || 0) + amount
    }
    return acc
  }, {} as Record<string, number>)
}
