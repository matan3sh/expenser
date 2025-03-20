import { CategoryWithBudget } from '@/types/category.types'
import { Expense } from '@/types/expense.types'

export const calculateBudgetStats = (categories: CategoryWithBudget[]) => {
  const totalBudget = categories.reduce((sum, category) => {
    return sum + (category.budget?.amount || 0)
  }, 0)

  const totalSpent = categories.reduce((sum, category) => {
    return (
      sum +
      category.expenses.reduce((expSum: number, expense: Expense) => {
        return expSum + expense.amount
      }, 0)
    )
  }, 0)

  const remainingBudget = totalBudget - totalSpent

  return {
    totalBudget,
    totalSpent,
    remainingBudget,
    progressPercentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
  }
}
