import { Card } from '@/components/ui/card'
import { categories } from '@/data/categories'
import { getMonthlyExpenses } from '@/data/expenses'

const AnalyticsStats = () => {
  const monthlyData = getMonthlyExpenses()
  const currentMonth = monthlyData[monthlyData.length - 1]

  // Calculate category totals for current month
  const categoryTotals = currentMonth.expenses.reduce((acc, expense) => {
    acc[expense.categoryId] = (acc[expense.categoryId] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  // Find top category
  const topCategory = categories.reduce((top, category) => {
    const amount = categoryTotals[category.id] || 0
    return amount > (categoryTotals[top?.id || ''] || 0) ? category : top
  }, categories[0])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-white/70">Monthly Transactions</p>
            <h3 className="text-2xl font-bold">
              {currentMonth.expenses.length}
            </h3>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-violet-500 to-violet-600 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-white/70">Top Category</p>
            <h3 className="text-2xl font-bold">{topCategory.name}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4M20 12a8 8 0 01-8 8m8-8a8 8 0 00-8-8m8 8h4m-4-8a8 8 0 00-8 8"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-white/70">Average Transaction</p>
            <h3 className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(
                currentMonth.expenses.reduce(
                  (sum, exp) => sum + exp.amount,
                  0
                ) / currentMonth.expenses.length
              )}
            </h3>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AnalyticsStats
