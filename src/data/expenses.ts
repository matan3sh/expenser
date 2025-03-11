export interface Expense {
  id: string
  date: string
  description: string
  amount: number
  categoryId: string
  currency: string
}

export const expenses: Expense[] = [
  {
    id: 'exp_1',
    date: '2024-03-15',
    description: 'Grocery Shopping',
    amount: 150.0,
    categoryId: 'groceries',
    currency: 'USD',
  },
  {
    id: 'exp_2',
    date: '2024-03-14',
    description: 'Electricity Bill',
    amount: 85.5,
    categoryId: 'utilities',
    currency: 'USD',
  },
  {
    id: 'exp_3',
    date: '2024-03-13',
    description: 'Movie Tickets',
    amount: 30.0,
    categoryId: 'entertainment',
    currency: 'USD',
  },
  {
    id: 'exp_4',
    date: '2024-03-12',
    description: 'Gas',
    amount: 45.0,
    categoryId: 'transport',
    currency: 'USD',
  },
  {
    id: 'exp_5',
    date: '2024-03-11',
    description: 'Internet Bill',
    amount: 60.0,
    categoryId: 'utilities',
    currency: 'USD',
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
