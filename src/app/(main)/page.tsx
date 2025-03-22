import { MobileExpenseList } from '@/components/dashboard/MobileExpenseList'
import { WeeklyVolumeChart } from '@/components/dashboard/WeeklyVolumeChart'
import { getExpensesForSelectedMonth } from '@/lib/actions/expense.actions'
import { getUserSelectedMonth } from '@/lib/actions/settings.actions'
import { Expense } from '@/types/expense.types'
import { auth } from '@clerk/nextjs/server'

interface DashboardProps {
  expenses: Expense[]
  recentExpenses: Expense[]
  selectedMonth: { month: number; year: number } | null
}

// Mobile Dashboard Component
function MobileDashboard({
  expenses,
  recentExpenses,
  selectedMonth,
}: DashboardProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pb-32 pt-4">
        <div className="mb-4">
          <WeeklyVolumeChart
            expenses={expenses}
            selectedMonth={selectedMonth}
          />
        </div>
        <h2 className="text-lg font-semibold">Recent Expenses</h2>
        <div className="space-y-4">
          <MobileExpenseList expenses={recentExpenses} />
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

  // Fetch all expenses from the database
  const { expenses } = await getExpensesForSelectedMonth({})

  // Fetch recent expenses from the database
  const { expenses: recentExpenses } = await getExpensesForSelectedMonth({
    limit: 5,
  })

  const selectedMonth = await getUserSelectedMonth()

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full">
        <MobileDashboard
          expenses={expenses}
          recentExpenses={recentExpenses}
          selectedMonth={selectedMonth}
        />
      </div>
    </div>
  )
}
