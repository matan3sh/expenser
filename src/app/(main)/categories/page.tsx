import { BudgetCard } from '@/components/categories/BudgetCard'
import { CategoryList } from '@/components/categories/CategoryList'
import { CreateCategoryButton } from '@/components/categories/CreateCategoryButton'
import { getCategories } from '@/lib/actions/category.actions'

interface Category {
  id: string
  name: string
  description: string
  budget: number
  totalExpenses: number
  color: string
  icon: string
  createdAt: Date
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  const categoriesWithTotals: Category[] = categories.map((category, index) => {
    return {
      id: category.id,
      name: category.title,
      description: category.title,
      budget: category.budget?.amount || 0,
      totalExpenses: 0, // This will be calculated client-side
      color: `var(--chart-${(index % 5) + 1})`,
      icon: 'circle',
      createdAt: category.createdAt,
    }
  })

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
        <div className="mb-6">
          <BudgetCard />
        </div>
        <CategoryList initialCategories={categoriesWithTotals} />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
          <div className="mb-4">
            <CreateCategoryButton />
          </div>
          <div className="mb-6">
            <BudgetCard />
          </div>
          <CategoryList initialCategories={categoriesWithTotals} />
        </div>
      </div>
    </div>
  )
}
