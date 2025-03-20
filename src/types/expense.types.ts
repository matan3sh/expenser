import { Decimal } from '@prisma/client/runtime/library'

export interface Expense {
  id: string
  amount: number
  description: string
  date: string
  categoryId?: string | null
  currency: string
  location: string
  notes?: string | null
  receipt?: string | null
  userIds?: string[]
  converted?: {
    amount: number
    currency: string
    symbol: string
  }
  createdAt: string
  updatedAt: string
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

export interface DatabaseExpense {
  id: string
  date: Date
  description: string
  amount: Decimal
  categoryId?: string | null
  currency: string
  location: string
  notes?: string | null
  receipt?: string | null
  userIds?: string[]
  converted?: {
    amount: number
    currency: string
    symbol: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Convertible {
  amount: number
  currency: string
}
