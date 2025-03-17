export type Expense = {
  id: string
  amount: number
  currency: string
  date: string
  description: string
  location: string
  categoryId: string
}

export interface ExpenseWithCategory {
  id: string
  description: string
  amount: number
  date: Date
  category: Category
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface ExpensesByCategory extends Category {
  total: number
}
