'use client'

import { CategoryCard } from '@/components/categories/category-card/CategoryCard'
import { CategoryWithBudget } from '@/types/category.types'

interface CategoryListProps {
  categories: CategoryWithBudget[]
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No categories found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          categories={categories}
          expenses={category.expenses}
        />
      ))}
    </div>
  )
}
