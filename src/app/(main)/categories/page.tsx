import { BudgetCard } from '@/components/categories/BudgetCard'
import { CategoryList } from '@/components/categories/CategoryList'
import { CreateCategoryButton } from '@/components/categories/CreateCategoryButton'
import { getCategories } from '@/lib/actions/category.actions'
import { calculateBudgetStats } from '@/lib/utils/categories.utils'

export default async function CategoriesPage() {
  const categories = await getCategories()
  const budgetStats = calculateBudgetStats(categories)

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block">
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
      <div className="px-4 lg:hidden min-h-full pb-32">
        <div className="flex justify-between px-4 pt-4">
          <div className="mb-6 ">
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Categories
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your expense categories
            </p>
          </div>
          <div className="mb-4">
            <CreateCategoryButton />
          </div>
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
    </>
  )
}
