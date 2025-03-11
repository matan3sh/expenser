import { Expense } from '@/types/expense'

export const expenses: Expense[] = [
  {
    id: '1',
    amount: 42.5,
    currency: 'USD',
    date: '2024-03-20',
    categoryId: 'other',
    description: 'Lunch at Downtown Cafe',
    location: 'Downtown Cafe',
  },
  {
    id: 'exp_2',
    date: '2024-03-14',
    description: 'Electricity Bill',
    amount: 85.5,
    categoryId: 'utilities',
    currency: 'USD',
    location: 'Power Company',
  },
  {
    id: 'exp_3',
    date: '2024-03-13',
    description: 'Movie Tickets',
    amount: 30.0,
    categoryId: 'entertainment',
    currency: 'USD',
    location: 'Cinema Complex',
  },
  {
    id: 'exp_4',
    date: '2024-03-12',
    description: 'Gas',
    amount: 45.0,
    categoryId: 'transport',
    currency: 'USD',
    location: 'Shell Gas Station',
  },
  {
    id: 'exp_5',
    date: '2024-03-11',
    description: 'Internet Bill',
    amount: 60.0,
    categoryId: 'utilities',
    currency: 'USD',
    location: 'Internet Provider',
  },
]

export const monthlyExpenses = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 900 },
  { month: 'Mar', amount: 1500 },
  { month: 'Apr', amount: 1100 },
  { month: 'May', amount: 1300 },
  { month: 'Jun', amount: 950 },
  { month: 'Jul', amount: 1150 },
  { month: 'Aug', amount: 1400 },
  { month: 'Sep', amount: 1250 },
  { month: 'Oct', amount: 1050 },
  { month: 'Nov', amount: 1350 },
  { month: 'Dec', amount: 1600 },
]

export const getRecentExpenses = (limit: number = 5) => {
  return [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}
