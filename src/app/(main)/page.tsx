import { CategoryTrendChart } from '@/components/dashboard/CategoryTrendChart'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentExpenses } from '@/components/expenses/RecentExpenses'
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@clerk/nextjs/server'
import { Suspense } from 'react'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    return <DashboardSkeleton />
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 min-h-[calc(100vh-3rem)]">
      <header className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Welcome to your expense tracking dashboard
        </p>
      </header>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="flex flex-col h-[400px] md:h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Recent Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <RecentExpenses />
            </CardContent>
          </Card>

          <Card className="flex flex-col h-[400px] md:h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                Category Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
              <CategoryTrendChart />
            </CardContent>
          </Card>
        </div>
      </Suspense>
    </div>
  )
}
