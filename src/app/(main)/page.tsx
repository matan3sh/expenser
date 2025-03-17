import { CategoryTrendChart } from '@/components/dashboard/CategoryTrendChart'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { MobileExpenseList } from '@/components/dashboard/MobileExpenseList'
import { RecentExpenses } from '@/components/dashboard/RecentExpenses'
import { WeeklyVolumeChart } from '@/components/dashboard/WeeklyVolumeChart'
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton'
import { MobileDashboardSkeleton } from '@/components/skeletons/MobileDashboardSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

// Mobile Dashboard Component
function MobileDashboard() {
  return (
    <div className="md:hidden space-y-4">
      <WeeklyVolumeChart />
      <MobileExpenseList />
    </div>
  )
}

// Desktop Dashboard Cards Component
function DesktopDashboardCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-6">
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
  )
}

// Desktop Dashboard Component
function DesktopDashboard() {
  return (
    <div className="hidden md:block">
      <DashboardStats />
      <DesktopDashboardCards />
    </div>
  )
}

// Loading Component with responsive skeletons
function DashboardLoading() {
  return (
    <>
      <div className="md:hidden">
        <MobileDashboardSkeleton />
      </div>
      <div className="hidden md:block">
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

  return (
    <div className="flex flex-col gap-4 p-4 min-h-[calc(100vh-3rem)]">
      <DashboardHeader />

      <Suspense fallback={<DashboardLoading />}>
        <MobileDashboard />
        <DesktopDashboard />
      </Suspense>
    </div>
  )
}
