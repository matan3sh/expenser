export type Expense = {
  id: string
  amount: number
  currency: string
  date: string
  description: string
  location?: string
  categoryId: string
}
