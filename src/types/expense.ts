export interface Expense {
  id: string
  amount: number
  description: string
  date: string
  categoryId: string
  currency: string
  location: string
  notes?: string
  userIds?: string[]
  converted?: {
    amount: number
    currency: string
    symbol: string
  }
}

export interface ExpenseWithCategory {
  id: string
  description: string
  amount: number
  date: string
  category: Category
  currency: string
  location: string
  notes?: string
  userIds?: string[]
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  budget?: number
}

export interface ExpensesByCategory extends Category {
  total: number
}

export interface MonthlyExpense {
  month: string
  expenses: Expense[]
  total: number
}
