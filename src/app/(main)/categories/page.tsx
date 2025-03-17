import { CategoryList } from '@/components/categories/CategoryList'
import { CreateCategoryButton } from '@/components/categories/CreateCategoryButton'
import { categories } from '@/data/categories'

export default function CategoriesPage() {
  return (
    <>
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

      <CategoryList categories={categories} />
    </>
  )
}
