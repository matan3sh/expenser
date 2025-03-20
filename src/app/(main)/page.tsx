import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { MobileExpenseList } from '@/components/dashboard/MobileExpenseList'
import { RecentExpenses } from '@/components/dashboard/RecentExpenses'
import { WeeklyVolumeChart } from '@/components/dashboard/WeeklyVolumeChart'
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton'
import { MobileDashboardSkeleton } from '@/components/skeletons/MobileDashboardSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getExpensesForSelectedMonth } from '@/lib/actions/expense.actions'
import { Expense } from '@/types/expense'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Suspense } from 'react'

// Header Component
function DashboardHeader() {
  return (
    <header className="space-y-0.5">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted-foreground">
        Welcome to your expense tracking dashboard
      </p>
    </header>
  )
}

interface DashboardProps {
  expenses: Expense[]
}

// Mobile Dashboard Component
function MobileDashboard({ expenses }: DashboardProps) {
  return (
    <div className="lg:hidden flex flex-col h-full">
      <div className="px-4 pb-32 pt-4">
        <div className="mb-4">
          <WeeklyVolumeChart expenses={expenses} />
        </div>
        <h2 className="text-lg font-semibold mb-4 ml-4">Recent Expenses</h2>
        <div className="space-y-4">
          <MobileExpenseList expenses={expenses} />
        </div>
      </div>
    </div>
  )
}

// Desktop Dashboard Cards Component
function DesktopDashboardCards({ expenses }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 mt-6">
      <Card className="flex flex-col h-[400px] md:h-[500px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Recent Expenses
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/expenses">All Expenses</Link>
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <RecentExpenses expenses={expenses} />
        </CardContent>
      </Card>
    </div>
  )
}

// Desktop Dashboard Component
function DesktopDashboard({ expenses }: DashboardProps) {
  return (
    <div className="hidden lg:block p-6 space-y-6">
      <DashboardHeader />
      <div className="mt-6">
        <DashboardStats expenses={expenses} />
        <DesktopDashboardCards expenses={expenses} />
      </div>
    </div>
  )
}

// Loading Component with responsive skeletons
function DashboardLoading() {
  return (
    <>
      <div className="lg:hidden">
        <MobileDashboardSkeleton />
      </div>
      <div className="hidden lg:block">
        <DashboardSkeleton />
      </div>
    </>
  )
}

// Main Dashboard Page Component
export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  // Fetch recent expenses from the database
  const { expenses } = await getExpensesForSelectedMonth({
    limit: 5,
  })

  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={<DashboardLoading />}>
        <MobileDashboard expenses={expenses} />
        <DesktopDashboard expenses={expenses} />
      </Suspense>
    </div>
  )
}
