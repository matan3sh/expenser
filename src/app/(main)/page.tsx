import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentExpenses } from '@/components/expenses/RecentExpenses'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your expense tracking dashboard
        </p>
      </header>

      <DashboardStats />
      <RecentExpenses />
    </div>
  )
}
