import { BudgetCard } from '@/components/categories/BudgetCard'
import { CategoryList } from '@/components/categories/CategoryList'
import { CreateCategoryButton } from '@/components/categories/CreateCategoryButton'
import { getCategories } from '@/lib/actions/category.actions'
import { calculateBudgetStats } from '@/lib/utils/categories.utils'

export default async function CategoriesPage() {
  const categories = await getCategories()
  const budgetStats = calculateBudgetStats(categories)

  return (
    <div className="px-4 min-h-full pb-32">
      <div className="flex justify-between px-4 pt-4">
        <div className="mb-6 ">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Planner</h1>
          <p className="text-sm text-muted-foreground">
            Monthly budget planner
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
  )
}
