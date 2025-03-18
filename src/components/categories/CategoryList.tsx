import type { Category } from '@/types/category'
import type { Expense } from '@/types/expense'
import { CategoryCard } from './CategoryCard'

interface CategoryListProps {
  categories: Category[]
  expenses: Expense[]
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  expenses,
}) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          categories={categories}
          expenses={expenses.filter(
            (expense) => expense.categoryId === category.id
          )}
        />
      ))}
    </div>
  )
}
