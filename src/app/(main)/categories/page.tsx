'use client'

import { CategoryList } from '@/components/categories/CategoryList'
import { CreateCategoryButton } from '@/components/categories/CreateCategoryButton'
import { useSettings } from '@/contexts/SettingsContext'
import { categories } from '@/data/categories'
import { expenses } from '@/data/expenses'
import { useCurrencyFormat } from '@/hooks/useCurrencyFormat'
import { useMemo } from 'react'

export default function CategoriesPage() {
  const { settings } = useSettings()
  const { convertToDisplayCurrency } = useCurrencyFormat()

  const categoriesWithTotals = useMemo(() => {
    return categories.map((category) => {
      const monthlyExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return (
          expense.categoryId === category.id &&
          expenseDate.getMonth() === settings.selectedMonth.month &&
          expenseDate.getFullYear() === settings.selectedMonth.year
        )
      })

      const total = monthlyExpenses.reduce((sum, expense) => {
        return sum + convertToDisplayCurrency(expense.amount, expense.currency)
      }, 0)

      return {
        ...category,
        totalExpenses: total,
      }
    })
  }, [settings.selectedMonth, convertToDisplayCurrency])

  return (
    <div className="flex flex-col h-full">
      {/* Desktop View */}
      <div className="hidden lg:block p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Categories
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Manage your expense categories
            </p>
          </div>
          <CreateCategoryButton />
        </div>
        <CategoryList categories={categoriesWithTotals} />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
          <div className="mb-4">
            <CreateCategoryButton />
          </div>
          <CategoryList categories={categoriesWithTotals} />
        </div>
      </div>
    </div>
  )
}
