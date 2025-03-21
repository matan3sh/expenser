import { MobileExpenseList } from '@/components/dashboard/MobileExpenseList'
import { WeeklyVolumeChart } from '@/components/dashboard/WeeklyVolumeChart'
import { getExpensesForSelectedMonth } from '@/lib/actions/expense.actions'
import { Expense } from '@/types/expense.types'
import { auth } from '@clerk/nextjs/server'

interface DashboardProps {
  expenses: Expense[]
}

// Mobile Dashboard Component
function MobileDashboard({ expenses }: DashboardProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pb-32 pt-4">
        <div className="mb-4">
          <WeeklyVolumeChart expenses={expenses} />
        </div>
        <h2 className="text-lg font-semibold">Recent Expenses</h2>
        <div className="space-y-4">
          <MobileExpenseList expenses={expenses} />
        </div>
      </div>
    </div>
  )
}

// Main Dashboard Page Component
export default async function Home() {
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
      <div className="flex flex-col h-full">
        <MobileDashboard expenses={expenses} />
      </div>
    </div>
  )
}
