import { Expense } from '@/types/expense.types'

export interface Category {
  id: string
  name: string
  description: string
  color: string
  icon: string
  budget?: {
    amount: number
    currency: string
  }
  totalExpenses?: number
}

export interface CategoryWithBudget extends Category {
  expenses?: Expense[]
}
