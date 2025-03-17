export interface MonthData {
  month: string
  expenses: Array<{
    amount: number
    currency: string
    categoryId: string
    date: string
    location: string
  }>
}
