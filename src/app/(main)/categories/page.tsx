import { BudgetCard } from '@/components/categories/BudgetCard'
import { CategoryList } from '@/components/categories/CategoryList'
import { CreateCategoryButton } from '@/components/categories/CreateCategoryButton'
import { getCategories } from '@/lib/actions/category.actions'
import { calculateBudgetStats } from '@/lib/utils/categories.utils'

export default async function CategoriesPage() {
  const categories = await getCategories()
  const budgetStats = calculateBudgetStats(categories)

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
          <BudgetCard
            totalBudget={budgetStats.totalBudget}
            totalSpent={budgetStats.totalSpent}
            remainingBudget={budgetStats.remainingBudget}
            progressPercentage={budgetStats.progressPercentage}
          />
        </div>
        <CategoryList categories={categories} />
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-4 pb-32 pt-4">
          <div className="mb-4">
            <CreateCategoryButton />
          </div>
          <div className="mb-6">
            <BudgetCard
              totalBudget={budgetStats.totalBudget}
              totalSpent={budgetStats.totalSpent}
              remainingBudget={budgetStats.remainingBudget}
              progressPercentage={budgetStats.progressPercentage}
            />
          </div>
          <CategoryList categories={categories} />
        </div>
      </div>
    </div>
  )
}
