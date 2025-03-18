'use client'

import { CategoryList } from '@/components/categories/CategoryList'
import { CreateCategoryButton } from '@/components/categories/CreateCategoryButton'
import { useSettings } from '@/contexts/SettingsContext'
import { categories } from '@/data/categories'
import { useExpenses } from '@/hooks/useExpenses'
import { useMemo } from 'react'

export default function CategoriesPage() {
  const { settings } = useSettings()

  const parsedExpenses = useExpenses()

  const categoriesWithTotals = useMemo(() => {
    return categories.map((category) => {
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
    parsedExpenses,
    settings.selectedMonth.month,
    settings.selectedMonth.year,
    settings.displayCurrency?.code,
  ])

  const monthlyExpenses = useMemo(() => {
    return parsedExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return (
        expenseDate.getMonth() === settings.selectedMonth.month &&
        expenseDate.getFullYear() === settings.selectedMonth.year
      )
    })
  }, [
    parsedExpenses,
    settings.selectedMonth.month,
    settings.selectedMonth.year,
  ])

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
        <CategoryList
          categories={categoriesWithTotals}
          expenses={monthlyExpenses}
        />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
          <div className="mb-4">
            <CreateCategoryButton />
          </div>
          <CategoryList
            categories={categoriesWithTotals}
            expenses={monthlyExpenses}
          />
        </div>
      </div>
    </div>
  )
}
