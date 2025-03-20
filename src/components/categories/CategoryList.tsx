'use client'

import { useSettings } from '@/contexts/SettingsContext'
import { useExpenses } from '@/hooks/useExpenses'
import { CategoryWithBudget } from '@/lib/actions/category.actions'
import { useMemo } from 'react'
import { CategoryCard } from './CategoryCard'

interface CategoryListProps {
  initialCategories: CategoryWithBudget[]
}

export function CategoryList({ initialCategories }: CategoryListProps) {
  const { settings } = useSettings()
  const parsedExpenses = useExpenses()

  const categoriesWithTotals = useMemo(() => {
    return initialCategories.map((category) => {
      const monthlyExpenses = parsedExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return (
          expense.categoryId === category.id &&
          expenseDate.getMonth() === settings.selectedMonth.month &&
          expenseDate.getFullYear() === settings.selectedMonth.year
        )
      })

      const total = monthlyExpenses.reduce((sum, expense) => {
        const amount =
          expense.currency !== settings.displayCurrency?.code
            ? expense.converted?.amount || 0
            : expense.amount
        return sum + amount
      }, 0)

      return {
        ...category,
        totalExpenses: total,
      }
    })
  }, [
    initialCategories,
    parsedExpenses,
    settings.selectedMonth,
    settings.displayCurrency?.code,
  ])

  if (categoriesWithTotals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No categories found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categoriesWithTotals.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          categories={categoriesWithTotals}
          expenses={parsedExpenses.filter(
            (expense) => expense.categoryId === category.id
          )}
        />
      ))}
    </div>
  )
}
