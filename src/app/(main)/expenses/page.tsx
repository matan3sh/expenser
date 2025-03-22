import { MobileExpensesView } from '@/components/expenses/MobileExpensesView'
import { getExpensesForSelectedMonth } from '@/lib/actions/expense.actions'
import { auth } from '@clerk/nextjs/server'

export default async function ExpensesPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  // Fetch expenses from the database using the server action
  const { expenses } = await getExpensesForSelectedMonth({})

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full">
        <div className="px-2 py-4">
          <MobileExpensesView expenses={expenses} />
        </div>
      </div>
    </div>
  )
}
