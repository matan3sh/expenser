import type { Category } from '@/types/category'
import { CategoryCard } from './CategoryCard'

interface CategoryListProps {
  categories: Category[]
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}
