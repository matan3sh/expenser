import { ExpenseAmount } from '@/components/expenses/ExpenseAmount'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings } from '@/contexts/SettingsContext'
import { categories } from '@/data/categories'
import { getMonthlyExpenses } from '@/data/expenses'
import { BanknoteIcon, ChartBarIcon, TagIcon } from 'lucide-react'

const AnalyticsStats = () => {
  const { settings } = useSettings()
  const monthlyData = getMonthlyExpenses(settings)
  const currentMonth = monthlyData[monthlyData.length - 1]

  // Calculate category totals for current month
  const categoryTotals = currentMonth.expenses.reduce((acc, expense) => {
    const amount =
      expense.currency !== settings.displayCurrency?.code
        ? expense.converted?.amount || 0
        : expense.amount
    acc[expense.categoryId] = (acc[expense.categoryId] || 0) + amount
    return acc
  }, {} as Record<string, number>)

  // Find top category
  const topCategory = categories.reduce((top, category) => {
    const amount = categoryTotals[category.id] || 0
    return amount > (categoryTotals[top?.id || ''] || 0) ? category : top
  }, categories[0])

  const totalExpenses = currentMonth.expenses.reduce((sum, expense) => {
    const amount =
      expense.currency !== settings.displayCurrency?.code
        ? expense.converted?.amount || 0
        : expense.amount
    return sum + amount
  }, 0)

  const averageTransaction =
    currentMonth.expenses.length > 0
      ? totalExpenses / currentMonth.expenses.length
      : 0

  const displayCurrency = settings?.displayCurrency?.code || 'USD'

  const stats = [
    {
      name: 'Monthly Transactions',
      value: currentMonth.expenses.length,
      isNumeric: true,
      currency: displayCurrency,
      icon: BanknoteIcon,
      gradient: 'from-blue-500/10 to-blue-500/5',
      borderColor: 'border-blue-500/20',
    },
    {
      name: 'Top Category',
      value: topCategory.name,
      isNumeric: false,
      icon: TagIcon,
      gradient: 'from-purple-500/10 to-purple-500/5',
      borderColor: 'border-purple-500/20',
    },
    {
      name: 'Average Transaction',
      value: averageTransaction,
      isNumeric: true,
      currency: displayCurrency,
      icon: ChartBarIcon,
      gradient: 'from-green-500/10 to-green-500/5',
      borderColor: 'border-green-500/20',
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 w-full">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.name}
            className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} border ${stat.borderColor} w-full`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/5 rounded-full translate-y-8 -translate-x-8" />

            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-lg ${stat.gradient.replace(
                    '/10',
                    '/20'
                  )}`}
                >
                  <Icon className="w-4 h-4 text-foreground/70" />
                </div>
                <CardTitle className="text-sm font-medium text-foreground/70">
                  {stat.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {stat.isNumeric ? (
                <ExpenseAmount
                  amount={stat.value as number}
                  currency={stat.currency ?? 'USD'}
                  className="text-2xl font-bold tracking-tight"
                  originalAmountClassName="text-sm text-muted-foreground"
                />
              ) : (
                <div className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default AnalyticsStats
