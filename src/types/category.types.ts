import { Convertible } from '@/types/expense.types'

export interface Category {
  id: string
  name: string
  description: string
  color: string
  icon: string
  budget?: number
  totalExpenses?: number
}

export type CategoryWithBudget = {
  id: string
  title: string
  createdAt: string
  color: string
  budget: {
    id: string
    amount: number
    currency: string
    createdAt: string
    converted?: Convertible
  } | null
  expenses: {
    id: string
    date: string
    description: string
    amount: number
    currency: string
    location: string
    notes: string | null
    receipt: string | null
    categoryId: string
    createdAt: string
    updatedAt: string
    converted?: Convertible
  }[]
}
